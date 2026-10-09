const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    categoryId: { type: String, required: true, index: true },
    scope: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },
    referenceNo: { type: String, default: "" },
    feePaid: { type: Boolean, default: false },
    feeAmount: { type: String, default: "LKR 1,000" },
    icon: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    city: { type: String, default: "" },
    serviceAreas: [{ type: String }],
    verifiedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
    submittedDate: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Provider", providerSchema);
