import express from "express";
import { register, login } from "./auth.controller.js";
import rateLimit from "express-rate-limit";
import { validate, authSchema } from "../../middleware/validate.middleware.js";

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/register", authLimiter, validate(authSchema), register);
router.post("/login", authLimiter, validate(authSchema), login);

export default router;
