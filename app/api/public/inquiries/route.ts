import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, sendClientEmail, buildInquiryEmail, buildInquiryAutoReply, ADMIN_EMAIL } from "@/lib/nodemailer";

// POST /api/public/inquiries — submit a new inquiry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, whatsapp, university, program, level, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        university: university || null,
        program: program || null,
        message: level ? `[Level: ${level}] ${message}` : message,
        status: "new",
        source: "website",
      },
    });

    // 1) Send notification email to admin (non-blocking)
    const adminEmailSetting = await prisma.siteConfig.findUnique({ where: { key: "contact_email" } });
    const adminTo = adminEmailSetting?.value || ADMIN_EMAIL;
    sendEmail({
      to: adminTo,
      subject: `📩 New Inquiry from ${name}`,
      html: buildInquiryEmail({ name, email, phone, university, program, message }),
      replyTo: email,
    }).catch((err) => console.error("Admin notification email failed:", err));

    // 2) Send auto-reply to the student (non-blocking, from noreply)
    sendClientEmail({
      to: email,
      subject: "Thank you for contacting Eduwave! We'll get back to you soon 🎓",
      html: buildInquiryAutoReply({ name, university, program }),
    }).catch((err) => console.error("Auto-reply email failed:", err));

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
