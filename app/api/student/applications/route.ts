import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateTrackingNumber } from "@/lib/tracking";
import { sendEmail } from "@/lib/nodemailer";

// GET — list student's own applications
export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any).id;

    const applications = await prisma.application.findMany({
      where: { studentId: userId },
      include: {
        university: { select: { id: true, name: true, logo: true } },
        program:    { select: { id: true, name: true, level: true } },
        documents:  true,
        messages:   { orderBy: { createdAt: "asc" }, include: { sender: { select: { name: true, role: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error("GET /api/student/applications:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// POST — submit a new application
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any).id;
    const role   = (session.user as any).role;
    if (role !== "STUDENT") return NextResponse.json({ success: false, message: "Students only" }, { status: 403 });

    const body = await req.json();
    const { universityId, programId, universityName, programName, intake, notes } = body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Resolve agent if student was referred
    let agentId: string | null = null;
    if (user?.referredBy) {
      const agent = await prisma.user.findUnique({ where: { agentCode: user.referredBy } });
      agentId = agent?.id ?? null;
    }

    const trackingNumber = await generateTrackingNumber();

    const app = await prisma.application.create({
      data: {
        trackingNumber,
        studentId: userId,
        universityId: universityId || null,
        programId:    programId    || null,
        universityName: universityName || null,
        programName:    programName    || null,
        intake: intake || null,
        status: "submitted",
        agentCode: user?.referredBy || null,
        agentId,
        adminNotes: notes || null,
      },
    });

    // Notify admin via dashboard notification
    const studentName = user?.name || "A student";
    await prisma.adminNotification.create({
      data: {
        title: "New Student Application",
        message: `${studentName} (${user?.email}) submitted a new application. University: ${universityName || "TBD"}, Program: ${programName || "TBD"}. Tracking: ${trackingNumber}`,
        type: "student_application",
        linkUrl: "/admin/applications",
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
              <h1 style="margin: 0; font-size: 22px;">📋 New Student Application</h1>
              <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Tracking: ${trackingNumber}</p>
            </div>
            <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #888;">Student:</td><td style="padding: 8px 0; font-weight: 600;">${studentName}</td></tr>
                <tr><td style="padding: 8px 0; color: #888;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${user?.email}" style="color: #E8622A;">${user?.email}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #888;">University:</td><td style="padding: 8px 0; font-weight: 600;">${universityName || "TBD"}</td></tr>
                <tr><td style="padding: 8px 0; color: #888;">Program:</td><td style="padding: 8px 0; font-weight: 600;">${programName || "TBD"}</td></tr>
                ${user?.referredBy ? `<tr><td style="padding: 8px 0; color: #888;">Referred By:</td><td style="padding: 8px 0; font-family: monospace; font-weight: 600;">${user.referredBy}</td></tr>` : ""}
              </table>
              <div style="text-align: center; margin: 24px 0;">
                <a href="https://theeduwave.com/admin/applications" style="display: inline-block; background: linear-gradient(135deg, #E8622A, #D04E18); color: white; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 600; font-size: 15px;">
                  Review Application →
                </a>
              </div>
            </div>
          </div>
        `;
        for (const admin of admins) {
          await sendEmail({
            to: admin.email,
            subject: `📋 New Student Application — ${studentName} (${trackingNumber})`,
            html,
          });
        }
      }
    } catch (emailErr) {
      console.error("Failed to send application notification email:", emailErr);
    }

    return NextResponse.json({ success: true, data: app, message: `Application submitted! Tracking: ${trackingNumber}` }, { status: 201 });
  } catch (error) {
    console.error("POST /api/student/applications:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

