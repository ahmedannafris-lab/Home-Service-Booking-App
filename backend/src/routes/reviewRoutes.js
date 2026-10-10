const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const c = require("../controllers/reviewController");

router.post("/", auth, c.submitReview);
router.get("/specialist/:id", c.getSpecialistReviews);
router.get("/service/:id", c.getServiceReviews);

module.exports = router;
