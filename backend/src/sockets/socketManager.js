// src/sockets/socketManager.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Whiteboard from "../modules/whiteboard/whiteboard.model.js";

const roomStateCache = new Map();
const cacheCleanupTimeouts = new Map();
const autoSaveTimeouts = new Map();

// --- HELPER: DEBOUNCED DB SAVE ---
// This ensures we save to MongoDB every 5 seconds during active drawing,
// rather than only saving when the user leaves.
const triggerAutoSave = (roomId) => {
  if (autoSaveTimeouts.has(roomId)) return; // Save is already scheduled

  const timeout = setTimeout(async () => {
    const elementsMap = roomStateCache.get(roomId);
    if (elementsMap) {
      const elementsArray = Array.from(elementsMap.values());
      try {
        await Whiteboard.findOneAndUpdate(
          { roomId },
          { elements: elementsArray, lastUpdated: Date.now() },
          { upsert: true },
        );
      } catch (err) {
        console.error("[DB_SAVE_ERROR]", err);
      }
    }
    autoSaveTimeouts.delete(roomId);
  }, 5000);

  autoSaveTimeouts.set(roomId, timeout);
};

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
    socket.on("join_room", async ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId);
      socket.roomId = roomId;

      // 1. REFRESH FIX: Cancel any pending cache destruction because the user came back
      if (cacheCleanupTimeouts.has(roomId)) {
        clearTimeout(cacheCleanupTimeouts.get(roomId));
        cacheCleanupTimeouts.delete(roomId);
      }

      // 2. If room isn't in memory cache, load it from MongoDB
      if (!roomStateCache.has(roomId)) {
        const elementMap = new Map();
        try {
          const savedBoard = await Whiteboard.findOne({ roomId });
          if (savedBoard && savedBoard.elements) {
            savedBoard.elements.forEach((el) => elementMap.set(el.id, el));
          }
        } catch (err) {
          console.error("[DB_LOAD_ERROR]", err);
        }
        roomStateCache.set(roomId, elementMap);
      }

      // 3. Send the current state to the user who just joined
      const currentElements = Array.from(roomStateCache.get(roomId).values());
      socket.emit("initial_state", currentElements);

      // 4. Notify others
      socket
        .to(roomId)
        .emit("user_joined", { socketId: socket.id, userId: socket.user.id });
    });

    socket.on("cursor_move", ({ roomId, cursor }) => {
      socket.to(roomId).emit("cursor_move", { socketId: socket.id, cursor });
    });

    socket.on("leave_room", ({ roomId }) => {
      socket.leave(roomId);
      socket
        .to(roomId)
        .emit("user_left", { socketId: socket.id, userId: socket.user.id });
    });

    // Handle incoming draw data and trigger the auto-save
    socket.on("add_element", ({ roomId, element }) => {
      if (roomStateCache.has(roomId)) {
        roomStateCache.get(roomId).set(element.id, element);
        triggerAutoSave(roomId);
      }
      socket.to(roomId).emit("add_element", element);
    });

    socket.on("update_element", ({ roomId, elementId, updates }) => {
      if (roomStateCache.has(roomId)) {
        const elements = roomStateCache.get(roomId);
        const existing = elements.get(elementId) || {};
        elements.set(elementId, { ...existing, ...updates });
        triggerAutoSave(roomId);
      }
      socket.to(roomId).emit("update_element", { elementId, updates });
    });

    socket.on("delete_element", ({ roomId, elementId }) => {
      if (roomStateCache.has(roomId)) {
        roomStateCache.get(roomId).delete(elementId);
        triggerAutoSave(roomId);
      }
      socket.to(roomId).emit("delete_element", { elementId });
    });

    socket.on("video_ready", ({ roomId, peerId }) => {
      socket.to(roomId).emit("user_video_ready", { peerId });
    });

    socket.on("send_message", ({ roomId, message }) => {
      socket.to(roomId).emit("receive_message", message);
    });

    socket.on("request_join", ({ roomId, user }) => {
      // Forward the request to everyone in the room (The host's UI will catch this)
      socket
        .to(roomId)
        .emit("incoming_join_request", {
          guestSocketId: socket.id,
          guestUser: user,
        });
    });

    socket.on("resolve_join_request", ({ guestSocketId, status }) => {
      // Send the host's decision directly back to the specific guest waiting in the lobby
      io.to(guestSocketId).emit("join_request_resolved", { status });
    });

    socket.on("disconnect", async () => {
      const roomId = socket.roomId;
      if (!roomId) return;

      socket
        .to(roomId)
        .emit("user_left", { socketId: socket.id, userId: socket.user.id });

      const room = io.sockets.adapter.rooms.get(roomId);

      // If the room is now completely empty
      if (!room || room.size === 0) {
        triggerAutoSave(roomId); // Final save push

        // Wait 30 seconds before wiping the cache from memory.
        // This gives the user plenty of time to refresh the page without losing the active state.
        const timeoutId = setTimeout(() => {
          roomStateCache.delete(roomId);
          cacheCleanupTimeouts.delete(roomId);
        }, 30000);

        cacheCleanupTimeouts.set(roomId, timeoutId);
      }
    });
  });

  return io;
};

export default initSockets;
