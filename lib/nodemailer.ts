import nodemailer from "nodemailer";

// Dev mode detection — when SMTP is not configured, log emails to console
const isDevMode = !process.env.SMTP_PASS || process.env.SMTP_USER === "your-email@gmail.com";

const transporter = isDevMode
  ? null
  : nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  try {
    if (isDevMode || !transporter) {
      // Dev mode fallback — log to console
      console.log("\n📧 ──── DEV MODE EMAIL ────────────────────────");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`ReplyTo: ${replyTo ?? "—"}`);
      console.log("HTML body logged (check console)");
      console.log("───────────────────────────────────────────────\n");
      return { success: true, messageId: `dev-${Date.now()}` };
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Eduwave" <noreply@theeduwave.com>',
      to,
      subject,
      html,
      replyTo,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

/** Build an inquiry notification email */
export function buildInquiryEmail(data: {
  name: string;
  email: string;
  phone?: string;
  university?: string;
  program?: string;
  message?: string;
}) {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: #1A2B5F; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">📩 New Student Inquiry</h1>
        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Eduwave Educational Consultancy</p>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Name:</td><td style="padding: 8px 0; color: #111827;">${data.name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #E8622A;">${data.email}</a></td></tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Phone:</td><td style="padding: 8px 0; color: #111827;">${data.phone}</td></tr>` : ""}
          ${data.university ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">University:</td><td style="padding: 8px 0; color: #111827;">${data.university}</td></tr>` : ""}
          ${data.program ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #374151;">Program:</td><td style="padding: 8px 0; color: #111827;">${data.program}</td></tr>` : ""}
        </table>
        ${data.message ? `<div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 6px; border-left: 4px solid #E8622A;"><p style="margin: 0 0 4px; font-weight: 600; color: #374151;">Message:</p><p style="margin: 0; color: #4b5563; line-height: 1.6;">${data.message}</p></div>` : ""}
        <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af;">Received via theeduwave.com contact form</p>
      </div>
    </div>
  `;
}

/** Build a password reset email */
export function buildPasswordResetEmail(resetUrl: string, userName: string) {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0F1B3F, #1A2B5F); color: white; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <div style="width: 56px; height: 56px; background: #E8622A; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="font-size: 24px; font-weight: 900; color: white;">E</span>
        </div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Reset Your Password</h1>
        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Eduwave Educational Consultancy</p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 8px;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">We received a request to reset your password. Click the button below to create a new password. This link will expire in <strong>1 hour</strong>.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #E8622A, #D04E18); color: white; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 600; font-size: 15px;">
            Reset Password
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 16px 0 0;">If you didn't request this, you can safely ignore this email. Your password will not be changed.</p>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
          <p style="color: #d1d5db; font-size: 11px; margin: 0;">If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="color: #9ca3af; font-size: 11px; word-break: break-all; margin: 4px 0 0;">${resetUrl}</p>
        </div>
      </div>
    </div>
  `;
}

/** Build a welcome email for new students */
export function buildWelcomeEmail(userName: string, loginUrl: string) {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0F1B3F, #1A2B5F); color: white; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <div style="width: 56px; height: 56px; background: #E8622A; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="font-size: 24px; font-weight: 900; color: white;">E</span>
        </div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Welcome to Eduwave! 🎉</h1>
        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Your study abroad journey starts here</p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 8px;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">Your student account has been created successfully! You can now log in and start your application process.</p>
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <p style="color: #0369a1; font-size: 14px; font-weight: 600; margin: 0 0 8px;">🚀 What's next?</p>
          <ol style="color: #374151; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Complete your student profile</li>
            <li>Browse universities and programs</li>
            <li>Submit your application</li>
            <li>Track your application status</li>
          </ol>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #E8622A, #D04E18); color: white; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 600; font-size: 15px;">
            Log In to Your Account
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 16px 0 0;">Need help? Contact us via WhatsApp or email at ceo.eduwave@gmail.com</p>
      </div>
    </div>
  `;
}

/** Build an auto-reply email for inquiry submissions */
export function buildInquiryAutoReply(data: {
  name: string;
  university?: string;
  program?: string;
}) {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+60112-4103692";
  return `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0F1B3F, #1A2B5F); color: white; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <div style="width: 56px; height: 56px; background: #E8622A; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="font-size: 24px; font-weight: 900; color: white;">E</span>
        </div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Thank You for Contacting Us! 📩</h1>
        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Eduwave Educational Consultancy</p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 8px;">Dear <strong>${data.name}</strong>,</p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
          Thank you for reaching out to Eduwave! We have received your inquiry and our counseling team will get back to you within <strong>24 hours</strong>.
        </p>

        ${data.university || data.program ? `
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 16px; margin: 16px 0;">
          <p style="color: #0369a1; font-size: 13px; font-weight: 600; margin: 0 0 8px;">📋 Your Inquiry Details:</p>
          ${data.university ? `<p style="color: #374151; font-size: 13px; margin: 4px 0;">University: <strong>${data.university}</strong></p>` : ""}
          ${data.program ? `<p style="color: #374151; font-size: 13px; margin: 4px 0;">Program: <strong>${data.program}</strong></p>` : ""}
        </div>
        ` : ""}

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin: 16px 0;">
          <p style="color: #166534; font-size: 13px; font-weight: 600; margin: 0 0 8px;">💡 While you wait, you can:</p>
          <ul style="color: #374151; font-size: 13px; line-height: 2; margin: 0; padding-left: 20px;">
            <li><a href="https://theeduwave.com/universities" style="color: #E8622A; text-decoration: none;">Browse our partner universities</a></li>
            <li><a href="https://theeduwave.com/courses" style="color: #E8622A; text-decoration: none;">Explore available programs</a></li>
            <li><a href="https://theeduwave.com/register" style="color: #E8622A; text-decoration: none;">Create a student account</a> to track your application</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="https://wa.me/${whatsapp.replace(/[^0-9+]/g, "")}" 
             style="display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-weight: 600; font-size: 14px;">
            💬 Chat on WhatsApp
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;"/>
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 0; text-align: center;">
          Eduwave Educational Consultancy<br/>
          Your trusted partner for studying in Malaysia 🇲🇾<br/>
          <a href="https://theeduwave.com" style="color: #E8622A;">theeduwave.com</a>
        </p>
      </div>
    </div>
  `;
}

/** Build application status update email */
export function buildApplicationStatusEmail(data: {
  studentName: string;
  trackingNumber: string;
  universityName: string;
  programName: string;
  status: string;
  message?: string;
}) {
  const statusLabels: Record<string, { label: string; color: string; emoji: string }> = {
    under_review:     { label: "Under Review",      color: "#2563eb", emoji: "🔍" },
    documents_required: { label: "Documents Required", color: "#d97706", emoji: "📄" },
    offer_received:   { label: "Offer Received",    color: "#7c3aed", emoji: "🎉" },
    visa_processing:  { label: "Visa Processing",   color: "#7c3aed", emoji: "✈️" },
    enrolled:         { label: "Enrolled",          color: "#16a34a", emoji: "🎓" },
    rejected:         { label: "Rejected",          color: "#dc2626", emoji: "❌" },
  };
  const s = statusLabels[data.status] || { label: data.status, color: "#6b7280", emoji: "📋" };

  return `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0F1B3F, #1A2B5F); color: white; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">${s.emoji} Application Update</h1>
        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Tracking: ${data.trackingNumber}</p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; font-size: 15px; margin: 0 0 16px;">Hi <strong>${data.studentName}</strong>,</p>
        <div style="background: ${s.color}10; border: 1px solid ${s.color}30; border-radius: 10px; padding: 20px; text-align: center; margin: 16px 0;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280;">Status Updated To:</p>
          <p style="margin: 0; font-size: 20px; font-weight: 700; color: ${s.color};">${s.emoji} ${s.label}</p>
        </div>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px 0; color: #888;">University:</td><td style="padding: 8px 0; font-weight: 600;">${data.universityName}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Program:</td><td style="padding: 8px 0; font-weight: 600;">${data.programName}</td></tr>
        </table>
        ${data.message ? `<div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin: 16px 0;"><p style="margin: 0; font-size: 13px; color: #92400e;"><strong>Note:</strong> ${data.message}</p></div>` : ""}
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://theeduwave.com/track" style="display: inline-block; background: #E8622A; color: white; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-weight: 600; font-size: 14px;">Track Your Application →</a>
        </div>
      </div>
    </div>
  `;
}

/** Build an email for admin when agent submits a student application */
export function buildAgentStudentApplicationEmail(data: {
  agentName: string;
  agentCode: string;
  studentName: string;
  studentEmail: string;
  universityName: string;
  programName: string;
  trackingNumber: string;
}) {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0F1B3F, #1A2B5F); color: white; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <div style="width: 56px; height: 56px; background: #E8622A; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="font-size: 24px; font-weight: 900; color: white;">E</span>
        </div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">🎓 New Student Application by Agent</h1>
        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">A new student has been submitted for review</p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #166534; font-weight: 600;">🤝 Agent Details</p>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #666;">Name:</td><td style="padding: 4px 0; font-weight: 600;">${data.agentName}</td></tr>
            <tr><td style="padding: 4px 0; color: #666;">Agent Code:</td><td style="padding: 4px 0; font-weight: 600; font-family: monospace;">${data.agentCode}</td></tr>
          </table>
        </div>
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #0369a1; font-weight: 600;">📋 Student Application</p>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #666;">Student:</td><td style="padding: 4px 0; font-weight: 600;">${data.studentName}</td></tr>
            <tr><td style="padding: 4px 0; color: #666;">Email:</td><td style="padding: 4px 0;"><a href="mailto:${data.studentEmail}" style="color: #E8622A;">${data.studentEmail}</a></td></tr>
            <tr><td style="padding: 4px 0; color: #666;">University:</td><td style="padding: 4px 0; font-weight: 600;">${data.universityName}</td></tr>
            <tr><td style="padding: 4px 0; color: #666;">Program:</td><td style="padding: 4px 0; font-weight: 600;">${data.programName}</td></tr>
            <tr><td style="padding: 4px 0; color: #666;">Tracking:</td><td style="padding: 4px 0; font-weight: 600; font-family: monospace; color: #0F1B5F;">${data.trackingNumber}</td></tr>
          </table>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://theeduwave.com/admin/applications" style="display: inline-block; background: linear-gradient(135deg, #E8622A, #D04E18); color: white; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 600; font-size: 15px;">
            Review Application →
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0; text-align: center;">This application requires commission setup. Visit the Commissions page to set the amount.</p>
      </div>
    </div>
  `;
}

/** Build commission payment confirmation email for agent */
export function buildCommissionPaymentEmail(data: {
  agentName: string;
  amount: number;
  currency: string;
  trackingNumber: string;
  studentName: string;
  universityName: string;
  receiptUrl?: string;
}) {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: linear-gradient(135deg, #166534, #15803d); color: white; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <div style="width: 56px; height: 56px; background: #fbbf24; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="font-size: 24px;">💰</span>
        </div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Commission Payment Processed!</h1>
        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Your commission has been paid</p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <p style="color: #374151; font-size: 15px; margin: 0 0 16px;">Hi <strong>${data.agentName}</strong>,</p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
          Great news! Your commission payment has been processed and sent to you. Here are the details:
        </p>
        <div style="background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #166534;">Payment Amount</p>
          <p style="margin: 0; font-size: 32px; font-weight: 800; color: #166534;">${data.currency} ${data.amount.toFixed(2)}</p>
          <p style="margin: 8px 0 0; font-size: 12px; color: #22c55e;">✅ PAID</p>
        </div>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px 0; color: #888;">Tracking #:</td><td style="padding: 8px 0; font-weight: 600; font-family: monospace;">${data.trackingNumber}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Student:</td><td style="padding: 8px 0; font-weight: 600;">${data.studentName}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">University:</td><td style="padding: 8px 0; font-weight: 600;">${data.universityName}</td></tr>
        </table>
        ${data.receiptUrl ? `
        <div style="text-align: center; margin: 20px 0;">
          <a href="${data.receiptUrl}" style="display: inline-block; background: #059669; color: white; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-weight: 600; font-size: 14px;">📄 View Payment Receipt</a>
        </div>
        ` : ""}
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://theeduwave.com/agent/commissions" style="display: inline-block; background: linear-gradient(135deg, #E8622A, #D04E18); color: white; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-weight: 600; font-size: 14px;">View Your Commissions →</a>
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0; text-align: center;">Thank you for being a valued Eduwave agent! Keep referring students to earn more commissions.</p>
      </div>
    </div>
  `;
}
