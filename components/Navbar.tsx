"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { NAV_LINKS } from "@/constants/site";

const DEFAULT_NAV = NAV_LINKS as readonly { label: string; href: string }[];
import { useSiteStore } from "@/hooks/useStore";
import {
  Menu, X, Phone, LogIn, UserPlus, Search, Handshake,
  LayoutDashboard, ChevronDown, LogOut, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { settings, fetchSettings } = useSiteStore();
  const { data: session, status } = useSession();

  // Parse dynamic nav links from settings, fallback to constants
  const dynamicNav: { label: string; href: string }[] = (() => {
    if (settings.nav_links) {
      try { return JSON.parse(settings.nav_links); } catch {}
    }
    return DEFAULT_NAV as { label: string; href: string }[];
  })();

  const logoText    = settings.site_name   || "Eduwave";
  const logoSubtext = settings.logo_subtext || "Educational Consultancy";
  const logoUrl     = settings.site_logo    || "/images/logos/eduwave-logo.png";
  const ctaText     = settings.header_cta_text || "Apply Now";
  const ctaUrl      = settings.header_cta_url  || "/contact";

  useEffect(() => { fetchSettings(); }, [fetchSettings]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine portal link based on role
  const role = (session?.user as any)?.role ?? "";
  const portalHref =
    role === "STUDENT"    ? "/portal/dashboard"  :
    role === "AGENT"      ? "/agent/dashboard"   :
    ["SUPER_ADMIN","ADMIN","EDITOR"].includes(role) ? "/admin/dashboard" : "/login";
  const portalLabel =
    role === "STUDENT" ? "My Portal" :
    role === "AGENT"   ? "Agent Portal" :
    ["SUPER_ADMIN","ADMIN","EDITOR"].includes(role) ? "Admin" : "Portal";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-lg shadow-md" : "bg-white"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-24 md:h-28">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="w-[160px] h-[72px] relative">
              <Image src={logoUrl} alt={logoText} fill className="object-contain object-left" priority />
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {dynamicNav.map((link) => (
              <Link key={link.href} href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-200">
                {link.label}
              </Link>
            ))}
            {/* Track Application — highlighted */}
            <Link href="/track"
              className="px-3 py-2 text-sm font-medium text-[var(--accent)] rounded-lg hover:bg-[var(--accent)]/10 flex items-center gap-1.5 transition-all duration-200">
              <Search size={13} /> Track
            </Link>
          </div>

          {/* ── Desktop CTA ── */}
          <div className="hidden lg:flex items-center gap-2">
            {status === "authenticated" ? (
              /* Logged-in user menu */
              <div className="relative">
                <button onClick={() => setUserMenu(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                    {session?.user?.name?.[0] ?? "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{session?.user?.name?.split(" ")[0]}</span>
                  <ChevronDown size={13} className={cn("transition-transform", userMenu && "rotate-180")} />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    onMouseLeave={() => setUserMenu(false)}>
                    <Link href={portalHref} onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard size={14} /> {portalLabel}
                    </Link>
                    <Link href={role === "STUDENT" ? "/portal/profile" : "/login"} onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={14} /> My Profile
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Visitor auth buttons */
              <>
                <Link href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  <LogIn size={15} /> Sign In
                </Link>
                <Link href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors">
                  <UserPlus size={15} /> Sign Up
                </Link>
              </>
            )}
            <Link href={ctaUrl} className="btn-primary text-sm !px-5 !py-2 ml-1">
              {ctaText}
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100" aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div className={cn(
        "lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t",
        open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="container-custom py-4 space-y-1">
          {dynamicNav.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-[var(--accent)]/5 hover:text-[var(--accent)] transition-colors">
              {link.label}
            </Link>
          ))}
          {/* Track Application */}
          <Link href="/track" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-base font-medium text-[var(--accent)] rounded-lg hover:bg-[var(--accent)]/5 transition-colors">
            <Search size={16} /> Track Application
          </Link>

          <div className="pt-4 border-t mt-4 space-y-2">
            {status === "authenticated" ? (
              <>
                <Link href={portalHref} onClick={() => setOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-[var(--primary)] text-white font-medium text-sm">
                  <LayoutDashboard size={16} /> {portalLabel}
                </Link>
                <button onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium">
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm">
                  <LogIn size={15} /> Sign In
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[var(--primary)] text-white font-medium text-sm">
                  <UserPlus size={15} /> Sign Up Free
                </Link>
                <Link href="/agent-apply" onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-[var(--accent)] text-[var(--accent)] font-medium text-sm">
                  <Handshake size={15} /> Become an Agent
                </Link>
                <Link href={ctaUrl} onClick={() => setOpen(false)} className="btn-primary w-full text-center">
                  {ctaText}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
