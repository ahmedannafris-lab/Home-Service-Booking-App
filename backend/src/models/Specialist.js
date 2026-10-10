const mongoose = require("mongoose");

const specialistSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // slug e.g. "kamal"
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      default: null,
    },
    name: { type: String, required: true },
    title: { type: String, default: "" },
    experience: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    jobsCompleted: { type: Number, default: 0 },
    distance: { type: String, default: "" },
    eta: { type: String, default: "" },
    avatar: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Live Now", "Available Today", "On Job"],
      default: "Available Today",
    },
    bio: { type: String, default: "" },
    skills: [{ type: String }],
    categoryId: { type: String, default: "", index: true },
    currentLat: { type: Number, default: null },
    currentLng: { type: Number, default: null },
    lastLocationAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Specialist", specialistSchema);
