const User = require("../models/User");

exports.getMyProfile = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      status: req.user.status,
      city: req.user.city,
      address: req.user.address,
      avatarUrl: req.user.avatarUrl,
      createdAt: req.user.createdAt,
    },
  });
};

exports.updateMyProfile = async (req, res) => {
  try {
    const allowed = ["fullName", "phone", "city", "address", "avatarUrl"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
        address: user.address,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
