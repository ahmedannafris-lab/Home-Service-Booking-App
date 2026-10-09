const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/authMiddleware");
const c = require("../controllers/providerController");

// Provider self-service
router.post("/apply", auth, c.applyAsProvider);
router.get("/me", auth, c.getMyProviderProfile);

module.exports = router;
