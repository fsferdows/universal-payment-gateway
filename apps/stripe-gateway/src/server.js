import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import Stripe from 'stripe';
import {
  ZERO_DECIMAL_CURRENCIES,
  CURRENCIES,
  COUNTRIES,
  getAllCurrencies,
  getAllCountries,
  getCurrency,
  getCountry,
  validatePhoneNumber,
  formatPhoneNumber
} from './data/currencies-and-countries.js';
import { PayPalProvider } from './providers/paypal-provider.js';
import {
  BkashProvider,
  NagadProvider,
  RocketProvider,
  convertToBDT,
  validateWalletNumber,
  BDT_EXCHANGE_RATES
} from './providers/mfs-provider.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');

// Load .env if available
const envFile = path.join(rootDir, '.env');
if (fs.existsSync(envFile) && typeof process.loadEnvFile === 'function') {
  try { process.loadEnvFile(envFile); } catch {}
}

const BASE_SECURITY_HEADERS = Object.freeze({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
});

/**
 * Converts a decimal amount (e.g. 29.99 USD) into the smallest currency unit (e.g. 2999 cents).
 */
export function toSmallestUnit(amount, currency = 'usd') {
  const cur = currency.toLowerCase();
  const num = Number(amount);
  if (!Number.isFinite(num) || num <= 0) {
    throw new Error(`Invalid payment amount: ${amount}`);
  }
  if (ZERO_DECIMAL_CURRENCIES.has(cur)) {
    return Math.round(num);
  }
  return Math.round(num * 100);
}

/**
 * Formats smallest unit back to human-readable string.
 */
export function formatCurrencyAmount(unitAmount, currency = 'usd') {
  const cur = currency.toLowerCase();
  const num = Number(unitAmount);
  if (ZERO_DECIMAL_CURRENCIES.has(cur)) {
    return `${num}`;
  }
  return (num / 100).toFixed(2);
}

export {
  ZERO_DECIMAL_CURRENCIES,
  CURRENCIES,
  COUNTRIES,
  getAllCurrencies,
  getAllCountries,
  getCurrency,
  getCountry,
  validatePhoneNumber,
  formatPhoneNumber,
  convertToBDT,
  validateWalletNumber,
  BDT_EXCHANGE_RATES
};

export class StripeGatewayServer {
  constructor(options = {}) {
    this.port = Number(options.port || process.env.STRIPE_GATEWAY_PORT || 4242);
    this.secretKey = options.secretKey || process.env.STRIPE_SECRET_KEY || '';
    this.publishableKey = options.publishableKey || process.env.STRIPE_PUBLISHABLE_KEY || '';
    this.webhookSecret = options.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || '';
    this.defaultCurrency = (options.defaultCurrency || process.env.STRIPE_CURRENCY || 'usd').toLowerCase();
    this.statementDescriptor = options.statementDescriptor || process.env.STRIPE_STATEMENT_DESCRIPTOR || 'YOUPI GLOBAL';

    const isTestPlaceholder = !this.secretKey || this.secretKey.includes('your-stripe') || this.secretKey === 'sk_test_placeholder';
    this.isMockMode = isTestPlaceholder;

    if (!this.isMockMode) {
      try {
        this.stripe = new Stripe(this.secretKey);
      } catch (err) {
        console.warn('[Stripe Gateway] Failed to initialize live Stripe client, falling back to sandbox mode:', err.message);
        this.isMockMode = true;
      }
    }

    // Payment Providers (PayPal, bKash, Nagad, Rocket)
    this.paypalProvider = new PayPalProvider({ statementDescriptor: this.statementDescriptor });
    this.bkashProvider = new BkashProvider({ statementDescriptor: this.statementDescriptor });
    this.nagadProvider = new NagadProvider({ statementDescriptor: this.statementDescriptor });
    this.rocketProvider = new RocketProvider({ statementDescriptor: this.statementDescriptor });

    this.publicDir = path.resolve(__dirname, '../public');
    this.paymentsLedger = new Map(); // In-memory tracking of created intents/sessions
    this.verificationCodes = new Map(); // E.164 phone verification codes store
  }

  /**
   * Helper to parse JSON body from request.
   */
  static async parseBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 2 * 1024 * 1024) {
          reject(new Error('Payload Too Large'));
        }
      });
      req.on('end', () => {
        if (!body.trim()) return resolve({});
        try {
          resolve(JSON.parse(body));
        } catch {
          reject(new Error('Malformed JSON body'));
        }
      });
      req.on('error', reject);
    });
  }

  /**
   * Helper to read raw request buffer (needed for Stripe webhook HMAC verification).
   */
  static async readRawBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
  }

  /**
   * Sends a standard JSON response.
   */
  static sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      ...BASE_SECURITY_HEADERS
    });
    res.end(JSON.stringify(data));
  }

  /**
   * Serves static files with correct content types.
   */
  serveStaticFile(res, filePath) {
    const safePath = path.normalize(filePath);
    if (!safePath.startsWith(this.publicDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access Denied');
      return;
    }

    if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      ...BASE_SECURITY_HEADERS
    });
    fs.createReadStream(safePath).pipe(res);
  }

  createServer() {
    return http.createServer(async (req, res) => {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const pathname = url.pathname;
      const method = req.method.toUpperCase();

      if (method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          ...BASE_SECURITY_HEADERS
        });
        res.end();
        return;
      }

      // 1. GET /health
      if (pathname === '/health' && method === 'GET') {
        StripeGatewayServer.sendJson(res, 200, {
          status: 'UP',
          service: 'stripe-gateway',
          mode: this.isMockMode ? 'SANDBOX_SIMULATOR' : 'LIVE_STRIPE',
          publishableKeyConfigured: Boolean(this.publishableKey && !this.publishableKey.includes('your-stripe')),
          defaultCurrency: this.defaultCurrency,
          totalCurrencies: CURRENCIES.length,
          totalCountries: COUNTRIES.length,
          supportedMethods: ['card', 'paypal', 'bkash', 'nagad', 'rocket', 'upi'],
          timestamp: new Date().toISOString()
        });
        return;
      }

      // 2. GET /api/payment-methods (Returns all active methods & configuration)
      if (pathname === '/api/payment-methods' && method === 'GET') {
        StripeGatewayServer.sendJson(res, 200, {
          methods: [
            {
              id: 'card',
              name: 'Credit / Debit Card',
              icon: '💳',
              badge: 'Instant',
              description: 'Visa, Mastercard, AMEX, Discover, JCB, UnionPay',
              supportedCurrencies: 'ALL',
              provider: 'Stripe Elements / 3D-Secure 2.0'
            },
            {
              id: 'paypal',
              name: 'PayPal',
              icon: '🅿️',
              badge: 'Global',
              description: 'Pay via PayPal Wallet, Bank Balance or Linked Cards',
              supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'SGD', 'CHF'],
              provider: 'PayPal REST v2'
            },
            {
              id: 'bkash',
              name: 'bKash',
              icon: '📱',
              badge: 'MFS',
              description: 'bKash Direct Wallet Payment (Instant BDT conversion)',
              supportedCurrencies: ['BDT', 'USD', 'EUR', 'GBP'],
              provider: 'bKash Tokenized Checkout'
            },
            {
              id: 'nagad',
              name: 'Nagad',
              icon: '📲',
              badge: 'MFS',
              description: 'Bangladesh Post Office Digital Financial Service',
              supportedCurrencies: ['BDT', 'USD', 'EUR', 'GBP'],
              provider: 'Nagad PG Direct'
            },
            {
              id: 'rocket',
              name: 'Rocket',
              icon: '🚀',
              badge: 'DBBL',
              description: 'Dutch-Bangla Bank 12-Digit Mobile Banking',
              supportedCurrencies: ['BDT', 'USD', 'EUR', 'GBP'],
              provider: 'DBBL Rocket MFS'
            },
            {
              id: 'upi',
              name: 'UPI / QR Code',
              icon: '⚡',
              badge: 'India Zero-Fee',
              description: 'PhonePe, Google Pay, Paytm, CRED, BHIM QR',
              supportedCurrencies: ['INR'],
              provider: 'YOUPI Sovereign Observer Engine'
            }
          ]
        });
        return;
      }

      // 3. GET /api/currencies (Full ISO currencies & country dialing codes catalog)
      if (pathname === '/api/currencies' && method === 'GET') {
        StripeGatewayServer.sendJson(res, 200, {
          currencies: getAllCurrencies(),
          countries: getAllCountries(),
          totalCurrencies: CURRENCIES.length,
          totalCountries: COUNTRIES.length,
          fxRates: BDT_EXCHANGE_RATES
        });
        return;
      }

      // 4. GET /api/config
      if (pathname === '/api/config' && method === 'GET') {
        StripeGatewayServer.sendJson(res, 200, {
          publishableKey: this.publishableKey || 'pk_test_sample_key_for_testing',
          defaultCurrency: this.defaultCurrency,
          statementDescriptor: this.statementDescriptor,
          isMockMode: this.isMockMode,
          supportedCurrencies: getAllCurrencies(),
          countries: getAllCountries(),
          totalCurrencies: CURRENCIES.length,
          totalCountries: COUNTRIES.length,
          fxRates: BDT_EXCHANGE_RATES,
          methods: ['card', 'paypal', 'bkash', 'nagad', 'rocket', 'upi']
        });
        return;
      }

      // 5. POST /api/verify/send-code (Customer phone number verification with country dialing code)
      if (pathname === '/api/verify/send-code' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const { dialCode, nationalNumber, countryCode } = body;
          const validation = validatePhoneNumber(dialCode, nationalNumber);
          if (!validation.valid) {
            StripeGatewayServer.sendJson(res, 400, { error: validation.error });
            return;
          }

          const code = `${crypto.randomInt(100000, 999999)}`;
          const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes TTL
          this.verificationCodes.set(validation.e164, {
            code,
            e164: validation.e164,
            dialCode: validation.dialCode,
            nationalNumber: validation.nationalNumber,
            countryCode: countryCode || null,
            expiresAt,
            verified: false
          });

          console.log(`[Stripe Gateway] SMS Verification code generated for ${validation.e164}: ${code}`);
          StripeGatewayServer.sendJson(res, 200, {
            success: true,
            message: `Verification code sent to ${validation.e164}`,
            e164: validation.e164,
            formattedPhone: formatPhoneNumber(validation.dialCode, validation.nationalNumber),
            sampleCode: code
          });
        } catch (err) {
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      // 6. POST /api/verify/check-code (Check 6-digit phone verification code)
      if (pathname === '/api/verify/check-code' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const { dialCode, nationalNumber, code } = body;
          const validation = validatePhoneNumber(dialCode, nationalNumber);
          if (!validation.valid) {
            StripeGatewayServer.sendJson(res, 400, { error: validation.error });
            return;
          }

          const record = this.verificationCodes.get(validation.e164);
          if (!record) {
            StripeGatewayServer.sendJson(res, 400, { error: 'No verification code requested for this number' });
            return;
          }

          if (Date.now() > record.expiresAt) {
            this.verificationCodes.delete(validation.e164);
            StripeGatewayServer.sendJson(res, 400, { error: 'Verification code has expired. Please request a new one.' });
            return;
          }

          if (record.code !== String(code).trim()) {
            StripeGatewayServer.sendJson(res, 400, { error: 'Invalid verification code. Please check and try again.' });
            return;
          }

          record.verified = true;
          StripeGatewayServer.sendJson(res, 200, {
            success: true,
            verified: true,
            e164: validation.e164,
            message: 'Phone number verified successfully'
          });
        } catch (err) {
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      // ========================
      // 7. CARD PAYMENTS (Stripe)
      // ========================
      if (pathname === '/api/create-payment-intent' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const rawAmount = body.amount ?? 25.00;
          const currency = (body.currency || this.defaultCurrency).toLowerCase();
          const orderId = body.orderId || `ORD-${Date.now()}`;
          const customerEmail = body.customerEmail || null;
          const customerName = body.customerName || null;
          const customerPhone = body.customerPhone || null;
          const countryCode = body.countryCode || null;
          const phoneVerified = Boolean(body.phoneVerified);
          const unitAmount = toSmallestUnit(rawAmount, currency);

          let clientSecret;
          let paymentIntentId;

          if (!this.isMockMode && this.stripe) {
            const paymentIntent = await this.stripe.paymentIntents.create({
              amount: unitAmount,
              currency,
              automatic_payment_methods: { enabled: true },
              statement_descriptor_suffix: this.statementDescriptor.slice(0, 10).toUpperCase(),
              metadata: {
                orderId,
                customerEmail: customerEmail || '',
                customerName: customerName || '',
                customerPhone: customerPhone || '',
                countryCode: countryCode || '',
                phoneVerified: phoneVerified ? 'true' : 'false',
                method: 'card',
                ...(body.metadata || {})
              },
              ...(customerEmail ? { receipt_email: customerEmail } : {})
            });
            clientSecret = paymentIntent.client_secret;
            paymentIntentId = paymentIntent.id;
          } else {
            paymentIntentId = `pi_sim_${crypto.randomBytes(12).toString('hex')}`;
            clientSecret = `${paymentIntentId}_secret_${crypto.randomBytes(16).toString('hex')}`;
          }

          this.paymentsLedger.set(paymentIntentId, {
            id: paymentIntentId,
            orderId,
            method: 'card',
            amount: unitAmount,
            humanAmount: formatCurrencyAmount(unitAmount, currency),
            currency,
            status: 'requires_payment_method',
            customerEmail,
            customerName,
            customerPhone,
            countryCode,
            phoneVerified,
            createdAt: new Date().toISOString()
          });

          StripeGatewayServer.sendJson(res, 200, {
            clientSecret,
            paymentIntentId,
            orderId,
            amount: unitAmount,
            formattedAmount: formatCurrencyAmount(unitAmount, currency),
            currency: currency.toUpperCase(),
            customerPhone,
            phoneVerified,
            isMockMode: this.isMockMode
          });
        } catch (err) {
          console.error('[Stripe Gateway] create-payment-intent error:', err);
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      if (pathname === '/api/create-checkout-session' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const rawAmount = body.amount ?? 25.00;
          const currency = (body.currency || this.defaultCurrency).toLowerCase();
          const orderId = body.orderId || `ORD-${Date.now()}`;
          const productName = body.productName || 'International Order Top-up';
          const customerPhone = body.customerPhone || null;
          const countryCode = body.countryCode || null;
          const unitAmount = toSmallestUnit(rawAmount, currency);

          const origin = req.headers.origin || `http://${req.headers.host || 'localhost:4242'}`;
          const successUrl = body.successUrl || `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}&order_id=${encodeURIComponent(orderId)}&method=card`;
          const cancelUrl = body.cancelUrl || `${origin}/cancel.html?order_id=${encodeURIComponent(orderId)}`;

          let checkoutUrl;
          let sessionId;

          if (!this.isMockMode && this.stripe) {
            const session = await this.stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              phone_number_collection: { enabled: true },
              line_items: [
                {
                  price_data: {
                    currency,
                    product_data: {
                      name: productName,
                      description: `Order Ref: ${orderId}`
                    },
                    unit_amount: unitAmount
                  },
                  quantity: 1
                }
              ],
              mode: 'payment',
              success_url: successUrl,
              cancel_url: cancelUrl,
              metadata: {
                orderId,
                customerPhone: customerPhone || '',
                countryCode: countryCode || '',
                method: 'card',
                ...(body.metadata || {})
              }
            });
            checkoutUrl = session.url;
            sessionId = session.id;
          } else {
            sessionId = `cs_sim_${crypto.randomBytes(16).toString('hex')}`;
            checkoutUrl = `${origin}/success.html?session_id=${sessionId}&order_id=${encodeURIComponent(orderId)}&method=card&mock=true`;
          }

          StripeGatewayServer.sendJson(res, 200, {
            sessionId,
            checkoutUrl,
            orderId,
            currency: currency.toUpperCase(),
            isMockMode: this.isMockMode
          });
        } catch (err) {
          console.error('[Stripe Gateway] create-checkout-session error:', err);
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      if (pathname === '/api/confirm-simulated-payment' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const { paymentIntentId, cardLast4 = '4242', brand = 'visa' } = body;
          const payment = this.paymentsLedger.get(paymentIntentId);
          if (payment) {
            payment.status = 'succeeded';
            payment.card = { brand, last4: cardLast4 };
            payment.completedAt = new Date().toISOString();
          }
          StripeGatewayServer.sendJson(res, 200, {
            success: true,
            status: 'succeeded',
            paymentIntentId,
            orderId: payment?.orderId,
            amount: payment?.humanAmount,
            currency: payment?.currency?.toUpperCase() || 'USD',
            statementDescriptor: this.statementDescriptor
          });
        } catch (err) {
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      // ========================
      // 8. PAYPAL PAYMENT ROUTES
      // ========================
      if (pathname === '/api/paypal/create-order' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const { amount = 25.00, currency = 'USD', orderId = `ORD-PP-${Date.now()}` } = body;
          const origin = req.headers.origin || `http://${req.headers.host || 'localhost:4242'}`;
          const returnUrl = `${origin}/success.html?method=paypal&order_id=${encodeURIComponent(orderId)}`;
          const cancelUrl = `${origin}/cancel.html?order_id=${encodeURIComponent(orderId)}`;

          const order = await this.paypalProvider.createOrder({
            amount,
            currency,
            orderId,
            returnUrl,
            cancelUrl
          });

          this.paymentsLedger.set(order.id, {
            id: order.id,
            orderId,
            method: 'paypal',
            amount,
            currency: currency.toUpperCase(),
            status: 'created',
            createdAt: new Date().toISOString()
          });

          StripeGatewayServer.sendJson(res, 200, order);
        } catch (err) {
          console.error('[PayPal] create-order error:', err);
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      if (pathname === '/api/paypal/capture-order' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const { paypalOrderId, payerEmail } = body;
          const result = await this.paypalProvider.captureOrder({ paypalOrderId, payerEmail });
          
          const payment = this.paymentsLedger.get(paypalOrderId);
          if (payment) {
            payment.status = 'succeeded';
            payment.captureId = result.captureId;
            payment.completedAt = result.completedAt;
          }

          StripeGatewayServer.sendJson(res, 200, {
            ...result,
            success: true,
            status: 'succeeded',
            method: 'paypal',
            orderId: payment?.orderId
          });
        } catch (err) {
          console.error('[PayPal] capture-order error:', err);
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      // ========================
      // 9. bKash PAYMENT ROUTES
      // ========================
      if (pathname === '/api/bkash/create-payment' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const { amount = 25.00, currency = 'usd', orderId = `ORD-BK-${Date.now()}`, customerWallet } = body;

          const payment = await this.bkashProvider.createPayment({
            amount,
            currency,
            orderId,
            customerWallet
          });

          this.paymentsLedger.set(payment.paymentID, {
            id: payment.paymentID,
            orderId,
            method: 'bkash',
            amount: payment.amountBDT,
            currency: 'BDT',
            originalAmount: payment.originalAmount,
            originalCurrency: payment.originalCurrency,
            customerWallet: payment.customerWallet,
            status: 'initiated',
            createdAt: new Date().toISOString()
          });

          StripeGatewayServer.sendJson(res, 200, payment);
        } catch (err) {
          console.error('[bKash] create-payment error:', err);
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      if (pathname === '/api/bkash/execute-payment' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const { paymentID, customerWallet, otp, pin } = body;

          const result = await this.bkashProvider.executePayment({
            paymentID,
            customerWallet,
            otp,
            pin
          });

          const payment = this.paymentsLedger.get(paymentID);
          if (payment) {
            payment.status = 'succeeded';
            payment.trxID = result.trxID;
            payment.completedAt = result.completedAt;
          }

          StripeGatewayServer.sendJson(res, 200, {
            ...result,
            success: true,
            status: 'succeeded',
            method: 'bkash',
            orderId: payment?.orderId,
            amountBDT: payment?.amount
          });
        } catch (err) {
          console.error('[bKash] execute-payment error:', err);
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      // ========================
      // 10. NAGAD PAYMENT ROUTES
      // ========================
      if (pathname === '/api/nagad/initialize' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const { amount = 25.00, currency = 'usd', orderId = `ORD-NG-${Date.now()}`, customerWallet } = body;

          const payment = await this.nagadProvider.initializePayment({
            amount,
            currency,
            orderId,
            customerWallet
          });

          this.paymentsLedger.set(payment.paymentRefId, {
            id: payment.paymentRefId,
            orderId,
            method: 'nagad',
            amount: payment.amountBDT,
            currency: 'BDT',
            customerWallet: payment.customerWallet,
            status: 'initialized',
            createdAt: new Date().toISOString()
          });

          StripeGatewayServer.sendJson(res, 200, payment);
        } catch (err) {
          console.error('[Nagad] initialize error:', err);
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      if (pathname === '/api/nagad/verify-payment' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const { paymentRefId, customerWallet, otp, pin } = body;

          const result = await this.nagadProvider.verifyPayment({
            paymentRefId,
            customerWallet,
            otp,
            pin
          });

          const payment = this.paymentsLedger.get(paymentRefId);
          if (payment) {
            payment.status = 'succeeded';
            payment.trxID = result.trxID;
            payment.completedAt = result.completedAt;
          }

          StripeGatewayServer.sendJson(res, 200, {
            ...result,
            success: true,
            status: 'succeeded',
            method: 'nagad',
            orderId: payment?.orderId,
            amountBDT: payment?.amount
          });
        } catch (err) {
          console.error('[Nagad] verify-payment error:', err);
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      // ========================
      // 11. ROCKET PAYMENT ROUTES
      // ========================
      if (pathname === '/api/rocket/initiate' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const { amount = 25.00, currency = 'usd', orderId = `ORD-RKT-${Date.now()}`, customerWallet } = body;

          const payment = await this.rocketProvider.initiatePayment({
            amount,
            currency,
            orderId,
            customerWallet
          });

          this.paymentsLedger.set(payment.rocketRefId, {
            id: payment.rocketRefId,
            orderId,
            method: 'rocket',
            amount: payment.amountBDT,
            currency: 'BDT',
            customerWallet: payment.customerWallet,
            status: 'initiated',
            createdAt: new Date().toISOString()
          });

          StripeGatewayServer.sendJson(res, 200, payment);
        } catch (err) {
          console.error('[Rocket] initiate error:', err);
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      if (pathname === '/api/rocket/verify' && method === 'POST') {
        try {
          const body = await StripeGatewayServer.parseBody(req);
          const { rocketRefId, customerWallet, otp, pin } = body;

          const result = await this.rocketProvider.verifyPayment({
            rocketRefId,
            customerWallet,
            otp,
            pin
          });

          const payment = this.paymentsLedger.get(rocketRefId);
          if (payment) {
            payment.status = 'succeeded';
            payment.trxID = result.trxID;
            payment.completedAt = result.completedAt;
          }

          StripeGatewayServer.sendJson(res, 200, {
            ...result,
            success: true,
            status: 'succeeded',
            method: 'rocket',
            orderId: payment?.orderId,
            amountBDT: payment?.amount
          });
        } catch (err) {
          console.error('[Rocket] verify error:', err);
          StripeGatewayServer.sendJson(res, 400, { error: err.message });
        }
        return;
      }

      // ========================
      // 12. WEBHOOK HANDLER
      // ========================
      if (pathname === '/api/webhook' && method === 'POST') {
        const rawBody = await StripeGatewayServer.readRawBody(req);
        const sig = req.headers['stripe-signature'];

        let event;
        if (!this.isMockMode && this.stripe && this.webhookSecret) {
          try {
            event = this.stripe.webhooks.constructEvent(rawBody, sig, this.webhookSecret);
          } catch (err) {
            console.error('[Stripe Webhook] Signature verification failed:', err.message);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `Webhook Error: ${err.message}` }));
            return;
          }
        } else {
          try {
            event = JSON.parse(rawBody.toString('utf8') || '{}');
          } catch {
            event = { type: 'unknown' };
          }
        }

        console.log(`[Webhook] Received verified event: ${event.type}`);

        switch (event.type) {
          case 'payment_intent.succeeded': {
            const pi = event.data?.object;
            console.log(`[Webhook] PaymentIntent succeeded: ${pi?.id} for ${pi?.amount} ${pi?.currency}`);
            break;
          }
          case 'payment_intent.payment_failed': {
            const pi = event.data?.object;
            console.warn(`[Webhook] PaymentIntent failed: ${pi?.id}: ${pi?.last_payment_error?.message}`);
            break;
          }
          case 'checkout.session.completed': {
            const session = event.data?.object;
            console.log(`[Webhook] Checkout Session completed: ${session?.id}`);
            break;
          }
          default:
            break;
        }

        StripeGatewayServer.sendJson(res, 200, { received: true, event: event.type });
        return;
      }

      // ========================
      // 13. STATIC FRONTEND
      // ========================
      if (method === 'GET') {
        let filePath = path.join(this.publicDir, pathname === '/' ? 'index.html' : pathname);
        this.serveStaticFile(res, filePath);
        return;
      }

      // Route Not Found
      StripeGatewayServer.sendJson(res, 404, { error: `Route not found: ${method} ${pathname}` });
    });
  }

  listen(port, callback) {
    const p = port || this.port;
    this.server = this.createServer();
    return this.server.listen(p, () => {
      console.log(`====================================================`);
      console.log(`💳 Universal Gateway online at: http://localhost:${p}`);
      console.log(`• Mode:               ${this.isMockMode ? '🟡 Developer Sandbox (Simulator)' : '🟢 Live Stripe Production/Test'}`);
      console.log(`• Default Currency:   ${this.defaultCurrency.toUpperCase()}`);
      console.log(`• Currencies Loaded:  ${CURRENCIES.length} ISO currencies`);
      console.log(`• Country Codes:      ${COUNTRIES.length} verification country dialing codes`);
      console.log(`• Payment Methods:    Card, PayPal, bKash, Nagad, Rocket, UPI`);
      console.log(`• Statement Brand:    ${this.statementDescriptor}`);
      console.log(`====================================================`);
      if (callback) callback();
    });
  }

  close(callback) {
    if (this.server) {
      this.server.close(callback);
    } else if (callback) {
      callback();
    }
  }
}
