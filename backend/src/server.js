// src/server.js
import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import initSockets from "./sockets/socketManager.js";
import { startCronJobs } from "./utils/cron.util.js";

const PORT = process.env.PORT || 10000;
const server = http.createServer(app);

const io = initSockets(server);
startCronJobs(io);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[SERVER] Running on http://localhost:${PORT}`);
      }
    });
  } catch (error) {
    console.error("[SERVER_FATAL]", error.message);
    process.exit(1);
  }
};

process.on("SIGTERM", () => {
  console.log("[SERVER] SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    process.exit(0);
  });
});

startServer();
