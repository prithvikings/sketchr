// src/modules/rooms/rooms.model.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  maxParticipants: { type: Number, default: 10 },
  sessionDurationLimit: { type: Number, default: 60 },
  status: { type: String, enum: ["active", "expired"], default: "active" },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // TTL 24 hours
});

export default mongoose.model("Room", roomSchema);
