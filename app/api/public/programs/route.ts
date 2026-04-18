import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/public/programs — list public programs, or get one by slug
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const universityId = searchParams.get("universityId");
    const level = searchParams.get("level");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    // Single program by slug
    if (slug) {
      const program = await prisma.program.findUnique({
        where: { slug },
        include: { university: true },
      });
      if (!program || !program.isPublic) {
        return NextResponse.json(
          { success: false, message: "Program not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: program });
    }

    // List programs
    const where: any = { isPublic: true };
    if (universityId) where.universityId = universityId;
    if (level) where.level = level;
    if (featured === "true") where.featured = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const programs = await prisma.program.findMany({
      where,
      include: { university: { select: { id: true, name: true, slug: true, logo: true, city: true, country: true } } },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: programs });
  } catch (error) {
    console.error("Programs API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
