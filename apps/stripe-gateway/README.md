# Universal Payment Gateway

### Multi-Method Global Checkout & Peer-to-Peer Banking Observer

**Architected & Maintained by [FS FERDOWS](https://github.com/fsferdows) • [YouTube](https://youtube.com/@fsferdowsyt?si=03HdUXfd3jfuD0AZ) • [LateBright](https://github.com/fsferdows)**

A high-performance sovereign payment microservice providing a unified checkout interface and automated payment observation across **Cards, PayPal, bKash, Nagad, Rocket, and UPI**.

---

## ⚡ Key Capabilities

1. **Global Multi-Rail Support**:
   - **Credit / Debit Cards**: Powered by Stripe Elements with 3D-Secure support.
   - **PayPal v2**: Instant order creation and capture.
   - **bKash**: Direct merchant API & Peer-to-Peer Send Money with automatic `TrxID` observation.
   - **Nagad**: Direct merchant API & Peer-to-Peer Send Money with automatic `TxnID` observation.
   - **Rocket (DBBL)**: 12-digit account validation & Peer-to-Peer Send Money with automatic `TxnId` observation.
   - **UPI**: Direct VPA intent and automated `UTR` banking observation.

2. **136 Global ISO Currencies & FX Engine**:
   - Auto-converts international currencies (`USD`, `EUR`, `GBP`, `CAD`, `AUD`, `JPY`, `AED`, `SAR`, etc.) into local settlement currency (`BDT`) using real-time pegged FX rates.
   - Handles zero-decimal currencies (`JPY`, `KRW`, `VND`, `CLP`) without floating-point error.

3. **155-Country Phone Verification**:
   - International dialing codes (`+1`, `+44`, `+880`, `+91`, `+49`, `+971`, etc.).
   - Built-in 6-digit SMS OTP verification engine.

4. **Automated Banking Observer (Zero Aggregator Fees)**:
   - Ingests cellular SMS notifications from Android background observers (`/api/observer/sms`).
   - Parses bKash (`TrxID`), Nagad (`TxnID`), Rocket (`TxnId`), and Indian UPI (`UTR`) messages.
   - Automatically attributes received payments to pending customer orders in $< 1$ second.

5. **Merchant Statement Privacy Shield & Auto-Payout**:
   - Routes received customer funds directly to your receiving card or bank account.
   - Masks sensitive card details (`**** **** **** 4444`).
   - Customizes statement descriptors (e.g. `YOUPI DIRECT`) for customer billing statements.

---

## 🔌 API Endpoints Reference

### Configuration & Discovery
- `GET /health` — Service health, active mode, and provider configuration status.
- `GET /api/config` — Public configuration, publishable keys, supported currencies, and receiving wallets.
- `GET /api/payment-methods` — List of all active payment rails and provider details.
- `GET /api/currencies` — Complete list of 136 ISO currencies, dialing codes, and exchange rates.

### Phone Verification
- `POST /api/verify/send-code` — Generate and dispatch a 6-digit verification code to the customer's phone.
- `POST /api/verify/check-code` — Validate customer OTP.

### Card Payments (Stripe)
- `POST /api/create-payment-intent` — Initialize a Stripe PaymentIntent with amount and currency.
- `POST /api/confirm-payment` — Confirm and settle the payment intent.

### PayPal Payments
- `POST /api/paypal/create-order` — Create a PayPal v2 checkout order.
- `POST /api/paypal/capture-order` — Capture funds upon customer approval.

### Bangladeshi Mobile Financial Services (MFS)
- `POST /api/bkash/create-payment` & `POST /api/bkash/execute-payment` — bKash merchant payment flow.
- `POST /api/nagad/initiate` & `POST /api/nagad/verify` — Nagad merchant payment flow.
- `POST /api/rocket/initiate` & `POST /api/rocket/verify` — Dutch-Bangla Bank Rocket 12-digit payment flow.

### Peer-to-Peer Banking Observer (0% Fee)
- `POST /api/p2p/verify-trxid` — Customer submits transaction ID (`TrxID` / `TxnID` / `UTR`) for instant verification.
- `GET /api/p2p/status?order_id=...&trx_id=...` — Poll order settlement status.
- `POST /api/observer/sms` — Ingest cellular banking SMS from Android observer.
- `GET /api/observer/recent` — View recently observed bank credit notifications.
- `GET /api/mfs-settings` & `POST /api/mfs-settings` — View or update merchant receiving wallets.

### Payout & Privacy
- `GET /api/payout-settings` & `POST /api/payout-settings` — Configure destination card and statement descriptor.
- `POST /api/payout-trigger` — Execute instant payout of settled customer balances.

---

## 🚀 Quickstart

### Running the Gateway

```bash
# Start standalone on port 4242
node apps/stripe-gateway/src/index.js
```

Open your browser at:
```
http://localhost:4242
```

### Running Tests

```bash
node --test apps/stripe-gateway/src/__tests__/stripe-gateway.test.js
```

---

## 👨‍💻 Author

**FS FERDOWS**  
- **GitHub**: [@fsferdows](https://github.com/fsferdows)  
- **YouTube**: [@fsferdowsyt](https://youtube.com/@fsferdowsyt?si=03HdUXfd3jfuD0AZ)  
- **Company**: LateBright  
- **Email**: fsferdows@icloud.com
