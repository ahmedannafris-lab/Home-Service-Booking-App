const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI missing in .env");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "homemate",
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

module.exports = connectDB;