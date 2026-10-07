const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
    currency: {
      type: String,
      enum: ["LKR"],
      default: "LKR",
    },
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
