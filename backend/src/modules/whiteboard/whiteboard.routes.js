// src/modules/whiteboard/whiteboard.routes.js
import express from "express";
import { saveSnapshot } from "./whiteboard.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();
router.post("/:roomId/snapshot", requireAuth, saveSnapshot);

export default router;
