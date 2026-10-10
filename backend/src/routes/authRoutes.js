const express = require("express");
const { body, validationResult } = require("express-validator");
const { register, login } = require("../controllers/authcontroller");


const router = express.Router();

router.post(
  "/register",
  [
    body("fullName")
      .isString()
      .withMessage("Full name is required")
      .bail()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Full name must contain 2–100 characters"),

    body("email")
      .isString()
      .withMessage("Email is required")
      .bail()
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address"),

    body("phone")
      .isString()
      .withMessage("Phone must be text")
      .bail()
      .trim()
      .matches(/^\+?[0-9]{9,15}$/)
      .withMessage("Enter 9–15 digits, optionally starting with +"),

    body("password")
      .isString()
      .withMessage("Password is required")
      .bail()
      .isLength({ min: 8 })
      .withMessage("Password must contain at least 8 characters")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .custom((value) => {
        if (Buffer.byteLength(value, "utf8") > 72) {
          throw new Error("Password must not exceed 72 bytes");
        }
        return true;
      }),

    body("acceptedTerms")
      .custom((value) => value === true)
      .withMessage("You must accept the terms"),

    body("role")
      .optional()
      .equals("customer")
      .withMessage("This endpoint supports customer registration"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Please check your details",
        errors: errors.array().map((error) => ({
          field: error.path,
          message: error.msg,
        })),
      });
    }

    next();
  },
  register
);

router.post(
  "/login",
  [
    body("role").optional().isIn(["customer", "provider", "admin"]).withMessage("Select a valid role"),
    body("email")
      .isString()
      .withMessage("Email is required")
      .bail()
      .trim()
      .isEmail()
      .withMessage("Enter a valid email"),

    body("password")
      .isString()
      .withMessage("Password is required")
      .bail()
      .notEmpty()
      .withMessage("Password is required"),
    body("role")
      .optional()
      .isIn(["customer", "provider", "admin"])
      .withMessage("Invalid role"),
  ],
  (req, res, next) => {
    const identifier = req.body.identifier || req.body.email;
    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is required",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Please check your details",
        errors: errors.array().map((error) => ({
          field: error.path,
          message: error.msg,
        })),
      });
    }

    next();
  },
  login
);
router.get("/me", require("../middleware/authMiddleware"), (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    },
  });
});

module.exports = router;
