import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public agent application submission
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, experience, region, motivation } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, message: "Name and email are required." }, { status: 400 });
    }

    // Check if already applied
    const existing = await prisma.agentApplication.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, message: "An application with this email already exists." }, { status: 409 });
    }

    const application = await prisma.agentApplication.create({
      data: { name, email, phone, company, experience, region, motivation, status: "pending" },
    });

    return NextResponse.json({ success: true, data: application, message: "Your agent application has been submitted! We'll review it and contact you within 2-3 business days." }, { status: 201 });
  } catch (error) {
    console.error("Agent apply error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
