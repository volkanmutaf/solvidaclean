// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "./send_email.js"; // .js uzantısı zorunlu (ESM)
import { generateAppointmentConfirmationEmail, generateAppointmentCancellationEmail } from "./emailTemplate.js";

dotenv.config();

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const expressApp = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration for production
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? [
        'https://solvidaclean.com', 
        'https://www.solvidaclean.com',
        'https://solvidaclean-production.up.railway.app' // Railway public domain
      ].filter(Boolean) // undefined değerleri temizle
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

expressApp.use(cors(corsOptions));
expressApp.use(express.json());

// Serve static files in production (if frontend build is in dist folder)
// Note: Railway'da dist klasörü yok, bu yüzden devre dışı
// Frontend İyonos'ta serve ediliyor
if (NODE_ENV === 'production' && false) { // Railway'da dist yok, devre dışı
  expressApp.use(express.static(path.join(__dirname, '../dist')));
}

// Quote submission endpoint
expressApp.post("/api/submit-quote", async (req, res) => {
  const { name, email, phone, service, message, bedrooms, bathrooms } = req.body;
  
  // Input validation and sanitization
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: "Email is required" });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  // Sanitize inputs
  const sanitizedName = name.trim().substring(0, 100); // Max 100 chars
  const sanitizedEmail = email.trim().toLowerCase().substring(0, 255); // Max 255 chars
  const sanitizedPhone = phone ? phone.trim().substring(0, 20) : null; // Max 20 chars
  const sanitizedMessage = message ? message.trim().substring(0, 1000) : ""; // Max 1000 chars
  const sanitizedService = service ? service.trim().substring(0, 100) : "General Cleaning";
  
  // Validate numeric inputs
  const validBedrooms = bedrooms && !isNaN(bedrooms) ? Math.max(1, Math.min(10, parseInt(bedrooms))) : 1;
  const validBathrooms = bathrooms && !isNaN(bathrooms) ? Math.max(1, Math.min(10, parseInt(bathrooms))) : 1;

  try {
    const currentYear = new Date().getFullYear();
    const quoteNumber = `Q${currentYear}-${String(Date.now()).slice(-5)}`;

    const quoteData = {
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      service: sanitizedService,
      message: sanitizedMessage,
      imageUrls: [],
      bedrooms: validBedrooms,
      bathrooms: validBathrooms,
      quoteNumber,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // For now, just return success without saving to Firestore
    // The frontend will handle the Firebase operations
    console.log("📝 Quote data received:", quoteData);
    
    res.json({ 
      success: true, 
      quoteNumber,
      message: "Quote submitted successfully" 
    });
  } catch (err) {
    console.error("Quote submission error:", err);
    res.status(500).json({ error: "Failed to submit quote" });
  }
});

expressApp.post("/api/send_quote_response", async (req, res) => {
  const { to, subject, message, templateData } = req.body;
  
  // Validate required fields
  if (!to || typeof to !== 'string' || !to.trim()) {
    return res.status(400).json({ error: "Missing required fields: to is required" });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to.trim())) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    return res.status(400).json({ error: "Missing required fields: subject is required" });
  }

  // If templateData is provided, message is optional (will be generated from template)
  // Otherwise, message is required
  if (!templateData && (!message || typeof message !== 'string' || !message.trim())) {
    return res.status(400).json({ error: "Either message or templateData must be provided" });
  }
  
  // Sanitize inputs
  const sanitizedTo = to.trim().toLowerCase();
  const sanitizedSubject = subject.trim().substring(0, 200); // Max 200 chars

  try {
    console.log("📨 Received email request:", { to: sanitizedTo, subject: sanitizedSubject, hasTemplateData: !!templateData });
    const result = await sendEmail({ 
      to: sanitizedTo, 
      subject: sanitizedSubject, 
      message: message ? message.trim().substring(0, 5000) : "", // Max 5000 chars
      templateData // Will generate HTML template if provided
    });
    console.log("✅ Email sent successfully, result:", result);
    res.json({ success: true, result });
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: err.message });
  }
});

expressApp.post("/api/send_appointment_confirmation", async (req, res) => {
  const { to, templateData } = req.body;
  
  // Validate required fields
  if (!to || typeof to !== 'string' || !to.trim()) {
    return res.status(400).json({ error: "Missing required fields: to is required" });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to.trim())) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  if (!templateData || typeof templateData !== 'object') {
    return res.status(400).json({ error: "Missing required fields: templateData is required" });
  }
  
  // Sanitize email
  const sanitizedTo = to.trim().toLowerCase();

  try {
    const websiteUrl = process.env.WEBSITE_URL || "http://localhost:5173";
    const htmlContent = generateAppointmentConfirmationEmail({
      ...templateData,
      websiteUrl
    });

    console.log("📨 Sending appointment confirmation email to:", sanitizedTo);
    const emailResult = await sendEmail({ 
      to: sanitizedTo, 
      subject: `Appointment Confirmed - ${templateData.appointmentDate || 'N/A'}`,
      message: `Your appointment has been confirmed for ${templateData.appointmentDate || 'N/A'} at ${templateData.appointmentTime || 'N/A'}.`,
      html: htmlContent
    });
    console.log("✅ Appointment confirmation email sent successfully, result:", emailResult);
    res.json({ success: true, result: emailResult });
  } catch (err) {
    console.error("❌ Appointment confirmation email sending failed:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: err.message });
  }
});

expressApp.post("/api/send_appointment_cancellation", async (req, res) => {
  const { to, templateData } = req.body;
  
  // Validate required fields
  if (!to || typeof to !== 'string' || !to.trim()) {
    console.error("❌ Missing required fields: to");
    return res.status(400).json({ error: "Missing required fields: to is required" });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to.trim())) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  if (!templateData || typeof templateData !== 'object') {
    console.error("❌ Missing required fields: templateData");
    return res.status(400).json({ error: "Missing required fields: templateData is required" });
  }
  
  // Sanitize email
  const sanitizedTo = to.trim().toLowerCase();
  
  console.log("📨 Received cancellation email request:", { to: sanitizedTo, hasTemplateData: !!templateData });

  try {
    const websiteUrl = process.env.WEBSITE_URL || "http://localhost:5173";
    
    console.log("📨 Sending appointment cancellation email to:", sanitizedTo);
    console.log("📧 Email subject: Appointment Cancelled -", templateData.appointmentDate || 'N/A');
    
    const emailResult = await sendEmail({ 
      to: sanitizedTo, 
      subject: `Appointment Cancelled - ${templateData.appointmentDate || 'N/A'}`,
      message: `Your appointment for ${templateData.appointmentDate || 'N/A'} at ${templateData.appointmentTime || 'N/A'} has been cancelled. If you would like to reschedule, please call us at (617) 202-1372.`,
      templateData: {
        ...templateData,
        websiteUrl
      }
    });
    
    console.log("✅ Appointment cancellation email sent successfully!");
    console.log("📧 Email result:", JSON.stringify(emailResult, null, 2));
    
    res.json({ success: true, result: emailResult });
  } catch (err) {
    console.error("❌ Appointment cancellation email sending failed:", err);
    console.error("❌ Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
expressApp.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all non-API routes (production only)
// Note: Railway'da sadece API server çalışıyor, frontend İyonos'ta
// Bu route'u devre dışı bırakıyoruz çünkü dist klasörü Railway'da yok
if (false) { // Railway'da frontend yok, sadece API
  // Frontend İyonos'ta serve ediliyor
}

// 🟢 SUNUCUYU BAŞLAT
expressApp.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT} (${NODE_ENV} mode)`);
  console.log(`🌐 Website URL: ${process.env.WEBSITE_URL || 'http://localhost:' + PORT}`);
});
