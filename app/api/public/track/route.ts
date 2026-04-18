import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidTrackingNumber, getPublicStatusInfo } from "@/lib/tracking";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tn = searchParams.get("tn")?.toUpperCase().trim();

    if (!tn) return NextResponse.json({ success: false, message: "Tracking number required." }, { status: 400 });
    if (!isValidTrackingNumber(tn)) return NextResponse.json({ success: false, message: "Invalid tracking number format. Expected: EDU-YYYY-NNNNN" }, { status: 400 });

    const app = await prisma.application.findUnique({
      where: { trackingNumber: tn },
      select: {
        trackingNumber: true,
        status: true,
        intake: true,
        createdAt: true,
        updatedAt: true,
        universityName: true,
        programName: true,
        university: { select: { name: true, city: true } },
        program:    { select: { name: true, level: true } },
        student:    { select: { name: true } }, // only name, no email/phone
        messages:   {
          where: { senderRole: "ADMIN" }, // only show admin messages publicly
          select: { message: true, createdAt: true },
          orderBy: { createdAt: "asc" },
          take: 5,
        },
      },
    });

    if (!app) return NextResponse.json({ success: false, message: "No application found with this tracking number." }, { status: 404 });

    const statusInfo = getPublicStatusInfo(app.status);

    return NextResponse.json({
      success: true,
      data: {
        trackingNumber: app.trackingNumber,
        status:         app.status,
        statusInfo,
        studentName:    app.student?.name ?? "Applicant",
        university:     app.university?.name ?? app.universityName ?? "TBC",
        program:        app.program?.name    ?? app.programName    ?? "TBC",
        intake:         app.intake ?? "TBC",
        submittedAt:    app.createdAt,
        lastUpdated:    app.updatedAt,
        adminMessages:  app.messages,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
