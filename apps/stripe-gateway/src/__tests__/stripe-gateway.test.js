import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {
  StripeGatewayServer,
  toSmallestUnit,
  formatCurrencyAmount,
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
  BDT_EXCHANGE_RATES,
  ZERO_DECIMAL_CURRENCIES
} from '../server.js';

describe('Universal Payment Gateway Tests (Card, PayPal, bKash, Nagad, Rocket, UPI)', () => {
  let gateway;
  let server;
  let baseUrl;
  const testPort = 4299;

  before(async () => {
    gateway = new StripeGatewayServer({
      port: testPort,
      secretKey: 'sk_test_placeholder',
      publishableKey: 'pk_test_sample_publishable_key',
      statementDescriptor: 'MY BRAND'
    });
    server = gateway.createServer();
    await new Promise(resolve => server.listen(testPort, resolve));
    baseUrl = `http://localhost:${testPort}`;
  });

  after(async () => {
    await new Promise(resolve => server.close(resolve));
  });

  function makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const reqHeaders = { ...headers };
      let payload = null;
      if (body) {
        payload = typeof body === 'string' ? body : JSON.stringify(body);
        reqHeaders['Content-Type'] = 'application/json';
        reqHeaders['Content-Length'] = Buffer.byteLength(payload);
      }
      const req = http.request(url, { method, headers: reqHeaders }, res => {
        let resBody = '';
        res.on('data', chunk => { resBody += chunk; });
        res.on('end', () => {
          let parsed;
          try { parsed = JSON.parse(resBody); } catch { parsed = resBody; }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      });
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  }

  // ============================================
  // 1. Currency & MFS Helper Unit Tests
  // ============================================
  test('toSmallestUnit converts standard decimal currencies to cents', () => {
    assert.equal(toSmallestUnit(10.50, 'usd'), 1050);
    assert.equal(toSmallestUnit('25.99', 'eur'), 2599);
    assert.equal(toSmallestUnit(100, 'gbp'), 10000);
    assert.equal(toSmallestUnit(500, 'inr'), 50000);
  });

  test('toSmallestUnit respects zero-decimal currencies (JPY, KRW, VND, CLP, etc.)', () => {
    assert.equal(toSmallestUnit(2500, 'jpy'), 2500);
    assert.equal(toSmallestUnit('500', 'krw'), 500);
    assert.equal(toSmallestUnit(100000, 'vnd'), 100000);
    assert.equal(toSmallestUnit(15000, 'clp'), 15000);
  });

  test('convertToBDT converts international currencies to BDT correctly', () => {
    const usd = convertToBDT(25, 'usd');
    assert.equal(usd.originalAmount, 25);
    assert.equal(usd.originalCurrency, 'USD');
    assert.equal(usd.exchangeRate, 122.50);
    assert.equal(usd.bdtAmount, 3063);

    const eur = convertToBDT(10, 'eur');
    assert.equal(eur.bdtAmount, 1320);

    const bdt = convertToBDT(500, 'bdt');
    assert.equal(bdt.bdtAmount, 500);
  });

  test('validateWalletNumber enforces format for bKash, Nagad, and Rocket', () => {
    // bKash: 11 digits
    assert.equal(validateWalletNumber('01711000111', 'bkash').valid, true);
    assert.equal(validateWalletNumber('01811000222', 'bkash').valid, true);
    assert.equal(validateWalletNumber('01911000333', 'bkash').valid, true);
    assert.equal(validateWalletNumber('12345', 'bkash').valid, false);

    // Nagad: 11 digits
    assert.equal(validateWalletNumber('01611000444', 'nagad').valid, true);
    assert.equal(validateWalletNumber('01211000444', 'nagad').valid, false); // invalid prefix

    // Rocket: 12 digits (11 mobile digits + 1 check digit)
    assert.equal(validateWalletNumber('019110003331', 'rocket').valid, true);
    assert.equal(validateWalletNumber('01911000333', 'rocket').valid, false); // only 11 digits
  });

  // ============================================
  // 2. Catalogs & Payment Methods
  // ============================================
  test('GET /api/payment-methods returns all active payment options (Card, PayPal, bKash, Nagad, Rocket, UPI)', async () => {
    const res = await makeRequest('GET', '/api/payment-methods');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.methods));
    const ids = res.body.methods.map(m => m.id);
    assert.ok(ids.includes('card'));
    assert.ok(ids.includes('paypal'));
    assert.ok(ids.includes('bkash'));
    assert.ok(ids.includes('nagad'));
    assert.ok(ids.includes('rocket'));
    assert.ok(ids.includes('upi'));
  });

  test('GET /api/currencies returns all supported ISO currencies and country numbers', async () => {
    const res = await makeRequest('GET', '/api/currencies');
    assert.equal(res.status, 200);
    assert.ok(res.body.totalCurrencies >= 130);
    assert.ok(res.body.totalCountries >= 150);
    assert.ok(res.body.fxRates.usd > 0);
  });

  // ============================================
  // 3. Phone Verification API Flow
  // ============================================
  test('Phone verification generates code and verifies matching code', async () => {
    const sendRes = await makeRequest('POST', '/api/verify/send-code', {
      dialCode: '+880',
      nationalNumber: '1711000111',
      countryCode: 'BD'
    });
    assert.equal(sendRes.status, 200);
    assert.equal(sendRes.body.success, true);
    assert.equal(sendRes.body.e164, '+8801711000111');
    assert.ok(sendRes.body.sampleCode);

    const checkRes = await makeRequest('POST', '/api/verify/check-code', {
      dialCode: '+880',
      nationalNumber: '1711000111',
      code: sendRes.body.sampleCode
    });
    assert.equal(checkRes.status, 200);
    assert.equal(checkRes.body.verified, true);
  });

  // ============================================
  // 4. CARD PAYMENT FLOW (Stripe)
  // ============================================
  test('Card payment: create payment intent and confirm simulation', async () => {
    const createRes = await makeRequest('POST', '/api/create-payment-intent', {
      amount: 49.99,
      currency: 'usd',
      orderId: 'ORD-CARD-101',
      customerEmail: 'buyer@example.com',
      customerName: 'Card Buyer',
      customerPhone: '+15550199',
      phoneVerified: true
    });
    assert.equal(createRes.status, 200);
    assert.ok(createRes.body.clientSecret);
    assert.equal(createRes.body.amount, 4999);

    const confirmRes = await makeRequest('POST', '/api/confirm-simulated-payment', {
      paymentIntentId: createRes.body.paymentIntentId,
      cardLast4: '4242',
      brand: 'visa'
    });
    assert.equal(confirmRes.status, 200);
    assert.equal(confirmRes.body.status, 'succeeded');
    assert.equal(confirmRes.body.statementDescriptor, 'MY BRAND');
  });

  // ============================================
  // 5. PAYPAL PAYMENT FLOW
  // ============================================
  test('PayPal payment: create order and capture payment', async () => {
    const createRes = await makeRequest('POST', '/api/paypal/create-order', {
      amount: 35.00,
      currency: 'USD',
      orderId: 'ORD-PP-101'
    });
    assert.equal(createRes.status, 200);
    assert.ok(createRes.body.id.startsWith('PAYID-'));
    assert.equal(createRes.body.status, 'CREATED');

    const captureRes = await makeRequest('POST', '/api/paypal/capture-order', {
      paypalOrderId: createRes.body.id,
      payerEmail: 'customer@paypal.com'
    });
    assert.equal(captureRes.status, 200);
    assert.equal(captureRes.body.status, 'succeeded');
    assert.equal(captureRes.body.method, 'paypal');
    assert.ok(captureRes.body.captureId);
  });

  // ============================================
  // 6. bKash PAYMENT FLOW
  // ============================================
  test('bKash payment: create payment and execute with OTP/PIN', async () => {
    const createRes = await makeRequest('POST', '/api/bkash/create-payment', {
      amount: 25.00,
      currency: 'usd',
      orderId: 'ORD-BKASH-101',
      customerWallet: '01711000111'
    });
    assert.equal(createRes.status, 200);
    assert.ok(createRes.body.paymentID.startsWith('BKASH_'));
    assert.equal(createRes.body.amountBDT, 3063);
    assert.equal(createRes.body.customerWallet, '01711000111');

    const execRes = await makeRequest('POST', '/api/bkash/execute-payment', {
      paymentID: createRes.body.paymentID,
      customerWallet: '01711000111',
      otp: '123456',
      pin: '12345'
    });
    assert.equal(execRes.status, 200);
    assert.equal(execRes.body.status, 'succeeded');
    assert.equal(execRes.body.method, 'bkash');
    assert.ok(execRes.body.trxID);
    assert.equal(execRes.body.statementDescriptor, 'MY BRAND');
  });

  test('bKash payment rejects invalid wallet number', async () => {
    const res = await makeRequest('POST', '/api/bkash/create-payment', {
      amount: 25.00,
      currency: 'usd',
      customerWallet: '12345'
    });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });

  // ============================================
  // 7. NAGAD PAYMENT FLOW
  // ============================================
  test('Nagad payment: initialize and verify with OTP/PIN', async () => {
    const initRes = await makeRequest('POST', '/api/nagad/initialize', {
      amount: 30.00,
      currency: 'usd',
      orderId: 'ORD-NAGAD-101',
      customerWallet: '01811000222'
    });
    assert.equal(initRes.status, 200);
    assert.ok(initRes.body.paymentRefId.startsWith('NGD_REF_'));
    assert.equal(initRes.body.customerWallet, '01811000222');

    const verifyRes = await makeRequest('POST', '/api/nagad/verify-payment', {
      paymentRefId: initRes.body.paymentRefId,
      customerWallet: '01811000222',
      otp: '123456',
      pin: '1234'
    });
    assert.equal(verifyRes.status, 200);
    assert.equal(verifyRes.body.status, 'succeeded');
    assert.equal(verifyRes.body.method, 'nagad');
    assert.ok(verifyRes.body.trxID.startsWith('NGD'));
  });

  // ============================================
  // 8. ROCKET PAYMENT FLOW
  // ============================================
  test('Rocket payment: initiate with 12-digit account and verify with OTP/PIN', async () => {
    const initRes = await makeRequest('POST', '/api/rocket/initiate', {
      amount: 20.00,
      currency: 'usd',
      orderId: 'ORD-ROCKET-101',
      customerWallet: '019110003331' // 12-digit DBBL Rocket number
    });
    assert.equal(initRes.status, 200);
    assert.ok(initRes.body.rocketRefId.startsWith('RKT_REF_'));
    assert.equal(initRes.body.customerWallet, '019110003331');

    const verifyRes = await makeRequest('POST', '/api/rocket/verify', {
      rocketRefId: initRes.body.rocketRefId,
      customerWallet: '019110003331',
      otp: '123456',
      pin: '1234'
    });
    assert.equal(verifyRes.status, 200);
    assert.equal(verifyRes.body.status, 'succeeded');
    assert.equal(verifyRes.body.method, 'rocket');
    assert.ok(verifyRes.body.trxID.startsWith('RKT'));
  });

  test('Rocket payment rejects non-12-digit account', async () => {
    const res = await makeRequest('POST', '/api/rocket/initiate', {
      amount: 20.00,
      currency: 'usd',
      customerWallet: '01911000333' // only 11 digits
    });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });

  // ============================================
  // 9. Static Frontend Serving
  // ============================================
  test('GET / serves HTML with Card, PayPal, bKash, Nagad, Rocket and UPI tabs', async () => {
    const res = await makeRequest('GET', '/');
    assert.equal(res.status, 200);
    assert.ok(typeof res.body === 'string');
    assert.ok(res.body.includes('tab-paypal'));
    assert.ok(res.body.includes('tab-bkash'));
    assert.ok(res.body.includes('tab-nagad'));
    assert.ok(res.body.includes('tab-rocket'));
    assert.ok(res.body.includes('tab-upi'));
    assert.ok(res.body.includes('Universal Payment Gateway'));
  });
});
