// server/emailTemplate.js
// Profesyonel HTML Email Template

export function generateQuoteResponseEmail({
  customerName,
  quoteNumber,
  serviceType,
  price,
  bedrooms,
  bathrooms,
  companyName = "SolVida Clean",
  companyPhone = "",
  companyEmail = "info@solvidaclean.com",
  companyAddress = "",
  websiteUrl = "http://localhost:5173", // Test için localhost, sonra production URL
}) {
  const currentYear = new Date().getFullYear();
  
  // Format price - add $ if not present
  const formatPrice = (priceStr) => {
    if (!priceStr) return "";
    const trimmed = priceStr.trim();
    // If already starts with $, €, £, etc., return as is
    if (/^[$€£¥]/.test(trimmed)) {
      return trimmed;
    }
    // Otherwise, add $
    return `$${trimmed}`;
  };
  
  const formattedPrice = formatPrice(price);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote Response - ${quoteNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                ${companyName}
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400;">
                Professional Cleaning Services
              </p>
            </td>
          </tr>

          <!-- Quote Number Badge -->
          <tr>
            <td style="padding: 30px 40px 20px; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 12px 24px; border-radius: 8px; font-size: 18px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);">
                Quote #${quoteNumber}
              </div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 600; line-height: 1.3;">
                Dear ${customerName},
              </h2>
              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in our cleaning services. We have reviewed your quote request and are pleased to provide you with our professional quote:
              </p>
            </td>
          </tr>

          <!-- Service Details Card -->
          <tr>
            <td style="padding: 0 40px 25px;">
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px;">
                <p style="margin: 0 0 12px; color: #1e40af; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Service Details
                </p>
                <p style="margin: 0 0 8px; color: #1f2937; font-size: 18px; font-weight: 600;">
                  ${serviceType && serviceType.toLowerCase().includes('deep') ? 'Professional Cleaning' : (serviceType || 'General Cleaning')}
                </p>
                ${bedrooms ? `<p style="margin: 4px 0; color: #4b5563; font-size: 14px;">Bedrooms: ${bedrooms}</p>` : ''}
                ${bathrooms ? `<p style="margin: 4px 0; color: #4b5563; font-size: 14px;">Bathrooms: ${bathrooms}</p>` : ''}
              </div>
            </td>
          </tr>

          <!-- Price Quote Card -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 30px; text-align: center;">
                <p style="margin: 0 0 12px; color: #92400e; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Your Quote
                </p>
                <div style="margin: 15px 0; color: #1f2937; font-size: 48px; font-weight: 700; line-height: 1;">
                  ${formattedPrice}
                </div>
                <p style="margin: 8px 0 0; color: #78350f; font-size: 14px; font-weight: 500;">
                  All-inclusive professional cleaning service
                </p>
              </div>
            </td>
          </tr>

          <!-- What's Included -->
          <tr>
            <td style="padding: 0 40px 25px;">
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                <p style="margin: 0 0 15px; color: #374151; font-size: 15px; font-weight: 600;">
                  What's Included:
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                  <li>Professional cleaning</li>
                  <li>Eco-friendly cleaning products</li>
                  <li>Fully insured and bonded team</li>
                  <li>Satisfaction guaranteed</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Important Notice -->
          <tr>
            <td style="padding: 0 40px 25px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;">
                <p style="margin: 0 0 12px; color: #92400e; font-size: 15px; font-weight: 600;">
                  Important Service Information:
                </p>
                <p style="margin: 0 0 10px; color: #78350f; font-size: 14px; line-height: 1.6;">
                  Please note that <strong>folding laundry</strong> and <strong>washing dishes</strong> are not included in our standard cleaning service. If you require these additional services, please specify when scheduling your appointment, as they are subject to additional charges.
                </p>
              </div>
            </td>
          </tr>

          <!-- Address Verification Notice -->
          <tr>
            <td style="padding: 0 40px 25px;">
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px;">
                <p style="margin: 0 0 12px; color: #991b1b; font-size: 15px; font-weight: 600;">
                  Service Area Verification:
                </p>
                <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
                  If your service address is outside our standard service areas, we may not be able to provide an accurate estimate, or pricing may differ from our standard rates. Please contact us to confirm service availability for your location.
                </p>
              </div>
            </td>
          </tr>

          <!-- Call to Action Buttons -->
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Ready to get started? Accept this quote to schedule your appointment.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="padding: 0 6px;">
                    <a href="${websiteUrl}/appointment?quote=${quoteNumber}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                      ✓ Accept Quote
                    </a>
                  </td>
                  <td align="center" style="padding: 0 6px;">
                    <a href="mailto:${companyEmail}?subject=Question about Quote ${quoteNumber}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                      Contact Us
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If the button above doesn't work, copy and paste this link into your browser:<br/>
                <a href="${websiteUrl}/appointment?quote=${quoteNumber}" style="color: #3b82f6; text-decoration: underline; word-break: break-all;">${websiteUrl}/appointment?quote=${quoteNumber}</a>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; text-align: center;">
              <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                <strong style="color: #1f2937;">${companyName}</strong>
              </p>
              ${companyPhone ? `<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Phone: <a href="tel:${companyPhone}" style="color: #3b82f6; text-decoration: none;">${companyPhone}</a></p>` : ''}
              ${companyEmail ? `<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Email: <a href="mailto:${companyEmail}" style="color: #3b82f6; text-decoration: none;">${companyEmail}</a></p>` : ''}
              ${companyAddress ? `<p style="margin: 0 0 20px; color: #6b7280; font-size: 14px;">${companyAddress}</p>` : ''}
              <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                © ${currentYear} ${companyName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Appointment Confirmation Email Template
export function generateAppointmentConfirmationEmail({
  customerName,
  appointmentDate,
  appointmentTime,
  quoteNumber,
  serviceType,
  price,
  appointmentId,
  companyName = "SolVida Clean",
  companyPhone = "(617) 202-1372",
  companyEmail = "info@solvidaclean.com",
  companyAddress = "",
  websiteUrl = "http://localhost:5173",
}) {
  const currentYear = new Date().getFullYear();
  const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format price - add $ if not present
  const formatPrice = (priceStr) => {
    if (!priceStr) return "";
    const trimmed = String(priceStr).trim();
    // If already starts with $, €, £, etc., return as is
    if (/^[$€£¥]/.test(trimmed)) {
      return trimmed;
    }
    // Otherwise, add $
    return `$${trimmed}`;
  };
  
  const formattedPrice = formatPrice(price);
  
  // Format time (HH:MM to 12-hour format)
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 40px 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 20px;">
                <tr>
                  <td style="width: 80px; height: 80px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; text-align: center; vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 48px; font-weight: bold; line-height: 80px; display: inline-block;">✓</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                Appointment Confirmed!
              </h1>
              <p style="margin: 12px 0 0; color: rgba(255, 255, 255, 0.95); font-size: 18px; font-weight: 400;">
                We're excited to serve you
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h2 style="margin: 0 0 15px; color: #1f2937; font-size: 24px; font-weight: 600; line-height: 1.3;">
                Dear ${customerName},
              </h2>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Great news! Your appointment has been confirmed. We're looking forward to providing you with exceptional cleaning service.
              </p>
            </td>
          </tr>

          <!-- Appointment Details Card -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #10b981; border-radius: 12px; padding: 30px;">
                <p style="margin: 0 0 20px; color: #065f46; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">
                  📅 Appointment Details
                </p>
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(16, 185, 129, 0.2);">
                      <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">Date</p>
                      <p style="margin: 4px 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">${formattedDate}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(16, 185, 129, 0.2);">
                      <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">Time</p>
                      <p style="margin: 4px 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">${formatTime(appointmentTime)}</p>
                    </td>
                  </tr>
                  ${quoteNumber ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(16, 185, 129, 0.2);">
                      <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">Quote Number</p>
                      <p style="margin: 4px 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">#${quoteNumber}</p>
                    </td>
                  </tr>
                  ` : ''}
                  ${serviceType ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(16, 185, 129, 0.2);">
                      <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">Service</p>
                      <p style="margin: 4px 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">${serviceType}</p>
                    </td>
                  </tr>
                  ` : ''}
                  ${price ? `
                  <tr>
                    <td style="padding: 12px 0;">
                      <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">Total Price</p>
                      <p style="margin: 4px 0 0; color: #1f2937; font-size: 24px; font-weight: 700;">${formattedPrice}</p>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
            </td>
          </tr>

          <!-- What to Expect -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
                <p style="margin: 0 0 15px; color: #374151; font-size: 16px; font-weight: 600;">
                  What to Expect:
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                  <li>Our professional team will arrive at the scheduled time</li>
                  <li>We'll bring all necessary equipment and eco-friendly supplies</li>
                  <li>We'll work efficiently to complete your cleaning service</li>
                  <li>Your satisfaction is our priority - we guarantee quality work</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Important Notes -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;">
                <p style="margin: 0 0 10px; color: #92400e; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  ⚠️ Important Reminders
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                  <li>Please ensure someone is available to let our team in</li>
                  <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                  <li>We'll send you a reminder 24 hours before your appointment</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Cancel Appointment Section -->
          ${appointmentId ? `
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px;">
                <p style="margin: 0 0 12px; color: #991b1b; font-size: 15px; font-weight: 600;">
                  Need to Cancel?
                </p>
                <p style="margin: 0 0 15px; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
                  If you need to cancel your appointment, you can do so up to 24 hours before the scheduled time by clicking the button below. For cancellations within 24 hours, please call us directly.
                </p>
                <a href="${websiteUrl}/appointment?quote=${quoteNumber || ''}&cancel=${appointmentId}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); transition: all 0.3s ease;">
                  Cancel Appointment
                </a>
              </div>
            </td>
          </tr>` : ''}

          <!-- Contact Information -->
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <p style="margin: 0 0 15px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Questions or need to make changes? We're here to help!
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="padding: 0 6px;">
                    <a href="tel:${companyPhone}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                      📞 Call Us
                    </a>
                  </td>
                  <td align="center" style="padding: 0 6px;">
                    <a href="mailto:${companyEmail}?subject=Appointment Question" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                      ✉️ Email Us
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; text-align: center;">
              <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                <strong style="color: #1f2937;">${companyName}</strong>
              </p>
              ${companyPhone ? `<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Phone: <a href="tel:${companyPhone}" style="color: #3b82f6; text-decoration: none;">${companyPhone}</a></p>` : ''}
              ${companyEmail ? `<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Email: <a href="mailto:${companyEmail}" style="color: #3b82f6; text-decoration: none;">${companyEmail}</a></p>` : ''}
              ${companyAddress ? `<p style="margin: 0 0 20px; color: #6b7280; font-size: 14px;">${companyAddress}</p>` : ''}
              <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                © ${currentYear} ${companyName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Appointment Cancellation Email Template
export function generateQuoteNotificationEmail({
  customerName,
  customerEmail,
  customerPhone,
  quoteNumber,
  serviceType,
  bedrooms,
  bathrooms,
  message,
  imageUrls = [],
  companyName = "SolVida Clean",
  companyPhone = "(617) 202-1372",
  companyEmail = "info@solvidaclean.com",
  websiteUrl = "https://solvidaclean.com",
}) {
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request - ${quoteNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                🆕 New Quote Request
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                You have received a new quote request:
              </p>
              
              <!-- Quote Details -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #374151;">Quote Number:</strong>
                    <span style="color: #1f2937; margin-left: 8px;">${quoteNumber}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #374151;">Customer Name:</strong>
                    <span style="color: #1f2937; margin-left: 8px;">${customerName || 'N/A'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #374151;">Email:</strong>
                    <a href="mailto:${customerEmail}" style="color: #3b82f6; margin-left: 8px; text-decoration: none;">${customerEmail || 'N/A'}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #374151;">Phone:</strong>
                    <a href="tel:${customerPhone?.replace(/[^0-9]/g, '') || ''}" style="color: #3b82f6; margin-left: 8px; text-decoration: none;">${customerPhone || 'N/A'}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #374151;">Service Type:</strong>
                    <span style="color: #1f2937; margin-left: 8px;">${serviceType || 'General Cleaning'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #374151;">Bedrooms:</strong>
                    <span style="color: #1f2937; margin-left: 8px;">${bedrooms || 1}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #374151;">Bathrooms:</strong>
                    <span style="color: #1f2937; margin-left: 8px;">${bathrooms || 1}</span>
                  </td>
                </tr>
                ${message ? `
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #374151;">Message:</strong>
                    <p style="color: #1f2937; margin: 8px 0 0; line-height: 1.6;">${message}</p>
                  </td>
                </tr>
                ` : ''}
                ${imageUrls && imageUrls.length > 0 ? `
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #374151;">Images:</strong>
                    <span style="color: #1f2937; margin-left: 8px;">${imageUrls.length} image(s) attached</span>
                  </td>
                </tr>
                ` : ''}
              </table>
              
              <p style="margin: 30px 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Please review this quote request and respond to the customer as soon as possible.
              </p>
              
              <!-- Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background-color: #3b82f6; border-radius: 8px;">
                          <a href="${websiteUrl}/admin" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                            View in Admin Panel
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                <strong>${companyName}</strong>
              </p>
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                Phone: <a href="tel:6172021372" style="color: #3b82f6; text-decoration: none;">${companyPhone}</a>
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Email: <a href="mailto:${companyEmail}" style="color: #3b82f6; text-decoration: none;">${companyEmail}</a>
              </p>
              <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px;">
                © ${currentYear} ${companyName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generateAppointmentCancellationEmail({
  customerName,
  appointmentDate,
  appointmentTime,
  quoteNumber,
  serviceType,
  companyName = "SolVida Clean",
  companyPhone = "(617) 202-1372",
  companyEmail = "info@solvidaclean.com",
  companyAddress = "",
  websiteUrl = "http://localhost:5173",
}) {
  const currentYear = new Date().getFullYear();
  
  // Format date
  const formattedDate = typeof appointmentDate === 'string' 
    ? new Date(appointmentDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : appointmentDate.toDate 
      ? appointmentDate.toDate().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : new Date(appointmentDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

  // Format time
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formattedTime = formatTime(appointmentTime);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Cancelled - ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 40px 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 20px;">
                <tr>
                  <td style="width: 80px; height: 80px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; text-align: center; vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 48px; font-weight: bold; line-height: 80px; display: inline-block;">✕</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                Appointment Cancelled
              </h1>
              <p style="margin: 12px 0 0; color: rgba(255, 255, 255, 0.95); font-size: 18px; font-weight: 400;">
                We're sorry to see you go
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h2 style="margin: 0 0 15px; color: #1f2937; font-size: 24px; font-weight: 600; line-height: 1.3;">
                Dear ${customerName},
              </h2>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                We wanted to inform you that your appointment has been cancelled.
              </p>
            </td>
          </tr>

          <!-- Cancelled Appointment Details -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #ef4444; border-radius: 12px; padding: 30px;">
                <p style="margin: 0 0 20px; color: #991b1b; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">
                  Cancelled Appointment Details
                </p>
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(239, 68, 68, 0.2);">
                      <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">Date</p>
                      <p style="margin: 4px 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">${formattedDate}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(239, 68, 68, 0.2);">
                      <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">Time</p>
                      <p style="margin: 4px 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">${formattedTime}</p>
                    </td>
                  </tr>
                  ${serviceType ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(239, 68, 68, 0.2);">
                      <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">Service</p>
                      <p style="margin: 4px 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">${serviceType}</p>
                    </td>
                  </tr>` : ''}
                  ${quoteNumber ? `
                  <tr>
                    <td style="padding: 12px 0;">
                      <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">Quote Number</p>
                      <p style="margin: 4px 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">${quoteNumber}</p>
                    </td>
                  </tr>` : ''}
                </table>
              </div>
            </td>
          </tr>

          <!-- Important Notice -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;">
                <p style="margin: 0 0 12px; color: #92400e; font-size: 15px; font-weight: 600;">
                  ⚠️ Important: Need to Reschedule?
                </p>
                <p style="margin: 0 0 10px; color: #78350f; font-size: 14px; line-height: 1.6;">
                  If you would like to book a new appointment or reschedule, please <strong style="color: #991b1b;">call us directly</strong> at <a href="tel:${companyPhone}" style="color: #3b82f6; text-decoration: none; font-weight: 700; font-size: 15px;">${companyPhone}</a>.
                </p>
                <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6; font-weight: 600;">
                  Our team will be happy to help you find a new time that works for you. We cannot process new appointments through email - please call us to schedule.
                </p>
              </div>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                We hope to serve you in the future. If you have any questions, please don't hesitate to contact us.
              </p>
              <a href="tel:${companyPhone}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
                Call Us to Reschedule
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; text-align: center;">
              <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                <strong style="color: #1f2937;">${companyName}</strong>
              </p>
              ${companyPhone ? `<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Phone: <a href="tel:${companyPhone}" style="color: #3b82f6; text-decoration: none;">${companyPhone}</a></p>` : ''}
              ${companyEmail ? `<p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Email: <a href="mailto:${companyEmail}" style="color: #3b82f6; text-decoration: none;">${companyEmail}</a></p>` : ''}
              ${companyAddress ? `<p style="margin: 0 0 20px; color: #6b7280; font-size: 14px;">${companyAddress}</p>` : ''}
              <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                © ${currentYear} ${companyName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

