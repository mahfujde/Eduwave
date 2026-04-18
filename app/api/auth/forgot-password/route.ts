import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";
import { sendEmail, buildPasswordResetEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting: max 3 reset requests per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentTokens = await prisma.passwordResetToken.count({
      where: {
        email: normalizedEmail,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentTokens >= 3) {
      // Don't reveal rate limit to prevent enumeration — just return success
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Look up user (don't reveal whether user exists)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user && user.isActive) {
      // Generate secure token
      const token = nanoid(48);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store token
      await prisma.passwordResetToken.create({
        data: {
          email: normalizedEmail,
          token,
          expiresAt,
        },
      });

      // Build reset URL
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      // Send email
      await sendEmail({
        to: normalizedEmail,
        subject: "Reset Your Password — Eduwave",
        html: buildPasswordResetEmail(resetUrl, user.name || "Student"),
      });

      // In dev mode, also log the reset URL
      if (!process.env.SMTP_USER || process.env.SMTP_USER === "your-email@gmail.com") {
        console.log(`\n🔗 PASSWORD RESET URL: ${resetUrl}\n`);
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
