// server/resend_api.js
// Resend API integration for email tracking
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

/**
 * Get email status from Resend API
 * @param {string} emailId - Resend email ID
 * @returns {Promise<Object>} Email status and events
 */
export async function getEmailStatus(emailId) {
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  try {
    // Resend API doesn't have a direct get email endpoint
    // We need to use webhooks or check logs
    // For now, we'll return a placeholder
    console.log("📧 Checking email status for:", emailId);
    
    // Note: Resend API v1 doesn't have a direct get email endpoint
    // You need to use webhooks or check the dashboard
    // This is a placeholder for future webhook integration
    
    return {
      id: emailId,
      status: "sent", // Will be updated via webhooks
      message: "Email status tracking requires webhook setup"
    };
  } catch (err) {
    console.error("❌ Error getting email status:", err);
    throw err;
  }
}

/**
 * List recent emails from Resend
 * Note: This requires Resend API v2 or webhook integration
 * For now, we'll use Firestore email logs
 */
export async function listRecentEmails(limit = 50) {
  // This would require Resend API v2 or webhook integration
  // For now, we'll track emails in Firestore
  return {
    message: "Use Firestore emailLogs collection for email tracking"
  };
}

