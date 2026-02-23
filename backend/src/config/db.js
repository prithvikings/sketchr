// src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is missing.");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("[MONGO_DB] Connection established successfully.");
  } catch (error) {
    console.error("[MONGO_DB_ERROR] Connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
