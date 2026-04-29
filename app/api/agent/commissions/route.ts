import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET — agent views their commissions
export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const role    = (session.user as any).role;
    const agentId = (session.user as any).id;
    if (role !== "AGENT") return NextResponse.json({ success: false }, { status: 403 });

    const commissions = await prisma.commission.findMany({
      where: { agentId },
      include: {
        application: {
          select: {
            id: true,
            trackingNumber: true,
            status: true,
            universityName: true,
            programName: true,
            student: { select: { name: true, email: true } },
            university: { select: { name: true } },
            program: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: commissions });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// PATCH — agent claims a commission
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const role    = (session.user as any).role;
    const agentId = (session.user as any).id;
    if (role !== "AGENT") return NextResponse.json({ success: false }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Commission ID required" }, { status: 400 });

    const { agentNotes } = await req.json();

    // Find the commission
    const commission = await prisma.commission.findUnique({
      where: { id },
      include: { application: { select: { status: true, trackingNumber: true } } },
    });
    if (!commission) return NextResponse.json({ success: false, message: "Commission not found" }, { status: 404 });
    if (commission.agentId !== agentId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

    // Can only claim if student has visa (visa_processing or enrolled status)
    const eligibleStatuses = ["visa_processing", "enrolled"];
    if (!eligibleStatuses.includes(commission.application.status)) {
      return NextResponse.json({
        success: false,
        message: "Commission can only be claimed when student has reached visa processing or enrolled status.",
      }, { status: 400 });
    }

    // Can only claim if status is pending and amount is set
    if (commission.status !== "pending") {
      return NextResponse.json({ success: false, message: `Commission already ${commission.status}` }, { status: 400 });
    }
    if (!commission.amount) {
      return NextResponse.json({ success: false, message: "Commission amount has not been set by admin yet." }, { status: 400 });
    }

    // Update commission status to claimed
    const updated = await prisma.commission.update({
      where: { id },
      data: {
        status: "claimed",
        claimedAt: new Date(),
        agentNotes: agentNotes || null,
      },
    });

    // Create admin notification
    const agentName = (session.user as any).name || "An agent";
    await prisma.adminNotification.create({
      data: {
        title: "Commission Claimed",
        message: `Agent "${agentName}" has claimed commission of ${commission.currency} ${commission.amount?.toFixed(2)} for application ${commission.application.trackingNumber}.`,
        type: "commission_claim",
        linkUrl: "/admin/commissions",
      },
    });

    return NextResponse.json({ success: true, data: updated, message: "Commission claimed successfully!" });
  } catch (error) {
    console.error("Agent claim commission error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
