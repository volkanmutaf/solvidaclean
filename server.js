// FILE: server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sendEmail } from "./server/send_email.js";

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/send_quote_response", async (req, res) => {
  const { to, subject, message, templateData } = req.body;
  
  // Validate required fields
  if (!to || !subject) {
    return res.status(400).json({ error: "Missing required fields: to and subject are required" });
  }

  // If templateData is provided, message is optional (will be generated from template)
  // Otherwise, message is required
  if (!templateData && !message) {
    return res.status(400).json({ error: "Either message or templateData must be provided" });
  }

  try {
    const result = await sendEmail({ 
      to, 
      subject, 
      message: message || "", // Fallback empty string if using template
      templateData // Will generate HTML template if provided
    });
    res.status(200).json(result);
  } catch (err) {
    console.error("Send error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`📡 Server listening on http://localhost:${PORT}`);
});
