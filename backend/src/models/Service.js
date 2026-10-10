const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // slug e.g. "pipe-installation"
    categoryId: { type: String, required: true, index: true },
    categoryName: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    badge: { type: String, default: null },
    badgeType: {
      type: String,
      enum: ["primary", "secondary", "warning", "tertiary"],
      default: null,
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    duration: { type: String, default: "" },
    features: [{ type: String }],
    includesList: [{ type: String }],
    image: { type: String, default: "" },
    specialistId: { type: String, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
