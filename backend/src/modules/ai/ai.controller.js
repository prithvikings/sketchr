// src/modules/ai/ai.controller.js
import crypto from "node:crypto";
import User from "../auth/auth.model.js";

// Must match the exact logic from users.controller.js
const getEncryptionKey = () => {
  const secret = process.env.ENCRYPTION_KEY || "default_development_secret_key";
  return crypto.createHash("sha256").update(secret).digest();
};

const decryptKey = (encryptedHex, ivHex) => {
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(ivHex, "hex"),
  );
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  return decrypted + decipher.final("utf8");
};

export const generateFlowchart = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = await User.findById(req.user.id);

    if (!user?.encryptedApiKey)
      throw new Error("No Gemini API key provided. Add it in settings.");

    // Decrypt the key
    const apiKey = decryptKey(user.encryptedApiKey, user.iv);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "You are a flowchart architect. Return ONLY valid JSON. The JSON must contain two arrays: 'nodes' [{id: string, type: string, label: string}] and 'connectors' [{sourceId: string, targetId: string}]. Do not include markdown formatting or explanations.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "External AI Provider Error");
    }

    let responseText = data.candidates[0].content.parts[0].text;

    // STRIP MARKDOWN: Safely remove ```json and ``` if the AI added them
    responseText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    res.status(200).json(JSON.parse(responseText));
  } catch (error) {
    console.error("[AI_GEN_ERROR]", error);
    res.status(400).json({ error: error.message });
  }
};
