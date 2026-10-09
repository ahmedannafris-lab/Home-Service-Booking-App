const Service = require("../models/Service");
const Review = require("../models/Review");

exports.listServices = async (req, res) => {
  try {
    const filter = { active: true };
    if (req.query.categoryId) filter.categoryId = req.query.categoryId;
    const services = await Service.find(filter).sort({ rating: -1 });
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id, active: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    const reviews = await Review.find({ serviceId: req.params.id }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: { ...service.toObject(), reviews } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { id: req.params.id },
      { active: false },
      { new: true }
    );
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, message: "Service deactivated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
