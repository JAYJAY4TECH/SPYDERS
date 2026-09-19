const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  slug:     String,
  image:    String,
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size:     { type: String, default: '' },
  color:    { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId:      { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true, trim: true },
  email:        { type: String, required: true, lowercase: true, trim: true },
  phone:        { type: String, required: true, trim: true },
  country:      { type: String, required: true, default: 'Nigeria' },
  state:        { type: String, required: true },
  city:         { type: String, required: true },
  address:      { type: String, required: true },
  items:        { type: [orderItemSchema], required: true },
  subtotal:     { type: Number, required: true },
  shipping:     { type: Number, required: true, default: 0 },
  total:        { type: Number, required: true },
  paymentReference: { type: String, default: null, index: true },
  paymentStatus:    { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending', index: true },
  paidAt:       { type: Date, default: null },
  orderStatus:  { type: String, enum: ['Pending','Paid','Processing','Shipped','Delivered','Cancelled'], default: 'Pending', index: true },
  notes:        { type: String, default: '' }
}, { timestamps: true });

orderSchema.pre('validate', function (next) {
  if (!this.orderId) {
    const stamp = Date.now().toString(36).toUpperCase();
    const rand  = Math.random().toString(36).slice(2, 6).toUpperCase();
    this.orderId = 'SPY-' + stamp + '-' + rand;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
