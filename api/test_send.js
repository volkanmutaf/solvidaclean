import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.MAILERSEND_API_KEY;

if (!apiKey) {
  console.error("❌ MAILERSEND_API_KEY is not defined in .env file.");
  process.exit(1);
}

const sendTestEmail = async () => {
  try {
    const response = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: {
          email: "noreply@test-z0vklo67ky1l7qrx.mlsender.net", // ✅ test domain adresi (doğrulanmış domainin olmasa bile geçerli)
          name: "SolVida Clean Admin",
        },
        to: [
          {
            email: "cr33ks@gmail.com", // 📩 buraya kendi test emailini yaz
            name: "Test User",
          },
        ],
        subject: "SolVida Clean Test Email",
        text: "✅ This is a test email sent from your backend using MailerSend.",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("MailerSend error:", JSON.stringify(data));
      console.log({ success: false, error: JSON.stringify(data) });
    } else {
      console.log("MailerSend success");
      console.log({ success: true, data });
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

sendTestEmail();
