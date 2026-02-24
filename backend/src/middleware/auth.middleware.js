import jwt from "jsonwebtoken";
import User from "../modules/auth/auth.model.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Security Fix: Ensure user hasn't been deleted since token was issued
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};
