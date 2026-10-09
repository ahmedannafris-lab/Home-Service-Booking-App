const Message = require("../models/Message");
const Booking = require("../models/Booking");

exports.getThread = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // Only customer or admin can read
    if (
      req.user.role !== "admin" &&
      booking.customerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const messages = await Message.find({ bookingId })
      .sort({ createdAt: 1 })
      .populate("senderId", "fullName avatarUrl role");

    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Message text is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const message = await Message.create({
      bookingId,
      senderId: req.user._id,
      senderRole: req.user.role,
      text: text.trim(),
    });

    // Emit via socket if io is attached to app
    const io = req.app.get("io");
    if (io) {
      io.to(`booking:${bookingId}`).emit("new_message", {
        ...message.toObject(),
        senderName: req.user.fullName,
      });
    }

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Message.updateMany(
      { bookingId, senderId: { $ne: req.user._id }, read: false },
      { read: true }
    );
    res.json({ success: true, message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
