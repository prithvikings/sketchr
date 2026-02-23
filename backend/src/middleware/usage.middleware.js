// src/middleware/usage.middleware.js
import Room from "../modules/rooms/rooms.model.js";

export const checkRoomLimit = async (req, res, next) => {
  try {
    const activeRoomsCount = await Room.countDocuments({
      hostId: req.user.id,
      status: "active",
    });

    const limit = req.user.role === "pro" ? 20 : 3;

    if (activeRoomsCount >= limit) {
      return res
        .status(402)
        .json({ error: "Active room limit reached. Upgrade to Pro." });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to verify usage limits" });
  }
};
