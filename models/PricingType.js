const mongoose = require('mongoose');

const PricingTypeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  desc: { type: String, default: '' },
  isDefault: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  order: { type: Number, default: 999 },
}, { timestamps: true });

module.exports = mongoose.model('PricingType', PricingTypeSchema);
