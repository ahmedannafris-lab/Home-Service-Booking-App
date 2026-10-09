const Specialist = require("../models/Specialist");
const Review = require("../models/Review");

exports.listSpecialists = async (req, res) => {
  try {
    const filter = {};
    if (req.query.categoryId) filter.categoryId = req.query.categoryId;
    if (req.query.status) filter.status = req.query.status;
    const specialists = await Specialist.find(filter).sort({ rating: -1 });
    res.json({ success: true, data: specialists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSpecialistById = async (req, res) => {
  try {
    const specialist = await Specialist.findOne({ id: req.params.id });
    if (!specialist) return res.status(404).json({ success: false, message: "Specialist not found" });

    const reviews = await Review.find({ specialistId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: { ...specialist.toObject(), reviews } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
