import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateTrackingNumber } from "@/lib/tracking";

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

    return NextResponse.json({ success: true, data: app, message: `Application submitted! Tracking: ${trackingNumber}` }, { status: 201 });
  } catch (error) {
    console.error("POST /api/student/applications:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
