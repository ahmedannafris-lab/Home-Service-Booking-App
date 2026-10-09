const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/authMiddleware");
const c = require("../controllers/serviceController");

router.get("/", c.listServices);
router.get("/:id", c.getServiceById);

// Admin only
router.post("/", auth, requireRole("admin"), c.createService);
router.put("/:id", auth, requireRole("admin"), c.updateService);
router.delete("/:id", auth, requireRole("admin"), c.deleteService);

module.exports = router;
