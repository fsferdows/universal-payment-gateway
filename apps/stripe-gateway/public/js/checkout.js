document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const currencySelect = document.getElementById('currency-select');
  const amountInput = document.getElementById('amount-input');
  const currencySymbol = document.getElementById('currency-symbol');
  const currencyCounter = document.getElementById('currency-counter');
  const payButtonAmount = document.getElementById('pay-button-amount');
  const summaryCurrency = document.getElementById('summary-currency');
  const summaryCountryNumber = document.getElementById('summary-country-number');
  const summaryVerification = document.getElementById('summary-verification');
  const summaryMethodBadge = document.getElementById('summary-method-badge');
  const summaryTotal = document.getElementById('summary-total');
  const summaryBdtTotal = document.getElementById('summary-bdt-total');
  const summaryOrderId = document.getElementById('summary-order-id');
  const modeBadge = document.getElementById('mode-badge');
  const configPkStatus = document.getElementById('config-pk-status');
  const paymentForm = document.getElementById('payment-form');
  const submitBtn = document.getElementById('submit-btn');
  const buttonSpinner = document.getElementById('button-spinner');
  const buttonText = document.getElementById('button-text');
  const paymentMessage = document.getElementById('payment-message');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Phone Verification Elements
  const countryDialSelect = document.getElementById('country-dial-select');
  const customerPhone = document.getElementById('customer-phone');
  const sendOtpBtn = document.getElementById('send-otp-btn');
  const sendOtpText = document.getElementById('send-otp-text');
  const sendOtpSpinner = document.getElementById('send-otp-spinner');
  const phoneVerificationStatusBadge = document.getElementById('phone-verification-status-badge');
  const otpDrawer = document.getElementById('otp-drawer');
  const otpInput = document.getElementById('otp-input');
  const verifyOtpBtn = document.getElementById('verify-otp-btn');
  const autofillOtpBtn = document.getElementById('autofill-otp-btn');
  const otpMessage = document.getElementById('otp-message');

  // PayPal Elements
  const paypalSummaryAmount = document.getElementById('paypal-summary-amount');
  const paypalPayBtn = document.getElementById('paypal-pay-btn');
  const paypalSpinner = document.getElementById('paypal-spinner');
  const paypalStatusMsg = document.getElementById('paypal-status-msg');

  // bKash Elements
  const bkashOrigAmt = document.getElementById('bkash-orig-amt');
  const bkashBdtAmt = document.getElementById('bkash-bdt-amt');
  const bkashRateNote = document.getElementById('bkash-rate-note');
  const bkashWalletInput = document.getElementById('bkash-wallet-input');
  const bkashInitBtn = document.getElementById('bkash-init-btn');
  const bkashInitSpinner = document.getElementById('bkash-init-spinner');
  const bkashOtpDrawer = document.getElementById('bkash-otp-drawer');
  const bkashOtpInput = document.getElementById('bkash-otp-input');
  const bkashPinInput = document.getElementById('bkash-pin-input');
  const bkashConfirmBtn = document.getElementById('bkash-confirm-btn');
  const bkashConfirmSpinner = document.getElementById('bkash-confirm-spinner');
  const bkashAutofillBtn = document.getElementById('bkash-autofill-btn');
  const bkashErrorMsg = document.getElementById('bkash-error-msg');
  let currentBkashPaymentId = null;

  // Nagad Elements
  const nagadOrigAmt = document.getElementById('nagad-orig-amt');
  const nagadBdtAmt = document.getElementById('nagad-bdt-amt');
  const nagadRateNote = document.getElementById('nagad-rate-note');
  const nagadWalletInput = document.getElementById('nagad-wallet-input');
  const nagadInitBtn = document.getElementById('nagad-init-btn');
  const nagadInitSpinner = document.getElementById('nagad-init-spinner');
  const nagadOtpDrawer = document.getElementById('nagad-otp-drawer');
  const nagadOtpInput = document.getElementById('nagad-otp-input');
  const nagadPinInput = document.getElementById('nagad-pin-input');
  const nagadConfirmBtn = document.getElementById('nagad-confirm-btn');
  const nagadConfirmSpinner = document.getElementById('nagad-confirm-spinner');
  const nagadAutofillBtn = document.getElementById('nagad-autofill-btn');
  const nagadErrorMsg = document.getElementById('nagad-error-msg');
  let currentNagadRefId = null;

  // Rocket Elements
  const rocketOrigAmt = document.getElementById('rocket-orig-amt');
  const rocketBdtAmt = document.getElementById('rocket-bdt-amt');
  const rocketRateNote = document.getElementById('rocket-rate-note');
  const rocketWalletInput = document.getElementById('rocket-wallet-input');
  const rocketInitBtn = document.getElementById('rocket-init-btn');
  const rocketInitSpinner = document.getElementById('rocket-init-spinner');
  const rocketOtpDrawer = document.getElementById('rocket-otp-drawer');
  const rocketOtpInput = document.getElementById('rocket-otp-input');
  const rocketPinInput = document.getElementById('rocket-pin-input');
  const rocketConfirmBtn = document.getElementById('rocket-confirm-btn');
  const rocketConfirmSpinner = document.getElementById('rocket-confirm-spinner');
  const rocketAutofillBtn = document.getElementById('rocket-autofill-btn');
  const rocketErrorMsg = document.getElementById('rocket-error-msg');
  let currentRocketRefId = null;

  // UPI Element
  const upiSummaryAmount = document.getElementById('upi-summary-amount');

  const symbols = {};
  const countryMap = new Map();
  let fxRates = { usd: 122.50, bdt: 1.00, eur: 132.00, gbp: 155.00, inr: 1.46 };
  let isPhoneVerified = false;
  let lastSampleCode = null;

  const currentOrderId = `INTL-${Date.now().toString().slice(-6)}`;
  summaryOrderId.textContent = currentOrderId;

  // 1. Fetch Gateway Configuration & Catalogs
  let config = { isMockMode: true, publishableKey: '', defaultCurrency: 'usd', supportedCurrencies: [], countries: [], fxRates: {} };
  try {
    const res = await fetch('/api/config');
    config = await res.json();
    if (config.fxRates) fxRates = { ...fxRates, ...config.fxRates };
  } catch (err) {
    console.error('Failed to load gateway config:', err);
  }

  // Populate dynamic currency symbols & options
  if (Array.isArray(config.supportedCurrencies) && config.supportedCurrencies.length > 0) {
    currencySelect.innerHTML = '';
    config.supportedCurrencies.forEach(curr => {
      symbols[curr.code.toLowerCase()] = curr.symbol;
      const opt = document.createElement('option');
      opt.value = curr.code.toLowerCase();
      opt.textContent = `${curr.flag || '🌐'} ${curr.code.toUpperCase()} (${curr.symbol}) — ${curr.name}`;
      if (curr.code.toLowerCase() === (config.defaultCurrency || 'usd')) {
        opt.selected = true;
      }
      currencySelect.appendChild(opt);
    });

    if (currencyCounter) {
      currencyCounter.textContent = `${config.supportedCurrencies.length} Currencies Available`;
    }
  }

  // Populate dynamic country calling codes ("country numbers")
  if (Array.isArray(config.countries) && config.countries.length > 0) {
    countryDialSelect.innerHTML = '';
    config.countries.forEach(country => {
      countryMap.set(country.code, country);
      const opt = document.createElement('option');
      opt.value = country.dialCode;
      opt.dataset.country = country.code;
      opt.dataset.flag = country.flag || '🌐';
      opt.dataset.name = country.name;
      opt.dataset.currency = country.currency || 'usd';
      opt.textContent = `${country.flag || '🌐'} ${country.name} (${country.dialCode})`;
      if (country.code === 'US') {
        opt.selected = true;
      }
      countryDialSelect.appendChild(opt);
    });
  }

  // Update mode badge & config status
  if (modeBadge) {
    if (config.isMockMode) {
      modeBadge.textContent = '🟡 SANDBOX SIMULATOR';
      modeBadge.className = 'mode-badge sandbox';
    } else {
      modeBadge.textContent = '🟢 LIVE MULTI-METHOD';
      modeBadge.className = 'mode-badge live';
    }
  }

  const configCardStatus = document.getElementById('config-card-status');
  if (configCardStatus) {
    configCardStatus.textContent = config.isMockMode ? 'Stripe Simulator (Active)' : 'Stripe Live';
  }
  if (configPkStatus) {
    configPkStatus.textContent = config.isMockMode ? 'Simulated Sandbox' : (config.publishableKey ? `${config.publishableKey.slice(0, 8)}...` : 'Configured');
  }

  // Update Country Dial Code badge
  function updateCountryBadge() {
    const selectedOpt = countryDialSelect.options[countryDialSelect.selectedIndex];
    if (selectedOpt) {
      const flag = selectedOpt.dataset.flag || '';
      const dial = selectedOpt.value;
      const code = selectedOpt.dataset.country || '';
      summaryCountryNumber.textContent = `${flag} ${dial} (${code})`;
    }
  }

  // Currency & Multi-Method Amount updates
  function updateAmounts() {
    const currency = (currencySelect.value || 'usd').toLowerCase();
    const symbol = symbols[currency] || '$';
    const val = parseFloat(amountInput.value) || 0;
    const formatted = `${symbol}${val.toFixed(2)}`;

    currencySymbol.textContent = symbol;
    payButtonAmount.textContent = `${formatted} ${currency.toUpperCase()}`;
    summaryCurrency.textContent = currency.toUpperCase();
    summaryTotal.textContent = formatted;

    // PayPal Amount
    if (paypalSummaryAmount) {
      paypalSummaryAmount.textContent = `${formatted} ${currency.toUpperCase()}`;
    }

    // BDT Conversion for MFS (bKash, Nagad, Rocket)
    const rateToBDT = fxRates[currency] || 122.50;
    const bdtAmount = Math.round(val * rateToBDT);
    const formattedBdt = `৳ ${bdtAmount.toLocaleString('en-US')} BDT`;
    const rateText = `Rate: 1 ${currency.toUpperCase()} ≈ ${rateToBDT.toFixed(2)} BDT`;

    if (summaryBdtTotal) summaryBdtTotal.textContent = `৳ ${bdtAmount.toLocaleString('en-US')}`;

    // bKash Box
    if (bkashOrigAmt) bkashOrigAmt.textContent = `${formatted} ${currency.toUpperCase()}`;
    if (bkashBdtAmt) bkashBdtAmt.textContent = formattedBdt;
    if (bkashRateNote) bkashRateNote.textContent = rateText;

    // Nagad Box
    if (nagadOrigAmt) nagadOrigAmt.textContent = `${formatted} ${currency.toUpperCase()}`;
    if (nagadBdtAmt) nagadBdtAmt.textContent = formattedBdt;
    if (nagadRateNote) nagadRateNote.textContent = rateText;

    // Rocket Box
    if (rocketOrigAmt) rocketOrigAmt.textContent = `${formatted} ${currency.toUpperCase()}`;
    if (rocketBdtAmt) rocketBdtAmt.textContent = formattedBdt;
    if (rocketRateNote) rocketRateNote.textContent = rateText;

    // UPI Box (INR)
    const rateToINR = (fxRates[currency] || 122.50) / (fxRates['inr'] || 1.46);
    const inrAmount = (val * (currency === 'inr' ? 1 : (currency === 'usd' ? 86.50 : rateToINR))).toFixed(2);
    if (upiSummaryAmount) upiSummaryAmount.textContent = `₹ ${inrAmount} INR`;
  }

  // When currency is changed, optionally select the corresponding primary country calling code
  currencySelect.addEventListener('change', () => {
    const curr = currencySelect.value.toLowerCase();
    const matchingCountry = config.countries.find(c => (c.currency || '').toLowerCase() === curr);
    if (matchingCountry) {
      for (let i = 0; i < countryDialSelect.options.length; i++) {
        if (countryDialSelect.options[i].dataset.country === matchingCountry.code) {
          countryDialSelect.selectedIndex = i;
          break;
        }
      }
    }
    updateCountryBadge();
    updateAmounts();
  });

  countryDialSelect.addEventListener('change', updateCountryBadge);
  amountInput.addEventListener('input', updateAmounts);

  // Preset button clicks
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      amountInput.value = parseFloat(btn.dataset.val).toFixed(2);
      updateAmounts();
    });
  });

  // Method Tab switching
  const methodNames = {
    elements: '💳 Card',
    paypal: '🅿️ PayPal',
    bkash: '📱 bKash',
    nagad: '📲 Nagad',
    rocket: '🚀 Rocket',
    upi: '⚡ UPI (India)',
    payouts: '🏦 Bank Privacy'
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(`tab-${btn.dataset.tab}`);
      if (target) target.classList.add('active');
      if (summaryMethodBadge && methodNames[btn.dataset.tab]) {
        summaryMethodBadge.textContent = methodNames[btn.dataset.tab];
      }
    });
  });

  // ============================================
  // 2. Phone Verification via SMS / 3DS Protocol
  // ============================================
  sendOtpBtn.addEventListener('click', async () => {
    const dialCode = countryDialSelect.value;
    const nationalNumber = customerPhone.value.trim();
    const selectedOpt = countryDialSelect.options[countryDialSelect.selectedIndex];
    const countryCode = selectedOpt?.dataset.country || 'US';

    if (!nationalNumber) {
      alert('Please enter your mobile phone number for verification.');
      customerPhone.focus();
      return;
    }

    sendOtpBtn.disabled = true;
    sendOtpText.textContent = 'Sending...';
    sendOtpSpinner.classList.remove('hidden');
    otpMessage.textContent = '';
    otpMessage.className = 'otp-message';

    try {
      const res = await fetch('/api/verify/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dialCode, nationalNumber, countryCode })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      otpDrawer.classList.remove('hidden');
      otpMessage.textContent = data.message || `Code sent to ${data.e164}!`;
      otpMessage.className = 'otp-message success';

      if (data.sampleCode) {
        lastSampleCode = data.sampleCode;
        autofillOtpBtn.classList.remove('hidden');
        autofillOtpBtn.textContent = `✨ Auto-Fill Code (${data.sampleCode})`;
      }

      sendOtpText.textContent = 'Resend';
    } catch (err) {
      otpDrawer.classList.remove('hidden');
      otpMessage.textContent = err.message || 'Error sending code';
      otpMessage.className = 'otp-message error';
      sendOtpText.textContent = 'Send Code';
    } finally {
      sendOtpBtn.disabled = false;
      sendOtpSpinner.classList.add('hidden');
    }
  });

  autofillOtpBtn.addEventListener('click', () => {
    if (lastSampleCode) {
      otpInput.value = lastSampleCode;
      verifyOtpBtn.click();
    }
  });

  verifyOtpBtn.addEventListener('click', async () => {
    const dialCode = countryDialSelect.value;
    const nationalNumber = customerPhone.value.trim();
    const code = otpInput.value.trim();

    if (!code) {
      otpMessage.textContent = 'Please enter the 6-digit verification code';
      otpMessage.className = 'otp-message error';
      return;
    }

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.textContent = 'Verifying...';

    try {
      const res = await fetch('/api/verify/check-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dialCode, nationalNumber, code })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      isPhoneVerified = true;
      phoneVerificationStatusBadge.className = 'verify-badge verified';
      phoneVerificationStatusBadge.innerHTML = '<span class="badge-dot"></span> Verified ✓';
      summaryVerification.className = 'badge badge-success';
      summaryVerification.textContent = 'Verified ✓';

      otpMessage.textContent = '✅ Phone verified successfully!';
      otpMessage.className = 'otp-message success';

      setTimeout(() => {
        otpDrawer.classList.add('hidden');
      }, 2000);
    } catch (err) {
      otpMessage.textContent = err.message || 'Invalid verification code';
      otpMessage.className = 'otp-message error';
    } finally {
      verifyOtpBtn.disabled = false;
      verifyOtpBtn.textContent = 'Verify Code';
    }
  });

  // ============================================
  // 3. PAYPAL PAYMENT INTEGRATION
  // ============================================
  paypalPayBtn?.addEventListener('click', async () => {
    paypalPayBtn.disabled = true;
    paypalSpinner?.classList.remove('hidden');
    paypalStatusMsg?.classList.add('hidden');

    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value.toUpperCase();

    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          orderId: currentOrderId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize PayPal');

      if (data.isMockMode) {
        // Capture simulated order
        await new Promise(r => setTimeout(r, 1000));
        await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paypalOrderId: data.id,
            payerEmail: 'buyer@paypal.sandbox'
          })
        });
        window.location.href = `/success.html?method=paypal&order_id=${encodeURIComponent(currentOrderId)}&amount=${amount}&currency=${currency}&paypal_order_id=${data.id}&mock=true`;
      } else if (data.approveUrl) {
        window.location.href = data.approveUrl;
      }
    } catch (err) {
      paypalStatusMsg.textContent = err.message;
      paypalStatusMsg.className = 'method-status-msg error';
      paypalStatusMsg.classList.remove('hidden');
      paypalPayBtn.disabled = false;
      paypalSpinner?.classList.add('hidden');
    }
  });

  // ============================================
  // 4. bKash PAYMENT INTEGRATION
  // ============================================
  bkashInitBtn?.addEventListener('click', async () => {
    const customerWallet = bkashWalletInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value;

    if (!customerWallet || customerWallet.length !== 11) {
      alert('Please enter a valid 11-digit bKash account number (e.g. 01711000111).');
      bkashWalletInput.focus();
      return;
    }

    bkashInitBtn.disabled = true;
    bkashInitSpinner?.classList.remove('hidden');
    bkashErrorMsg.textContent = '';

    try {
      const res = await fetch('/api/bkash/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          orderId: currentOrderId,
          customerWallet
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initiate bKash payment');

      currentBkashPaymentId = data.paymentID;
      bkashOtpDrawer.classList.remove('hidden');
      bkashErrorMsg.textContent = `OTP sent to ${customerWallet}. (Test OTP: 123456, PIN: 12345)`;
      bkashErrorMsg.className = 'otp-message success';
    } catch (err) {
      bkashErrorMsg.textContent = err.message;
      bkashErrorMsg.className = 'otp-message error';
    } finally {
      bkashInitBtn.disabled = false;
      bkashInitSpinner?.classList.add('hidden');
    }
  });

  bkashAutofillBtn?.addEventListener('click', () => {
    bkashOtpInput.value = '123456';
    bkashPinInput.value = '12345';
  });

  bkashConfirmBtn?.addEventListener('click', async () => {
    const otp = bkashOtpInput.value.trim();
    const pin = bkashPinInput.value.trim();
    const customerWallet = bkashWalletInput.value.trim();

    if (!otp || !pin) {
      bkashErrorMsg.textContent = 'Please enter both bKash OTP and PIN.';
      bkashErrorMsg.className = 'otp-message error';
      return;
    }

    bkashConfirmBtn.disabled = true;
    bkashConfirmSpinner?.classList.remove('hidden');

    try {
      const res = await fetch('/api/bkash/execute-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentID: currentBkashPaymentId,
          customerWallet,
          otp,
          pin
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'bKash verification failed');

      window.location.href = `/success.html?method=bkash&order_id=${encodeURIComponent(currentOrderId)}&amount=${data.amountBDT || 3062}&currency=BDT&trx_id=${data.trxID}&wallet=${encodeURIComponent(customerWallet)}&mock=true`;
    } catch (err) {
      bkashErrorMsg.textContent = err.message;
      bkashErrorMsg.className = 'otp-message error';
      bkashConfirmBtn.disabled = false;
      bkashConfirmSpinner?.classList.add('hidden');
    }
  });

  // ============================================
  // 5. NAGAD PAYMENT INTEGRATION
  // ============================================
  nagadInitBtn?.addEventListener('click', async () => {
    const customerWallet = nagadWalletInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value;

    if (!customerWallet || customerWallet.length !== 11) {
      alert('Please enter a valid 11-digit Nagad account number (e.g. 01811000222).');
      nagadWalletInput.focus();
      return;
    }

    nagadInitBtn.disabled = true;
    nagadInitSpinner?.classList.remove('hidden');
    nagadErrorMsg.textContent = '';

    try {
      const res = await fetch('/api/nagad/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          orderId: currentOrderId,
          customerWallet
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize Nagad');

      currentNagadRefId = data.paymentRefId;
      nagadOtpDrawer.classList.remove('hidden');
      nagadErrorMsg.textContent = `Nagad challenge initiated for ${customerWallet}. (Test OTP: 123456, PIN: 1234)`;
      nagadErrorMsg.className = 'otp-message success';
    } catch (err) {
      nagadErrorMsg.textContent = err.message;
      nagadErrorMsg.className = 'otp-message error';
    } finally {
      nagadInitBtn.disabled = false;
      nagadInitSpinner?.classList.add('hidden');
    }
  });

  nagadAutofillBtn?.addEventListener('click', () => {
    nagadOtpInput.value = '123456';
    nagadPinInput.value = '1234';
  });

  nagadConfirmBtn?.addEventListener('click', async () => {
    const otp = nagadOtpInput.value.trim();
    const pin = nagadPinInput.value.trim();
    const customerWallet = nagadWalletInput.value.trim();

    if (!otp || !pin) {
      nagadErrorMsg.textContent = 'Please enter both Nagad OTP and PIN.';
      nagadErrorMsg.className = 'otp-message error';
      return;
    }

    nagadConfirmBtn.disabled = true;
    nagadConfirmSpinner?.classList.remove('hidden');

    try {
      const res = await fetch('/api/nagad/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentRefId: currentNagadRefId,
          customerWallet,
          otp,
          pin
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Nagad verification failed');

      window.location.href = `/success.html?method=nagad&order_id=${encodeURIComponent(currentOrderId)}&amount=${data.amountBDT || 3062}&currency=BDT&trx_id=${data.trxID}&wallet=${encodeURIComponent(customerWallet)}&mock=true`;
    } catch (err) {
      nagadErrorMsg.textContent = err.message;
      nagadErrorMsg.className = 'otp-message error';
      nagadConfirmBtn.disabled = false;
      nagadConfirmSpinner?.classList.add('hidden');
    }
  });

  // ============================================
  // 6. ROCKET PAYMENT INTEGRATION
  // ============================================
  rocketInitBtn?.addEventListener('click', async () => {
    const customerWallet = rocketWalletInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value;

    if (!customerWallet || customerWallet.length !== 12) {
      alert('Please enter a valid 12-digit Rocket account number (11 digits mobile + 1 check digit e.g. 019110003331).');
      rocketWalletInput.focus();
      return;
    }

    rocketInitBtn.disabled = true;
    rocketInitSpinner?.classList.remove('hidden');
    rocketErrorMsg.textContent = '';

    try {
      const res = await fetch('/api/rocket/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          orderId: currentOrderId,
          customerWallet
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initiate Rocket payment');

      currentRocketRefId = data.rocketRefId;
      rocketOtpDrawer.classList.remove('hidden');
      rocketErrorMsg.textContent = `Rocket verification initiated for ${customerWallet}. (Test OTP: 123456, PIN: 1234)`;
      rocketErrorMsg.className = 'otp-message success';
    } catch (err) {
      rocketErrorMsg.textContent = err.message;
      rocketErrorMsg.className = 'otp-message error';
    } finally {
      rocketInitBtn.disabled = false;
      rocketInitSpinner?.classList.add('hidden');
    }
  });

  rocketAutofillBtn?.addEventListener('click', () => {
    rocketOtpInput.value = '123456';
    rocketPinInput.value = '1234';
  });

  rocketConfirmBtn?.addEventListener('click', async () => {
    const otp = rocketOtpInput.value.trim();
    const pin = rocketPinInput.value.trim();
    const customerWallet = rocketWalletInput.value.trim();

    if (!otp || !pin) {
      rocketErrorMsg.textContent = 'Please enter both Rocket OTP and PIN.';
      rocketErrorMsg.className = 'otp-message error';
      return;
    }

    rocketConfirmBtn.disabled = true;
    rocketConfirmSpinner?.classList.remove('hidden');

    try {
      const res = await fetch('/api/rocket/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rocketRefId: currentRocketRefId,
          customerWallet,
          otp,
          pin
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rocket verification failed');

      window.location.href = `/success.html?method=rocket&order_id=${encodeURIComponent(currentOrderId)}&amount=${data.amountBDT || 3062}&currency=BDT&trx_id=${data.trxID}&wallet=${encodeURIComponent(customerWallet)}&mock=true`;
    } catch (err) {
      rocketErrorMsg.textContent = err.message;
      rocketErrorMsg.className = 'otp-message error';
      rocketConfirmBtn.disabled = false;
      rocketConfirmSpinner?.classList.add('hidden');
    }
  });

  // ============================================
  // 7. CARD PAYMENTS (Stripe Elements / Simulator)
  // ============================================
  let stripe = null;
  let cardElement = null;
  const paymentElementContainer = document.getElementById('payment-element');

  if (!config.isMockMode && window.Stripe && config.publishableKey) {
    try {
      stripe = window.Stripe(config.publishableKey);
      const elements = stripe.elements();
      cardElement = elements.create('card', {
        style: {
          base: {
            color: '#f8fafc',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '15px',
            '::placeholder': { color: '#64748b' }
          },
          invalid: {
            color: '#ef4444',
            iconColor: '#ef4444'
          }
        }
      });
      cardElement.mount('#payment-element');
    } catch (err) {
      console.warn('Stripe Elements initialization error, falling back to simulator:', err);
      renderSimulatedCardForm();
    }
  } else {
    renderSimulatedCardForm();
  }

  function attachCardFillListener() {
    const fillBtn = document.getElementById('fill-test-btn');
    if (fillBtn) {
      fillBtn.onclick = () => {
        const cardNum = document.getElementById('sim-card-num');
        const cardExp = document.getElementById('sim-exp');
        const cardCvc = document.getElementById('sim-cvc');
        if (cardNum) cardNum.value = '4242 4242 4242 4242';
        if (cardExp) cardExp.value = '12 / 28';
        if (cardCvc) cardCvc.value = '123';
      };
    }
  }

  function renderSimulatedCardForm() {
    if (!paymentElementContainer) return;
    paymentElementContainer.innerHTML = `
      <div class="simulated-card-box">
        <div class="simulated-field">
          <label for="sim-card-num">Card Number</label>
          <input type="text" id="sim-card-num" value="4242 4242 4242 4242" placeholder="4242 4242 4242 4242" autocomplete="cc-number">
        </div>
        <div class="input-grid">
          <div class="simulated-field">
            <label for="sim-exp">MM / YY</label>
            <input type="text" id="sim-exp" value="12 / 28" placeholder="12 / 28" autocomplete="cc-exp">
          </div>
          <div class="simulated-field">
            <label for="sim-cvc">CVC</label>
            <input type="text" id="sim-cvc" value="123" placeholder="123" autocomplete="cc-csc">
          </div>
        </div>
        <button type="button" class="fill-test-btn" id="fill-test-btn">✨ Auto-Fill Test Card (4242)</button>
      </div>
    `;
    attachCardFillListener();
  }

  attachCardFillListener();

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      buttonSpinner.classList.remove('hidden');
      buttonText.classList.add('hidden');
    } else {
      buttonSpinner.classList.add('hidden');
      buttonText.classList.remove('hidden');
    }
  }

  paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading(true);
    paymentMessage.classList.add('hidden');

    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value;
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const dialCode = countryDialSelect.value;
    const phoneNum = customerPhone.value.trim();
    const fullPhone = phoneNum ? `${dialCode}${phoneNum}` : '';
    const selectedOpt = countryDialSelect.options[countryDialSelect.selectedIndex];
    const countryCode = selectedOpt?.dataset.country || 'US';

    try {
      const intentRes = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          orderId: currentOrderId,
          customerName,
          customerEmail,
          customerPhone: fullPhone,
          dialCode,
          countryCode,
          phoneVerified: isPhoneVerified
        })
      });

      const intentData = await intentRes.json();
      if (!intentRes.ok) {
        throw new Error(intentData.error || 'Failed to create payment intent');
      }

      if (stripe && cardElement && !config.isMockMode) {
        const result = await stripe.confirmCardPayment(intentData.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerName,
              email: customerEmail,
              phone: fullPhone
            }
          }
        });

        if (result.error) {
          throw new Error(result.error.message);
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          window.location.href = `/success.html?method=card&payment_intent=${result.paymentIntent.id}&order_id=${encodeURIComponent(currentOrderId)}&amount=${amount}&currency=${currency.toUpperCase()}&phone=${encodeURIComponent(fullPhone)}`;
        }
      } else {
        await new Promise(r => setTimeout(r, 1200));
        await fetch('/api/confirm-simulated-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: intentData.paymentIntentId,
            cardLast4: '4242',
            brand: 'visa'
          })
        });
        window.location.href = `/success.html?method=card&payment_intent=${intentData.paymentIntentId}&order_id=${encodeURIComponent(currentOrderId)}&amount=${amount}&currency=${currency.toUpperCase()}&phone=${encodeURIComponent(fullPhone)}&verified=${isPhoneVerified}&mock=true`;
      }
    } catch (err) {
      setLoading(false);
      paymentMessage.textContent = err.message || 'Payment processing failed';
      paymentMessage.className = 'payment-error-box';
      paymentMessage.classList.remove('hidden');
    }
  });

  // Initial UI updates
  updateCountryBadge();
  updateAmounts();
});
