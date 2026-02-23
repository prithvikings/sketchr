// src/modules/rooms/rooms.controller.js
import Room from "./rooms.model.js";

export const createRoom = async (req, res) => {
  try {
    const { maxParticipants } = req.body;
    const room = await Room.create({ hostId: req.user.id, maxParticipants });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) throw new Error("Room not found");
    if (room.status === "expired") throw new Error("Session expired");
    if (room.participants.length >= room.maxParticipants)
      throw new Error("Room full");

    if (
      !room.participants.includes(req.user.id) &&
      room.hostId.toString() !== req.user.id
    ) {
      room.participants.push(req.user.id);
      await room.save();
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ... keep existing createRoom and joinRoom ...

export const getIceServers = async (req, res) => {
  // You must replace TURN credentials with a real provider (Twilio/Metered) in production.
  // Hardcoded STUN is fine for development.
  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];

  if (
    process.env.TURN_URL &&
    process.env.TURN_USERNAME &&
    process.env.TURN_PASSWORD
  ) {
    iceServers.push({
      urls: process.env.TURN_URL,
      username: process.env.TURN_USERNAME,
      credential: process.env.TURN_PASSWORD,
    });
  }

  res.status(200).json({ iceServers });
};
