// backend/src/modules/whiteboard/whiteboard.controller.js

import Whiteboard from "./whiteboard.model.js";

export const saveSnapshot = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { elements } = req.body;

    const board = await Whiteboard.findOneAndUpdate(
      { roomId },
      { elements, lastUpdated: Date.now() },
      { upsert: true, new: true },
    );
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
