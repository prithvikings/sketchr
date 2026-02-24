import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: error.errors });
  }
};

export const registerSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const roomSchema = z.object({
  maxParticipants: z.number().min(2).max(50).default(10),
});

export const aiSchema = z.object({
  prompt: z.string().min(5).max(1000),
});
