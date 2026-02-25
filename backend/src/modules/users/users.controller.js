// src/modules/users/users.controller.js
import crypto from "node:crypto";
import User from "../auth/auth.model.js";

// This guarantees your key is ALWAYS exactly 32 bytes, regardless of what is in your .env
const getEncryptionKey = () => {
  const secret = process.env.ENCRYPTION_KEY || "default_development_secret_key";
  return crypto.createHash("sha256").update(secret).digest();
};

export const saveApiKey = async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) throw new Error("API Key is required");

    const iv = crypto.randomBytes(16);
    const key = getEncryptionKey();

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encryptedData = cipher.update(apiKey, "utf8", "hex");
    encryptedData += cipher.final("hex");

    await User.findByIdAndUpdate(req.user.id, {
      encryptedApiKey: encryptedData,
      iv: iv.toString("hex"),
    });

    res.status(200).json({ message: "API Key securely stored" });
  } catch (error) {
    console.error("[ENCRYPTION_ERROR]", error);
    res.status(400).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, avatar } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (fullName) user.fullName = fullName;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      message: "Profile updated",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};
