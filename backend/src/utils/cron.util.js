import cron from "node-cron";
import Room from "../modules/rooms/rooms.model.js";

export const startCronJobs = (io) => {
  cron.schedule("* * * * *", async () => {
    try {
      const expiredRooms = await Room.find({
        status: "active",
        $expr: {
          $lt: [
            {
              $add: [
                "$createdAt",
                { $multiply: ["$sessionDurationLimit", 60000] },
              ],
            },
            new Date(),
          ],
        },
      });

      for (const room of expiredRooms) {
        room.status = "expired";
        await room.save();
        io.to(room._id.toString()).emit("room_expired", {
          message: "Session time limit reached.",
        });
        io.in(room._id.toString()).disconnectSockets(true);
      }
    } catch (error) {
      console.error(
        "[CRON_ERROR] Failed to process room expirations:",
        error.message,
      );
    }
  });
};
