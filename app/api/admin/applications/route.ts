import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isStaff } from "@/lib/rbac";
import { sendEmail, buildApplicationStatusEmail } from "@/lib/nodemailer";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !isStaff((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status    = searchParams.get("status");
    const agentCode = searchParams.get("agentCode");
    const studentId = searchParams.get("studentId");
    const page      = parseInt(searchParams.get("page") ?? "1");
    const take      = parseInt(searchParams.get("limit") ?? "20");
    const skip      = (page - 1) * take;

    const where: any = {};
    if (status    && status !== "all") where.status    = status;
    if (agentCode)                     where.agentCode = agentCode;
    if (studentId)                     where.studentId = studentId;

    const [apps, total] = await Promise.all([
      prisma.application.findMany({
        where, skip, take,
        include: {
          student:    { select: { id: true, name: true, email: true, phone: true } },
          university: { select: { id: true, name: true, logo: true } },
          program:    { select: { id: true, name: true, level: true } },
          agent:      { select: { id: true, name: true, agentCode: true } },
          _count:     { select: { messages: true, documents: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.application.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: apps, total, page, pageSize: take, totalPages: Math.ceil(total / take) });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !isStaff((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    const body = await req.json();
    const updated = await prisma.application.update({
      where: { id },
      data: {
        ...(body.status     !== undefined && { status: body.status }),
        ...(body.adminNotes !== undefined && { adminNotes: body.adminNotes }),
      },
      include: {
        student:    { select: { name: true, email: true } },
        university: { select: { name: true } },
        program:    { select: { name: true } },
      },
    });

    // Send email notification to student when status changes
    if (body.status && updated.student?.email) {
      try {
        const html = buildApplicationStatusEmail({
          studentName: updated.student.name,
          trackingNumber: updated.trackingNumber,
          universityName: updated.university?.name || updated.universityName || "University",
          programName: updated.program?.name || updated.programName || "Program",
          status: body.status,
          message: body.adminNotes || undefined,
        });
        await sendEmail({
          to: updated.student.email,
          subject: `📋 Application Update — ${updated.trackingNumber} (${body.status.replace(/_/g, " ").toUpperCase()})`,
          html,
        });
      } catch (emailErr) {
        console.error("Failed to send status update email:", emailErr);
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

