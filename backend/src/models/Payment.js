const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    method: {
      type: String,
      enum: ["card", "online", "cash"],
      required: true,
    },
    cardLastFour: { type: String, match: /^\d{4}$/ },
    onlineProvider: { type: String, enum: ["genie", "ezcash", "bank"] },
    mobileLastFour: { type: String, match: /^\d{4}$/ },
    status: {
      type: String,
      enum: ["demo_paid", "due", "paid", "failed", "refunded"],
      required: true,
    },
    amountMinor: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "LKR",
    },
    transactionRef: {
      type: String,
      default: null,
    },
    demo: {
      type: Boolean,
      default: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
