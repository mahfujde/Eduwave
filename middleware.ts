import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccessRoute } from "@/lib/rbac";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin routes (except login) ──
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = await auth();
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const role = (session.user as any)?.role ?? "";
    if (!canAccessRoute(role, "/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ── Student portal routes ──
  if (pathname.startsWith("/portal")) {
    const session = await auth();
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const role = (session.user as any)?.role ?? "";
    if (!canAccessRoute(role, "/portal")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ── Agent portal routes ──
  if (pathname.startsWith("/agent")) {
    const session = await auth();
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const role       = (session.user as any)?.role       ?? "";
    const isApproved = (session.user as any)?.isApproved ?? false;
    if (role !== "AGENT" || !isApproved) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/agent/:path*"],
};
