const mongoose = require("mongoose");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Keep system default if custom DNS cannot be set
}

let isConnecting = false;
let lastError = null;

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI missing in .env");
  }

  if (mongoose.connection.readyState === 1 || isConnecting) {
    return;
  }

  isConnecting = true;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "homemate",
      serverSelectionTimeoutMS: 6000,
    });

    lastError = null;
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    const seedDefaultUsers = require("./seedUsers");
    await seedDefaultUsers();
  } catch (error) {
    lastError = error.message;
    console.warn("\n------------------------------------------------------------");
    console.warn("MongoDB Atlas Connection Note:");
    console.warn(`Details: ${error.message}`);
    console.warn("------------------------------------------------------------\n");

    // Automatically retry in background every 10 seconds
    setTimeout(() => {
      isConnecting = false;
      connectDB().catch(() => {});
    }, 10000);
  } finally {
    isConnecting = false;
  }
}

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.getLastError = () => lastError;