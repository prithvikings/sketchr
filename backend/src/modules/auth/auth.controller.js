// src/modules/auth/auth.controller.js
import jwt from "jsonwebtoken";
import User from "./auth.model.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (await User.findOne({ email })) throw new Error("Email in use");

    const user = await User.create({ email, passwordHash: password });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
