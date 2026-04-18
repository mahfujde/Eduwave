import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, buildInquiryEmail } from "@/lib/nodemailer";

// POST /api/public/inquiries — submit a new inquiry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, whatsapp, university, program, message } = body;

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
        message,
        status: "new",
        source: "website",
      },
    });

    // Send notification email to admin (non-blocking)
    const adminEmail = await prisma.siteConfig.findUnique({ where: { key: "contact_email" } });
    if (adminEmail?.value) {
      sendEmail({
        to: adminEmail.value,
        subject: `New Inquiry from ${name}`,
        html: buildInquiryEmail({ name, email, phone, university, program, message }),
        replyTo: email,
      }).catch((err) => console.error("Email notification failed:", err));
    }

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
