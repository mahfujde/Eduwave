import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/public/universities — list all public universities, or get one by slug
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const country = searchParams.get("country");

    // Single university by slug
    if (slug) {
      const university = await prisma.university.findUnique({
        where: { slug },
        include: {
          programs: {
            where: { isPublic: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      });
      if (!university || !university.isPublic) {
        return NextResponse.json(
          { success: false, message: "University not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: university });
    }

    // List universities
    const where: any = { isPublic: true };
    if (featured === "true") where.featured = true;
    if (country) where.country = country;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { shortName: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const universities = await prisma.university.findMany({
      where,
      include: { _count: { select: { programs: true } } },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: universities });
  } catch (error) {
    console.error("Universities API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
