// FILE: binoclean/api/send_quote_response.js
import { sendEmail } from "../server/send_email";

// ✅ JSON verisini elle oku (Vite'de body-parser yok)
async function getJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        console.error("Error submitting quote:", err);
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  try {
    const { to, subject, message } = await getJsonBody(req);

    const result = await sendEmail({ to, subject, message });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  } catch (err) {
    console.error("❌ Email send failed:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err.message }));
  }
}
