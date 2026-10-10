const mongoose = require("mongoose");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Use system default if custom DNS is not supported
}

let isConnecting = false;
let lastError = null;

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  if (mongoose.connection.readyState === 1 || isConnecting) {
    return;
  }

  isConnecting = true;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "homemate",
      serverSelectionTimeoutMS: 5000,
    });

    lastError = null;
    console.log(`[Database] MongoDB connected: ${mongoose.connection.name}`);
    const seedDefaultUsers = require("./seedUsers");
    await seedDefaultUsers();
  } catch (error) {
    lastError = error.message;
    console.warn(`[Database] Connection attempt failed: ${error.message}`);

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