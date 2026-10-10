const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // One review per booking
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialistId: {
      type: String, // specialist slug id
      required: true,
      index: true,
    },
    serviceId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    authorName: { type: String, default: "" },
    authorInitials: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

// After saving a review, update specialist rating
reviewSchema.post("save", async function () {
  try {
    const Specialist = mongoose.model("Specialist");
    const reviews = await mongoose.model("Review").find({ specialistId: this.specialistId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Specialist.findOneAndUpdate(
      { id: this.specialistId },
      { rating: Math.round(avg * 100) / 100, reviewsCount: reviews.length }
    );
  } catch (_) {}
});

module.exports = mongoose.model("Review", reviewSchema);
