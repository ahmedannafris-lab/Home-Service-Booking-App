const Review = require("../models/Review");
const Booking = require("../models/Booking");

exports.submitReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({ success: false, message: "bookingId and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (booking.status !== "completed") {
      return res.status(409).json({ success: false, message: "Can only review completed bookings" });
    }

    // Check duplicate
    const existing = await Review.findOne({ bookingId });
    if (existing) return res.status(409).json({ success: false, message: "You already reviewed this booking" });

    const nameParts = req.user.fullName.split(" ");
    const initials = nameParts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);

    const review = await Review.create({
      bookingId,
      authorId: req.user._id,
      specialistId: booking.specialistId || "kamal",
      serviceId: booking.serviceId,
      rating,
      comment: comment || "",
      authorName: req.user.fullName,
      authorInitials: initials,
      location: req.user.city || "",
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Already reviewed" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSpecialistReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ specialistId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
