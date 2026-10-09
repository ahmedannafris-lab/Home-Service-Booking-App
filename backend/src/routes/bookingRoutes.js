const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/authMiddleware");
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  cancelBooking,
} = require("../controllers/bookingController");

// Customer: create and view own bookings
router.post("/", auth, createBooking);
router.get("/", auth, getBookings);
router.get("/:id", auth, getBookingById);
router.put("/:id/cancel", auth, cancelBooking);

// Admin/Provider: update status, delete
router.put("/:id/status", auth, requireRole("admin", "provider"), updateBookingStatus);
router.delete("/:id", auth, requireRole("admin"), deleteBooking);

module.exports = router;