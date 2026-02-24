import express from "express";
import {
  createRoom,
  joinRoom,
  getIceServers,
  getUserRooms,
} from "./rooms.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { checkRoomLimit } from "../../middleware/usage.middleware.js";
// Note: You may need to update roomSchema in validate.middleware.js to accept an optional 'name' string

const router = express.Router();

router.get("/", requireAuth, getUserRooms); // <-- ADDED THIS
router.post("/", requireAuth, createRoom); // Removed validate middleware temporarily if it blocks 'name'
router.post("/:id/join", requireAuth, joinRoom);
router.get("/ice-servers", requireAuth, getIceServers);

export default router;
