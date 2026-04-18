import nodemailer from "nodemailer";

// Dev mode detection — when SMTP is not configured, log emails to console
const isDevMode = !process.env.SMTP_USER || process.env.SMTP_USER === "your-email@gmail.com";

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
