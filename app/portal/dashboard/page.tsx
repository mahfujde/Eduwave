"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, Clock, CheckCircle2, AlertCircle, GraduationCap,
  ArrowRight, Inbox, Plus,
} from "lucide-react";
import { getPublicStatusInfo } from "@/lib/tracking";

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/applications")
      .then(r => r.json())
      .then(d => { if (d.success) setApplications(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const active  = applications.filter(a => !["enrolled","rejected","withdrawn"].includes(a.status));
  const done    = applications.filter(a =>  ["enrolled","rejected","withdrawn"].includes(a.status));

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#0F1B3F] to-[#1A2B5F] rounded-2xl p-8 text-white">
        <p className="text-blue-200/70 text-sm font-medium mb-1">Welcome back</p>
        <h1 className="text-3xl font-bold">{session?.user?.name} 👋</h1>
        <p className="text-blue-100/60 mt-2 text-sm">
          {applications.length === 0
            ? "You haven't submitted any applications yet. Start your journey today!"
            : `You have ${active.length} active application${active.length !== 1 ? "s" : ""}.`}
        </p>
        <Link href="/portal/apply"
          className="mt-5 inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[#d04e18]
            text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
          <Plus size={16}/> New Application <ArrowRight size={16}/>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total",    value: applications.length, icon: FileText,     color: "blue"   },
          { label: "Active",   value: active.length,       icon: Clock,        color: "purple" },
          { label: "Enrolled", value: done.filter(a => a.status === "enrolled").length, icon: CheckCircle2, color: "green" },
          { label: "Pending",  value: applications.filter(a => ["submitted","under_review"].includes(a.status)).length, icon: AlertCircle, color: "orange" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <s.icon size={22} className="text-[var(--accent)] mb-3" />
            <p className="text-2xl font-extrabold text-[var(--primary)]">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[var(--primary)]">Recent Applications</h2>
          <Link href="/portal/applications" className="text-sm text-[var(--accent)] hover:underline">View all →</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
            <Inbox size={48} className="mx-auto mb-4 text-gray-300"/>
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-gray-400 text-sm mt-1">Start by applying to a university</p>
            <Link href="/portal/apply" className="mt-4 inline-flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#d04e18] transition-colors">
              <Plus size={15}/> Apply Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((app: any) => {
              const si = getPublicStatusInfo(app.status);
              return (
                <Link key={app.id} href={`/portal/applications/${app.id}`}
                  className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100
                    hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                    <GraduationCap size={18} className="text-[var(--primary)]"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {app.program?.name ?? app.programName ?? "Program TBC"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {app.university?.name ?? app.universityName ?? "University TBC"} · {app.trackingNumber}
                    </p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold
                    ${si.color === "green" ? "bg-green-100 text-green-700" :
                      si.color === "red"   ? "bg-red-100 text-red-700" :
                      si.color === "orange"? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"}`}>
                    {si.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
