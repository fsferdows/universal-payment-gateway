<div align="center">

```
██╗   ██╗███╗   ██╗██╗██╗   ██╗███████╗██████╗ ███████╗ █████╗ ██╗     
██║   ██║████╗  ██║██║██║   ██║██╔════╝██╔══██╗██╔════╝██╔══██╗██║     
██║   ██║██╔██╗ ██║██║██║   ██║█████╗  ██████╔╝███████╗███████║██║     
██║   ██║██║╚██╗██║██║╚██╗ ██╔╝██╔══╝  ██╔══██╗╚════██║██╔══██║██║     
╚██████╔╝██║ ╚████║██║ ╚████╔╝ ███████╗██║  ██║███████║██║  ██║███████╗
 ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
```

# Universal Sovereign Payment Gateway & Banking Observer

### Zero-Fee Self-Hosted Global Payment Gateway with Real-Time Banking Observation

**Architected & Maintained by [FS FERDOWS](https://github.com/fsferdows) • [YouTube](https://youtube.com/@fsferdowsyt?si=03HdUXfd3jfuD0AZ) • [LateBright](https://github.com/fsferdows)**
**0% Gateway Fees • Direct-to-Wallet Settlement • bKash, Nagad, Rocket, UPI, Card & PayPal • Real-Time SMS & Gmail Observers**

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/fsferdows/universal-payment-gateway?style=for-the-badge&logo=github&color=ffd700)](https://github.com/fsferdows/universal-payment-gateway/stargazers)
[![Node.js](https://img.shields.io/badge/Node.js-v22%2B%20LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Zero Aggregator Fees](https://img.shields.io/badge/Fees-0%25%20Forever-10b981?style=for-the-badge&logo=cashapp&logoColor=white)](#)
[![Direct Settlement](https://img.shields.io/badge/Settlement-Instant%20P2P%20Wallet-3b82f6?style=for-the-badge&logo=buffer&logoColor=white)](#)
[![Android Observer](https://img.shields.io/badge/Android-Certified%20APK-3ddc84?style=for-the-badge&logo=android&logoColor=white)](#)
[![Regression Tests](https://img.shields.io/badge/Tests-58%2F58%20Passing%20(100%25)-success?style=for-the-badge&logo=vitest&logoColor=white)](#)
[![Currencies](https://img.shields.io/badge/Currencies-136%20ISO%20Rails-8b5cf6?style=for-the-badge)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

<p align="center">
  <a href="#-quickstart-in-60-seconds">⚡ Quickstart</a> •
  <a href="#-architecture--how-it-works">🏗️ Architecture</a> •
  <a href="#-payment-rails--superpowers">💳 Payment Rails</a> •
  <a href="#-peer-to-peer-mobile-money-observer-bkash--nagad--rocket--upi">📱 P2P SMS Observer</a> •
  <a href="#-100-bank-statement-confidentiality-shield">🛡️ Privacy Shield</a> •
  <a href="#-author--creator">👨‍💻 Author</a>
</p>

</div>

---

## ⚡ Overview

**Universal Sovereign Payment Gateway** is a sovereign, self-hosted financial infrastructure engine designed to eliminate payment aggregator cuts (2%–5%) and corporate merchant account barriers.

It provides a universal, beautiful checkout portal supporting **136 global currencies**, credit/debit cards, PayPal, and **instant zero-fee peer-to-peer (P2P) transfers for bKash, Nagad, Rocket, and UPI** with automated real-time banking observation (SMS & Gmail parsing).

Money flows directly into your personal mobile wallet or bank account in real-time, verified by an automated Android background notification listener.

```
  [ Customer Worldwide ]
             │
  (1) Chooses Card, PayPal, bKash, Nagad, Rocket or UPI at /checkout
             │
  (2) P2P Send Money: Customer transfers directly to YOUR personal wallet
             │
  (3) Telecom/Bank sends credit confirmation SMS to YOUR Android phone
             │
  (4) YouPI SMS Observer app detects SMS and extracts Amount + TrxID in < 500ms
             │
  (5) Core Attribution Engine verifies transaction and marks session SUCCESS
             │
  ┌──────────┴───────────────────────────────────────┐
  ▼                                                  ▼
[ Authoritative HMAC-SHA256 Webhook ]    [ Confidential Direct Card Transfer ]
Sent to your backend / merchant app      Automatically routes settled funds to
                                         your private bank card with 100% masking!
```

---

## 🏗️ Architecture & How It Works

```mermaid
flowchart TD
    subgraph Client["Frontend Checkout (Port 4242 / 7000)"]
        UI["Universal Checkout Portal"]
        Card["💳 Credit / Debit Cards (Stripe Elements)"]
        PP["🅿️ PayPal v2 Orders API"]
        MFS["📱 bKash / Nagad / Rocket (P2P Send Money)"]
        UPI["⚡ UPI & Dynamic QR Stand"]
    end

    subgraph CoreEngine["Sovereign Core Gateway (Port 6100 / 4242)"]
        StateMachine["Payment State Machine (Immutable Transitions)"]
        Queue["Dynamic Atomic Slot Allocator"]
        Normalizer["Multi-Currency Monetary Normalizer"]
        Attribution["Attribution & Anti-Fraud Engine"]
        CardRouter["Confidential Bank Card Auto-Payout Hub"]
    end

    subgraph ObserverMesh["Real-Time Banking Observers"]
        AndroidApp["📱 Android Background Observer APK"]
        SmsParser["📩 Bank & Telecom SMS Regex Parser"]
        GmailPoller["📧 Gmail Push Notification Observer"]
    end

    subgraph MerchantSystem["Merchant App & Settlement"]
        Webhook["Authoritative HMAC-SHA256 Webhook POST /api/webhook"]
        PrivateCard["💳 Merchant's Confidential Bank Card (Zero Exposure)"]
    end

    UI --> Card & PP & MFS & UPI
    MFS & UPI -->|P2P Transfer| TelecomNetwork["Mobile Operator / NPCI Network"]
    TelecomNetwork -->|Credit Alert SMS| AndroidApp
    AndroidApp --> SmsParser
    SmsParser -->|Parsed UTR & Amount| Attribution
    GmailPoller -->|Bank Alert| Attribution
    Card & PP --> CoreEngine

    Attribution --> StateMachine
    StateMachine -->|SUCCESS| Webhook
    StateMachine -->|Auto Transfer| CardRouter
    CardRouter --> PrivateCard
```

---

## 💳 Payment Rails & Superpowers

| Payment Method | Mechanism | Fees | Settlement Time | Coverage |
| :--- | :--- | :--- | :--- | :--- |
| **bKash P2P** | Direct Send Money + SMS Observer | **0%** | **Instant (Real-Time)** | 🇧🇩 Bangladesh (75M+ users) |
| **Nagad P2P** | Bangladesh Post Office MFS + SMS | **0%** | **Instant (Real-Time)** | 🇧🇩 Bangladesh (60M+ users) |
| **Rocket P2P** | Dutch-Bangla Bank 12-digit DBBL | **0%** | **Instant (Real-Time)** | 🇧🇩 Bangladesh (30M+ users) |
| **UPI & QR** | PhonePe, GPay, Paytm, CRED, BHIM | **0%** | **Instant (Real-Time)** | 🇮🇳 India (350M+ users) |
| **Credit/Debit Card** | Stripe Elements / 3D-Secure 2.0 | Standard Stripe | T+2 / Instant Payout | 🌍 136 Global ISO Currencies |
| **PayPal** | PayPal v2 Checkout & Smart Buttons | Standard PayPal | Instant to Balance | 🌍 200+ Countries |

---

## 📱 Peer-to-Peer Mobile Money Observer (bKash / Nagad / Rocket / UPI)

### Zero Gateway Fees & Zero Merchant Accounts
Traditional payment gateways take 2%–4% of every sale and demand registered corporate paperwork. **Universal Sovereign Gateway** solves this through **automated observation**:

1. **Merchant Display**: The checkout screen displays your personal receiving mobile number (`017XXXXXXXX`) and a dynamic reference code.
2. **Customer Send Money**: The customer opens their bKash/Nagad/Rocket app and sends funds via personal "Send Money".
3. **Automated SMS Parsing**: Your personal Android phone receives the telecom SMS (`"You have received Tk 3,000 from 01711000111... TrxID 9A8B7C6D5E"`).
4. **Instant Approval**: The Android Observer app or customer TrxID submission attributes the credit in milliseconds and triggers the verified order callback.

---

## 🛡️ 100% Bank Statement Confidentiality Shield

When accepting payments, your personal debit/bank card or receiving account details are **100% confidential**:
- Customer card and bank statements display **strictly your chosen statement descriptor** (e.g. `YOUPI GLOBAL`).
- Customer never sees your receiving card number, bank name, or routing codes.
- Funds route automatically from the backend to your private linked bank card.

---

## ⚡ Quickstart in 60 Seconds

### Prerequisites
- Node.js >= 22.13.0 (Recommended: Node.js 24 LTS)
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/fsferdows/universal-payment-gateway.git
cd universal-payment-gateway
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Add your personal receiving phone numbers:
```env
MERCHANT_BKASH_NUMBER="017XXXXXXXX"
MERCHANT_NAGAD_NUMBER="018XXXXXXXX"
MERCHANT_ROCKET_NUMBER="019XXXXXXXXX"
MERCHANT_UPI_VPA="yourname@okhdfcbank"
```

### 3. Launch Gateway
```bash
# Start all microservices & checkout portal:
npm run dev

# Or launch the Universal Gateway on Port 4242:
npm run start:stripe
```

Open [`http://localhost:4242`](http://localhost:4242) in your browser to experience the live checkout!

---

## 🧪 Regression Test Suite (100% Pass Rate)

The repository includes **58 comprehensive regression test suites** covering:
- Bank SMS regex parsers for SBI, HDFC, ICICI, Axis, Kotak, bKash, Nagad, and Rocket
- Payment state machine invariant guards and fail-closed security
- Webhook HMAC-SHA256 signature generation and raw-body verification
- P2P TrxID verification and automatic payout routing

```bash
# Run all 58 test suites:
npm test

# Typecheck:
npm run typecheck
```

---

## 👨‍💻 Author & Creator

**Universal Sovereign Payment Gateway & Banking Observer** was architected and built with ❤️ by:

### **FS FERDOWS**
- **GitHub**: [@fsferdows](https://github.com/fsferdows)
- **YouTube**: [@fsferdowsyt](https://youtube.com/@fsferdowsyt?si=03HdUXfd3jfuD0AZ)
- **Company**: LateBright
- **Location**: Dhaka, Bangladesh
- **Email**: [fsferdows@icloud.com](mailto:fsferdows@icloud.com) / [ferdowsurrahman1@gmail.com](mailto:ferdowsurrahman1@gmail.com)

---

## 📄 License

This project is open-source under the [MIT License](LICENSE). Contributions, stars, and pull requests are warmly welcomed!

<br/>

<p align="center">
  <a href="#-live-product-demos">Live Demos</a> •
  <a href="#-the-problem-vs-the-youpi-solution">Why YOUPI?</a> •
  <a href="#-architecture-at-a-glance">Architecture</a> •
  <a href="#-key-features--superpowers">Superpowers</a> •
  <a href="#-quickstart-in-60-seconds">Quickstart</a> •
  <a href="#-universal-merchant-integration">Merchant Integration</a> •
  <a href="#-tri-channel-observation-mesh">Banking Observers</a> •
  <a href="#-port-topology">Port Topology</a> •
  <a href="#-documentation-hub">Docs</a>
</p>

---

</div>

<br/>

## Live Product Demos

See **YOUPI PG V2** live in action across Desktop and Mobile checkout flows:

|                                                                                                                                              Desktop Modal Flow                                                                                                                                               |                                                                                                                  Mobile Drawer & App Switcher                                                                                                                   |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                        <img src="assets/desktop-demo.gif" width="100%" alt="Desktop Checkout Demo" /><br/><sub>_Full end-to-end checkout: One-script modal, WhatsApp OTP, dynamic vector QR & bank observation._</sub>                                                        |                                    <img src="assets/mobile-demo.gif" width="60%" alt="Mobile Checkout Demo" /><br/><sub>_Ultra-responsive bottom drawer with 1-tap deep-link intent for GPay, PhonePe, Paytm & CRED._</sub>                                     |
| • **Zero-JS One-Script Trigger**: Auto-binds to `[data-youpi-pay]`<br/>• **WhatsApp Pre-Checkout OTP**: Real-time 6-digit phone verification<br/>• **Dynamic Vector SVG QR**: Pure vector QR code with dual timers<br/>• **Experimental observer-based payment detection**: Instant credit via bank SMS/Gmail | • **Responsive Bottom Drawer**: Native app-feel mobile UI<br/>• **Direct UPI App Deep-Linking**: GPay, PhonePe, Paytm, CRED<br/>• **Real-Time Payment Polling**: Instant status reflection<br/>• **Counter Desk Modalities**: Configurable Cash & Card fallback |

<br/>

> **High-Definition 120FPS Raw Recordings**: [assets/Desktop.mp4](assets/Desktop.mp4) • [assets/Mobile.mp4](assets/Mobile.mp4)

<br/>

---

## Overview

Traditional payment gateways (Razorpay, Cashfree, PayU, Stripe) lock your revenue into high fees, multi-day settlement delays, and sudden compliance freezes:

| Comparison Metric               | Traditional Aggregators (Razorpay / Cashfree)      | YOUPI PG (Self-Hosted Sovereign)                                                                                |
| :------------------------------ | :------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| **Transaction Fee**             | **2.0% – 3.0% + 18% GST** per transaction          | **0.0% (Zero Fees Forever)**                                                                                    |
| **Settlement Speed**            | **T+2 to T+3 Business Days** (Holdbacks)           | **Direct transfer; timing and availability depend on the bank and UPI rails**                                   |
| **Account / Service Risk**      | Depends on provider, bank, and circumstances       | **Not eliminated**; banks can still restrict accounts and this project has no guarantee against holds or review |
| **Customer Authentication**     | SMS OTP (Costly SMS gateway bills, phone spoofing) | **WhatsApp OTP** (Zero spoofing, verified mobile)                                                               |
| **Payment Verification**        | Aggregator proprietary webhooks                    | **Bank SMS & Gmail Alerts** parsed in real time                                                                 |
| **Queue & Mismatch Prevention** | Aggregator pooled virtual accounts                 | **Invariant Single-Slot FIFO UPI Queue**                                                                        |
| **Branding Control**            | "Secured by Razorpay" badges mandatory             | **100% White-Label** (Your brand, your domain, zero mentions)                                                   |
| **Offline Retail Till Desk**    | Expensive add-ons / dedicated POS hardware         | **Built-in POS Cash & Card at Till Billing Mode**                                                               |
| **Deployment Simplicity**       | Proprietary SaaS lock-in                           | **Native Node.js host process** (Zero Docker mandatory)                                                         |

<br/>

---

## Architecture at a Glance

YOUPI PG is designed to use standard Indian personal or business UPI receiving accounts for payment collection by coupling **pure vector SVG QR codes** with an **automated multi-channel banking observation mesh**.

```mermaid
flowchart LR
    subgraph Storefront["Merchant Storefront"]
        Buyer[Buyer Browser]
        Cart[Checkout Button]
    end

    subgraph Gateway["YOUPI Gateway Instance"]
        AuthGate[WhatsApp Berry Auth<br/>6-Digit OTP]
        Queue[Single-Slot FIFO Queue<br/>Deterministic Arbiter]
        VectorQR[ISO Vector QR Engine<br/>UPI URI]
        DualTimer[Dual Timers<br/>5:00 Pay • 0:30 Verify]
    end

    subgraph BankingMesh["Sovereign Banking Observers"]
        AndroidNode[Native Android APK<br/>SMS & Push Notifications]
        GmailNode[Gmail Ingestion<br/>OAuth2 & CDP Web]
        SMSNode[Google Messages<br/>Headless CDP]
    end

    subgraph Settlement["Direct Bank Settlement"]
        MerchantBank[(Merchant Bank Account<br/>Direct P2P UPI Transfer)]
    end

    Buyer -->|Clicks Checkout| Cart
    Cart -->|youpi.js Embed| AuthGate
    AuthGate -->|Verified| Queue
    Queue -->|Active Slot| VectorQR
    VectorQR -->|Displays Dynamic QR| Buyer

    Buyer -->|Scans & Pays with any UPI App<br/>GPay / PhonePe / Paytm / CRED| MerchantBank
    MerchantBank -->|Pushes Cellular SMS & Alerts| AndroidNode
    MerchantBank -->|Pushes Credit Alert Email| GmailNode

    AndroidNode -->|HMAC-SHA256 Signed Alert| DualTimer
    GmailNode -->|Normalized Amount & UTR| DualTimer

    DualTimer -->|OBSERVED_SUCCESS - not reconciled| Buyer
    DualTimer -->|Signed observation webhook| Cart
```

<br/>

---

## Key Features

### 1. No Gateway Fee in the Self-Hosted Model (Not a Reliability or Compliance Guarantee)

Every rupee paid goes straight from your customer's bank account to your bank account via standard NPCI UPI rails. This design does not itself provide regulated payment aggregation or guarantee uninterrupted access to a bank account. Confirm your intended use with your bank and qualified advisers.

### 2. WhatsApp Pre-Checkout Authentication (Berry Protocol)

No more fake orders, bot spam, or fraudulent phone numbers. Before a customer can enter the checkout queue, the gateway delivers a cryptographically random 6-digit OTP directly to their WhatsApp app using the embedded Baileys/Berry Protocol socket. Verified customer profiles are remembered in browser `localStorage`.

### 3. Deterministic Single-Slot FIFO Queue Engine

Because standard UPI alerts do not carry arbitrary merchant metadata, multiple concurrent transactions with identical amounts could create attribution confusion. YOUPI PG solves this with a mathematical invariant:

- **Only ONE customer can pay on a VPA at a time.**
- Other buyers wait in a database-backed FIFO queue with live position streaming.
- This queue design is intended to reduce ambiguity when matching incoming payments.

### 4. Native Android Observer APK (`com.youpi.observer`)

A lightweight, battery-optimized Android foreground service that captures:

- Cellular banking SMS (`android.provider.Telephony.SMS_RECEIVED`).
- Real-time bank push notifications via `NotificationListenerService`.
- Enrolls securely via ephemeral QR code and signs all observation payloads with **HMAC-SHA256**.

### 5. Automated Gmail & Google Messages Ingestion

Dual backup observation channels:

- **Gmail Observer (Port 6003):** Polls Google Cloud OAuth2 API or automated headless Chrome CDP inbox monitoring.
- **SMS Observer (Port 6002):** Connects to Google Messages for Web via Chrome DevTools Protocol (CDP).

### 6. Dual Operational Modalities

- **Online Selling Mode:** UPI Vector QR + Cash on Delivery (COD) with customer pre-purchase verification and decoupled address lifecycle.
- **Offline Store Counter Mode:** Designed for physical retail stores. Supports UPI QR, Cash at Till (`CASH_COUNTER`), and Card at POS Terminal (`CARD_COUNTER`) with an interactive real-time cashier till dock and instant SSE customer approval.

### 7. White-Label Configuration

Rebrand the checkout portal completely through environment variables or the Merchant Admin Panel:

- **Global Environment Variables (`.env`)**: Configure gateway-wide defaults via `DEFAULT_APP_NAME`, `DEFAULT_PRIMARY_COLOR`, `DEFAULT_SUPPORT_EMAIL`, `DEFAULT_SUPPORT_PHONE`, `DEFAULT_LOGO_URL`, `DEFAULT_FOOTER_GUARANTEE`, and `WHATSAPP_SENDER_NAME`.
- **Per-Merchant Admin Customizer**: Override app name, logo URL, color theme, and custom instructions live from the admin dashboard without server restarts.
- **Custom domain binding**: Dynamic multi-subdomain routing via Cloudflare Tunnels (`pay.yourbrand.com`).
- **Complete white-labeling**: `DEFAULT_HIDE_POWERED_BY=true` completely eliminates any default platform attribution.

### 8. 5 Standardized Merchant Outcome Pages

The application includes the following customer outcome pages:

- `/order-success` — Payment verified by observers, order marked paid and provisioned.
- `/order-failed` — Verification timed out, reassuring customer no money was lost.
- `/order-suspicious` — Flagged by fraud heuristics, held for manual compliance review.
- `/order-expired` — 5-minute session elapsed, slot released for queued customers.
- `/order-cancelled` — Customer cancelled checkout session.

<br/>

---

## Research Scope, Usage Limits & Safety

This repository is intended for external research, education, code review, prototyping, and controlled experiments. It may be useful for developers exploring payment-flow UX or building a small demo, but it should not be treated as a substitute for a bank/acquirer integration or a professionally reviewed payment service.

### Suggested limits for experiments

- Keep the project to **20 or fewer payment attempts/transactions per day per receiving account** as a conservative project-level testing limit.
- This is **not an official universal NPCI daily cap**. UPI limits depend on transaction category and may also be affected by the bank, UPI application, account type, and risk controls. Check current official rules before use.
- Use low-value transactions only when real-money testing is necessary, and obtain the account holder's permission.
- Do not use this experimental setup to collect payments on behalf of unrelated merchants, pool or route funds, or represent the software as an authorised payment aggregator.
- Do not use it for production checkout until you have completed an independent security review, tested failure and refund paths, established reconciliation and customer-support procedures, and confirmed all applicable legal, contractual, bank, and regulatory requirements.

### Known design risks to evaluate

- **Bank alert parsing can be wrong or delayed.** SMS, notification, and email formats can change, alerts may be duplicated or missing, and messages can be spoofed or misinterpreted.
- **Amount matching is not a complete payment identity check.** Equal amounts, delayed notifications, and replayed events can cause a payment to be attributed to the wrong order.
- **A webhook signature does not prove funds settled.** It only authenticates a message relative to a secret and implementation; merchant systems must still validate event freshness, replay protection, amount, order state, and reconciliation.
- **Secrets and personal data need protection.** Restrict access to bank-connected email, Android observer permissions, logs, databases, backups, and environment files. Do not store more customer data than necessary.
- **Operational safeguards are required.** Add rate limits, access controls, audit logs, backups, monitoring, incident response, refund/dispute handling, and manual reconciliation before considering any real-money deployment.

### Before using with real customers

1. Review the full source code and threat model; do not assume passing tests mean the system is secure.
2. Confirm the receiving account and intended merchant activity are permitted by the bank and applicable UPI terms.
3. Get qualified advice on whether your specific business model triggers payment-system, payment-aggregator, consumer-protection, privacy, tax, or other obligations.
4. Test duplicate notifications, wrong amounts, expired orders, concurrent orders, delayed settlement, refunds, disputes, and service outages.
5. Keep an auditable reconciliation process and a human-reviewed fallback for ambiguous payments.

This section is a practical project warning, not a certification, compliance checklist, or legal opinion.

---

## Quickstart in 60 Seconds

### Prerequisites

- **Node.js `>= 22.13.0` LTS** (Recommended: Node 24 LTS, `node -v`) for native `node:sqlite` (`DatabaseSync`) engine.
  `node:sqlite` was added in Node 22.5.0 but only unflagged in **22.13.0**, so 22.5.0–22.12.x cannot run this project without `--experimental-sqlite`.
- Standard Linux, macOS, or Windows host
- _External database services (PostgreSQL/Redis) are completely optional!_

> **Note:** Containerisation is not included in this repository yet — there is no `Dockerfile` or
> `docker-compose.yml`. Run the services on a native Node.js host as described below.

### Native Host Quickstart

#### 1. Clone & Install Dependencies

Standard `npm install` works out-of-the-box across all packages and apps without any protocol issues:

```bash
git clone https://github.com/youpi-pg/YouPI-PG.git youpi-pg
cd youpi-pg
npm install
```

#### 2. Configure Environment

```bash
cp .env.example .env
```

_(The default `.env` is pre-configured for localhost out of the box)._

### 3. Start the Services

On first launch, YOUPI PG automatically provisions `data/youpi_pg.sqlite`, creates the directory if missing, and executes idempotent migrations and baseline seeds. No manual database setup is required:

```bash
npm run dev
# or
npm start
```

The services can then be accessed at the following local addresses:

- **Control Center Supervisor:** [`http://localhost:8090`](http://localhost:8090)
- **Merchant Admin Panel:** [`http://localhost:6001`](http://localhost:6001)
- **YOUPI Showcase Demo Store:** [`http://localhost:5000`](http://localhost:5000)
- **Payment REST API:** [`http://localhost:6100`](http://localhost:6100)
- **Customer Checkout Portal:** [`http://localhost:7000`](http://localhost:7000)

### 4. Run the Full Regression Test Suite

Run the curated test suites across packages, apps, and chaos harnesses, including observed-payment handling, statement reconciliation, and durable webhook delivery:

```bash
npm test
```

```text
============================================================
 YOUPI PG V2 — FULL REGRESSION TEST RUNNER
Running 31 curated test suites...
============================================================
[1/31] Testing packages/common/src/__tests__/common.test.js...  PASS (0.22s)
...
[31/31] Testing scripts/production-infrastructure.test.js...  PASS (0.17s)
============================================================
 ALL 31 TEST SUITES PASSED CLEANLY (Total: 17.68s)
============================================================
```

<br/>

---

## Universal Merchant Integration

YOUPI PG can be integrated into a website, web application, or e-commerce store using the following steps.

### Step 1: Add the Universal Script to your `<head>`

```html
<!-- Official YOUPI PG Universal Integration Script -->
<script
  src="https://pay.yourdomain.com/youpi.js"
  data-youpi-key="YOUR_MERCHANT_PUBLIC_KEY"
  data-currency="INR"
></script>
```

### Step 2: Declarative Button (Zero JavaScript Required!)

Add `data-youpi-pay` attributes to any existing HTML button:

```html
<button
  data-youpi-pay
  data-order-id="ORDER-1001"
  data-amount="499.00"
  data-currency="INR"
>
  Buy Now with YOUPI PG
</button>
```

_The script automatically intercepts the click, opens a centered desktop modal (or mobile slide-up bottom sheet), and launches the checkout session!_

### Step 3: Programmatic API (For React, Vue, Next.js, Nuxt)

```javascript
window.Youpi.pay({
  order_id: "ORDER-1001",
  amount: 499.0,
  currency: "INR",
  name: "Acme Digital Store",
  description: "Pro Subscription Top-Up",
  handler: function (response) {
    // Browser callbacks update the UI; they do not prove bank settlement.
    console.log(`Checkout status: ${response.status}; UTR: ${response.utr}`);
    window.location.href = `/order-success?order_id=${response.order_id}&utr=${response.utr}`;
  },
  onClose: function () {
    console.log("Customer closed payment modal");
  },
});
```

### Step 4: Signed Server-to-Server Webhook Verification

UPI alerts produce `OBSERVED_SUCCESS` with `settlementState: "NOT_RECONCILED"`.
They do not produce a bank-confirmed `SUCCESS`. Only a matching operator-imported
bank statement produces `RECONCILED` with `settlementState: "RECONCILED"`.
There is no bank API or automatic statement feed. An imported CSV is trusted
operator input, not independently authenticated bank evidence.

`SUCCESS` remains the COD and counter-payment outcome; COD means an order was
placed, not that money was received. A valid HMAC authenticates the gateway
message, not settlement. For UPI fulfillment, require `method: "UPI"`,
`event: "RECONCILED"`, and `settlementState: "RECONCILED"`, then match the order,
currency, expected amount, and reference against your records and process the
delivery idempotently. The snippets below show signature and event filtering;
they leave order validation and persistent deduplication to your application.
See [Merchant Integration](docs/MERCHANT_INTEGRATION.md) for the full lifecycle.

> **CRITICAL SECURITY RULE:** Never fulfill orders based solely on frontend browser events. Always verify the backend HMAC-SHA256 signature! Consumers **MUST** compute the HMAC over the raw, unparsed request bytes before any JSON parsing.

#### Webhook Contract:

- **Header**: `X-Gateway-Signature: sha256=<64_char_hex_hash>` — `HMAC-SHA256(webhookSecret, rawRequestBody)`
- **Additional Headers**:
  - `X-Gateway-Event: OBSERVED_SUCCESS`, `RECONCILED`, or another lifecycle outcome
  - `X-Gateway-Delivery-Id: <uuid>` — stable across retries; use it to deduplicate
  - `X-Gateway-Timestamp: <timestamp_ms>` — the time the delivery was FIRST signed
  - `X-Gateway-Signature-V2: sha256=<64_char_hex_hash>` — `HMAC-SHA256(webhookSecret, "<timestamp_ms>.<rawRequestBody>")`, binds the timestamp into the signature
- **Payload Fields**:
  - `event`: lifecycle outcome, such as `'OBSERVED_SUCCESS'` or `'RECONCILED'`
  - `settlementState`: `'NOT_RECONCILED'` for an alert; `'RECONCILED'` for a matched statement
  - `orderId`: Merchant order ID (string)
  - `amount`: Formatted amount in Rupees, e.g. `'499.00'`
  - `amountPaise`: Integer amount in Paise, e.g. `49900`
  - `utr`: 12-digit bank reference number
  - `paymentId`: Unique gateway payment session UUID
  - `deliveryId`: UUID of this delivery (matches the `X-Gateway-Delivery-Id` header)
  - `timestamp`: Epoch milliseconds the delivery was first signed (matches `X-Gateway-Timestamp`)
  - `verificationTag`, `verificationLevel`: Verification provenance
- **Retries**: a failed delivery is retried with backoff up to 1 hour later. The body is
  resent byte for byte, so `X-Gateway-Timestamp` and `X-Gateway-Delivery-Id` still describe
  the ORIGINAL delivery. Any freshness window you enforce must therefore cover the gateway's
  retry schedule; deduplicate on `deliveryId` rather than on the timestamp.
- **Amount matching**: reusing an `orderId` with a different amount is rejected with
  `409 ORDER_AMOUNT_MISMATCH`.

#### Polyglot Webhook Verification Snippets:

##### 1. Node.js (Express)

```javascript
import crypto from "node:crypto";

app.post(
  "/api/youpi-webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const signature = req.headers["x-gateway-signature"] || "";
    const secret = process.env.YOUPI_WEBHOOK_SECRET;
    const expected =
      "sha256=" +
      crypto.createHmac("sha256", secret).update(req.body).digest("hex");

    if (
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    const payload = JSON.parse(req.body.toString("utf8"));
    if (payload.event === "RECONCILED" && payload.method === "UPI" && payload.settlementState === "RECONCILED") {
      // Validate order, currency, expected amount and UTR; deduplicate before fulfillment.
    }
    res.status(200).json({ received: true });
  },
);
```

##### 2. Python (FastAPI)

```python
import hmac, hashlib, json
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()

@app.post("/api/youpi-webhook")
async def youpi_webhook(request: Request):
    raw_body = await request.body()
    signature = request.headers.get("X-Gateway-Signature", "")
    secret = request.app.state.webhook_secret.encode("utf-8")

    expected = "sha256=" + hmac.new(secret, raw_body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    payload = json.loads(raw_body.decode("utf-8"))
    if (payload.get("event") == "RECONCILED" and payload.get("method") == "UPI"
            and payload.get("settlementState") == "RECONCILED"):
        # Validate order, currency, expected amount and UTR; deduplicate before fulfillment.
        pass
    return {"received": True}
```

##### 3. PHP

```php
<?php
$rawPayload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_GATEWAY_SIGNATURE'] ?? '';
$secret = getenv('YOUPI_WEBHOOK_SECRET');

$expected = 'sha256=' . hash_hmac('sha256', $rawPayload, $secret);

if (!hash_equals($expected, $signature)) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid webhook signature']));
}

$payload = json_decode($rawPayload, true);
if (($payload['event'] ?? '') === 'RECONCILED' && ($payload['method'] ?? '') === 'UPI'
    && ($payload['settlementState'] ?? '') === 'RECONCILED') {
    // Validate order, currency, expected amount and UTR; deduplicate before fulfillment.
}

http_response_code(200);
echo json_encode(['received' => true]);
?>
```

##### 4. Go (`net/http`)

```go
package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"os"
)

func youpiWebhookHandler(w http.ResponseWriter, r *http.Request) {
	rawBody, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Cannot read body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	signature := r.Header.Get("X-Gateway-Signature")
	secret := []byte(os.Getenv("YOUPI_WEBHOOK_SECRET"))

	mac := hmac.New(sha256.New, secret)
	mac.Write(rawBody)
	expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))

	if !hmac.Equal([]byte(signature), []byte(expected)) {
		http.Error(w, "Invalid webhook signature", http.StatusUnauthorized)
		return
	}

	var payload struct {
		Event       string `json:"event"`
		Method      string `json:"method"`
		SettlementState string `json:"settlementState"`
		OrderId     string `json:"orderId"`
		UTR         string `json:"utr"`
		Amount      string `json:"amount"`
		AmountPaise int64  `json:"amountPaise"`
	}
	if err := json.Unmarshal(rawBody, &payload); err == nil && payload.Event == "RECONCILED" && payload.Method == "UPI" && payload.SettlementState == "RECONCILED" {
		// Validate order, currency, expected amount and UTR; deduplicate before fulfillment.
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"received":true}`))
}
```

<br/>

---

## Tri-Channel Observation Mesh

YOUPI PG confirms payments without expensive commercial banking APIs using a triple-layer observation pipeline:

```text
              CUSTOMER SCANS & PAYS VIA UPI
                           │
                           ▼
                 RECEIVING BANK ACCOUNT
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  CELLULAR SMS │  │   BANK PUSH   │  │  GMAIL CREDIT │
│  ALERT ON SIM │  │ NOTIFICATION  │  │  ALERT EMAIL  │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                  │
        ▼                  ▼                  │
┌──────────────────────────────────┐          │
│    NATIVE ANDROID OBSERVER APK   │          │
│  com.youpi.observer (Foreground) │          │
│     HMAC-SHA256 Signed Payload   │          │
└─────────────────┬────────────────┘          │
                  │                           ▼
                  │                 ┌───────────────────┐
                  │                 │   GMAIL OBSERVER  │
                  │                 │ Google Cloud API  │
                  │                 └─────────┬─────────┘
                  │                           │
                  └─────────────┬─────────────┘
                                ▼
                   PAYMENT CORE REST ENGINE
               Exact Amount & UTR Normalization
                                │
                                ▼
                       SUCCESS CONFIRMED
```

1. **Android Observer App:** Install [`apps/android-observer-app/youpi-sms-gateway.apk`](apps/android-observer-app/youpi-sms-gateway.apk) (Certified SHA-256: `959218223e75da4784744c16afaf7bc121cff377dff04f041875237042f51601`) on any secondary Android smartphone with the receiving bank SIM. Scan the pairing QR code in Merchant Admin to establish an encrypted HMAC link.
2. **Gmail Observer:** Connect your bank-registered Google account using standard OAuth2 credentials.
   <details>
   <summary><b>🔍 View Verified Indian Bank Domains & RBI <code>.bank.in</code> Registry</b></summary>

   > Supports both modern RBI-mandated sovereign `.bank.in` / `.fin.in` spaces (`sbi.bank.in`, `hdfcbank.bank.in`, `icici.bank.in`, `axis.bank.in`, `kotak.bank.in`, `pnb.bank.in`, `bankofbaroda.bank.in`, etc.) and verified legacy notification channels with full subdomain routing (`alerts.hdfcbank.net`, `custalert.icicibank.com`, `alerts.sbi.co.in`, `kotak.com`, `canarabank.com`, etc.). See [docs/OBSERVERS_SETUP.md](docs/OBSERVERS_SETUP.md) for full DNS / MX verified topology.

   </details>

3. **Google Messages Web Observer:** Pairs via headless Chrome DevTools Protocol to observe cellular SMS through Google Messages Web.

<br/>

---

## Port Topology & Microservices Map

| Service             |  Port  | Directory                                                | Entrypoint     | Responsibility                                                      |
| :------------------ | :----: | :------------------------------------------------------- | :------------- | :------------------------------------------------------------------ |
| **Payment API**     | `6100` | [`apps/payment-api`](apps/payment-api)                   | `src/index.js` | Core REST API, state machine, DB transactions & SSE stream          |
| **Checkout Portal** | `7000` | [`apps/checkout-portal`](apps/checkout-portal)           | `src/index.js` | Customer iframe checkout, dynamic vector QR, SDK bundle             |
| **Merchant Admin**  | `6001` | [`apps/merchant-admin`](apps/merchant-admin)             | `src/index.js` | Operations panel, till billing desk, branding customizer            |
| **Showcase Store**  | `5000` | [`apps/coin-wallet-store`](apps/coin-wallet-store)       | `src/index.js` | Reference enterprise merchant PDP, 5 outcome demonstrations         |
| **Control Center**  | `8090` | [`apps/control-center`](apps/control-center)             | `src/index.js` | Process supervisor for starting, stopping, and logging all services |
| **SMS Observer**    | `6002` | [`apps/sms-observer`](apps/sms-observer)                 | `src/index.js` | Google Messages Web automation via Chrome CDP                       |
| **Gmail Observer**  | `6003` | [`apps/gmail-observer`](apps/gmail-observer)             | `src/index.js` | Gmail Web CDP automation & Google OAuth2 poller                     |
| **Android APK**     |  N/A   | [`apps/android-observer-app`](apps/android-observer-app) | Android OS     | Intercepts cellular banking SMS and notifications                   |

<br/>

---

## Security & Reliability Architecture

- **64-Bit Integer Minor Units (Paise):** Financial values are strictly represented as integers (`49900` paise = ₹499.00). Floating-point rounding drift is mathematically impossible.
- **Server-Authoritative Timers:** Timers are calculated strictly from SQLite state timestamps. Client-side browser tampering cannot manipulate countdowns.
- **Anti-Replay Observation Protection:** Android observer payloads require HMAC signatures with timestamp drift verification ($< 60$ seconds).
- **Hardware & Browser Fingerprinting:** The implementation may collect device/browser signals. Treat these as fallible risk signals, not reliable identity proof; review privacy, retention, and appeal requirements before use.
- **Write-Ahead Logging (WAL):** SQLite operates with `PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;`, ensuring crash safety and concurrent read performance.

<br/>

---

## Documentation Hub

Deep-dive engineering manuals and operational runbooks are available in the [`/docs`](docs) directory:

| Document                                                                   | Description                                                |
| :------------------------------------------------------------------------- | :--------------------------------------------------------- |
| [`ARCHITECTURE.md`](ARCHITECTURE.md)                                       | **Canonical System Architecture & Engineering Blueprint**  |
| [`docs/INSTALLATION.md`](docs/INSTALLATION.md)                             | Host installation, prerequisites & environment setup       |
| [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md)                           | Environment configuration variables & secret management    |
| [`docs/ANDROID_MOBILE_APP.md`](docs/ANDROID_MOBILE_APP.md)                 | Native Android Kotlin Observer APK guide & permissions     |
| [`docs/OBSERVERS_SETUP.md`](docs/OBSERVERS_SETUP.md)                       | Complete setup for Gmail, Google Messages & Android        |
| [`docs/MERCHANT_INTEGRATION.md`](docs/MERCHANT_INTEGRATION.md)             | Full developer integration guide, SDK methods & webhooks   |
| [`docs/WHITE_LABEL.md`](docs/WHITE_LABEL.md)                               | White-label branding customizer, domains & Cloudflare      |
| [`docs/OPERATIONS_TROUBLESHOOTING.md`](docs/OPERATIONS_TROUBLESHOOTING.md) | Production operations, logs, diagnostics & troubleshooting |
| [`PAYMENT_INTEGRATION_GUIDE.md`](PAYMENT_INTEGRATION_GUIDE.md)             | Fins & Wings manual UPI checkout, webhook, and admin verification flow |
| [`SECURITY_REMEDIATION_REPORT.md`](SECURITY_REMEDIATION_REPORT.md)         | Manual UPI security posture, findings, and remaining blockers |
| [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)                       | Production readiness checks; deployment is not included in this work |
| [`openapi.yaml`](openapi.yaml)                                             | Official OpenAPI 3.0 REST API specification                |

<br/>

---

## License

See [`LICENSE`](LICENSE) for the actual license terms. A license to use the code does not imply regulatory approval, bank approval, security certification, or permission to operate a regulated payment service.

<br/>

<div align="center">

### YOUPI PG

**Self-hosted payment infrastructure with direct UPI settlement.**

⭐ **Contributions and feedback are welcome.**

</div>
