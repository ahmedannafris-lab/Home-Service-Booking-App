const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/authMiddleware");
const c = require("../controllers/categoryController");

router.get("/", c.listCategories);
router.get("/:id", c.getCategoryById);

// Admin only
router.post("/", auth, requireRole("admin"), c.createCategory);
router.put("/:id", auth, requireRole("admin"), c.updateCategory);
router.delete("/:id", auth, requireRole("admin"), c.deleteCategory);

module.exports = router;
