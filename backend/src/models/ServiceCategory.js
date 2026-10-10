const mongoose = require("mongoose");

const serviceCategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // slug e.g. "plumbing"
    name: { type: String, required: true },
    icon: { type: String, default: "" },
    specCount: { type: Number, default: 0 },
    heroImage: { type: String, default: "" },
    heroTagline: { type: String, default: "" },
    heroSubtag: { type: String, default: "" },
    heroHeadline: { type: String, default: "" },
    heroBadges: [{ type: String }],
    availableToday: { type: Number, default: 0 },
    filterPills: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
