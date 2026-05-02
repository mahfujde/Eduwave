"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminNavForRole } from "@/lib/rbac";
import {
  LayoutDashboard, Building2, GraduationCap, MessageSquare,
  Quote, FileText, Settings, LogOut, Menu, X, ChevronRight,
  Users, Bell, Image, Layout, Search, Handshake, BookOpen,
  Globe, ExternalLink, Palette, Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ToastContainer from "@/components/admin/ToastContainer";

const iconMap: Record<string, any> = {
  LayoutDashboard, Building2, GraduationCap, MessageSquare,
  Quote, FileText, Settings, Users, Bell, Image, Layout,
  Search, Handshake, BookOpen, Globe, Palette, Wallet,
};

// Group nav items for visual clarity
const NAV_GROUPS = [
  {
    label: "Overview",
    items: ["/admin/dashboard"],
  },
  {
    label: "Student & Agent Portals",
    items: ["/admin/applications", "/admin/users", "/admin/students", "/admin/agents", "/admin/commissions", "/admin/inquiries"],
  },
  {
    label: "Content",
    items: ["/admin/universities", "/admin/programs", "/admin/testimonials", "/admin/blog"],
  },
  {
    label: "CMS & Marketing",
    items: ["/admin/cms", "/admin/header-footer", "/admin/seo", "/admin/media", "/admin/notifications"],
  },
  {
    label: "System",
    items: ["/admin/theme", "/admin/settings"],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) router.push("/admin/login");
  }, [status, router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;
  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"/>
    </div>
  );
  if (!session) return null;

  const role     = (session.user as any)?.role ?? "ADMIN";
  const navLinks = getAdminNavForRole(role);

  // Build grouped nav — only include groups that have at least one accessible link
  const groups = NAV_GROUPS.map(g => ({
    ...g,
    links: navLinks.filter(l => g.items.includes(l.href)),
  })).filter(g => g.links.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)}/>}

      {/* ── Sidebar ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 z-50 flex flex-col",
        "bg-gradient-to-b from-[#0F1B3F] to-[#1A2B5F] shadow-2xl",
        "transform transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-black text-sm">E</div>
            <div>
              <span className="text-base font-bold text-white block leading-none">Eduwave</span>
              <span className="text-[10px] text-white/50 block leading-none mt-0.5">Admin Panel</span>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-white/70 hover:text-white"><X size={20}/></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {groups.map(group => (
            <div key={group.label} className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.links.map((link) => {
                  const Icon   = iconMap[link.icon] || LayoutDashboard;
                  const active = pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href + "/"));
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-white/15 text-white shadow-sm"
                          : "text-white/55 hover:text-white hover:bg-white/8"
                      )}>
                      <Icon size={16} className="shrink-0"/>
                      <span className="flex-1 truncate">{link.label}</span>
                      {active && <ChevronRight size={12} className="shrink-0 opacity-60"/>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* View website shortcut */}
        <div className="px-3 py-2 border-t border-white/10 shrink-0">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 text-xs transition-colors">
            <ExternalLink size={13}/> View Public Website
          </a>
        </div>

        {/* User footer */}
        <div className="p-3 border-t border-white/10 bg-[#0a1530] shrink-0">
          <div className="flex items-center gap-3 mb-2 px-1">
            <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {session.user?.name?.[0] || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{session.user?.name}</p>
              <p className="text-[10px] text-white/40 truncate">{role.replace("_"," ")}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut size={14}/> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b px-4 lg:px-8 h-16 flex items-center gap-4 shadow-sm">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <Menu size={20}/>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-base font-semibold text-[var(--primary)] truncate">
              {navLinks.find((l) => pathname === l.href || (l.href !== "/admin/dashboard" && pathname.startsWith(l.href + "/")))?.label ?? "Dashboard"}
            </h2>
          </div>
          {/* Role badge */}
          <span className="ml-1 hidden sm:inline text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full font-medium">
            {role.replace("_"," ")}
          </span>
          <Link href="/" target="_blank" className="ml-auto text-xs text-gray-400 hover:text-[var(--accent)] transition-colors flex items-center gap-1">
            <ExternalLink size={12}/> View Website
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
