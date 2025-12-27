// server/send_email.js
import { Resend } from "resend";
import dotenv from "dotenv";
import { generateQuoteResponseEmail, generateAppointmentConfirmationEmail, generateAppointmentCancellationEmail } from "./emailTemplate.js";

dotenv.config();

const apiKey = process.env.RESEND_API_KEY;

// Initialize Resend
const resend = new Resend(apiKey);

// Check if API key exists
if (!apiKey) {
  console.error("❌ RESEND_API_KEY is not set in .env file!");
  console.error("Please add: RESEND_API_KEY=re_your_api_key_here");
  console.error("Get your API key from: https://resend.com/api-keys");
}

/**
 * Send email with HTML template support using Resend
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text message (fallback)
 * @param {string} options.html - HTML content (optional, if provided, will be used instead of template)
 * @param {Object} options.templateData - Data for template generation (optional)
 */
export async function sendEmail({ 
  to, 
  subject, 
  message, 
  html,
  templateData 
}) {
  // Check if API key exists
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured. Please add it to your .env file.");
  }

  // If templateData is provided, generate HTML from template
  let htmlContent = html;
  if (templateData && !html) {
    // Determine which template to use based on templateData
    // Cancellation email: has appointmentDate and appointmentTime, but typically no price
    // Confirmation email: has appointmentDate, appointmentTime, and price
    // Quote response: has quoteNumber but no appointmentDate
    if (templateData.appointmentDate && templateData.appointmentTime) {
      // This is an appointment-related email
      if (templateData.price !== undefined && templateData.price !== null) {
        // Has price = confirmation email
        console.log("📧 Using confirmation email template");
        htmlContent = generateAppointmentConfirmationEmail(templateData);
      } else {
        // No price = cancellation email
        console.log("📧 Using cancellation email template");
        htmlContent = generateAppointmentCancellationEmail(templateData);
      }
    } else if (templateData.quoteNumber) {
      // Quote response email
      console.log("📧 Using quote response email template");
      htmlContent = generateQuoteResponseEmail(templateData);
    } else {
      // Default to quote response if we can't determine
      console.log("📧 Defaulting to quote response email template");
      htmlContent = generateQuoteResponseEmail(templateData);
    }
  }

  // Debug: Log API key status (first 10 chars only for security)
  console.log("📧 Sending email with Resend...");
  console.log("🔑 API Key status:", apiKey ? `Set (${apiKey.substring(0, 10)}...)` : "NOT SET");
  console.log("📬 To:", to);
  console.log("📝 Subject:", subject);

  try {
    const { data, error } = await resend.emails.send({
      from: "SolVida Clean <info@solvidaclean.com>", // Production domain - solvidaclean.com
      to: [to],
      subject: subject,
      html: htmlContent || `<p>${message}</p>`, // HTML content
      text: message, // Plain text fallback
    });

    if (error) {
      console.error("❌ Resend Error Response:", JSON.stringify(error, null, 2));
      
      // Better error message for domain verification
      if (error.message?.includes("only send testing emails to your own email address") || 
          error.message?.includes("verify a domain")) {
        throw new Error(
          "Domain doğrulaması gerekiyor! " +
          "Resend test domain'i ile sadece kendi email adresinize gönderebilirsiniz. " +
          "Başka email adreslerine göndermek için: " +
          "1) https://resend.com/domains adresine gidin, " +
          "2) Domain ekleyin ve DNS kayıtlarını yapın, " +
          "3) Domain doğrulandıktan sonra send_email.js dosyasındaki 'from' email'i güncelleyin. " +
          "Detaylar için RESEND_DOMAIN_SETUP.md dosyasına bakın."
        );
      }
      
      throw new Error(error.message || "Resend API failed");
    }

    console.log("✅ Email sent successfully!");
    console.log("📧 Email ID:", data?.id);
    console.log("📬 Sent to:", to);
    console.log("📝 Subject:", subject);
    
    return { 
      success: true, 
      id: data?.id,
      message: "Email sent successfully" 
    };
  } catch (err) {
    console.error("❌ Resend Error:", err);
    
    // Better error messages
    let errorMessage = err.message || "Resend API failed";
    
    if (err.message?.includes("Unauthorized") || err.message?.includes("Invalid API key")) {
      errorMessage = "Unauthenticated: Invalid or expired API key. Please check your RESEND_API_KEY in .env file.";
    } else if (err.message?.includes("Forbidden")) {
      errorMessage = "Forbidden: Your API key doesn't have permission to send emails. Check your Resend account settings.";
    } else if (err.message?.includes("Validation")) {
      errorMessage = `Validation Error: ${err.message}`;
    } else if (err.message?.includes("Rate limit")) {
      errorMessage = "Rate Limit: Too many requests. Please try again later.";
    }
    
    throw new Error(errorMessage);
  }
}
