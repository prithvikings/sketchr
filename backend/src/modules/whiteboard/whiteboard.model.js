// backend/src/modules/whiteboard/whiteboard.model.js

import mongoose from "mongoose";

const elementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["stroke", "node", "connector", "sticky", "text"],
      required: true,
    },
    position: { type: Object },
    content: { type: mongoose.Schema.Types.Mixed },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false },
);

const whiteboardSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
    index: true,
  },
  elements: [elementSchema],
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Whiteboard", whiteboardSchema);
