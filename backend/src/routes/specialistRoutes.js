const express = require("express");
const router = express.Router();
const c = require("../controllers/specialistController");

router.get("/", c.listSpecialists);
router.get("/:id", c.getSpecialistById);

module.exports = router;
