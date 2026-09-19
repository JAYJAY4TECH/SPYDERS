const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 120 },
  slug:        { type: String, unique: true, index: true },
  description: { type: String, default: '', maxlength: 5000 },
  price:       { type: Number, required: true, min: 0 },
  salePrice:   { type: Number, default: null, min: 0 },
  images:      { type: [String], default: [] },
  category:    { type: String, required: true, enum: ['T-Shirts','Hoodies','Shirts','Trousers','Jackets','Accessories'], index: true },
  collection:  { type: String, default: 'Essentials', index: true },
  sizes:       { type: [String], default: ['S','M','L','XL'] },
  colors:      { type: [{ name: String, hex: String }], default: [] },
  stock:       { type: Number, default: 0, min: 0 },
  featured:    { type: Boolean, default: false, index: true },
  newArrival:  { type: Boolean, default: false, index: true },
  bestSeller:  { type: Boolean, default: false, index: true },
  keywords:    { type: [String], default: [] },
  materials:   { type: String, default: '100% Cotton' },
  shippingInfo:{ type: String, default: 'Ships within 2-5 business days across Nigeria.' },
  returnsInfo: { type: String, default: '14-day returns on unworn items with original tags.' }
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (this.isModified('name') || this.isModified('category') || this.isModified('collection')) {
    const base = (this.name + ' ' + this.category + ' ' + this.collection).toLowerCase();
    this.keywords = [...new Set(base.split(/\s+/).filter(Boolean))];
  }
  next();
});

productSchema.virtual('finalPrice').get(function () {
  return this.salePrice && this.salePrice < this.price ? this.salePrice : this.price;
});

productSchema.set('toJSON',   { virtuals: true });
productSchema.set('toObject', { virtuals: true });
productSchema.index({ name: 'text', description: 'text', category: 'text', collection: 'text' });

module.exports = mongoose.model('Product', productSchema);
