import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/rbac";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

// Ensure fresh data on every request
export const dynamic = "force-dynamic";

// GET all agent applications (pending/approved/rejected)
export async function GET() {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });

    const agentApps = await prisma.agentApplication.findMany({
      include: { user: { select: { id: true, name: true, email: true, agentCode: true, isApproved: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: agentApps });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// PATCH — approve or reject an agent application
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    const { action, reviewNotes } = await req.json();
    const agentApp = await prisma.agentApplication.findUnique({ where: { id } });
    if (!agentApp) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    if (action === "approve") {
      const agentCode = `AGT-${nanoid(8).toUpperCase()}`;
      const tempPassword = nanoid(10);
      const hashed = await bcrypt.hash(tempPassword, 12);

      // Create user account for agent
      const user = await prisma.user.upsert({
        where: { email: agentApp.email },
        update: { role: "AGENT", isApproved: true, isActive: true, agentCode, password: hashed },
        create: { email: agentApp.email, name: agentApp.name, password: hashed, role: "AGENT", isApproved: true, isActive: true, agentCode },
      });

      await prisma.agentApplication.update({
        where: { id },
        data: { status: "approved", userId: user.id, reviewNotes: reviewNotes || null },
      });

      // Try to send email notification (non-blocking)
      let emailSent = false;
      try {
        const siteUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://theeduwave.com";
        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+60112-4103692";

        // Send email via sendClientEmail helper (noreply reply-to)
        const { sendClientEmail } = require("@/lib/nodemailer");
        await sendClientEmail({
          to: agentApp.email,
          subject: "🎉 Your Agent Application Has Been Approved - Eduwave",
          html: `
              <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 16px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #1A2B5F, #0F1B3F); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #fff; margin: 0; font-size: 28px;">🎉 Welcome to Eduwave!</h1>
                  <p style="color: rgba(255,255,255,0.7); margin-top: 8px;">Your agent application has been approved</p>
                </div>
                <div style="padding: 30px;">
                  <p style="font-size: 16px; color: #333;">Dear <strong>${agentApp.name}</strong>,</p>
                  <p style="font-size: 14px; color: #555; line-height: 1.6;">
                    Congratulations! Your application to become an Eduwave agent has been approved. 
                    You can now log in to your agent dashboard and start referring students.
                  </p>
                  
                  <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #1A2B5F; font-size: 16px;">📋 Your Credentials</h3>
                    <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #888; width: 120px;">Agent Code:</td>
                        <td style="padding: 8px 0; font-weight: bold; font-family: monospace; color: #1A2B5F;">${agentCode}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #888;">Email:</td>
                        <td style="padding: 8px 0; font-weight: bold;">${agentApp.email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #888;">Password:</td>
                        <td style="padding: 8px 0; font-weight: bold; font-family: monospace; color: #d4380d;">${tempPassword}</td>
                      </tr>
                    </table>
                  </div>

                  <div style="text-align: center; margin: 25px 0;">
                    <a href="${siteUrl}/admin/login" 
                       style="background: #C17024; color: #fff; padding: 14px 40px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">
                      Login to Your Dashboard →
                    </a>
                  </div>

                  <div style="background: #e8f5e9; border-radius: 10px; padding: 15px; margin-top: 20px;">
                    <p style="margin: 0; font-size: 13px; color: #2e7d32;">
                      <strong>⚠️ Important:</strong> Please change your password after your first login for security.
                    </p>
                  </div>

                  <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;"/>
                  
                  <p style="font-size: 13px; color: #888; margin: 0;">
                    Need help? Contact us on WhatsApp: 
                    <a href="https://wa.me/${whatsappNumber.replace(/[^0-9+]/g,'')}" style="color: #25D366;">${whatsappNumber}</a>
                  </p>
                </div>
                <div style="background: #1A2B5F; padding: 15px; text-align: center;">
                  <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Eduwave Educational Consultancy</p>
                </div>
              </div>
            `,
        });
          emailSent = true;
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
        // Email failure should not block the approval
      }

      return NextResponse.json({
        success: true,
        message: `Agent "${agentApp.name}" approved successfully!`,
        agentCode,
        tempPassword,
        emailSent,
      });
    }

    if (action === "reject") {
      await prisma.agentApplication.update({
        where: { id },
        data: { status: "rejected", reviewNotes: reviewNotes || null },
      });
      return NextResponse.json({ success: true, message: `Agent "${agentApp.name}" has been rejected.` });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// DELETE — delete an agent application
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    const agentApp = await prisma.agentApplication.findUnique({ where: { id } });
    if (!agentApp) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    // If the agent has an associated user account, deactivate it
    if (agentApp.userId) {
      await prisma.user.update({ where: { id: agentApp.userId }, data: { isActive: false, isApproved: false } }).catch(() => {});
    }

    await prisma.agentApplication.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Agent application deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
