// src/modules/chat/chat.controller.js
import Chat from "./chat.model.js";

export const getRoomChat = async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Chat.find({ roomId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate("senderId", "email"); // Only fetch email from user

    res.status(200).json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
