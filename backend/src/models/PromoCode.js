const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("PromoCode", promoSchema);