const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { connectDB, getLastError } = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Check database readiness for mutation routes
app.use("/api", (req, res, next) => {
  if (req.path === "/health" || req.path === "/" || req.path === "/auth/login") {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    const errorMsg = getLastError() || "Connecting to database...";
    const isAuthError = errorMsg.includes("bad auth") || errorMsg.includes("Authentication failed");
    return res.status(503).json({
      success: false,
      message: isAuthError
        ? "MongoDB Atlas Authentication Failed: Please check your Database User username & password in MongoDB Atlas -> Security -> Database Access."
        : `Database unavailable: ${errorMsg}`,
    });
  }
  next();
});

app.use('/api', require('./src/routes/checkoutRoutes'));
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HomeMate Backend API is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "connecting",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "HomeMate API healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "connecting",
  });
});

app.listen(PORT, () => {
  console.log(`HomeMate server running on port ${PORT}`);
  connectDB().catch((error) => {
    console.error("DB connection error:", error.message);
  });
});
