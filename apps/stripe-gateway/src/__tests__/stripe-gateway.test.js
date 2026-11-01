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
  ZERO_DECIMAL_CURRENCIES
} from '../server.js';

describe('Stripe Gateway International Card Flow & Verification Tests', () => {
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

  // 1. Currency Unit Calculations & Zero-Decimal Invariants
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
    assert.equal(toSmallestUnit(7500, 'ugx'), 7500);
  });

  test('formatCurrencyAmount formats smallest units back to decimal or whole', () => {
    assert.equal(formatCurrencyAmount(1050, 'usd'), '10.50');
    assert.equal(formatCurrencyAmount(2500, 'jpy'), '2500');
    assert.equal(formatCurrencyAmount(50000, 'inr'), '500.00');
  });

  // 2. Comprehensive Currency & Country Calling Code Datasets
  test('CURRENCIES catalog contains over 130 ISO currencies', () => {
    assert.ok(CURRENCIES.length >= 130, `Expected >= 130 currencies, got ${CURRENCIES.length}`);
    const codes = new Set(CURRENCIES.map(c => c.code.toLowerCase()));
    
    // Major & regional currencies must all be present
    const required = [
      'usd', 'eur', 'gbp', 'cad', 'aud', 'jpy', 'inr', 'chf', 'cny', 'sgd',
      'hkd', 'nzd', 'sek', 'nok', 'dkk', 'pln', 'mxn', 'brl', 'zar', 'krw',
      'aed', 'sar', 'qar', 'kwd', 'bhd', 'omr', 'jod', 'ils', 'egp', 'mad',
      'thb', 'myr', 'idr', 'php', 'vnd', 'twd', 'bdt', 'pkr', 'lkr', 'npr',
      'ngn', 'kes', 'ghs', 'ugx', 'tzs', 'rwf', 'etb', 'ars', 'clp', 'cop',
      'pen', 'uyu', 'pyg', 'bob', 'crc', 'dop', 'gtq', 'hnl', 'nio', 'pab'
    ];
    for (const cur of required) {
      assert.ok(codes.has(cur), `Missing required currency: ${cur}`);
    }
  });

  test('COUNTRIES catalog contains international dialing codes ("country numbers") for verification', () => {
    assert.ok(COUNTRIES.length >= 150, `Expected >= 150 countries, got ${COUNTRIES.length}`);
    const dialMap = new Map(COUNTRIES.map(c => [c.code, c.dialCode]));

    // Check key dialing codes
    assert.equal(dialMap.get('US'), '+1');
    assert.equal(dialMap.get('GB'), '+44');
    assert.equal(dialMap.get('IN'), '+91');
    assert.equal(dialMap.get('DE'), '+49');
    assert.equal(dialMap.get('FR'), '+33');
    assert.equal(dialMap.get('JP'), '+81');
    assert.equal(dialMap.get('AU'), '+61');
    assert.equal(dialMap.get('AE'), '+971');
    assert.equal(dialMap.get('BD'), '+880');
    assert.equal(dialMap.get('PK'), '+92');
    assert.equal(dialMap.get('BR'), '+55');
    assert.equal(dialMap.get('NG'), '+234');
    assert.equal(dialMap.get('KE'), '+254');
  });

  test('getCurrency and getCountry helpers resolve correctly', () => {
    const usd = getCurrency('USD');
    assert.equal(usd.code, 'usd');
    assert.equal(usd.symbol, '$');

    const ind = getCountry('IN');
    assert.equal(ind.dialCode, '+91');
    assert.equal(ind.currency, 'inr');

    assert.equal(getCurrency('UNKNOWN'), null);
    assert.equal(getCountry('XX'), null);
  });

  // 3. International Phone Number Validation & Formatting (ITU-T E.164)
  test('validatePhoneNumber validates ITU-T E.164 phone numbers with country calling code', () => {
    const validUS = validatePhoneNumber('+1', '5550199');
    assert.equal(validUS.valid, true);
    assert.equal(validUS.e164, '+15550199');

    const validIN = validatePhoneNumber('+91', '9876543210');
    assert.equal(validIN.valid, true);
    assert.equal(validIN.e164, '+919876543210');

    const validBD = validatePhoneNumber('+880', '1712345678');
    assert.equal(validBD.valid, true);
    assert.equal(validBD.e164, '+8801712345678');

    // Invalid formats
    assert.equal(validatePhoneNumber('', '5550199').valid, false);
    assert.equal(validatePhoneNumber('1', '5550199').valid, false); // missing '+'
    assert.equal(validatePhoneNumber('+1', '12').valid, false); // too short
  });

  test('formatPhoneNumber formats numbers nicely for user display', () => {
    assert.equal(formatPhoneNumber('+1', '5551234567'), '+1 (555) 123-4567');
    assert.equal(formatPhoneNumber('+91', '9876543210'), '+91 (987) 654-3210');
    assert.equal(formatPhoneNumber('+44', '7911123456'), '+44 (791) 112-3456');
  });

  // 4. API Catalogs (GET /api/currencies and GET /api/config)
  test('GET /api/currencies returns all supported ISO currencies and country numbers', async () => {
    const res = await makeRequest('GET', '/api/currencies');
    assert.equal(res.status, 200);
    assert.ok(res.body.totalCurrencies >= 130);
    assert.ok(res.body.totalCountries >= 150);
    assert.ok(Array.isArray(res.body.currencies));
    assert.ok(Array.isArray(res.body.countries));
  });

  test('GET /api/config includes supportedCurrencies and countries', async () => {
    const res = await makeRequest('GET', '/api/config');
    assert.equal(res.status, 200);
    assert.equal(res.body.publishableKey, 'pk_test_sample_publishable_key');
    assert.equal(res.body.statementDescriptor, 'MY BRAND');
    assert.ok(Array.isArray(res.body.supportedCurrencies));
    assert.ok(res.body.supportedCurrencies.length >= 130);
    assert.ok(Array.isArray(res.body.countries));
    assert.ok(res.body.countries.length >= 150);
  });

  // 5. Phone Verification API Flow (Send & Check OTP)
  test('POST /api/verify/send-code generates verification code for phone with country number', async () => {
    const res = await makeRequest('POST', '/api/verify/send-code', {
      dialCode: '+1',
      nationalNumber: '5550199',
      countryCode: 'US'
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.e164, '+15550199');
    assert.ok(res.body.sampleCode);
    assert.equal(res.body.sampleCode.length, 6);
  });

  test('POST /api/verify/send-code rejects invalid phone numbers', async () => {
    const res = await makeRequest('POST', '/api/verify/send-code', {
      dialCode: 'invalid',
      nationalNumber: '12'
    });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });

  test('POST /api/verify/check-code verifies matching code and rejects invalid code', async () => {
    // 1. Send code
    const sendRes = await makeRequest('POST', '/api/verify/send-code', {
      dialCode: '+44',
      nationalNumber: '7911123456',
      countryCode: 'GB'
    });
    assert.equal(sendRes.status, 200);
    const sentCode = sendRes.body.sampleCode;

    // 2. Try wrong code
    const failRes = await makeRequest('POST', '/api/verify/check-code', {
      dialCode: '+44',
      nationalNumber: '7911123456',
      code: '000000'
    });
    assert.equal(failRes.status, 400);
    assert.ok(failRes.body.error);

    // 3. Verify correct code
    const successRes = await makeRequest('POST', '/api/verify/check-code', {
      dialCode: '+44',
      nationalNumber: '7911123456',
      code: sentCode
    });
    assert.equal(successRes.status, 200);
    assert.equal(successRes.body.success, true);
    assert.equal(successRes.body.verified, true);
    assert.equal(successRes.body.e164, '+447911123456');
  });

  // 6. Payment Intent Creation with Verified Phone & Multi-Currency
  test('POST /api/create-payment-intent creates intent with customer phone and currency', async () => {
    const res = await makeRequest('POST', '/api/create-payment-intent', {
      amount: 49.99,
      currency: 'eur',
      orderId: 'ORD-INTL-101',
      customerEmail: 'buyer@example.com',
      customerName: 'Alice Buyer',
      customerPhone: '+447911123456',
      dialCode: '+44',
      countryCode: 'GB',
      phoneVerified: true
    });
    assert.equal(res.status, 200);
    assert.ok(res.body.clientSecret);
    assert.ok(res.body.paymentIntentId);
    assert.equal(res.body.amount, 4999);
    assert.equal(res.body.currency, 'EUR');
    assert.equal(res.body.customerPhone, '+447911123456');
    assert.equal(res.body.phoneVerified, true);
  });

  // 7. Simulated Payment Confirmation
  test('POST /api/confirm-simulated-payment marks intent as succeeded with statement descriptor', async () => {
    const createRes = await makeRequest('POST', '/api/create-payment-intent', {
      amount: 3000,
      currency: 'jpy',
      orderId: 'ORD-TEST-JPY-1002'
    });

    const confirmRes = await makeRequest('POST', '/api/confirm-simulated-payment', {
      paymentIntentId: createRes.body.paymentIntentId,
      cardLast4: '4242',
      brand: 'visa'
    });
    assert.equal(confirmRes.status, 200);
    assert.equal(confirmRes.body.success, true);
    assert.equal(confirmRes.body.status, 'succeeded');
    assert.equal(confirmRes.body.statementDescriptor, 'MY BRAND');
  });

  // 8. Hosted Checkout Session Creation with Phone Collection
  test('POST /api/create-checkout-session returns hosted session URL with phone collection enabled', async () => {
    const res = await makeRequest('POST', '/api/create-checkout-session', {
      amount: 100.00,
      currency: 'usd',
      orderId: 'ORD-HOSTED-555',
      customerPhone: '+15550199',
      countryCode: 'US'
    });
    assert.equal(res.status, 200);
    assert.ok(res.body.sessionId);
    assert.ok(res.body.checkoutUrl);
    assert.equal(res.body.orderId, 'ORD-HOSTED-555');
  });

  // 9. Webhook Handler
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

  // 10. Static Frontend Serving
  test('GET / serves HTML with currency and phone verification elements', async () => {
    const res = await makeRequest('GET', '/');
    assert.equal(res.status, 200);
    assert.ok(typeof res.body === 'string');
    assert.ok(res.body.includes('https://js.stripe.com/v3/'));
    assert.ok(res.body.includes('currency-select'));
    assert.ok(res.body.includes('country-dial-select'));
    assert.ok(res.body.includes('send-otp-btn'));
  });

  test('GET /css/style.css serves valid stylesheet with phone verification styles', async () => {
    const res = await makeRequest('GET', '/css/style.css');
    assert.equal(res.status, 200);
    assert.ok(typeof res.body === 'string');
    assert.ok(res.body.includes('.phone-verification-section'));
    assert.ok(res.body.includes('.dial-code-dropdown'));
  });
});
