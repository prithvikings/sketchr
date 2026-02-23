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
