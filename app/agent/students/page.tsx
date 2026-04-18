"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Users, Search, Inbox } from "lucide-react";
import { getPublicStatusInfo } from "@/lib/tracking";

const STATUS_COLORS: Record<string, string> = {
  green:  "bg-green-100 text-green-700",
  blue:   "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  purple: "bg-purple-100 text-purple-700",
  teal:   "bg-teal-100 text-teal-700",
  indigo: "bg-indigo-100 text-indigo-700",
  red:    "bg-red-100 text-red-700",
  gray:   "bg-gray-100 text-gray-600",
};

export default function AgentStudentsPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");

  const agentCode = (session?.user as any)?.agentCode ?? "—";

  useEffect(() => {
    fetch("/api/agent/students")
      .then(r => r.json())
      .then(d => { if (d.success) setStudents(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s => {
    const matchFilter = filter === "all" || s.status === filter;
    const matchSearch = !search ||
      s.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.student?.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.trackingNumber?.includes(search.toUpperCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">My Students</h1>
          <p className="text-gray-500 text-sm mt-1">
            Students referred via code <span className="font-mono text-[var(--primary)] font-semibold">{agentCode}</span>
            {" · "}{students.length} total
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, tracking…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all","submitted","under_review","offer_received","enrolled","rejected"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0
                ${filter === s ? "bg-[var(--primary)] text-white" : "bg-white border text-gray-500 hover:bg-gray-50"}`}>
              {s === "all" ? "All" : s.replace(/_/g," ").replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-200">
          <Inbox size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-medium">No students found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Student","Email","University","Program","Tracking #","Status","Date"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s: any) => {
                  const si = getPublicStatusInfo(s.status);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 text-xs shrink-0">
                            {s.student?.name?.[0] ?? "?"}
                          </div>
                          <span className="font-medium text-gray-800">{s.student?.name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{s.student?.email ?? "—"}</td>
                      <td className="px-5 py-4 text-gray-600 text-xs">{s.university?.name ?? s.universityName ?? "—"}</td>
                      <td className="px-5 py-4 text-gray-600 text-xs">{s.program?.name ?? s.programName ?? "—"}</td>
                      <td className="px-5 py-4 font-mono text-xs text-[var(--primary)] font-semibold">{s.trackingNumber}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[si.color] ?? "bg-gray-100 text-gray-600"}`}>
                          {si.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {new Date(s.student?.createdAt ?? s.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
