"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, GraduationCap, ArrowRight, Inbox, Plus } from "lucide-react";
import { getPublicStatusInfo } from "@/lib/tracking";

const STATUS_COLORS: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  red:   "bg-red-100 text-red-700",
  orange:"bg-orange-100 text-orange-700",
  purple:"bg-purple-100 text-purple-700",
  teal:  "bg-teal-100 text-teal-700",
  indigo:"bg-indigo-100 text-indigo-700",
  blue:  "bg-blue-100 text-blue-700",
  gray:  "bg-gray-100 text-gray-600",
};

export default function ApplicationsPage() {
  const [apps, setApps]       = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  useEffect(() => {
    fetch("/api/student/applications")
      .then(r => r.json())
      .then(d => { if (d.success) setApps(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">My Applications</h1>
          <p className="text-gray-500 text-sm mt-1">{apps.length} total application{apps.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/portal/apply" className="btn-primary self-start sm:self-auto">
          <Plus size={16}/> New Application
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all","submitted","under_review","documents_required","offer_received","visa_processing","enrolled","rejected"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors
              ${filter === s ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            {s === "all" ? "All" : s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-200">
          <Inbox size={48} className="mx-auto mb-4 text-gray-300"/>
          <p className="text-gray-500 font-medium">No applications found</p>
          <Link href="/portal/apply" className="mt-4 inline-flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#d04e18] transition-colors">
            <Plus size={15}/> Apply Now
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((app: any) => {
            const si = getPublicStatusInfo(app.status);
            return (
              <Link key={app.id} href={`/portal/applications/${app.id}`}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                    <GraduationCap size={22} className="text-[var(--primary)]"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {app.program?.name ?? app.programName ?? "Program TBC"}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {app.university?.name ?? app.universityName ?? "University TBC"}
                        </p>
                      </div>
                      <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[si.color] ?? "bg-gray-100 text-gray-600"}`}>
                        {si.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{app.trackingNumber}</span>
                      {app.intake && <span>📅 {app.intake}</span>}
                      <span>🕐 {new Date(app.createdAt).toLocaleDateString()}</span>
                      {app.messages?.length > 0 && <span>💬 {app.messages.length} message{app.messages.length !== 1 ? "s" : ""}</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 italic">{si.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 shrink-0 mt-1"/>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
