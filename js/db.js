// =============================================
// DigiCores - Data Layer (localStorage)
// =============================================

const DigiDB = (() => {
  const PRODUCTS_KEY = 'digicores_products';
  const CART_KEY = 'digicores_cart';
  const CUSTOM_CATEGORIES_KEY       = 'digicores_custom_categories';
  const CATEGORY_OVERRIDES_KEY      = 'digicores_category_overrides';
  const HIDDEN_CATEGORIES_KEY       = 'digicores_hidden_categories';
  const CUSTOM_PRICING_TYPES_KEY    = 'digicores_custom_pricing_types';
  const PRICING_TYPE_OVERRIDES_KEY  = 'digicores_pricing_type_overrides';
  const HIDDEN_PRICING_TYPES_KEY    = 'digicores_hidden_pricing_types';

  const DEFAULT_CATEGORY_IDS = ['pequeno-formato','autocolantes','brindes','expositores','lonas','placas','texteis'];
  const DEFAULT_PRICING_TYPE_IDS = ['flyer','cartao','folheto','envelope','autocolante','etiqueta','brinde-unidade','rollup','expositor','area','textil'];

  // ── Seed Data ──────────────────────────────
  const seedProducts = [
    // ── PEQUENO FORMATO ──
    {
      id: 'flyers-a5',
      name: 'Flyers',
      category: 'pequeno-formato',
      subcategory: 'flyers',
      description: 'Flyers de alta qualidade para promoção do seu negócio. Impressão offset em papel premium, ideal para campanhas de marketing e distribuição em massa.',
      image: 'https://placehold.co/600x400/FF4500/white?text=Flyers',
      featured: true,
      active: true,
      pricingType: 'flyer',
      startingPrice: 18,
      options: {
        quantities: [100, 250, 500, 1000, 2500, 5000, 10000],
        sizes: ['A6', 'A5', 'A4', 'A3'],
        papers: ['90g', '115g', '135g', '170g'],
        sides: ['Simples', 'Frente e Verso']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'cartoes-visita',
      name: 'Cartões de Visita',
      category: 'pequeno-formato',
      subcategory: 'cartoes',
      description: 'Cartões de visita profissionais com acabamentos premium. Disponível em vários acabamentos para transmitir a melhor imagem da sua empresa.',
      image: 'https://placehold.co/600x400/1a1a2e/white?text=Cartões+de+Visita',
      featured: true,
      active: true,
      pricingType: 'cartao',
      startingPrice: 18,
      options: {
        quantities: [100, 250, 500, 1000],
        finishes: ['Mate', 'Brilhante', 'Soft Touch', 'Linho'],
        corners: ['Retos', 'Arredondados'],
        sides: ['Simples', 'Frente e Verso']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'folhetos',
      name: 'Folhetos Desdobráveis',
      category: 'pequeno-formato',
      subcategory: 'folhetos',
      description: 'Folhetos desdobráveis em formato bi-fold ou tri-fold. Perfeitos para menus, catálogos e apresentações de produtos ou serviços.',
      image: 'https://placehold.co/600x400/2d6a4f/white?text=Folhetos',
      featured: false,
      active: true,
      pricingType: 'folheto',
      startingPrice: 35,
      options: {
        quantities: [100, 250, 500, 1000, 2500],
        sizes: ['A5 Dobrado (A4)', 'A4 Dobrado (A3)'],
        folds: ['Bi-fold', 'Tri-fold', 'Z-fold'],
        papers: ['115g', '135g', '170g']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'envelopes',
      name: 'Envelopes Personalizados',
      category: 'pequeno-formato',
      subcategory: 'envelopes',
      description: 'Envelopes personalizados com impressão do logótipo e identidade da sua empresa. Disponíveis em vários formatos e gramaturas.',
      image: 'https://placehold.co/600x400/457b9d/white?text=Envelopes',
      featured: false,
      active: true,
      pricingType: 'envelope',
      startingPrice: 55,
      options: {
        quantities: [250, 500, 1000, 2500],
        sizes: ['DL (110x220mm)', 'C5 (162x229mm)', 'C4 (229x324mm)'],
        papers: ['80g', '90g', '120g'],
        windows: ['Sem Janela', 'Com Janela']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },

    // ── AUTOCOLANTES ──
    {
      id: 'autocolantes',
      name: 'Autocolantes Personalizados',
      category: 'autocolantes',
      subcategory: 'autocolantes',
      description: 'Autocolantes personalizados em vinil de alta durabilidade. Ideais para decoração, produto, embalagem ou promoção. Resistentes à água e ao exterior.',
      image: 'https://placehold.co/600x400/e63946/white?text=Autocolantes',
      featured: true,
      active: true,
      pricingType: 'autocolante',
      startingPrice: 12,
      options: {
        quantities: [10, 25, 50, 100, 250, 500],
        sizes: ['Pequeno (até 5x5cm)', 'Médio (até 10x10cm)', 'Grande (até 20x20cm)'],
        materials: ['Papel', 'Vinil Branco', 'Vinil Transparente'],
        finishes: ['Mate', 'Brilhante']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'etiquetas',
      name: 'Etiquetas',
      category: 'autocolantes',
      subcategory: 'etiquetas',
      description: 'Etiquetas personalizadas para produtos, embalagens e organização. Impressão digital de alta resolução com cores vibrantes e duradouras.',
      image: 'https://placehold.co/600x400/f4a261/white?text=Etiquetas',
      featured: false,
      active: true,
      pricingType: 'etiqueta',
      startingPrice: 22,
      options: {
        quantities: [50, 100, 250, 500, 1000],
        shapes: ['Redonda', 'Quadrada', 'Rectangular', 'Oval'],
        sizes: ['30mm', '50mm', '70mm', '100mm'],
        materials: ['Papel Brilhante', 'Papel Mate', 'Vinil']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },

    // ── BRINDES ──
    {
      id: 'canetas',
      name: 'Canetas Personalizadas',
      category: 'brindes',
      subcategory: 'canetas',
      description: 'Canetas personalizadas com o logótipo da sua empresa. Brindes corporativos de alta qualidade, ideais para oferta a clientes e colaboradores.',
      image: 'https://placehold.co/600x400/8338ec/white?text=Canetas',
      featured: false,
      active: true,
      pricingType: 'brinde-unidade',
      startingPrice: 0.85,
      options: {
        quantities: [50, 100, 250, 500, 1000],
        models: ['Esfera Clássica', 'Esfera Premium', 'Roller'],
        colors: ['Branco', 'Preto', 'Azul', 'Vermelho', 'Personalizável'],
        printAreas: ['1 Lado', '2 Lados']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'canecas',
      name: 'Canecas Personalizadas',
      category: 'brindes',
      subcategory: 'canecas',
      description: 'Canecas personalizadas em cerâmica de alta qualidade. Impressão sublimática com cores vibrantes e duradouras. Ideal para brindes corporativos.',
      image: 'https://placehold.co/600x400/06d6a0/white?text=Canecas',
      featured: true,
      active: true,
      pricingType: 'brinde-unidade',
      startingPrice: 5.50,
      options: {
        quantities: [12, 24, 48, 100],
        capacity: ['325ml Cerâmica', '440ml Cerâmica', '300ml Mágica'],
        printSides: ['1 Lado', 'Toda a Volta'],
        colors: ['Branca', 'Preta', 'Colorida']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'porta-chaves',
      name: 'Porta-Chaves',
      category: 'brindes',
      subcategory: 'porta-chaves',
      description: 'Porta-chaves personalizados em vários materiais e formatos. Excelente brinde corporativo e merchandising para eventos e promoções.',
      image: 'https://placehold.co/600x400/ffb703/black?text=Porta-Chaves',
      featured: false,
      active: true,
      pricingType: 'brinde-unidade',
      startingPrice: 1.20,
      options: {
        quantities: [50, 100, 250, 500],
        materials: ['PVC', 'Metal', 'Madeira', 'Acrílico'],
        shapes: ['Redondo', 'Rectangular', 'Personalizado'],
        printSides: ['1 Lado', '2 Lados']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },

    // ── EXPOSITORES ──
    {
      id: 'roll-up',
      name: 'Roll-Up',
      category: 'expositores',
      subcategory: 'roll-up',
      description: 'Roll-ups de alta qualidade para feiras, eventos e pontos de venda. Impressão em lona premium com base resistente e saco de transporte incluído.',
      image: 'https://placehold.co/600x400/023e8a/white?text=Roll-Up',
      featured: true,
      active: true,
      pricingType: 'rollup',
      startingPrice: 75,
      options: {
        sizes: ['85x200cm', '100x200cm', '120x200cm', '150x200cm'],
        quantities: [1, 2, 3, 5, 10],
        materials: ['Lona Standard', 'Lona Premium', 'Lona Backlit']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'popup-display',
      name: 'Pop-Up Display',
      category: 'expositores',
      subcategory: 'popup',
      description: 'Sistema de exposição pop-up ideal para feiras e eventos. Montagem rápida, portátil e com gráficos em lona de alta definição.',
      image: 'https://placehold.co/600x400/3a0ca3/white?text=Pop-Up+Display',
      featured: false,
      active: true,
      pricingType: 'expositor',
      startingPrice: 285,
      options: {
        sizes: ['3x3 Painéis (228x230cm)', '5x3 Painéis (380x230cm)', '7x3 Painéis (532x230cm)'],
        quantities: [1, 2, 5],
        accessories: ['Sem Iluminação', 'Com Iluminação LED', 'Com Balcão']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },

    // ── LONAS ──
    {
      id: 'lona-standard',
      name: 'Lona Standard',
      category: 'lonas',
      subcategory: 'lona-standard',
      description: 'Lonas de impressão de grande formato, ideais para publicidade exterior, eventos e decoração. Material resistente a intempéries com acabamento em ilhós.',
      image: 'https://placehold.co/600x400/e9c46a/black?text=Lona+Standard',
      featured: false,
      active: true,
      pricingType: 'area',
      startingPrice: 12,
      priceUnit: '€/m²',
      options: {
        widths: [0.5, 1, 1.5, 2, 2.5, 3, 4, 5],
        heights: [0.5, 1, 1.5, 2, 2.5, 3],
        material: 'Lona 440g/m² (Standard)',
        finishes: ['Sem Acabamento', 'Com Ilhós', 'Com Ilhós e Reforço'],
        minPrice: 20
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'lona-blackout',
      name: 'Lona Blackout',
      category: 'lonas',
      subcategory: 'lona-blackout',
      description: 'Lona opaca blackout para uso em vitrines, interiores e locais com iluminação intensa. Impressão de alta resolução em ambos os lados.',
      image: 'https://placehold.co/600x400/264653/white?text=Lona+Blackout',
      featured: false,
      active: true,
      pricingType: 'area',
      startingPrice: 18,
      priceUnit: '€/m²',
      options: {
        widths: [0.5, 1, 1.5, 2, 2.5, 3, 4, 5],
        heights: [0.5, 1, 1.5, 2, 2.5, 3],
        material: 'Lona Blackout 510g/m²',
        finishes: ['Sem Acabamento', 'Com Ilhós', 'Com Ilhós e Reforço'],
        minPrice: 30
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },

    // ── PLACAS ──
    {
      id: 'placa-pvc',
      name: 'Placa PVC',
      category: 'placas',
      subcategory: 'placa-pvc',
      description: 'Placas em PVC expandido para sinalética interior e exterior. Material leve, resistente e de fácil instalação. Impressão UV de alta resolução.',
      image: 'https://placehold.co/600x400/2b9348/white?text=Placa+PVC',
      featured: false,
      active: true,
      pricingType: 'area',
      startingPrice: 18,
      priceUnit: '€/m²',
      options: {
        widths: [0.3, 0.5, 0.7, 1, 1.5, 2],
        heights: [0.2, 0.3, 0.5, 0.7, 1, 1.5],
        thicknesses: ['3mm', '5mm', '10mm'],
        finishes: ['Brilhante', 'Mate'],
        minPrice: 15
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'placa-aluminio',
      name: 'Placa Alumínio Dibond',
      category: 'placas',
      subcategory: 'placa-aluminio',
      description: 'Placas em alumínio composto Dibond, ideais para sinalética de exterior de longa duração. Material rígido, leve e com excelente resistência às intempéries.',
      image: 'https://placehold.co/600x400/495057/white?text=Placa+Alumínio',
      featured: false,
      active: true,
      pricingType: 'area',
      startingPrice: 35,
      priceUnit: '€/m²',
      options: {
        widths: [0.3, 0.5, 0.7, 1, 1.5, 2],
        heights: [0.2, 0.3, 0.5, 0.7, 1, 1.5],
        thicknesses: ['3mm'],
        finishes: ['Brilhante', 'Mate', 'Escovado'],
        minPrice: 25
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },

    // ── TÊXTEIS ──
    {
      id: 'tshirt',
      name: 'T-Shirt Personalizada',
      category: 'texteis',
      subcategory: 'tshirt',
      description: 'T-shirts personalizadas de alta qualidade em algodão 100%. Impressão digital ou serigrafia com cores vibrantes e duradouras. Ideal para equipas, eventos e merchandising.',
      image: 'https://placehold.co/600x400/d62828/white?text=T-Shirt',
      featured: true,
      active: true,
      pricingType: 'textil',
      startingPrice: 8.50,
      options: {
        quantities: [5, 10, 20, 50, 100],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        printTypes: ['Frente', 'Costas', 'Frente e Costas', 'Frente + Manga'],
        printTechniques: ['Impressão Digital', 'Serigrafia 1 cor', 'Serigrafia 2 cores', 'Serigrafia 4 cores'],
        fabrics: ['Algodão 100% 150g', 'Algodão 100% 180g', 'Poliéster 100%']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'polo',
      name: 'Polo Personalizado',
      category: 'texteis',
      subcategory: 'polo',
      description: 'Polos personalizados para uniformes corporativos e equipas. Bordado ou impressão de alta qualidade. Material 100% algodão piqué para máximo conforto.',
      image: 'https://placehold.co/600x400/003049/white?text=Polo',
      featured: false,
      active: true,
      pricingType: 'textil',
      startingPrice: 14,
      options: {
        quantities: [5, 10, 20, 50, 100],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        printTypes: ['Peito Esquerdo', 'Costas', 'Peito Esquerdo + Costas'],
        printTechniques: ['Bordado', 'Impressão Digital', 'Serigrafia'],
        fabrics: ['Piqué 100% Algodão 200g', 'Piqué Premium 220g']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'sweatshirt',
      name: 'Sweatshirt Personalizada',
      category: 'texteis',
      subcategory: 'sweatshirt',
      description: 'Sweatshirts personalizadas em algodão felpado. Perfeitas para equipas, eventos e merchandising. Disponíveis com ou sem capuz.',
      image: 'https://placehold.co/600x400/560bad/white?text=Sweatshirt',
      featured: false,
      active: true,
      pricingType: 'textil',
      startingPrice: 18,
      options: {
        quantities: [5, 10, 20, 50, 100],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        types: ['Sem Capuz', 'Com Capuz (Hoodie)', 'Zíper Completo'],
        printTypes: ['Frente', 'Costas', 'Frente e Costas'],
        printTechniques: ['Impressão Digital', 'Bordado', 'Serigrafia']
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ];

  // ── Pricing Engine ─────────────────────────
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
      // Price per unit decreasing with quantity
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
      base: {
        '3x3 Painéis (228x230cm)': 285,
        '5x3 Painéis (380x230cm)': 420,
        '7x3 Painéis (532x230cm)': 580
      },
      accessories: { 'Sem Iluminação': 0, 'Com Iluminação LED': 85, 'Com Balcão': 120 },
      qtyDiscount: { 1: 1, 2: 0.9, 5: 0.8 }
    },
    area: {
      // pricePerSqM from product.startingPrice
      minPrice: 20
    },
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

  // ── Custom Price Engine (used when product.optionPrices is defined) ──────
  function calculateCustomPrice(product, selections) {
    const prices = product.optionPrices || {};
    const modes  = product.fieldPriceModes || {};
    const opts   = product.options || {};

    // Step 1: find the base price from the 'absolute' field (usually quantities)
    let basePrice = product.startingPrice;
    for (const [field, mode] of Object.entries(modes)) {
      if (mode !== 'absolute') continue;
      if (!prices[field]) continue;
      // Map field name to selection key
      const selKey = field === 'quantities' ? 'quantity'
                   : field === 'widths'     ? 'width'
                   : field === 'heights'    ? 'height'
                   : field;
      const selVal = String(selections[selKey] !== undefined ? selections[selKey]
                   : selections[field] !== undefined ? selections[field]
                   : (opts[field] ? opts[field][0] : ''));
      if (prices[field][selVal] !== undefined) {
        basePrice = prices[field][selVal];
        break; // only one absolute field drives the base
      }
    }

    // Step 2: apply multipliers from all 'multiplier' fields
    let total = basePrice;
    for (const [field, mode] of Object.entries(modes)) {
      if (mode !== 'multiplier') continue;
      if (!prices[field]) continue;
      const selKey = field;
      const selVal = String(selections[selKey] !== undefined ? selections[selKey]
                   : (opts[field] ? opts[field][0] : ''));
      const mult = prices[field][selVal];
      if (mult !== undefined && mult > 0) total *= mult;
    }

    return Math.round(total * 100) / 100;
  }

  // ── Calculate Price ─────────────────────────
  function calculatePrice(product, selections) {
    // Use custom pricing engine if optionPrices is defined
    if (product.optionPrices && Object.keys(product.optionPrices).length > 0) {
      return calculateCustomPrice(product, selections);
    }
    const p = PRICING;
    let price = 0;
    const type = product.pricingType;

    if (type === 'flyer') {
      const originalMin = 18; // base para 100 unidades A6 simples
      const ratio = product.startingPrice / originalMin;
      const qty = selections.quantity || 500;
      const base = (p.flyer.base[qty] || 28) * ratio;
      const size = p.flyer.size[selections.size] || 1;
      const paper = p.flyer.paper[selections.paper] || 1;
      const sides = p.flyer.sides[selections.sides] || 1;
      price = base * size * paper * sides;

    } else if (type === 'cartao') {
      const originalMin = 18; // base para 100 unidades
      const ratio = product.startingPrice / originalMin;
      const qty = selections.quantity || 100;
      const base = (p.cartao.base[qty] || 18) * ratio;
      const finish = p.cartao.finish[selections.finish] || 1;
      const corners = (p.cartao.corners[selections.corners] || 0) * ratio;
      const sides = p.cartao.sides[selections.sides] || 1;
      price = (base * finish * sides) + corners;

    } else if (type === 'folheto') {
      const originalMin = 35; // base para 100 unidades
      const ratio = product.startingPrice / originalMin;
      const qty = selections.quantity || 250;
      const base = (p.folheto.base[qty] || 45) * ratio;
      const size = p.folheto.size[selections.size] || 1;
      const fold = p.folheto.fold[selections.fold] || 1;
      const paper = p.folheto.paper[selections.paper] || 1;
      price = base * size * fold * paper;

    } else if (type === 'envelope') {
      const originalMin = 55; // base para 250 unidades DL
      const ratio = product.startingPrice / originalMin;
      const qty = selections.quantity || 250;
      const base = (p.envelope.base[qty] || 55) * ratio;
      const size = p.envelope.size[selections.size] || 1;
      const paper = p.envelope.paper[selections.paper] || 1;
      const window = (p.envelope.window[selections.window] || 0) * ratio;
      price = (base * size * paper) + window;

    } else if (type === 'autocolante') {
      const originalMin = 12; // base para 10 unidades
      const ratio = product.startingPrice / originalMin;
      const qty = selections.quantity || 50;
      const base = (p.autocolante.base[qty] || 25) * ratio;
      const size = p.autocolante.size[selections.size] || 1;
      const material = p.autocolante.material[selections.material] || 1;
      const finish = p.autocolante.finish[selections.finish] || 1;
      price = base * size * material * finish;

    } else if (type === 'etiqueta') {
      const originalMin = 22; // base para 50 unidades
      const ratio = product.startingPrice / originalMin;
      const qty = selections.quantity || 100;
      const base = (p.etiqueta.base[qty] || 32) * ratio;
      const size = p.etiqueta.size[selections.size] || 1;
      const shape = p.etiqueta.shape[selections.shape] || 1;
      const material = p.etiqueta.material[selections.material] || 1;
      price = base * size * shape * material;

    } else if (type === 'brinde-unidade') {
      // Preço unitário vem sempre do startingPrice definido pelo admin
      const baseUnit = product.startingPrice;
      const qty = selections.quantity || 50;
      const discount = p['brinde-unidade'].quantityDiscount[qty] || 1;
      price = baseUnit * qty * discount;

    } else if (type === 'rollup') {
      // startingPrice = preço do tamanho mais pequeno; outros tamanhos escalam proporcionalmente
      const sizeRatios = { '85x200cm': 1, '100x200cm': 1.187, '120x200cm': 1.44, '150x200cm': 1.84 };
      const size = selections.size || '85x200cm';
      const base = product.startingPrice * (sizeRatios[size] || 1);
      const material = p.rollup.material[selections.material] || 1;
      const qty = selections.quantity || 1;
      const qtyD = p.rollup.qtyDiscount[qty] || 0.72;
      price = base * material * qty * qtyD;

    } else if (type === 'expositor') {
      // startingPrice = preço do expositor mais pequeno; outros escalam proporcionalmente
      const sizeRatios = {
        '3x3 Painéis (228x230cm)': 1,
        '5x3 Painéis (380x230cm)': 1.474,
        '7x3 Painéis (532x230cm)': 2.035
      };
      const size = selections.size || Object.keys(sizeRatios)[0];
      const base = product.startingPrice * (sizeRatios[size] || 1);
      const acc = p.expositor.accessories[selections.accessories] || 0;
      const qty = selections.quantity || 1;
      const qtyD = p.expositor.qtyDiscount[qty] || 0.8;
      price = (base + acc) * qty * qtyD;

    } else if (type === 'area') {
      const w = parseFloat(selections.width) || 1;
      const h = parseFloat(selections.height) || 1;
      const area = w * h;
      const pricePerSqM = product.startingPrice;
      const minPrice = product.options?.minPrice || 20;
      price = Math.max(area * pricePerSqM, minPrice);

    } else if (type === 'textil') {
      const subMap = { 'tshirt': 'tshirt', 'polo': 'polo', 'sweatshirt': 'sweatshirt' };
      const sub = subMap[product.subcategory] || 'tshirt';
      const originalBase = p.textil[sub].base;
      const ratio = product.startingPrice / originalBase;
      const base = originalBase * ratio; // = product.startingPrice
      const printExtra = p.textil[sub].printExtra * ratio;
      const qty = selections.quantity || 10;
      const size = selections.size || 'M';
      const technique = selections.technique || selections.printTechnique || 'Impressão Digital';

      const sizeM = p.textil.sizeMultiplier[size] || 1;
      const qtyD = p.textil.qtyDiscount[qty] || 1;
      const techM = p.textil.techniqueMultiplier[technique] || 1;

      const unitPrice = (base + printExtra) * sizeM * techM;
      price = unitPrice * qty * qtyD;
    }

    return Math.round(price * 100) / 100;
  }

  // ── Storage Helpers ─────────────────────────
  function getProducts() {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seedProducts));
    return seedProducts;
  }

  function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }

  function getProduct(id) {
    return getProducts().find(p => p.id === id) || null;
  }

  function createProduct(data) {
    const products = getProducts();
    const id = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    const product = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(product);
    saveProducts(products);
    return product;
  }

  function updateProduct(id, data) {
    const products = getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...data, id, updatedAt: new Date().toISOString() };
    saveProducts(products);
    return products[idx];
  }

  function deleteProduct(id) {
    const products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
  }

  function getCategories() {
    const DEFAULTS = [
      { id: 'pequeno-formato', name: 'Pequeno Formato', icon: '🗒️' },
      { id: 'autocolantes',    name: 'Autocolantes',    icon: '🏷️' },
      { id: 'brindes',         name: 'Brindes',         icon: '🎁' },
      { id: 'expositores',     name: 'Expositores',     icon: '🖼️' },
      { id: 'lonas',           name: 'Lonas',           icon: '🎪' },
      { id: 'placas',          name: 'Placas',          icon: '🪧' },
      { id: 'texteis',         name: 'Têxteis',         icon: '👕' }
    ];
    const overrides = JSON.parse(localStorage.getItem(CATEGORY_OVERRIDES_KEY) || '{}');
    const hidden    = JSON.parse(localStorage.getItem(HIDDEN_CATEGORIES_KEY)  || '[]');
    const custom    = JSON.parse(localStorage.getItem(CUSTOM_CATEGORIES_KEY)  || '[]');
    const defaults  = DEFAULTS
      .filter(c => !hidden.includes(c.id))
      .map(c => overrides[c.id] ? { ...c, ...overrides[c.id] } : c);
    return [...defaults, ...custom];
  }

  function createCategory(data) {
    const custom = JSON.parse(localStorage.getItem(CUSTOM_CATEGORIES_KEY) || '[]');
    custom.push(data);
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(custom));
    return data;
  }

  function updateCategory(id, data) {
    if (DEFAULT_CATEGORY_IDS.includes(id)) {
      const overrides = JSON.parse(localStorage.getItem(CATEGORY_OVERRIDES_KEY) || '{}');
      overrides[id] = { ...(overrides[id] || {}), ...data };
      localStorage.setItem(CATEGORY_OVERRIDES_KEY, JSON.stringify(overrides));
      return { id, ...data };
    }
    const custom = JSON.parse(localStorage.getItem(CUSTOM_CATEGORIES_KEY) || '[]');
    const idx = custom.findIndex(c => c.id === id);
    if (idx === -1) return null;
    custom[idx] = { ...custom[idx], ...data };
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(custom));
    return custom[idx];
  }

  function deleteCategory(id) {
    if (DEFAULT_CATEGORY_IDS.includes(id)) {
      const hidden = JSON.parse(localStorage.getItem(HIDDEN_CATEGORIES_KEY) || '[]');
      if (!hidden.includes(id)) { hidden.push(id); localStorage.setItem(HIDDEN_CATEGORIES_KEY, JSON.stringify(hidden)); }
    } else {
      const custom = JSON.parse(localStorage.getItem(CUSTOM_CATEGORIES_KEY) || '[]');
      localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(custom.filter(c => c.id !== id)));
    }
  }

  function getDefaultPricingTypesList() {
    const DEFAULTS = [
      { id: 'flyer',          name: 'Flyer',                desc: 'qty + tamanho + papel' },
      { id: 'cartao',         name: 'Cartão de Visita',     desc: 'qty + acabamento' },
      { id: 'folheto',        name: 'Folheto Desdobrável',  desc: 'qty + dobra' },
      { id: 'envelope',       name: 'Envelope',             desc: 'qty + formato' },
      { id: 'autocolante',    name: 'Autocolante',          desc: 'qty + tamanho + material' },
      { id: 'etiqueta',       name: 'Etiqueta',             desc: 'qty + forma + material' },
      { id: 'brinde-unidade', name: 'Brinde por Unidade',   desc: 'qty × preço/un.' },
      { id: 'rollup',         name: 'Roll-Up / Expositor',  desc: 'tamanho + material' },
      { id: 'expositor',      name: 'Expositor Pop-Up',     desc: 'tamanho + acessórios' },
      { id: 'area',           name: 'Área (€/m²)',          desc: 'lonas, placas' },
      { id: 'textil',         name: 'Têxtil',               desc: 'qty + tamanho + técnica' },
    ];
    const overrides = JSON.parse(localStorage.getItem(PRICING_TYPE_OVERRIDES_KEY) || '{}');
    const hidden    = JSON.parse(localStorage.getItem(HIDDEN_PRICING_TYPES_KEY)   || '[]');
    return DEFAULTS
      .filter(t => !hidden.includes(t.id))
      .map(t => overrides[t.id] ? { ...t, ...overrides[t.id] } : t);
  }

  function getPricingTypes() {
    return JSON.parse(localStorage.getItem(CUSTOM_PRICING_TYPES_KEY) || '[]');
  }

  function createPricingType(data) {
    const types = JSON.parse(localStorage.getItem(CUSTOM_PRICING_TYPES_KEY) || '[]');
    types.push(data);
    localStorage.setItem(CUSTOM_PRICING_TYPES_KEY, JSON.stringify(types));
    return data;
  }

  function updatePricingType(id, data) {
    if (DEFAULT_PRICING_TYPE_IDS.includes(id)) {
      const overrides = JSON.parse(localStorage.getItem(PRICING_TYPE_OVERRIDES_KEY) || '{}');
      overrides[id] = { ...(overrides[id] || {}), ...data };
      localStorage.setItem(PRICING_TYPE_OVERRIDES_KEY, JSON.stringify(overrides));
      return { id, ...data };
    }
    const types = JSON.parse(localStorage.getItem(CUSTOM_PRICING_TYPES_KEY) || '[]');
    const idx = types.findIndex(t => t.id === id);
    if (idx === -1) return null;
    types[idx] = { ...types[idx], ...data };
    localStorage.setItem(CUSTOM_PRICING_TYPES_KEY, JSON.stringify(types));
    return types[idx];
  }

  function deletePricingType(id) {
    if (DEFAULT_PRICING_TYPE_IDS.includes(id)) {
      const hidden = JSON.parse(localStorage.getItem(HIDDEN_PRICING_TYPES_KEY) || '[]');
      if (!hidden.includes(id)) { hidden.push(id); localStorage.setItem(HIDDEN_PRICING_TYPES_KEY, JSON.stringify(hidden)); }
    } else {
      const types = JSON.parse(localStorage.getItem(CUSTOM_PRICING_TYPES_KEY) || '[]');
      localStorage.setItem(CUSTOM_PRICING_TYPES_KEY, JSON.stringify(types.filter(t => t.id !== id)));
    }
  }

  // ── Cart ────────────────────────────────────
  function getCart() {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  function addToCart(product, selections, price) {
    const cart = getCart();
    const item = {
      cartId: Date.now(),
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      selections,
      price,
      quantity: 1
    };
    cart.push(item);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  }

  function removeFromCart(cartId) {
    const cart = getCart().filter(i => i.cartId !== cartId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
  }

  function resetToSeed() {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seedProducts));
  }

  return {
    getProducts, getProduct, createProduct, updateProduct, deleteProduct,
    getCategories, createCategory, updateCategory, deleteCategory,
    getDefaultPricingTypesList, getPricingTypes, createPricingType, updatePricingType, deletePricingType,
    calculatePrice,
    getCart, addToCart, removeFromCart, clearCart, resetToSeed
  };
})();
