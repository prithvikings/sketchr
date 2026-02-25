// src/modules/users/users.routes.js
import express from "express";
import { saveApiKey, updateProfile, deleteMe } from "./users.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { z } from "zod";

const router = express.Router();

const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(50),
});

router.use(requireAuth);

router.put("/profile", validate(updateProfileSchema), updateProfile);
router.delete("/me", deleteMe);
router.post("/api-key", requireAuth, saveApiKey);

export default router;
