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
  const summaryTotal = document.getElementById('summary-total');
  const summaryOrderId = document.getElementById('summary-order-id');
  const hostedSummaryAmount = document.getElementById('hosted-summary-amount');
  const modeBadge = document.getElementById('mode-badge');
  const configPkStatus = document.getElementById('config-pk-status');
  const configDescriptor = document.getElementById('config-descriptor');
  const configCurrencyCount = document.getElementById('config-currency-count');
  const configCountryCount = document.getElementById('config-country-count');
  const paymentForm = document.getElementById('payment-form');
  const submitBtn = document.getElementById('submit-btn');
  const buttonSpinner = document.getElementById('button-spinner');
  const buttonText = document.getElementById('button-text');
  const paymentMessage = document.getElementById('payment-message');
  const hostedCheckoutBtn = document.getElementById('hosted-checkout-btn');
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

  const symbols = {};
  const countryMap = new Map();
  let isPhoneVerified = false;
  let lastSampleCode = null;

  const currentOrderId = `INTL-${Date.now().toString().slice(-6)}`;
  summaryOrderId.textContent = currentOrderId;

  // 1. Fetch Gateway Configuration & Catalogs
  let config = { isMockMode: true, publishableKey: '', defaultCurrency: 'usd', supportedCurrencies: [], countries: [] };
  try {
    const res = await fetch('/api/config');
    config = await res.json();
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
    if (configCurrencyCount) {
      configCurrencyCount.textContent = `${config.supportedCurrencies.length} ISO Currencies`;
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

    if (configCountryCount) {
      configCountryCount.textContent = `${config.countries.length} Country Calling Codes`;
    }
  }

  // Update mode badge
  if (config.isMockMode) {
    modeBadge.textContent = '🟡 Sandbox Simulator';
    modeBadge.className = 'mode-badge sandbox';
    configPkStatus.textContent = 'Simulated (Add real keys in .env)';
  } else {
    modeBadge.textContent = '🟢 Live Stripe Mode';
    modeBadge.className = 'mode-badge live';
    configPkStatus.textContent = config.publishableKey ? `${config.publishableKey.slice(0, 8)}...` : 'Configured';
  }
  if (config.statementDescriptor) {
    configDescriptor.textContent = config.statementDescriptor;
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

  // Currency & Amount updates
  function updateAmounts() {
    const currency = (currencySelect.value || 'usd').toLowerCase();
    const symbol = symbols[currency] || '$';
    const val = parseFloat(amountInput.value) || 0;
    const formatted = `${symbol}${val.toFixed(2)}`;

    currencySymbol.textContent = symbol;
    payButtonAmount.textContent = `${formatted} ${currency.toUpperCase()}`;
    summaryCurrency.textContent = currency.toUpperCase();
    summaryTotal.textContent = formatted;
    hostedSummaryAmount.textContent = `${formatted} ${currency.toUpperCase()}`;
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

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(`tab-${btn.dataset.tab}`);
      if (target) target.classList.add('active');
    });
  });

  // 2. Phone Verification via SMS / 3D-Secure Protocol
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

  // Autofill button click
  autofillOtpBtn.addEventListener('click', () => {
    if (lastSampleCode) {
      otpInput.value = lastSampleCode;
      verifyOtpBtn.click();
    }
  });

  // Check OTP Code
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

  // 3. Setup Stripe Elements or Sandbox Mock Elements
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

  function renderSimulatedCardForm() {
    paymentElementContainer.innerHTML = `
      <div class="simulated-card-box">
        <div class="simulated-field">
          <label>Card Number</label>
          <input type="text" id="sim-card-num" value="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242" placeholder="4242 4242 4242 4242">
        </div>
        <div class="input-grid">
          <div class="simulated-field">
            <label>MM / YY</label>
            <input type="text" id="sim-exp" value="12 / 28" placeholder="12 / 28">
          </div>
          <div class="simulated-field">
            <label>CVC</label>
            <input type="text" id="sim-cvc" value="123" placeholder="123">
          </div>
        </div>
        <button type="button" class="fill-test-btn" id="fill-test-btn">✨ Auto-Fill Test Card (4242)</button>
      </div>
    `;

    document.getElementById('fill-test-btn')?.addEventListener('click', () => {
      document.getElementById('sim-card-num').value = '4242 4242 4242 4242';
      document.getElementById('sim-exp').value = '12 / 28';
      document.getElementById('sim-cvc').value = '123';
    });
  }

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

  // 4. Payment Form Submit
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
      // Step A: Create PaymentIntent on server
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

      // Step B: Confirm payment
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
          window.location.href = `/success.html?payment_intent=${result.paymentIntent.id}&order_id=${encodeURIComponent(currentOrderId)}&amount=${amount}&currency=${currency.toUpperCase()}&phone=${encodeURIComponent(fullPhone)}`;
        }
      } else {
        // Simulated sandbox confirmation
        await new Promise(r => setTimeout(r, 1200)); // Simulate bank authorization
        await fetch('/api/confirm-simulated-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: intentData.paymentIntentId,
            cardLast4: '4242',
            brand: 'visa'
          })
        });
        window.location.href = `/success.html?payment_intent=${intentData.paymentIntentId}&order_id=${encodeURIComponent(currentOrderId)}&amount=${amount}&currency=${currency.toUpperCase()}&phone=${encodeURIComponent(fullPhone)}&verified=${isPhoneVerified}&mock=true`;
      }
    } catch (err) {
      setLoading(false);
      paymentMessage.textContent = err.message || 'Payment processing failed';
      paymentMessage.className = 'payment-error-box';
      paymentMessage.classList.remove('hidden');
    }
  });

  // 5. Hosted Checkout Button Click
  hostedCheckoutBtn.addEventListener('click', async () => {
    hostedCheckoutBtn.disabled = true;
    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value;
    const dialCode = countryDialSelect.value;
    const phoneNum = customerPhone.value.trim();
    const fullPhone = phoneNum ? `${dialCode}${phoneNum}` : '';
    const selectedOpt = countryDialSelect.options[countryDialSelect.selectedIndex];
    const countryCode = selectedOpt?.dataset.country || 'US';

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          orderId: currentOrderId,
          productName: `International Payment (${currentOrderId})`,
          customerPhone: fullPhone,
          countryCode
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize Checkout Session');
      window.location.href = data.checkoutUrl;
    } catch (err) {
      alert(`Checkout Error: ${err.message}`);
      hostedCheckoutBtn.disabled = false;
    }
  });

  // Initial UI updates
  updateCountryBadge();
  updateAmounts();
});
