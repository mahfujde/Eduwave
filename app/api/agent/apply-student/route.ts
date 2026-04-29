import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateTrackingNumber } from "@/lib/tracking";
import { sendEmail, buildAgentStudentApplicationEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const role      = (session.user as any).role;
    const agentId   = (session.user as any).id;
    const agentCode = (session.user as any).agentCode;
    if (role !== "AGENT") return NextResponse.json({ success: false }, { status: 403 });

    const body = await req.json();
    const { studentName, studentEmail, studentPhone, universityId, programId, universityName, programName, intake, passportNo, nationality, notes } = body;

    if (!studentName || !studentEmail) {
      return NextResponse.json({ success: false, message: "Student name and email are required" }, { status: 400 });
    }

    // Create or find student user
    let student = await prisma.user.findUnique({ where: { email: studentEmail } });
    if (!student) {
      const bcrypt = require("bcryptjs");
      const { nanoid } = await import("nanoid");
      const tempPassword = nanoid(10);
      const hashed = await bcrypt.hash(tempPassword, 12);
      student = await prisma.user.create({
        data: {
          email: studentEmail,
          name: studentName,
          password: hashed,
          role: "STUDENT",
          phone: studentPhone || null,
          referredBy: agentCode,
          isApproved: false,
        },
      });

      // Create student profile
      await prisma.studentProfile.create({
        data: {
          userId: student.id,
          passportNo: passportNo || null,
          nationality: nationality || "Bangladeshi",
        },
      });
    }

    // Generate tracking number
    const trackingNumber = await generateTrackingNumber();

    // Create application
    const application = await prisma.application.create({
      data: {
        trackingNumber,
        studentId: student.id,
        universityId: universityId || null,
        programId: programId || null,
        universityName: universityName || null,
        programName: programName || null,
        intake: intake || null,
        status: "submitted",
        agentCode,
        agentId,
        adminNotes: notes || null,
      },
    });

    // Create commission record (pending — amount will be set by admin)
    await prisma.commission.create({
      data: {
        applicationId: application.id,
        agentId,
        status: "pending",
      },
    });

    // Create admin notification
    const agentName = (session.user as any).name || "An agent";
    await prisma.adminNotification.create({
      data: {
        title: "New Student Application by Agent",
        message: `Agent "${agentName}" (${agentCode}) has submitted a new student application for ${studentName} (${studentEmail}). Tracking: ${trackingNumber}`,
        type: "agent_student",
        linkUrl: "/admin/applications",
      },
    });

    // Send email to admin(s)
    try {
      const admins = await prisma.user.findMany({
        where: { role: { in: ["SUPER_ADMIN", "ADMIN"] }, isActive: true },
        select: { email: true },
      });
      const adminEmails = admins.map((a) => a.email);
      if (adminEmails.length > 0) {
        const html = buildAgentStudentApplicationEmail({
          agentName,
          agentCode: agentCode || "",
          studentName,
          studentEmail,
          universityName: universityName || "TBD",
          programName: programName || "TBD",
          trackingNumber,
        });
        for (const email of adminEmails) {
          await sendEmail({
            to: email,
            subject: `🎓 New Student Application by Agent ${agentName} — ${trackingNumber}`,
            html,
          });
        }
      }
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
    }

    return NextResponse.json({
      success: true,
      data: { trackingNumber, applicationId: application.id },
      message: `Student application submitted successfully! Tracking: ${trackingNumber}`,
    });
  } catch (error: any) {
    console.error("Agent apply-student error:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}
