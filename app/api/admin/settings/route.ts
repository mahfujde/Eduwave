import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Ensure fresh data on every request
export const dynamic = "force-dynamic";

async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const settings = await prisma.siteConfig.findMany({
      orderBy: { group: "asc" },
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// PUT /api/admin/settings
// Accepts: { settings: [{key, value}] }  — batch
//       OR { key, value, group?, label? } — single (used by SEO manager)
export async function PUT(req: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const body = await req.json();

    // Single key-value update
    if (body.key && body.value !== undefined) {
      const result = await prisma.siteConfig.upsert({
        where:  { key: body.key },
        update: { value: body.value, ...(body.group && { group: body.group }), ...(body.label && { label: body.label }) },
        create: { key: body.key, value: body.value, group: body.group ?? "seo", label: body.label ?? null },
      });
      return NextResponse.json({ success: true, data: result });
    }

    // Batch update
    const { settings } = body;
    if (!Array.isArray(settings)) {
      return NextResponse.json({ success: false, message: "Provide 'key'+'value' or 'settings' array." }, { status: 400 });
    }

    const results = await Promise.all(
      settings.map((s: { key: string; value: string; group?: string; label?: string }) =>
        prisma.siteConfig.upsert({
          where:  { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value, group: s.group ?? "general", label: s.label ?? null },
        })
      )
    );

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
