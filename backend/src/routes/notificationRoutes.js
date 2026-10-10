const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const c = require("../controllers/notificationController");

router.get("/", auth, c.listNotifications);
router.patch("/read-all", auth, c.markAllRead);
router.patch("/:id/read", auth, c.markAsRead);

module.exports = router;
