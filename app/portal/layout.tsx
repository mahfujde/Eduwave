"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, FileText, User, MessageSquare, LogOut,
  GraduationCap, Menu, X, ChevronRight, BookOpen,
} from "lucide-react";
import { useState } from "react";
import ToastContainer from "@/components/admin/ToastContainer";

const navLinks = [
  { href: "/portal/dashboard",     label: "Dashboard",       icon: LayoutDashboard },
  { href: "/portal/apply",         label: "Apply Now",       icon: GraduationCap },
  { href: "/portal/applications",  label: "My Applications", icon: FileText },
  { href: "/portal/messages",      label: "Messages",        icon: MessageSquare },
  { href: "/portal/profile",       label: "My Profile",      icon: User },
];

export default function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=" + pathname);
    if (status === "authenticated" && (session.user as any).role !== "STUDENT") router.push("/");
  }, [status, session, router, pathname]);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ToastContainer />
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 z-50 flex flex-col
        bg-gradient-to-b from-[#0F1B3F] to-[#1A2B5F] shadow-2xl
        transform transition-transform duration-300 lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <Link href="/portal/dashboard" className="flex items-center gap-2">
            <BookOpen size={22} className="text-[var(--accent)]" />
            <span className="font-bold text-white">Student Portal</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-white/60"><X size={20}/></button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active ? "bg-white/15 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                <Icon size={18}/> {label}
                {active && <ChevronRight size={14} className="ml-auto"/>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
              {session.user?.name?.[0] ?? "S"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
              <p className="text-xs text-white/50 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut size={16}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b px-4 lg:px-8 h-16 flex items-center gap-4 shadow-sm">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <Menu size={20}/>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Student Portal</span>
            <ChevronRight size={14} className="text-gray-300"/>
            <span className="text-sm font-semibold text-[var(--primary)]">
              {navLinks.find(l => pathname === l.href || pathname.startsWith(l.href + "/"))?.label ?? "Portal"}
            </span>
          </div>
          <Link href="/" className="ml-auto text-xs text-gray-400 hover:text-[var(--accent)] transition-colors">
            ← Back to website
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
