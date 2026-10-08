const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  cancelBooking
} = require("../controllers/bookingController");

// CREATE
router.post("/", createBooking);

// READ
router.get("/", getBookings);
router.get("/:id", getBookingById);

// UPDATE - Status (admin)
router.put("/:id/status", updateBookingStatus);

// CANCEL (customer)
router.put("/:id/cancel", cancelBooking);

// DELETE (admin)
router.delete("/:id", deleteBooking);

module.exports = router;