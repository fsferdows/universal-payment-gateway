import crypto from 'node:crypto';

/**
 * PayPal Payment Provider
 * Supports PayPal REST API v2 (Orders & Captures) with seamless developer sandbox fallback.
 */
export class PayPalProvider {
  constructor(options = {}) {
    this.clientId = options.clientId || process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = options.clientSecret || process.env.PAYPAL_CLIENT_SECRET || '';
    this.mode = (options.mode || process.env.PAYPAL_MODE || 'sandbox').toLowerCase();
    this.statementDescriptor = options.statementDescriptor || 'YOUPI GLOBAL';

    const isPlaceholder = !this.clientId || this.clientId.includes('your-paypal') || this.clientId === 'sandbox_placeholder';
    this.isMockMode = isPlaceholder;
    this.baseUrl = this.mode === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
  }

  /**
   * Get OAuth2 access token from PayPal
   */
  async getAccessToken() {
    if (this.isMockMode) {
      return 'mock_access_token_' + crypto.randomBytes(16).toString('hex');
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const res = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`PayPal OAuth failed: ${res.status} ${errText}`);
    }

    const data = await res.json();
    return data.access_token;
  }

  /**
   * Create PayPal Order (v2/checkout/orders)
   */
  async createOrder({ amount, currency = 'USD', orderId, returnUrl, cancelUrl }) {
    const cur = currency.toUpperCase();
    const formattedAmount = Number(amount).toFixed(2);

    if (this.isMockMode) {
      const paypalOrderId = `PAYID-${crypto.randomBytes(10).toString('hex').toUpperCase()}`;
      return {
        id: paypalOrderId,
        status: 'CREATED',
        amount: formattedAmount,
        currency: cur,
        orderId,
        approveUrl: returnUrl || `http://localhost:4242/success.html?method=paypal&order_id=${encodeURIComponent(orderId)}&paypal_order_id=${paypalOrderId}&amount=${formattedAmount}&currency=${cur}`,
        isMockMode: true
      };
    }

    const token = await this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: orderId,
            description: `Payment for ${orderId}`,
            soft_descriptor: this.statementDescriptor.slice(0, 22),
            amount: {
              currency_code: cur,
              value: formattedAmount
            }
          }
        ],
        application_context: {
          brand_name: this.statementDescriptor,
          return_url: returnUrl,
          cancel_url: cancelUrl,
          user_action: 'PAY_NOW'
        }
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create PayPal order');
    }

    const data = await res.json();
    const approveLink = data.links?.find(l => l.rel === 'approve')?.href;

    return {
      id: data.id,
      status: data.status,
      amount: formattedAmount,
      currency: cur,
      orderId,
      approveUrl: approveLink,
      isMockMode: false
    };
  }

  /**
   * Capture PayPal Order (v2/checkout/orders/{id}/capture)
   */
  async captureOrder({ paypalOrderId, payerEmail }) {
    if (this.isMockMode) {
      const captureId = `CAPTURE-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
      return {
        id: paypalOrderId,
        status: 'COMPLETED',
        captureId,
        payerEmail: payerEmail || 'customer@gateway.checkout',
        statementDescriptor: this.statementDescriptor,
        completedAt: new Date().toISOString()
      };
    }

    const token = await this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to capture PayPal payment');
    }

    const data = await res.json();
    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];

    return {
      id: data.id,
      status: data.status,
      captureId: capture?.id,
      payerEmail: data.payer?.email_address,
      statementDescriptor: this.statementDescriptor,
      completedAt: new Date().toISOString(),
      isMockMode: false
    };
  }
}

