const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () { return this.amountMinor != null; },
      index: true,
    },
    serviceId: {
      type: String,
      required: true,
    },
    serviceTitle: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    amountMinor: {
      type: Number,
      required: function () { return this.customerId != null; },
      min: 0,
      validate: Number.isSafeInteger,
    },
    currency: {
      type: String,
      enum: ["LKR"],
      default: "LKR",
    },
    categoryName: { type: String },
    price: { type: Number, min: 0 },
    discount: { type: Number, min: 0, default: 0 },
    finalPrice: { type: Number, min: 0 },
    specialist: {
      name: String,
      title: String,
      avatar: String,
    },
    specialistId: { type: mongoose.Schema.Types.ObjectId, ref: "Specialist", default: null },
    status: {
      type: String,
      enum: [
        "scheduled",
        "transit",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
