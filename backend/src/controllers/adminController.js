const User = require("../models/User");
const Booking = require("../models/Booking");
const Provider = require("../models/Provider");
const Payment = require("../models/Payment");

exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalProviders,
      pendingProviders,
      verifiedProviders,
      totalBookings,
      scheduledBookings,
      completedBookings,
      cancelledBookings,
      totalPayments,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      Provider.countDocuments(),
      Provider.countDocuments({ status: "pending" }),
      Provider.countDocuments({ status: "verified" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "scheduled" }),
      Booking.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: "cancelled" }),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amountMinor" } } }]),
    ]);

    const totalRevenueLKR = totalPayments[0]
      ? Math.round(totalPayments[0].total / 100)
      : 0;

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, active: activeUsers },
        providers: { total: totalProviders, pending: pendingProviders, verified: verifiedProviders },
        bookings: {
          total: totalBookings,
          scheduled: scheduledBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
        },
        revenue: { totalLKR: totalRevenueLKR },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.role) filter.role = req.query.role;
    if (req.query.city) filter.city = new RegExp(req.query.city, "i");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({ success: true, data: users, meta: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const bookings = await Booking.find({ customerId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({ success: true, data: { ...user.toObject(), recentBookings: bookings } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ success: false, message: "status must be 'active' or 'inactive'" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "inactive", email: `deleted_${Date.now()}_${req.params.id}@removed.com` },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deactivated (soft delete)" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.listAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("customerId", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(filter),
    ]);

    res.json({ success: true, data: bookings, meta: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
