import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:10000";

let socket = null;

export const initSocket = () => {
  const token = localStorage.getItem("sketchr_token");

  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token }, // Passes the JWT to your backend io.use() middleware
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("[SOCKET] Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("[SOCKET] Connection Error:", err.message);
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
