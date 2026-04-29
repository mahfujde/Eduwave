import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/nodemailer";

// Public agent application submission
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, experience, region, motivation } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, message: "Name and email are required." }, { status: 400 });
    }

    // Check if already applied
    const existing = await prisma.agentApplication.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, message: "An application with this email already exists." }, { status: 409 });
    }

    const application = await prisma.agentApplication.create({
      data: { name, email, phone, company, experience, region, motivation, status: "pending" },
    });

    // Notify admin via dashboard notification
    await prisma.adminNotification.create({
      data: {
        title: "New Agent Application",
        message: `${name} (${email}) has applied to become an agent.${company ? ` Company: ${company}.` : ""}${region ? ` Region: ${region}.` : ""}`,
        type: "agent_application",
        linkUrl: "/admin/agents",
      },
    }).catch(() => {});

    // Notify admin via email
    try {
      const admins = await prisma.user.findMany({
        where: { role: { in: ["SUPER_ADMIN", "ADMIN"] }, isActive: true },
        select: { email: true },
      });
      if (admins.length > 0) {
        const html = `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0F1B3F, #1A2B5F); color: white; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 22px;">🤝 New Agent Application</h1>
              <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">A new agent has applied to join Eduwave</p>
            </div>
            <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #888;">Name:</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #888;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #E8622A;">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding: 8px 0; color: #888;">Phone:</td><td style="padding: 8px 0;">${phone}</td></tr>` : ""}
                ${company ? `<tr><td style="padding: 8px 0; color: #888;">Company:</td><td style="padding: 8px 0;">${company}</td></tr>` : ""}
                ${region ? `<tr><td style="padding: 8px 0; color: #888;">Region:</td><td style="padding: 8px 0;">${region}</td></tr>` : ""}
              </table>
              ${motivation ? `<div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 6px; border-left: 4px solid #E8622A;"><p style="margin: 0 0 4px; font-weight: 600; color: #374151;">Motivation:</p><p style="margin: 0; color: #4b5563; line-height: 1.6;">${motivation}</p></div>` : ""}
              <div style="text-align: center; margin: 24px 0;">
                <a href="https://theeduwave.com/admin/agents" style="display: inline-block; background: linear-gradient(135deg, #E8622A, #D04E18); color: white; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 600; font-size: 15px;">
                  Review Application →
                </a>
              </div>
            </div>
          </div>
        `;
        for (const admin of admins) {
          await sendEmail({
            to: admin.email,
            subject: `🤝 New Agent Application — ${name}`,
            html,
          });
        }
      }
    } catch (emailErr) {
      console.error("Failed to send agent application notification:", emailErr);
    }

    return NextResponse.json({ success: true, data: application, message: "Your agent application has been submitted! We'll review it and contact you within 2-3 business days." }, { status: 201 });
  } catch (error) {
    console.error("Agent apply error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

