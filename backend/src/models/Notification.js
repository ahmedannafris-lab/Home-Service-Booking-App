const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "booking_confirmed",
        "specialist_en_route",
        "specialist_arrived",
        "booking_completed",
        "booking_assigned",
        "provider_verified",
        "provider_rejected",
        "new_message",
        "promo",
        "system",
      ],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
    data: { type: mongoose.Schema.Types.Mixed, default: null }, // Extra payload
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
