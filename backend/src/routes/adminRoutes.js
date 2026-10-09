const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/authMiddleware");
const admin = require("../controllers/adminController");
const provider = require("../controllers/providerController");

// All admin routes require auth + admin role
router.use(auth, requireRole("admin"));

// Dashboard stats
router.get("/stats", admin.getStats);

// User management
router.get("/users", admin.listUsers);
router.get("/users/:id", admin.getUserById);
router.patch("/users/:id/status", admin.updateUserStatus);
router.delete("/users/:id", admin.deleteUser);

// All bookings
router.get("/bookings", admin.listAllBookings);

// Provider management
router.get("/providers", provider.listProviders);
router.get("/providers/:id", provider.getProviderById);
router.patch("/providers/:id/verify", provider.verifyProvider);

module.exports = router;
