import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/public/settings — all site config entries
export async function GET() {
  try {
    const settings = await prisma.siteConfig.findMany();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Settings API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
