// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";

// Route Imports
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import roomsRoutes from "./modules/rooms/rooms.routes.js";
import whiteboardRoutes from "./modules/whiteboard/whiteboard.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "500kb" }));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// REST Routes Mount Points
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/whiteboard", whiteboardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);

// Global 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[EXPRESS_ERROR]", err.stack);
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

export default app;
