// src/modules/users/users.controller.js
import User from "../auth/auth.model.js";
import { encrypt } from "../../utils/crypto.util.js";

export const saveApiKey = async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) throw new Error("API Key is required");

    const { encryptedData, iv, authTag } = encrypt(apiKey);

    await User.findByIdAndUpdate(req.user.id, {
      encryptedApiKey: encryptedData,
      iv: iv,
      // Note: Add authTag to your User model schema to ensure GCM integrity
    });

    res.status(200).json({ message: "API Key securely stored" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update User Profile
// Example update to your existing user.controller.js
export const updateProfile = async (req, res) => {
  try {
    const { fullName, avatar } = req.body; // Extract avatar

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (fullName) user.fullName = fullName;
    if (avatar) user.avatar = avatar; // Save avatar

    await user.save();

    res.status(200).json({
      message: "Profile updated",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Account
export const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    // Note: In a real app, you'd also delete their boards/rooms here
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};
