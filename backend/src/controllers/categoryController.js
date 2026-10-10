const ServiceCategory = require("../models/ServiceCategory");
const Service = require("../models/Service");

exports.listCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await ServiceCategory.findOne({ id: req.params.id });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    const services = await Service.find({ categoryId: req.params.id, active: true });
    res.json({ success: true, data: { ...category.toObject(), services } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findOneAndDelete({ id: req.params.id });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
