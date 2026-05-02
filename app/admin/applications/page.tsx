"use client";

import { useState, useEffect } from "react";
import { FileText, Search, Filter, Eye, MessageSquare, X, Check, Loader2, ChevronDown } from "lucide-react";
import { getPublicStatusInfo, APPLICATION_STATUSES } from "@/lib/tracking";
import { useToast } from "@/hooks/useToast";

const STATUS_COLORS: Record<string,string> = {
  green:"bg-green-100 text-green-700", red:"bg-red-100 text-red-700",
  orange:"bg-orange-100 text-orange-700", blue:"bg-blue-100 text-blue-700",
  purple:"bg-purple-100 text-purple-700", teal:"bg-teal-100 text-teal-700",
  indigo:"bg-indigo-100 text-indigo-700", gray:"bg-gray-100 text-gray-600",
};

export default function AdminApplicationsPage() {
  const [apps, setApps]       = useState<any[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState("all");
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving]   = useState(false);
  const [msgText, setMsgText] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  const toast = useToast();

  const fetchApps = async () => {
    setLoading(true);
    const qs = new URLSearchParams({ ...(status !== "all" && { status }) });
    const res = await fetch(`/api/admin/applications?${qs}`);
    const d   = await res.json();
    if (d.success) { setApps(d.data); setTotal(d.total); }
    setLoading(false);
  };
  useEffect(() => { fetchApps(); }, [status]);

  const openApp = (app: any) => { setSelected(app); setNewStatus(app.status); setAdminNotes(app.adminNotes ?? ""); };

  const saveStatus = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res  = await fetch(`/api/admin/applications?id=${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminNotes }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Application updated successfully! Status email sent to student.");
        setSelected(null);
        fetchApps();
      } else {
        toast.error(json.message || "Failed to update application.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
    setSaving(false);
  };

  const sendMsg = async () => {
    if (!msgText.trim() || !selected) return;
    setSendingMsg(true);
    try {
      const res = await fetch("/api/student/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: selected.id, message: msgText }),
      });
      const json = await res.json();
      if (json.success !== false) {
        toast.success("Message sent to student!");
        setMsgText("");
      } else {
        toast.error(json.message || "Failed to send message.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
    setSendingMsg(false);
  };

  const filtered = search
    ? apps.filter(a =>
        a.trackingNumber.includes(search.toUpperCase()) ||
        a.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.student?.email?.toLowerCase().includes(search.toLowerCase()))
    : apps;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Applications</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total applications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, tracking..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"/>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["all","submitted","under_review","documents_required","offer_received","visa_processing","enrolled","rejected"].map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${status === s ? "bg-[var(--primary)] text-white" : "bg-white border text-gray-500 hover:bg-gray-50"}`}>
              {s === "all" ? "All" : s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[var(--accent)]"/></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Tracking #","Student","University / Program","Status","Date","Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">No applications found</td></tr>
                ) : filtered.map((app: any) => {
                  const si = getPublicStatusInfo(app.status);
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-[var(--primary)]">{app.trackingNumber}</td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">{app.student?.name}</p>
                        <p className="text-gray-400 text-xs">{app.student?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-700 font-medium line-clamp-1">{app.university?.name ?? app.universityName ?? "—"}</p>
                        <p className="text-gray-400 text-xs line-clamp-1">{app.program?.name ?? app.programName ?? "—"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[si.color] ?? "bg-gray-100"}`}>{si.label}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => openApp(app)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                          <Eye size={14}/>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-bold text-[var(--primary)]">{selected.trackingNumber}</h2>
                <p className="text-sm text-gray-500">{selected.student?.name} — {selected.student?.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["University", selected.university?.name ?? selected.universityName ?? "—"],
                  ["Program",    selected.program?.name    ?? selected.programName    ?? "—"],
                  ["Intake",     selected.intake ?? "—"],
                  ["Submitted",  new Date(selected.createdAt).toLocaleDateString()],
                ].map(([k,v]) => (
                  <div key={k}>
                    <p className="text-gray-400 text-xs">{k}</p>
                    <p className="font-medium text-gray-700">{v}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Update Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field">
                  {APPLICATION_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Internal Notes (admin only)</label>
                <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={3} className="input-field resize-none"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Send Message to Student</label>
                <div className="flex gap-2">
                  <input value={msgText} onChange={e => setMsgText(e.target.value)} className="input-field flex-1" placeholder="Type a message..."/>
                  <button onClick={sendMsg} disabled={sendingMsg || !msgText.trim()}
                    className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[#d04e18] disabled:opacity-50 text-sm font-medium">
                    {sendingMsg ? <Loader2 size={14} className="animate-spin"/> : "Send"}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t">
                <button onClick={saveStatus} disabled={saving} className="btn-primary">
                  {saving && <Loader2 size={14} className="animate-spin"/>} Save Changes
                </button>
                <button onClick={() => setSelected(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
