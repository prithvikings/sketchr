// src/sockets/socketManager.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Whiteboard from "../modules/whiteboard/whiteboard.model.js";

const roomStateCache = new Map();

const initSockets = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.use((socket, next) => {
    const authHeader = socket.handshake.headers?.authorization;
    const token =
      socket.handshake.auth?.token || (authHeader && authHeader.split(" ")[1]);
    if (!token) return next(new Error("Authentication error: Token missing"));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join_room", ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId);
      socket.roomId = roomId;
      if (!roomStateCache.has(roomId)) roomStateCache.set(roomId, new Map());
      socket
        .to(roomId)
        .emit("user_joined", { socketId: socket.id, userId: socket.user.id });
    });

    socket.on("leave_room", ({ roomId }) => {
      socket.leave(roomId);
      socket
        .to(roomId)
        .emit("user_left", { socketId: socket.id, userId: socket.user.id });
    });

    socket.on("draw_stroke", ({ roomId, element }) => {
      if (roomStateCache.has(roomId))
        roomStateCache.get(roomId).set(element.id, element);
      socket.to(roomId).emit("draw_stroke", element);
    });

    socket.on("add_element", ({ roomId, element }) => {
      if (roomStateCache.has(roomId))
        roomStateCache.get(roomId).set(element.id, element);
      socket.to(roomId).emit("add_element", element);
    });

    socket.on("update_element", ({ roomId, elementId, updates }) => {
      if (roomStateCache.has(roomId)) {
        const elements = roomStateCache.get(roomId);
        const existing = elements.get(elementId) || {};
        elements.set(elementId, { ...existing, ...updates });
      }
      socket.to(roomId).emit("update_element", { elementId, updates });
    });

    socket.on("delete_element", ({ roomId, elementId }) => {
      if (roomStateCache.has(roomId))
        roomStateCache.get(roomId).delete(elementId);
      socket.to(roomId).emit("delete_element", { elementId });
    });

    socket.on("send_offer", ({ targetId, offer }) => {
      socket.to(targetId).emit("receive_offer", { senderId: socket.id, offer });
    });

    socket.on("send_answer", ({ targetId, answer }) => {
      socket
        .to(targetId)
        .emit("receive_answer", { senderId: socket.id, answer });
    });

    socket.on("send_ice", ({ targetId, candidate }) => {
      socket
        .to(targetId)
        .emit("receive_ice", { senderId: socket.id, candidate });
    });

    socket.on("disconnect", async () => {
      const roomId = socket.roomId;
      if (!roomId) return;

      const room = io.sockets.adapter.rooms.get(roomId);
      if (!room || room.size === 0) {
        const elementsMap = roomStateCache.get(roomId);
        if (elementsMap && elementsMap.size > 0) {
          const elementsArray = Array.from(elementsMap.values());
          await Whiteboard.findOneAndUpdate(
            { roomId },
            { elements: elementsArray, lastUpdated: Date.now() },
            { upsert: true },
          ).catch((err) => console.error("[DB_SAVE_ERROR]", err));
        }
        roomStateCache.delete(roomId);
      }
    });
  });

  return io;
};

export default initSockets;
