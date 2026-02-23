// src/modules/ai/ai.controller.js
import crypto from "crypto";
import User from "../auth/auth.model.js";

const decryptKey = (encryptedHex, ivHex) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.ENCRYPTION_KEY, "hex"),
    Buffer.from(ivHex, "hex"),
  );
  // Note: GCM requires an auth tag in production. This is simplified for rendering.
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  return decrypted + decipher.final("utf8");
};

export const generateFlowchart = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = await User.findById(req.user.id);

    if (!user?.encryptedApiKey) throw new Error("No AI API key provided");
    const apiKey = decryptKey(user.encryptedApiKey, user.iv);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Return ONLY valid JSON with two arrays: 'nodes' [{id, type, label}] and 'connectors' [{sourceId, targetId}].",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) throw new Error("External AI Provider Error");
    const data = await response.json();
    res.status(200).json(JSON.parse(data.choices[0].message.content));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
