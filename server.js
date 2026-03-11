// =============================================
// DigiCores - Servidor Node.js (Stripe Backend)
// =============================================
// Instalar dependências: npm install
// Arrancar servidor: node server.js
// Abrir no browser: http://localhost:3000
// =============================================

require('dotenv').config();

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51T9N5LAr4sl9qN1uYUdJYsVQiOuETIv2QX8ta9ofoXM0kdAUSg6NAuJ1IcX9hhOHXmSn5CXXJyk1JUyjI3QucFpC00eb65sAU4');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Email de destino (onde chegam as mensagens do formulário)
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'coontasegura@gmail.com';
const EMAIL_PASS    = process.env.EMAIL_PASS;     // App Password do Gmail (variável de ambiente)

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));  // serve os ficheiros HTML/CSS/JS

// ── Log de Emails ─────────────────────────────
const EMAIL_LOG_FILE = path.join(__dirname, 'emails-log.json');

function readEmailLog() {
  try {
    if (!fs.existsSync(EMAIL_LOG_FILE)) return [];
    return JSON.parse(fs.readFileSync(EMAIL_LOG_FILE, 'utf8'));
  } catch { return []; }
}

function writeEmailLog(entries) {
  fs.writeFileSync(EMAIL_LOG_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

function logEmail(entry) {
  const entries = readEmailLog();
  entries.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), ...entry });
  writeEmailLog(entries);
}

// ── Health check ─────────────────────────────
app.get('/api/health', (_, res) => res.json({ ok: true }));

// ── Formulário de Contacto ────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nome, email e mensagem são obrigatórios.' });
  }

  if (!EMAIL_PASS) {
    // Sem credenciais configuradas: aceita mas avisa (útil em dev local)
    console.log(`📧 Contacto recebido de ${name} <${email}>: ${subject}`);
    logEmail({ name, email, phone: phone || '', subject, message, status: 'no_config', error: 'EMAIL_PASS não configurado' });
    return res.json({ ok: true, warn: 'EMAIL_PASS não configurado — email não enviado.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: CONTACT_EMAIL, pass: EMAIL_PASS }
    });

    const info = await transporter.sendMail({
      from: `"DigiCores Website" <${CONTACT_EMAIL}>`,
      to: CONTACT_EMAIL,
      replyTo: `"${name}" <${email}>`,
      subject: `[DigiCores] ${subject} — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#FF4500;border-bottom:2px solid #FF4500;padding-bottom:8px;">
            Nova Mensagem — DigiCores
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:8px;font-weight:700;width:120px;">Nome</td><td style="padding:8px;">${name}</td></tr>
            <tr style="background:#f8f9fa;"><td style="padding:8px;font-weight:700;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:700;">Telefone</td><td style="padding:8px;">${phone || '—'}</td></tr>
            <tr style="background:#f8f9fa;"><td style="padding:8px;font-weight:700;">Assunto</td><td style="padding:8px;">${subject}</td></tr>
          </table>
          <div style="background:#f8f9fa;border-left:4px solid #FF4500;padding:16px;border-radius:4px;">
            <p style="font-weight:700;margin-bottom:8px;">Mensagem:</p>
            <p style="white-space:pre-wrap;margin:0;">${message}</p>
          </div>
          <p style="color:#999;font-size:12px;margin-top:20px;">
            Enviado pelo formulário de contacto de digicores.pt
          </p>
        </div>`
    });

    logEmail({ name, email, phone: phone || '', subject, message, status: 'sent', messageId: info.messageId });
    res.json({ ok: true });
  } catch (err) {
    console.error('Erro ao enviar email:', err.message);
    logEmail({ name, email, phone: phone || '', subject, message, status: 'failed', error: err.message });
    res.status(500).json({ error: 'Erro ao enviar email. Verifique as credenciais Gmail.' });
  }
});

// ── Admin: Log de Emails ──────────────────────
app.get('/api/emails', (_, res) => {
  res.json(readEmailLog());
});

app.delete('/api/emails/:id', (req, res) => {
  const entries = readEmailLog().filter(e => e.id !== req.params.id);
  writeEmailLog(entries);
  res.json({ ok: true });
});

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
