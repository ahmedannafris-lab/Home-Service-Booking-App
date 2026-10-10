const Booking = require("../models/Booking");

// CREATE - අලුත් booking එකක්
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// READ - සියලු bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// READ - එක booking එකක්
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE - Status update කරන්න (admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "scheduled",
      "transit",
      "in_progress",
      "completed",
      "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed: " + allowedStatuses.join(", ")
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE - Booking එකක් delete කරන්න (admin)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }
    res.json({
      message: "Booking deleted successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// CANCEL - Booking cancel කරන්න (customer)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "cancelled"
      },
      {
        new: true
      }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};