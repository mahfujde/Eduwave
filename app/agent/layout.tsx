"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Menu, X, ChevronRight, Handshake, LogOut, BookOpen, User, UserPlus, Wallet } from "lucide-react";

const navLinks = [
  { href: "/agent/dashboard",     label: "Dashboard",        icon: LayoutDashboard },
  { href: "/agent/apply-student", label: "Apply for Student", icon: UserPlus },
  { href: "/agent/students",      label: "My Students",      icon: Users },
  { href: "/agent/commissions",   label: "My Commissions",   icon: Wallet },
  { href: "/agent/profile",       label: "My Profile",       icon: User },
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      const role       = (session.user as any).role;
      const isApproved = (session.user as any).isApproved;
      if (role !== "AGENT" || !isApproved) router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!session) return null;

  const agentCode = (session.user as any).agentCode ?? "—";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 w-64 z-50 flex flex-col
        bg-gradient-to-b from-[#1B3A2F] to-[#2A5C45] shadow-2xl
        transform transition-transform duration-300 lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <span className="text-lg font-bold text-white">Agent Portal</span>
            <p className="text-xs text-green-200/60 mt-0.5 font-mono">{agentCode}</p>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-white/60"><X size={20} /></button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active ? "bg-white/15 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                <Icon size={18} /> {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Referral code card */}
        <div className="mx-4 mb-4 p-4 bg-white/10 rounded-xl border border-white/10">
          <p className="text-xs text-green-200/60 mb-1">Your Referral Code</p>
          <p className="font-mono font-bold text-white text-lg tracking-widest">{agentCode}</p>
          <p className="text-xs text-green-200/50 mt-1">Share with students to track referrals</p>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-green-400 flex items-center justify-center text-white font-bold text-sm">
              {session.user?.name?.[0] ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
              <p className="text-xs text-white/50 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b px-4 lg:px-8 h-16 flex items-center gap-4 shadow-sm">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Agent Portal</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-sm font-semibold text-gray-700">
              {navLinks.find(l => pathname.startsWith(l.href))?.label ?? "Portal"}
            </span>
          </div>
          <Link href="/" className="ml-auto text-xs text-gray-400 hover:text-[var(--accent)]">← Website</Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
