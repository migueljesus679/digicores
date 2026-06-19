const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, default: '' },
  subcategory: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  pricingType: { type: String, default: '' },
  startingPrice: { type: Number, default: 0 },
  priceUnit: { type: String, default: '' },
  options: { type: mongoose.Schema.Types.Mixed, default: {} },
  optionPrices: { type: mongoose.Schema.Types.Mixed, default: {} },
  fieldPriceModes: { type: mongoose.Schema.Types.Mixed, default: {} },
  optionLabels: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
