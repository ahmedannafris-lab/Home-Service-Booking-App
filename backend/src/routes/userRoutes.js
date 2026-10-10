const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const c = require("../controllers/userController");

router.get("/me", auth, c.getMyProfile);
router.put("/me", auth, c.updateMyProfile);

module.exports = router;
