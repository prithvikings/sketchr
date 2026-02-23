// src/modules/ai/ai.routes.js
import express from "express";
import { generateFlowchart } from "./ai.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 5 }); // strict limit

router.post("/flowchart", requireAuth, aiLimiter, generateFlowchart);

export default router;
