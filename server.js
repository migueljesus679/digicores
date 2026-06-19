require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const path = require('path');
const fs = require('fs');

const Product = require('./models/Product');
const Category = require('./models/Category');
const PricingType = require('./models/PricingType');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── MongoDB ────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digicores';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado:', MONGO_URI);
    seedIfEmpty();
  })
  .catch(err => console.error('❌ Erro MongoDB:', err.message));

// ── Seed Data ──────────────────────────────────
const DEFAULT_CATEGORIES = [
  { id: 'pequeno-formato', name: 'Pequeno Formato', icon: '🗒️', isDefault: true, order: 1 },
  { id: 'autocolantes',    name: 'Autocolantes',    icon: '🏷️', isDefault: true, order: 2 },
  { id: 'brindes',         name: 'Brindes',         icon: '🎁', isDefault: true, order: 3 },
  { id: 'expositores',     name: 'Expositores',     icon: '🖼️', isDefault: true, order: 4 },
  { id: 'lonas',           name: 'Lonas',           icon: '🎪', isDefault: true, order: 5 },
  { id: 'placas',          name: 'Placas',          icon: '🪧', isDefault: true, order: 6 },
  { id: 'texteis',         name: 'Têxteis',         icon: '👕', isDefault: true, order: 7 },
];

const DEFAULT_PRICING_TYPES = [
  { id: 'flyer',          name: 'Flyer',               desc: 'qty + tamanho + papel',       isDefault: true, order: 1 },
  { id: 'cartao',         name: 'Cartão de Visita',    desc: 'qty + acabamento',            isDefault: true, order: 2 },
  { id: 'folheto',        name: 'Folheto Desdobrável', desc: 'qty + dobra',                 isDefault: true, order: 3 },
  { id: 'envelope',       name: 'Envelope',            desc: 'qty + formato',               isDefault: true, order: 4 },
  { id: 'autocolante',    name: 'Autocolante',         desc: 'qty + tamanho + material',    isDefault: true, order: 5 },
  { id: 'etiqueta',       name: 'Etiqueta',            desc: 'qty + forma + material',      isDefault: true, order: 6 },
  { id: 'brinde-unidade', name: 'Brinde por Unidade',  desc: 'qty × preço/un.',             isDefault: true, order: 7 },
  { id: 'rollup',         name: 'Roll-Up / Expositor', desc: 'tamanho + material',          isDefault: true, order: 8 },
  { id: 'expositor',      name: 'Expositor Pop-Up',    desc: 'tamanho + acessórios',        isDefault: true, order: 9 },
  { id: 'area',           name: 'Área (€/m²)',         desc: 'lonas, placas',               isDefault: true, order: 10 },
  { id: 'textil',         name: 'Têxtil',              desc: 'qty + tamanho + técnica',     isDefault: true, order: 11 },
];

const SEED_PRODUCTS = [
  {
    id: 'flyers-a5',
    name: 'Flyers',
    category: 'pequeno-formato',
    subcategory: 'flyers',
    description: 'Flyers de alta qualidade para promoção do seu negócio. Impressão offset em papel premium, ideal para campanhas de marketing e distribuição em massa.',
    image: 'https://placehold.co/600x400/053ea1/white?text=Flyers',
    featured: true, active: true,
    pricingType: 'flyer', startingPrice: 18,
    options: { quantities: [100,250,500,1000,2500,5000,10000], sizes: ['A6','A5','A4','A3'], papers: ['90g','115g','135g','170g'], sides: ['Simples','Frente e Verso'] }
  },
  {
    id: 'cartoes-visita',
    name: 'Cartões de Visita',
    category: 'pequeno-formato',
    subcategory: 'cartoes',
    description: 'Cartões de visita profissionais com acabamentos premium. Disponível em vários acabamentos para transmitir a melhor imagem da sua empresa.',
    image: 'https://placehold.co/600x400/1a1a2e/white?text=Cartões+de+Visita',
    featured: true, active: true,
    pricingType: 'cartao', startingPrice: 18,
    options: { quantities: [100,250,500,1000], finishes: ['Mate','Brilhante','Soft Touch','Linho'], corners: ['Retos','Arredondados'], sides: ['Simples','Frente e Verso'] }
  },
  {
    id: 'folhetos',
    name: 'Folhetos Desdobráveis',
    category: 'pequeno-formato',
    subcategory: 'folhetos',
    description: 'Folhetos desdobráveis em formato bi-fold ou tri-fold. Perfeitos para menus, catálogos e apresentações de produtos ou serviços.',
    image: 'https://placehold.co/600x400/2d6a4f/white?text=Folhetos',
    featured: false, active: true,
    pricingType: 'folheto', startingPrice: 35,
    options: { quantities: [100,250,500,1000,2500], sizes: ['A5 Dobrado (A4)','A4 Dobrado (A3)'], folds: ['Bi-fold','Tri-fold','Z-fold'], papers: ['115g','135g','170g'] }
  },
  {
    id: 'autocolantes',
    name: 'Autocolantes Personalizados',
    category: 'autocolantes',
    subcategory: 'autocolantes',
    description: 'Autocolantes personalizados em vinil de alta durabilidade. Ideais para decoração, produto, embalagem ou promoção. Resistentes à água e ao exterior.',
    image: 'https://placehold.co/600x400/e63946/white?text=Autocolantes',
    featured: true, active: true,
    pricingType: 'autocolante', startingPrice: 12,
    options: { quantities: [10,25,50,100,250,500], sizes: ['Pequeno (até 5x5cm)','Médio (até 10x10cm)','Grande (até 20x20cm)'], materials: ['Papel','Vinil Branco','Vinil Transparente'], finishes: ['Mate','Brilhante'] }
  },
  {
    id: 'canecas',
    name: 'Canecas Personalizadas',
    category: 'brindes',
    subcategory: 'canecas',
    description: 'Canecas personalizadas em cerâmica de alta qualidade. Impressão sublimática com cores vibrantes e duradouras. Ideal para brindes corporativos.',
    image: 'https://placehold.co/600x400/06d6a0/white?text=Canecas',
    featured: true, active: true,
    pricingType: 'brinde-unidade', startingPrice: 5.50,
    options: { quantities: [12,24,48,100], capacity: ['325ml Cerâmica','440ml Cerâmica','300ml Mágica'], printSides: ['1 Lado','Toda a Volta'], colors: ['Branca','Preta','Colorida'] }
  },
  {
    id: 'roll-up',
    name: 'Roll-Up',
    category: 'expositores',
    subcategory: 'roll-up',
    description: 'Roll-ups de alta qualidade para feiras, eventos e pontos de venda. Impressão em lona premium com base resistente e saco de transporte incluído.',
    image: 'https://placehold.co/600x400/023e8a/white?text=Roll-Up',
    featured: true, active: true,
    pricingType: 'rollup', startingPrice: 75,
    options: { sizes: ['85x200cm','100x200cm','120x200cm','150x200cm'], quantities: [1,2,3,5,10], materials: ['Lona Standard','Lona Premium','Lona Backlit'] }
  },
  {
    id: 'lona-standard',
    name: 'Lona Standard',
    category: 'lonas',
    subcategory: 'lona-standard',
    description: 'Lonas de impressão de grande formato, ideais para publicidade exterior, eventos e decoração. Material resistente a intempéries com acabamento em ilhós.',
    image: 'https://placehold.co/600x400/e9c46a/black?text=Lona+Standard',
    featured: false, active: true,
    pricingType: 'area', startingPrice: 12, priceUnit: '€/m²',
    options: { widths: [0.5,1,1.5,2,2.5,3,4,5], heights: [0.5,1,1.5,2,2.5,3], material: 'Lona 440g/m² (Standard)', finishes: ['Sem Acabamento','Com Ilhós','Com Ilhós e Reforço'], minPrice: 20 }
  },
  {
    id: 'placa-pvc',
    name: 'Placa PVC',
    category: 'placas',
    subcategory: 'placa-pvc',
    description: 'Placas em PVC expandido para sinalética interior e exterior. Material leve, resistente e de fácil instalação. Impressão UV de alta resolução.',
    image: 'https://placehold.co/600x400/2b9348/white?text=Placa+PVC',
    featured: false, active: true,
    pricingType: 'area', startingPrice: 18, priceUnit: '€/m²',
    options: { widths: [0.3,0.5,0.7,1,1.5,2], heights: [0.2,0.3,0.5,0.7,1,1.5], thicknesses: ['3mm','5mm','10mm'], finishes: ['Brilhante','Mate'], minPrice: 15 }
  },
  {
    id: 'tshirt',
    name: 'T-Shirt Personalizada',
    category: 'texteis',
    subcategory: 'tshirt',
    description: 'T-shirts personalizadas de alta qualidade em algodão 100%. Impressão digital ou serigrafia com cores vibrantes e duradouras. Ideal para equipas, eventos e merchandising.',
    image: 'https://placehold.co/600x400/d62828/white?text=T-Shirt',
    featured: true, active: true,
    pricingType: 'textil', startingPrice: 8.50,
    options: { quantities: [5,10,20,50,100], sizes: ['XS','S','M','L','XL','XXL'], printTypes: ['Frente','Costas','Frente e Costas','Frente + Manga'], printTechniques: ['Impressão Digital','Serigrafia 1 cor','Serigrafia 2 cores','Serigrafia 4 cores'], fabrics: ['Algodão 100% 150g','Algodão 100% 180g','Poliéster 100%'] }
  },
  {
    id: 'polo',
    name: 'Polo Personalizado',
    category: 'texteis',
    subcategory: 'polo',
    description: 'Polos personalizados para uniformes corporativos e equipas. Bordado ou impressão de alta qualidade. Material 100% algodão piqué para máximo conforto.',
    image: 'https://placehold.co/600x400/003049/white?text=Polo',
    featured: false, active: true,
    pricingType: 'textil', startingPrice: 14,
    options: { quantities: [5,10,20,50,100], sizes: ['XS','S','M','L','XL','XXL'], printTypes: ['Peito Esquerdo','Costas','Peito Esquerdo + Costas'], printTechniques: ['Bordado','Impressão Digital','Serigrafia'], fabrics: ['Piqué 100% Algodão 200g','Piqué Premium 220g'] }
  },
];

async function seedIfEmpty() {
  const [catCount, ptCount, prodCount] = await Promise.all([
    Category.countDocuments(),
    PricingType.countDocuments(),
    Product.countDocuments(),
  ]);

  if (catCount === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log('✅ Categorias criadas (seed)');
  }
  if (ptCount === 0) {
    await PricingType.insertMany(DEFAULT_PRICING_TYPES);
    console.log('✅ Tipos de cálculo criados (seed)');
  }
  if (prodCount === 0) {
    await Product.insertMany(SEED_PRODUCTS);
    console.log('✅ Produtos criados (seed)');
  }
}

// ── Admin auth ─────────────────────────────────
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

function requireAdmin(req, res, next) {
  if (!ADMIN_SECRET) return res.status(500).json({ error: 'ADMIN_SECRET não configurado.' });
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || token !== ADMIN_SECRET) return res.status(401).json({ error: 'Não autorizado.' });
  next();
}

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const ADMINS = [
    { username: process.env.ADMIN_USERNAME  || 'admin',  password: process.env.ADMIN_PASSWORD  || '', name: 'Administrador' },
    { username: process.env.ADMIN2_USERNAME || 'gestor', password: process.env.ADMIN2_PASSWORD || '', name: 'Gestor de Loja' },
  ];
  const user = ADMINS.find(u => u.username === username && u.password === password && u.password !== '');
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });
  if (!ADMIN_SECRET) return res.status(500).json({ error: 'ADMIN_SECRET não configurado.' });
  res.json({ token: ADMIN_SECRET, name: user.name });
});

// ── Health check ───────────────────────────────
app.get('/api/health', (_, res) => res.json({ ok: true }));

// ── Seed / Reset ───────────────────────────────
app.post('/api/seed', requireAdmin, async (req, res) => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(SEED_PRODUCTS);
    res.json({ ok: true, count: SEED_PRODUCTS.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Products CRUD ──────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const query = {};
    if (req.query.active === 'true') query.active = true;
    if (req.query.featured === 'true') query.featured = true;
    const products = await Product.find(query).lean();
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const p = await Product.findOne({ id: req.params.id }).lean();
    if (!p) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(p);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const { name, category, subcategory, description, image, featured, active, pricingType, startingPrice, priceUnit, options, optionPrices, fieldPriceModes, optionLabels } = req.body;
    const slug = String(name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    const product = await Product.create({ name, category, subcategory, description, image, featured, active, pricingType, startingPrice, priceUnit, options, optionPrices, fieldPriceModes, optionLabels, id: slug });
    res.status(201).json(product.toObject());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const { name, category, subcategory, description, image, featured, active, pricingType, startingPrice, priceUnit, options, optionPrices, fieldPriceModes, optionLabels } = req.body;
    const update = { name, category, subcategory, description, image, featured, active, pricingType, startingPrice, priceUnit, options, optionPrices, fieldPriceModes, optionLabels };
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      update,
      { new: true, runValidators: true }
    ).lean();
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Categories CRUD ────────────────────────────
app.get('/api/categories', async (req, res) => {
  try {
    const cats = await Category.find({ hidden: false }).sort({ order: 1, createdAt: 1 }).lean();
    res.json(cats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/categories', requireAdmin, async (req, res) => {
  try {
    const { id, name, icon, order } = req.body;
    const cat = await Category.create({ id, name, icon, order, isDefault: false });
    res.status(201).json(cat.toObject());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    const { name, icon, order, hidden } = req.body;
    const update = { name, icon, order, hidden };
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);
    const cat = await Category.findOneAndUpdate(
      { id: req.params.id },
      update,
      { new: true, runValidators: true }
    ).lean();
    if (!cat) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json(cat);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    const cat = await Category.findOne({ id: req.params.id });
    if (!cat) return res.status(404).json({ error: 'Categoria não encontrada' });
    if (cat.isDefault) {
      await Category.findOneAndUpdate({ id: req.params.id }, { hidden: true });
    } else {
      await Category.findOneAndDelete({ id: req.params.id });
    }
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Pricing Types CRUD ─────────────────────────
app.get('/api/pricing-types', async (req, res) => {
  try {
    const query = { hidden: false };
    if (req.query.customOnly === 'true') query.isDefault = false;
    const types = await PricingType.find(query).sort({ order: 1, createdAt: 1 }).lean();
    res.json(types);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/pricing-types', requireAdmin, async (req, res) => {
  try {
    const { id, name, desc, order } = req.body;
    const pt = await PricingType.create({ id, name, desc, order, isDefault: false });
    res.status(201).json(pt.toObject());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/pricing-types/:id', requireAdmin, async (req, res) => {
  try {
    const { name, desc, order, hidden } = req.body;
    const update = { name, desc, order, hidden };
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);
    const pt = await PricingType.findOneAndUpdate(
      { id: req.params.id },
      update,
      { new: true, runValidators: true }
    ).lean();
    if (!pt) return res.status(404).json({ error: 'Tipo não encontrado' });
    res.json(pt);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/pricing-types/:id', requireAdmin, async (req, res) => {
  try {
    const pt = await PricingType.findOne({ id: req.params.id });
    if (!pt) return res.status(404).json({ error: 'Tipo não encontrado' });
    if (pt.isDefault) {
      await PricingType.findOneAndUpdate({ id: req.params.id }, { hidden: true });
    } else {
      await PricingType.findOneAndDelete({ id: req.params.id });
    }
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Email Log ──────────────────────────────────
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

app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message, emailStatus, emailError } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Nome, email e mensagem são obrigatórios.' });
  const entries = readEmailLog();
  const entry = { id: Date.now().toString(), timestamp: new Date().toISOString(), name, email, phone: phone || '', subject, message, status: emailStatus || 'sent' };
  if (emailError) entry.error = emailError;
  entries.unshift(entry);
  writeEmailLog(entries);
  res.json({ ok: true });
});

app.get('/api/emails', (_, res) => res.json(readEmailLog()));

app.delete('/api/emails/:id', requireAdmin, (req, res) => {
  const entries = readEmailLog().filter(e => e.id !== req.params.id);
  writeEmailLog(entries);
  res.json({ ok: true });
});

// ── Stripe Payments ────────────────────────────
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur', metadata = {} } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Montante inválido.' });
    const pi = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), currency,
      automatic_payment_methods: { enabled: true },
      metadata: { ...metadata, source: 'digicores-website' }
    });
    res.json({ clientSecret: pi.client_secret });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/create-mbway-intent', async (req, res) => {
  try {
    const { amount, phone, currency = 'eur', metadata = {} } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Montante inválido.' });
    if (!phone) return res.status(400).json({ error: 'Telefone obrigatório.' });
    const formattedPhone = phone.startsWith('+') ? phone : `+351${phone.replace(/\s/g, '')}`;
    const pi = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), currency,
      payment_method_types: ['mb_way'],
      payment_method_data: { type: 'mb_way', billing_details: { phone: formattedPhone } },
      confirm: true,
      metadata: { ...metadata, phone: formattedPhone, source: 'digicores-website' }
    });
    res.json({ status: pi.status, paymentIntentId: pi.id, clientSecret: pi.client_secret });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/payment-status/:id', async (req, res) => {
  try {
    const pi = await stripe.paymentIntents.retrieve(req.params.id);
    res.json({ status: pi.status, id: pi.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = webhookSecret ? stripe.webhooks.constructEvent(req.body, sig, webhookSecret) : JSON.parse(req.body);
  } catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }
  if (event.type === 'payment_intent.succeeded') console.log('✅ Pagamento confirmado:', event.data.object.id);
  res.json({ received: true });
});

// ── Start ──────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Grafica Comercial em http://localhost:${PORT}\n`);
});
