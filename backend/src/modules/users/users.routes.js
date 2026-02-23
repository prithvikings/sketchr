// src/modules/users/users.routes.js
import express from "express";
import { saveApiKey } from "./users.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();
router.post("/keys", requireAuth, saveApiKey);

export default router;
