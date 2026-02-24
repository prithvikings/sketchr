import express from "express";
import { register, login, logout } from "./auth.controller.js";
import rateLimit from "express-rate-limit";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../../middleware/validate.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", requireAuth, logout);

export default router;
