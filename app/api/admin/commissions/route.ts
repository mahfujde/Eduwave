import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/rbac";
import { sendEmail, buildCommissionPaymentEmail } from "@/lib/nodemailer";

// GET — admin views all commissions
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "all") where.status = status;

    const commissions = await prisma.commission.findMany({
      where,
      include: {
        agent: { select: { id: true, name: true, email: true, agentCode: true, phone: true } },
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

// PATCH — admin sets amount, approves, pays, or rejects commission
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Commission ID required" }, { status: 400 });

    const body = await req.json();
    const { action, amount, currency, adminNotes, receiptUrl } = body;

    const commission = await prisma.commission.findUnique({
      where: { id },
      include: {
        agent: { select: { name: true, email: true, agentCode: true } },
        application: {
          select: { trackingNumber: true, universityName: true, programName: true, student: { select: { name: true } }, university: { select: { name: true } }, program: { select: { name: true } } },
        },
      },
    });
    if (!commission) return NextResponse.json({ success: false, message: "Commission not found" }, { status: 404 });

    // Action: set_amount
    if (action === "set_amount") {
      if (!amount || amount <= 0) {
        return NextResponse.json({ success: false, message: "Valid amount required" }, { status: 400 });
      }
      const updated = await prisma.commission.update({
        where: { id },
        data: {
          amount: parseFloat(amount),
          currency: currency || "MYR",
          adminNotes: adminNotes || commission.adminNotes,
        },
      });
      return NextResponse.json({ success: true, data: updated, message: `Commission amount set to ${currency || "MYR"} ${parseFloat(amount).toFixed(2)}` });
    }

    // Action: approve
    if (action === "approve") {
      if (commission.status !== "claimed") {
        return NextResponse.json({ success: false, message: "Can only approve claimed commissions" }, { status: 400 });
      }
      const updated = await prisma.commission.update({
        where: { id },
        data: {
          status: "approved",
          approvedAt: new Date(),
          adminNotes: adminNotes || commission.adminNotes,
        },
      });
      return NextResponse.json({ success: true, data: updated, message: "Commission approved!" });
    }

    // Action: pay — mark as paid with receipt
    if (action === "pay") {
      if (!["claimed", "approved"].includes(commission.status)) {
        return NextResponse.json({ success: false, message: "Can only pay claimed or approved commissions" }, { status: 400 });
      }
      const updated = await prisma.commission.update({
        where: { id },
        data: {
          status: "paid",
          paidAt: new Date(),
          approvedAt: commission.approvedAt || new Date(),
          receiptUrl: receiptUrl || null,
          adminNotes: adminNotes || commission.adminNotes,
        },
      });

      // Send email to agent
      try {
        const html = buildCommissionPaymentEmail({
          agentName: commission.agent.name,
          amount: commission.amount ?? 0,
          currency: commission.currency,
          trackingNumber: commission.application.trackingNumber,
          studentName: commission.application.student?.name || "Student",
          universityName: commission.application.university?.name || commission.application.universityName || "University",
          receiptUrl: receiptUrl || undefined,
        });
        await sendEmail({
          to: commission.agent.email,
          subject: `💰 Commission Payment Processed — ${commission.application.trackingNumber}`,
          html,
        });
      } catch (emailErr) {
        console.error("Failed to send commission payment email:", emailErr);
      }

      return NextResponse.json({ success: true, data: updated, message: "Commission marked as paid!" });
    }

    // Action: reject
    if (action === "reject") {
      const updated = await prisma.commission.update({
        where: { id },
        data: {
          status: "rejected",
          adminNotes: adminNotes || commission.adminNotes,
        },
      });
      return NextResponse.json({ success: true, data: updated, message: "Commission rejected." });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin commission error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
