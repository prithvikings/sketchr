import express from "express";
import { createRoom, joinRoom, getIceServers } from "./rooms.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { checkRoomLimit } from "../../middleware/usage.middleware.js";
import { validate, roomSchema } from "../../middleware/validate.middleware.js";

const router = express.Router();

router.post("/", requireAuth, checkRoomLimit, validate(roomSchema), createRoom);
router.post("/:id/join", requireAuth, joinRoom);
router.get("/ice-servers", requireAuth, getIceServers);

export default router;
