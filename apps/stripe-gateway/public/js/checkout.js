document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const currencySelect = document.getElementById('currency-select');
  const amountInput = document.getElementById('amount-input');
  const currencySymbol = document.getElementById('currency-symbol');
  const payButtonAmount = document.getElementById('pay-button-amount');
  const summaryCurrency = document.getElementById('summary-currency');
  const summaryTotal = document.getElementById('summary-total');
  const summaryOrderId = document.getElementById('summary-order-id');
  const hostedSummaryAmount = document.getElementById('hosted-summary-amount');
  const modeBadge = document.getElementById('mode-badge');
  const configPkStatus = document.getElementById('config-pk-status');
  const configDescriptor = document.getElementById('config-descriptor');
  const paymentForm = document.getElementById('payment-form');
  const submitBtn = document.getElementById('submit-btn');
  const buttonSpinner = document.getElementById('button-spinner');
  const buttonText = document.getElementById('button-text');
  const paymentMessage = document.getElementById('payment-message');
  const hostedCheckoutBtn = document.getElementById('hosted-checkout-btn');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  const symbols = {
    usd: '$', eur: '€', gbp: '£', cad: 'C$', aud: 'A$',
    jpy: '¥', inr: '₹', sgd: 'S$', aed: 'AED ', chf: 'CHF '
  };

  const currentOrderId = `INTL-${Date.now().toString().slice(-6)}`;
  summaryOrderId.textContent = currentOrderId;

  // 1. Fetch Gateway Config
  let config = { isMockMode: true, publishableKey: '', defaultCurrency: 'usd' };
  try {
    const res = await fetch('/api/config');
    config = await res.json();
  } catch (err) {
    console.error('Failed to load gateway config:', err);
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

  // Currency & Amount updates
  function updateAmounts() {
    const currency = currencySelect.value;
    const symbol = symbols[currency] || '$';
    const val = parseFloat(amountInput.value) || 0;
    const formatted = `${symbol}${val.toFixed(2)}`;

    currencySymbol.textContent = symbol;
    payButtonAmount.textContent = `${formatted} ${currency.toUpperCase()}`;
    summaryCurrency.textContent = currency.toUpperCase();
    summaryTotal.textContent = formatted;
    hostedSummaryAmount.textContent = `${formatted} ${currency.toUpperCase()}`;
  }

  currencySelect.addEventListener('change', updateAmounts);
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

  // 2. Setup Stripe Elements or Sandbox Mock Elements
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

  // 3. Payment Form Submit
  paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading(true);
    paymentMessage.classList.add('hidden');

    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value;
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;

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
          customerEmail
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
              email: customerEmail
            }
          }
        });

        if (result.error) {
          throw new Error(result.error.message);
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          window.location.href = `/success.html?payment_intent=${result.paymentIntent.id}&order_id=${encodeURIComponent(currentOrderId)}&amount=${amount}&currency=${currency.toUpperCase()}`;
        }
      } else {
        // Simulated sandbox confirmation
        await new Promise(r => setTimeout(r, 1200)); // Simulate bank authorization
        const confirmRes = await fetch('/api/confirm-simulated-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: intentData.paymentIntentId,
            cardLast4: '4242',
            brand: 'visa'
          })
        });
        const confirmData = await confirmRes.json();
        window.location.href = `/success.html?payment_intent=${intentData.paymentIntentId}&order_id=${encodeURIComponent(currentOrderId)}&amount=${amount}&currency=${currency.toUpperCase()}&mock=true`;
      }
    } catch (err) {
      setLoading(false);
      paymentMessage.textContent = err.message || 'Payment processing failed';
      paymentMessage.className = 'payment-error-box';
      paymentMessage.classList.remove('hidden');
    }
  });

  // 4. Hosted Checkout Button Click
  hostedCheckoutBtn.addEventListener('click', async () => {
    hostedCheckoutBtn.disabled = true;
    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value;

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          orderId: currentOrderId,
          productName: `International Payment (${currentOrderId})`
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

  // Initial amounts display
  updateAmounts();
});
