// src/modules/chat/chat.routes.js
import express from "express";
import { getRoomChat } from "./chat.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();
router.get("/:roomId", requireAuth, getRoomChat);

export default router;
