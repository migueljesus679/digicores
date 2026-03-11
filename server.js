// =============================================
// DigiCores - Servidor Node.js (Stripe Backend)
// =============================================
// Instalar dependências: npm install
// Arrancar servidor: node server.js
// Abrir no browser: http://localhost:3000
// =============================================

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51T9N5LAr4sl9qN1uYUdJYsVQiOuETIv2QX8ta9ofoXM0kdAUSg6NAuJ1IcX9hhOHXmSn5CXXJyk1JUyjI3QucFpC00eb65sAU4');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));  // serve os ficheiros HTML/CSS/JS

// ── Health check ─────────────────────────────
app.get('/api/health', (_, res) => res.json({ ok: true }));

// ── Criar PaymentIntent (Cartão) ─────────────
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur', metadata = {} } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Montante inválido.' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { ...metadata, source: 'digicores-website' }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Erro Stripe (cartão):', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Criar PaymentIntent MB WAY ───────────────
// MB WAY é um método assíncrono — o cliente confirma na app.
// O Stripe envia um webhook quando o pagamento é confirmado.
app.post('/api/create-mbway-intent', async (req, res) => {
  try {
    const { amount, phone, currency = 'eur', metadata = {} } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Montante inválido.' });
    if (!phone) return res.status(400).json({ error: 'Telefone obrigatório.' });

    // Formatar número: garantir formato +351XXXXXXXXX
    const formattedPhone = phone.startsWith('+') ? phone : `+351${phone.replace(/\s/g, '')}`;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method_types: ['mb_way'],  // exclusivamente MB WAY
      payment_method_data: {
        type: 'mb_way',
        billing_details: { phone: formattedPhone }
      },
      confirm: true,  // inicia o pedido na app imediatamente
      metadata: { ...metadata, phone: formattedPhone, source: 'digicores-website' }
    });

    // Estados possíveis:
    //  requires_action  → notificação enviada, aguarda confirmação na app (normal)
    //  succeeded        → já confirmado (raro em teste)
    //  payment_failed   → número inválido ou recusado
    res.json({
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error('Erro Stripe (MB WAY):', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Verificar estado de um PaymentIntent ─────
// Usado pelo frontend para saber se o MB WAY foi confirmado.
app.get('/api/payment-status/:id', async (req, res) => {
  try {
    const pi = await stripe.paymentIntents.retrieve(req.params.id);
    res.json({ status: pi.status, id: pi.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Webhook Stripe (confirmação assíncrona) ───
// O Stripe chama este endpoint quando o pagamento muda de estado.
// Em produção: configurar em https://dashboard.stripe.com/webhooks
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = webhookSecret
      ? stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
      : JSON.parse(req.body);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('✅ Pagamento confirmado:', event.data.object.id);
      // Aqui: atualizar base de dados, enviar email de confirmação, etc.
      break;
    case 'payment_intent.payment_failed':
      console.log('❌ Pagamento recusado:', event.data.object.id);
      break;
    default:
      console.log(`Evento recebido: ${event.type}`);
  }

  res.json({ received: true });
});

// ── Arrancar servidor ────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 DigiCores servidor em http://localhost:${PORT}`);
  console.log('   Abra o browser em http://localhost:3000\n');
});
