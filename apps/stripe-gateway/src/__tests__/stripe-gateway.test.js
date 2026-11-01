import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { StripeGatewayServer, toSmallestUnit, formatCurrencyAmount } from '../server.js';

describe('Stripe Gateway International Card Flow Tests', () => {
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

  // 1. Currency Unit Calculations
  test('toSmallestUnit converts standard decimal currencies to cents', () => {
    assert.equal(toSmallestUnit(10.50, 'usd'), 1050);
    assert.equal(toSmallestUnit('25.99', 'eur'), 2599);
    assert.equal(toSmallestUnit(100, 'gbp'), 10000);
  });

  test('toSmallestUnit respects zero-decimal currencies (JPY, KRW, etc.)', () => {
    assert.equal(toSmallestUnit(2500, 'jpy'), 2500);
    assert.equal(toSmallestUnit('500', 'krw'), 500);
  });

  test('formatCurrencyAmount formats smallest units back to decimal', () => {
    assert.equal(formatCurrencyAmount(1050, 'usd'), '10.50');
    assert.equal(formatCurrencyAmount(2500, 'jpy'), '2500');
  });

  // 2. Health Endpoint
  test('GET /health returns status UP and gateway configuration', async () => {
    const res = await makeRequest('GET', '/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'UP');
    assert.equal(res.body.service, 'stripe-gateway');
  });

  // 3. Config Endpoint
  test('GET /api/config returns publishableKey and supported currencies', async () => {
    const res = await makeRequest('GET', '/api/config');
    assert.equal(res.status, 200);
    assert.equal(res.body.publishableKey, 'pk_test_sample_publishable_key');
    assert.equal(res.body.statementDescriptor, 'MY BRAND');
    assert.ok(Array.isArray(res.body.supportedCurrencies));
    assert.ok(res.body.supportedCurrencies.some(c => c.code === 'usd'));
    assert.ok(res.body.supportedCurrencies.some(c => c.code === 'eur'));
  });

  // 4. Payment Intent Creation
  test('POST /api/create-payment-intent creates intent and returns clientSecret', async () => {
    const res = await makeRequest('POST', '/api/create-payment-intent', {
      amount: 49.99,
      currency: 'usd',
      orderId: 'ORD-TEST-1001',
      customerEmail: 'buyer@example.com',
      customerName: 'Alice Buyer'
    });
    assert.equal(res.status, 200);
    assert.ok(res.body.clientSecret);
    assert.ok(res.body.paymentIntentId);
    assert.equal(res.body.amount, 4999);
    assert.equal(res.body.currency, 'USD');
    assert.equal(res.body.formattedAmount, '49.99');
  });

  // 5. Simulated Payment Confirmation
  test('POST /api/confirm-simulated-payment marks intent as succeeded', async () => {
    const createRes = await makeRequest('POST', '/api/create-payment-intent', {
      amount: 25.00,
      currency: 'eur',
      orderId: 'ORD-TEST-1002'
    });

    const confirmRes = await makeRequest('POST', '/api/confirm-simulated-payment', {
      paymentIntentId: createRes.body.paymentIntentId,
      cardLast4: '4242',
      brand: 'visa'
    });
    assert.equal(confirmRes.status, 200);
    assert.equal(confirmRes.body.success, true);
    assert.equal(confirmRes.body.status, 'succeeded');
    assert.equal(confirmRes.body.orderId, 'ORD-TEST-1002');
  });

  // 6. Hosted Checkout Session Creation
  test('POST /api/create-checkout-session returns hosted session URL', async () => {
    const res = await makeRequest('POST', '/api/create-checkout-session', {
      amount: 100.00,
      currency: 'usd',
      orderId: 'ORD-HOSTED-555'
    });
    assert.equal(res.status, 200);
    assert.ok(res.body.sessionId);
    assert.ok(res.body.checkoutUrl);
    assert.equal(res.body.orderId, 'ORD-HOSTED-555');
  });

  // 7. Webhook Handler
  test('POST /api/webhook receives and acknowledges event', async () => {
    const payload = {
      id: 'evt_test_123',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_123',
          amount: 2500,
          currency: 'usd'
        }
      }
    };
    const res = await makeRequest('POST', '/api/webhook', payload);
    assert.equal(res.status, 200);
    assert.equal(res.body.received, true);
    assert.equal(res.body.event, 'payment_intent.succeeded');
  });

  // 8. Static Frontend Serving
  test('GET / serves HTML with Stripe.js script tag', async () => {
    const res = await makeRequest('GET', '/');
    assert.equal(res.status, 200);
    assert.ok(typeof res.body === 'string');
    assert.ok(res.body.includes('https://js.stripe.com/v3/'));
    assert.ok(res.body.includes('Global Card Gateway'));
  });

  test('GET /css/style.css serves valid stylesheet', async () => {
    const res = await makeRequest('GET', '/css/style.css');
    assert.equal(res.status, 200);
    assert.ok(typeof res.body === 'string');
    assert.ok(res.body.includes(':root'));
  });
});
