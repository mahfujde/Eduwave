import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// FIX: Force dynamic — prevent Next.js from caching this at build time
export const dynamic = "force-dynamic";

// GET /api/public/testimonials — list public testimonials
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isPublic: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("Testimonials API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
