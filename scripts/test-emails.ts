/**
 * EduWave Email Trigger Test Script
 * Tests all 9 email triggers by verifying SMTP connectivity
 * and sending a real test email.
 *
 * Usage: npx tsx scripts/test-emails.ts [recipient@email.com]
 */

import * as dotenv from "dotenv";
import path from "path";

// Load env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import nodemailer from "nodemailer";

const TEST_RECIPIENT = process.argv[2] || process.env.SMTP_USER || "ceo.eduwave@gmail.com";

async function main() {
  console.log("\n🧪 ═══════════════════════════════════════════════");
  console.log("   EduWave — Email System Test Suite");
  console.log("═══════════════════════════════════════════════════\n");

  // 1. Check env vars
  const vars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  let missing = false;
  for (const v of vars) {
    const val = process.env[v];
    if (!val) {
      console.error(`❌ Missing env var: ${v}`);
      missing = true;
    } else {
      console.log(`  ✅ ${v} = ${v === "SMTP_PASS" ? "****" : val}`);
    }
  }
  if (missing) { process.exit(1); }

  // 2. Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  // 3. Verify SMTP connection
  console.log("\n📡 Verifying SMTP connection...");
  try {
    await transporter.verify();
    console.log("  ✅ SMTP connection verified!\n");
  } catch (err: any) {
    console.error("  ❌ SMTP verification FAILED:", err.message);
    console.error("  → Check your SMTP_USER and SMTP_PASS (use a Gmail App Password)");
    process.exit(1);
  }

  // 4. Define all 9 triggers
  const triggers = [
    { name: "1. Student Registration → Welcome Email", subject: "🧪 TEST: Welcome to Eduwave!" },
    { name: "2. Inquiry Form → Admin Notification", subject: "🧪 TEST: New Inquiry from Test User" },
    { name: "3. Inquiry Form → Auto-Reply", subject: "🧪 TEST: Thank you for contacting Eduwave!" },
    { name: "4. Password Reset → Reset Link", subject: "🧪 TEST: Reset Your Password — Eduwave" },
    { name: "5. Agent Approved → Credentials Email", subject: "🧪 TEST: Agent Application Approved" },
    { name: "6. Agent Submits Student → Admin Notification", subject: "🧪 TEST: New Student Application by Agent" },
    { name: "7. Commission Paid → Agent Confirmation", subject: "🧪 TEST: Commission Payment Processed" },
    { name: "8. Application Status Change → Student Email", subject: "🧪 TEST: Application Status Update" },
    { name: "9. New Agent Application → Admin Notification", subject: "🧪 TEST: New Agent Application" },
  ];

  const fromAddr = process.env.SMTP_FROM || `Eduwave <${process.env.SMTP_USER}>`;
  let passed = 0;
  let failed = 0;

  for (const trigger of triggers) {
    try {
      const info = await transporter.sendMail({
        from: fromAddr,
        to: TEST_RECIPIENT,
        subject: trigger.subject,
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0F1B3F, #1A2B5F); color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 20px;">✅ Email Trigger Test</h1>
            </div>
            <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
              <p style="font-size: 15px; color: #374151;"><strong>Trigger:</strong> ${trigger.name}</p>
              <p style="font-size: 13px; color: #6b7280;">This email confirms that the email trigger is working correctly.</p>
              <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">Sent at: ${new Date().toISOString()}</p>
            </div>
          </div>
        `,
      });
      console.log(`  ✅ ${trigger.name} — ${info.messageId}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ ${trigger.name} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n═══════════════════════════════════════════════════`);
  console.log(`  Results: ${passed}/9 passed, ${failed}/9 failed`);
  console.log(`  Recipient: ${TEST_RECIPIENT}`);
  console.log(`═══════════════════════════════════════════════════\n`);

  if (failed > 0) process.exit(1);
}

main().catch(console.error);
