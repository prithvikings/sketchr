// src/modules/chat/chat.model.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
    index: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true, maxlength: 1000 },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);
