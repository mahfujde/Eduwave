"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Users, TrendingUp, CheckCircle2, Clock, ArrowRight, Copy, Check, Wallet, UserPlus, Banknote } from "lucide-react";
import { getPublicStatusInfo } from "@/lib/tracking";

export default function AgentDashboard() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [copied, setCopied]     = useState(false);

  const agentCode = (session?.user as any)?.agentCode ?? "—";

  useEffect(() => {
    Promise.all([
      fetch("/api/agent/students").then(r => r.json()).then(d => { if (d.success) setStudents(d.data); }),
      fetch("/api/agent/commissions").then(r => r.json()).then(d => { if (d.success) setCommissions(d.data); }),
    ]).finally(() => setLoading(false));
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(agentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const enrolled  = students.filter(s => s.status === "enrolled").length;
  const active    = students.filter(s => !["enrolled","rejected","withdrawn"].includes(s.status)).length;
  const pending   = students.filter(s => s.status === "submitted").length;
  const totalEarned = commissions.filter(c => c.status === "paid").reduce((s: number, c: any) => s + (c.amount || 0), 0);
  const pendingCommissions = commissions.filter(c => ["pending", "claimed", "approved"].includes(c.status)).length;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#1B3A2F] to-[#2A5C45] rounded-2xl p-8 text-white">
        <p className="text-green-200/60 text-sm mb-1">Welcome back</p>
        <h1 className="text-3xl font-bold text-white">{session?.user?.name} 👋</h1>
        <p className="text-green-100/60 mt-2 text-sm">You have referred {students.length} student{students.length !== 1 ? "s" : ""} — {enrolled} enrolled.</p>

        {/* Referral code */}
        <div className="mt-6 flex items-center gap-3 bg-white/10 rounded-xl px-5 py-3 w-fit">
          <div>
            <p className="text-xs text-green-200/60">Your Referral Code</p>
            <p className="font-mono font-bold text-xl tracking-widest">{agentCode}</p>
          </div>
          <button onClick={copyCode} className="ml-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
            {copied ? <Check size={16} className="text-green-300" /> : <Copy size={16} className="text-white" />}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/agent/apply-student"
            className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-medium transition-colors">
            <UserPlus size={14} /> Apply for Student
          </Link>
          <Link href="/agent/commissions"
            className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-medium transition-colors">
            <Wallet size={14} /> My Commissions
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Referred", value: students.length,  icon: Users,         col: "blue"   },
          { label: "Active Apps",    value: active,           icon: Clock,         col: "purple" },
          { label: "Enrolled",       value: enrolled,         icon: CheckCircle2,  col: "green"  },
          { label: "New (Pending)",  value: pending,          icon: TrendingUp,    col: "orange" },
          { label: "Total Earned",   value: `MYR ${totalEarned.toFixed(0)}`, icon: Banknote, col: "green" },
          { label: "Pending Claims", value: pendingCommissions, icon: Wallet, col: "yellow" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <s.icon size={22} className="text-[var(--accent)] mb-3" />
            <p className="text-2xl font-extrabold text-[var(--primary)]">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[var(--primary)]">Recent Referred Students</h2>
          <Link href="/agent/students" className="text-sm text-[var(--accent)] hover:underline">View all →</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">No students referred yet</p>
            <p className="text-gray-400 text-sm mt-1">Share your code <span className="font-mono text-[var(--primary)]">{agentCode}</span> with students</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.slice(0, 6).map((s: any) => {
              const si = getPublicStatusInfo(s.status);
              return (
                <div key={s.id} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 shrink-0">
                    {s.student?.name?.[0] ?? "S"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{s.student?.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {s.university?.name ?? s.universityName ?? "University TBC"} · {s.trackingNumber}
                    </p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold
                    ${si.color === "green" ? "bg-green-100 text-green-700" :
                      si.color === "red"   ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"}`}>
                    {si.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
