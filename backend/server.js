const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const checkoutRoutes = require("./src/routes/checkoutRoutes");
const promoRoutes = require("./src/routes/promoRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const serviceRoutes = require("./src/routes/serviceRoutes");
const specialistRoutes = require("./src/routes/specialistRoutes");
const providerRoutes = require("./src/routes/providerRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const userRoutes = require("./src/routes/userRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health
app.get("/", (req, res) => res.json({ success: true, message: "HomeMate Backend API is running" }));
app.get("/api/health", (req, res) => res.json({ success: true, message: "HomeMate API healthy" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", checkoutRoutes);           // POST /api/bookings (auth), POST /api/payments
app.use("/api/bookings", bookingRoutes);   // Legacy CRUD
app.use("/api/promocodes", promoRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/specialists", specialistRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err.message);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`HomeMate server running on port ${PORT}`);
    });

    // Socket.IO for real-time chat + GPS
    const { Server } = require("socket.io");
    const io = new Server(server, { cors: { origin: "*" } });
    require("./src/socket/socketHandler")(io, app);
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
