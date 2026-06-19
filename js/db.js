// =============================================
// Grafica Comercial - Data Layer (API + MongoDB)
// =============================================

const DigiDB = (() => {
  const CART_KEY = 'digicores_cart';

  // ── API Helper ──────────────────────────────
  async function apiFetch(path, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    const method = (opts.method || 'GET').toUpperCase();
    if (method !== 'GET') {
      const token = localStorage.getItem('digicores_admin_token') || '';
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(path, { headers, ...opts });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || res.statusText);
    }
    return res.json();
  }

  // ── Products ────────────────────────────────
  async function getProducts(filters = {}) {
    const qs = new URLSearchParams(filters).toString();
    return apiFetch('/api/products' + (qs ? '?' + qs : ''));
  }

  async function getProduct(id) {
    try { return await apiFetch(`/api/products/${id}`); }
    catch { return null; }
  }

  async function createProduct(data) {
    return apiFetch('/api/products', { method: 'POST', body: JSON.stringify(data) });
  }

  async function updateProduct(id, data) {
    return apiFetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async function deleteProduct(id) {
    return apiFetch(`/api/products/${id}`, { method: 'DELETE' });
  }

  async function resetToSeed() {
    return apiFetch('/api/seed', { method: 'POST' });
  }

  // ── Categories ──────────────────────────────
  async function getCategories() {
    return apiFetch('/api/categories');
  }

  async function createCategory(data) {
    return apiFetch('/api/categories', { method: 'POST', body: JSON.stringify(data) });
  }

  async function updateCategory(id, data) {
    return apiFetch(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async function deleteCategory(id) {
    return apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
  }

  // ── Pricing Types ───────────────────────────
  async function getDefaultPricingTypesList() {
    return apiFetch('/api/pricing-types');
  }

  async function getPricingTypes() {
    return apiFetch('/api/pricing-types?customOnly=true');
  }

  async function createPricingType(data) {
    return apiFetch('/api/pricing-types', { method: 'POST', body: JSON.stringify(data) });
  }

  async function updatePricingType(id, data) {
    return apiFetch(`/api/pricing-types/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async function deletePricingType(id) {
    return apiFetch(`/api/pricing-types/${id}`, { method: 'DELETE' });
  }

  // ── Pricing Engine (client-side) ────────────
  const PRICING = {
    flyer: {
      base: { 100: 18, 250: 22, 500: 28, 1000: 35, 2500: 58, 5000: 89, 10000: 145 },
      size: { 'A6': 1, 'A5': 1.6, 'A4': 2.5, 'A3': 4.2 },
      paper: { '90g': 1, '115g': 1.1, '135g': 1.25, '170g': 1.45 },
      sides: { 'Simples': 1, 'Frente e Verso': 1.4 }
    },
    cartao: {
      base: { 100: 18, 250: 24, 500: 32, 1000: 48 },
      finish: { 'Mate': 1, 'Brilhante': 1.15, 'Soft Touch': 1.40, 'Linho': 1.55 },
      corners: { 'Retos': 0, 'Arredondados': 5 },
      sides: { 'Simples': 1, 'Frente e Verso': 1.35 }
    },
    folheto: {
      base: { 100: 35, 250: 45, 500: 62, 1000: 88, 2500: 165 },
      size: { 'A5 Dobrado (A4)': 1, 'A4 Dobrado (A3)': 1.8 },
      fold: { 'Bi-fold': 1, 'Tri-fold': 1.1, 'Z-fold': 1.1 },
      paper: { '115g': 1, '135g': 1.15, '170g': 1.35 }
    },
    envelope: {
      base: { 250: 55, 500: 75, 1000: 120, 2500: 240 },
      size: { 'DL (110x220mm)': 1, 'C5 (162x229mm)': 1.6, 'C4 (229x324mm)': 2.4 },
      paper: { '80g': 1, '90g': 1.1, '120g': 1.35 },
      window: { 'Sem Janela': 0, 'Com Janela': 8 }
    },
    autocolante: {
      base: { 10: 12, 25: 18, 50: 25, 100: 38, 250: 65, 500: 110 },
      size: { 'Pequeno (até 5x5cm)': 1, 'Médio (até 10x10cm)': 1.6, 'Grande (até 20x20cm)': 2.8 },
      material: { 'Papel': 1, 'Vinil Branco': 1.4, 'Vinil Transparente': 1.65 },
      finish: { 'Mate': 1, 'Brilhante': 1.05 }
    },
    etiqueta: {
      base: { 50: 22, 100: 32, 250: 55, 500: 90, 1000: 155 },
      size: { '30mm': 1, '50mm': 1.4, '70mm': 1.8, '100mm': 2.5 },
      shape: { 'Redonda': 1, 'Quadrada': 1, 'Rectangular': 1, 'Oval': 1.05 },
      material: { 'Papel Brilhante': 1, 'Papel Mate': 1, 'Vinil': 1.5 }
    },
    'brinde-unidade': {
      quantityDiscount: { 50: 1, 100: 0.9, 250: 0.78, 500: 0.68, 1000: 0.55, 12: 1, 24: 0.88, 48: 0.75 },
      model: {
        'Esfera Clássica': 0.85, 'Esfera Premium': 1.45, 'Roller': 2.20,
        '325ml Cerâmica': 5.50, '440ml Cerâmica': 6.20, '300ml Mágica': 7.80,
        'PVC': 1.20, 'Metal': 2.80, 'Madeira': 2.10, 'Acrílico': 1.90,
        'Redondo': 0, 'Rectangular': 0, 'Personalizado': 0.50
      }
    },
    rollup: {
      base: { '85x200cm': 75, '100x200cm': 89, '120x200cm': 108, '150x200cm': 138 },
      material: { 'Lona Standard': 1, 'Lona Premium': 1.2, 'Lona Backlit': 1.45 },
      qtyDiscount: { 1: 1, 2: 0.92, 3: 0.88, 5: 0.82, 10: 0.72 }
    },
    expositor: {
      base: { '3x3 Painéis (228x230cm)': 285, '5x3 Painéis (380x230cm)': 420, '7x3 Painéis (532x230cm)': 580 },
      accessories: { 'Sem Iluminação': 0, 'Com Iluminação LED': 85, 'Com Balcão': 120 },
      qtyDiscount: { 1: 1, 2: 0.9, 5: 0.8 }
    },
    area: { minPrice: 20 },
    textil: {
      tshirt: { base: 8.50, printExtra: 4.50 },
      polo: { base: 14.00, printExtra: 5.00 },
      sweatshirt: { base: 18.00, printExtra: 6.50 },
      sizeMultiplier: { 'XS': 1, 'S': 1, 'M': 1, 'L': 1, 'XL': 1.06, 'XXL': 1.12 },
      qtyDiscount: { 5: 1, 10: 0.92, 20: 0.85, 50: 0.75, 100: 0.65 },
      techniqueMultiplier: {
        'Impressão Digital': 1, 'Serigrafia 1 cor': 0.9, 'Serigrafia 2 cores': 1.1,
        'Serigrafia 4 cores': 1.25, 'Bordado': 1.35
      }
    }
  };

  function calculateCustomPrice(product, selections) {
    const prices = product.optionPrices || {};
    const modes  = product.fieldPriceModes || {};
    const opts   = product.options || {};
    let basePrice = product.startingPrice;
    let baseSet = false;
    for (const [field, mode] of Object.entries(modes)) {
      if (mode !== 'absolute') continue;
      if (!prices[field]) continue;
      const selKey = field === 'quantities' ? 'quantity' : field === 'widths' ? 'width' : field === 'heights' ? 'height' : field;
      const selVal = String(selections[selKey] !== undefined ? selections[selKey] : selections[field] !== undefined ? selections[field] : (opts[field] ? opts[field][0] : ''));
      if (prices[field][selVal] !== undefined) {
        if (!baseSet) { basePrice = prices[field][selVal]; baseSet = true; }
        else { basePrice += prices[field][selVal]; }
      }
    }
    let total = basePrice;
    for (const [field, mode] of Object.entries(modes)) {
      if (mode !== 'multiplier') continue;
      if (!prices[field]) continue;
      const selVal = String(selections[field] !== undefined ? selections[field] : (opts[field] ? opts[field][0] : ''));
      const mult = prices[field][selVal];
      if (mult !== undefined && mult > 0) total *= mult;
    }
    return Math.round(total * 100) / 100;
  }

  function calculatePrice(product, selections) {
    if (product.optionPrices && Object.keys(product.optionPrices).length > 0) {
      return calculateCustomPrice(product, selections);
    }
    const p = PRICING;
    let price = 0;
    const type = product.pricingType;

    if (type === 'flyer') {
      const ratio = product.startingPrice / 18;
      const qty = selections.quantity || 500;
      price = (p.flyer.base[qty] || 28) * ratio * (p.flyer.size[selections.size] || 1) * (p.flyer.paper[selections.paper] || 1) * (p.flyer.sides[selections.sides] || 1);
    } else if (type === 'cartao') {
      const ratio = product.startingPrice / 18;
      const qty = selections.quantity || 100;
      price = ((p.cartao.base[qty] || 18) * ratio * (p.cartao.finish[selections.finish] || 1) * (p.cartao.sides[selections.sides] || 1)) + ((p.cartao.corners[selections.corners] || 0) * ratio);
    } else if (type === 'folheto') {
      const ratio = product.startingPrice / 35;
      const qty = selections.quantity || 250;
      price = (p.folheto.base[qty] || 45) * ratio * (p.folheto.size[selections.size] || 1) * (p.folheto.fold[selections.fold] || 1) * (p.folheto.paper[selections.paper] || 1);
    } else if (type === 'envelope') {
      const ratio = product.startingPrice / 55;
      const qty = selections.quantity || 250;
      price = ((p.envelope.base[qty] || 55) * ratio * (p.envelope.size[selections.size] || 1) * (p.envelope.paper[selections.paper] || 1)) + ((p.envelope.window[selections.window] || 0) * ratio);
    } else if (type === 'autocolante') {
      const ratio = product.startingPrice / 12;
      const qty = selections.quantity || 50;
      price = (p.autocolante.base[qty] || 25) * ratio * (p.autocolante.size[selections.size] || 1) * (p.autocolante.material[selections.material] || 1) * (p.autocolante.finish[selections.finish] || 1);
    } else if (type === 'etiqueta') {
      const ratio = product.startingPrice / 22;
      const qty = selections.quantity || 100;
      price = (p.etiqueta.base[qty] || 32) * ratio * (p.etiqueta.size[selections.size] || 1) * (p.etiqueta.shape[selections.shape] || 1) * (p.etiqueta.material[selections.material] || 1);
    } else if (type === 'brinde-unidade') {
      const qty = selections.quantity || 50;
      price = product.startingPrice * qty * (p['brinde-unidade'].quantityDiscount[qty] || 1);
    } else if (type === 'rollup') {
      const sizeRatios = { '85x200cm': 1, '100x200cm': 1.187, '120x200cm': 1.44, '150x200cm': 1.84 };
      const size = selections.size || '85x200cm';
      const qty = selections.quantity || 1;
      price = product.startingPrice * (sizeRatios[size] || 1) * (p.rollup.material[selections.material] || 1) * qty * (p.rollup.qtyDiscount[qty] || 0.72);
    } else if (type === 'expositor') {
      const sizeRatios = { '3x3 Painéis (228x230cm)': 1, '5x3 Painéis (380x230cm)': 1.474, '7x3 Painéis (532x230cm)': 2.035 };
      const size = selections.size || '3x3 Painéis (228x230cm)';
      const qty = selections.quantity || 1;
      price = (product.startingPrice * (sizeRatios[size] || 1) + (p.expositor.accessories[selections.accessories] || 0)) * qty * (p.expositor.qtyDiscount[qty] || 0.8);
    } else if (type === 'area') {
      const w = parseFloat(selections.width) || 1;
      const h = parseFloat(selections.height) || 1;
      price = Math.max(w * h * product.startingPrice, product.options?.minPrice || 20);
    } else if (type === 'textil') {
      const subMap = { 'tshirt': 'tshirt', 'polo': 'polo', 'sweatshirt': 'sweatshirt' };
      const sub = subMap[product.subcategory] || 'tshirt';
      const ratio = product.startingPrice / p.textil[sub].base;
      const qty = selections.quantity || 10;
      const size = selections.size || 'M';
      const technique = selections.technique || selections.printTechnique || 'Impressão Digital';
      price = (p.textil[sub].base * ratio + p.textil[sub].printExtra * ratio) * (p.textil.sizeMultiplier[size] || 1) * (p.textil.techniqueMultiplier[technique] || 1) * qty * (p.textil.qtyDiscount[qty] || 1);
    }
    return Math.round(price * 100) / 100;
  }

  // ── Cart (localStorage) ─────────────────────
  function getCart() {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  function addToCart(product, selections, price) {
    const cart = getCart();
    cart.push({ cartId: Date.now(), productId: product.id, productName: product.name, productImage: product.image, selections, price, quantity: 1 });
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  }

  function removeFromCart(cartId) {
    const cart = getCart().filter(i => i.cartId !== cartId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  }

  function clearCart() { localStorage.removeItem(CART_KEY); }

  return {
    getProducts, getProduct, createProduct, updateProduct, deleteProduct, resetToSeed,
    getCategories, createCategory, updateCategory, deleteCategory,
    getDefaultPricingTypesList, getPricingTypes, createPricingType, updatePricingType, deletePricingType,
    calculatePrice,
    getCart, addToCart, removeFromCart, clearCart,
  };
})();
