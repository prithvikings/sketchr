import jwt from "jsonwebtoken";
import User from "./auth.model.js";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (await User.findOne({ email })) throw new Error("Email already in use");

    const user = await User.create({ fullName, email, passwordHash: password });
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
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

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // In a stateless JWT setup, we simply tell the client to clear their storage.
    // If using cookies, you would clear the cookie here: res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};
