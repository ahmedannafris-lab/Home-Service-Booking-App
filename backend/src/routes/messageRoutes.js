const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const c = require("../controllers/messageController");

router.get("/:bookingId", auth, c.getThread);
router.post("/:bookingId", auth, c.sendMessage);
router.patch("/:bookingId/read", auth, c.markAsRead);

module.exports = router;
