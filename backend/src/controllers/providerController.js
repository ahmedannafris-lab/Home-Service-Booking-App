const Provider = require("../models/Provider");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.applyAsProvider = async (req, res) => {
  try {
    const existing = await Provider.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(409).json({ success: false, message: "You already have a provider application" });
    }

    const { businessName, category, categoryId, scope, city, serviceAreas } = req.body;
    const refNo = "VR-" + Math.floor(8000 + Math.random() * 1000);
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const provider = await Provider.create({
      userId: req.user._id,
      businessName,
      category,
      categoryId,
      scope,
      email: req.user.email,
      phone: req.user.phone || "",
      city,
      serviceAreas: serviceAreas || [],
      referenceNo: refNo,
      submittedDate: today,
      status: "pending",
      feePaid: false,
    });

    // Update user role to provider
    await User.findByIdAndUpdate(req.user._id, { role: "provider" });

    res.status(201).json({ success: true, data: provider });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) return res.status(404).json({ success: false, message: "No provider profile found" });
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.listProviders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.categoryId) filter.categoryId = req.query.categoryId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [providers, total] = await Promise.all([
      Provider.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Provider.countDocuments(filter),
    ]);

    res.json({ success: true, data: providers, meta: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate("userId", "fullName email phone");
    if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyProvider = async (req, res) => {
  try {
    const { action, reason } = req.body;
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ success: false, message: "action must be 'approve' or 'reject'" });
    }

    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });

    if (action === "approve") {
      provider.status = "verified";
      provider.verifiedAt = new Date();
      provider.rejectionReason = null;
    } else {
      provider.status = "rejected";
      provider.rejectedAt = new Date();
      provider.rejectionReason = reason || "Application did not meet requirements";
    }

    await provider.save();

    // Create notification for the provider's user
    await Notification.create({
      userId: provider.userId,
      type: action === "approve" ? "provider_verified" : "provider_rejected",
      title: action === "approve" ? "🎉 Application Approved!" : "Application Update",
      body:
        action === "approve"
          ? `Your business "${provider.businessName}" has been verified. You can now accept bookings.`
          : `Your application was not approved. Reason: ${provider.rejectionReason}`,
    });

    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
