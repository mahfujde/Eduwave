"use client";

import { useState, useEffect } from "react";
import {
  Handshake, Check, X, Loader2, Eye, Clock, Users,
  Mail, Phone, MapPin, Building, MessageSquare,
  Copy, CheckCircle2, ExternalLink, GraduationCap, Trash2, Download,
} from "lucide-react";

const STATUS_STYLES: Record<string,string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const APP_STATUS_STYLES: Record<string,string> = {
  submitted:        "bg-orange-100 text-orange-600",
  under_review:     "bg-blue-100 text-blue-600",
  offer_received:   "bg-indigo-100 text-indigo-600",
  visa_processing:  "bg-purple-100 text-purple-600",
  enrolled:         "bg-green-100 text-green-700",
  rejected:         "bg-red-100 text-red-600",
};

export default function AdminAgentsPage() {
  const [apps, setApps]       = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [saving, setSaving]   = useState<"approve"|"reject"|"">("");
  const [result, setResult]   = useState<any>(null);
  const [toast, setToast]     = useState<{msg:string;type:"success"|"error"}|null>(null);
  const [tab, setTab]         = useState<"info"|"students">("info");
  const [referredStudents, setReferredStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [filter, setFilter]   = useState<"all"|"pending"|"approved"|"rejected">("all");
  const [copiedField, setCopiedField] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchApps = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/agents");
    const d   = await res.json();
    if (d.success) setApps(d.data);
    setLoading(false);
  };
  useEffect(() => { fetchApps(); }, []);

  // Show toast helper
  const showToast = (msg: string, type: "success"|"error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  // Fetch referred students for an agent
  const fetchReferredStudents = async (agentCode: string) => {
    if (!agentCode) return;
    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/admin/agents/students?agentCode=${agentCode}`);
      const d = await res.json();
      if (d.success) setReferredStudents(d.data);
    } catch { /* ignore */ }
    setLoadingStudents(false);
  };

  const handleAction = async (action: "approve"|"reject") => {
    if (!selected) return;
    setSaving(action);
    const res  = await fetch(`/api/admin/agents?id=${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reviewNotes }),
    });
    const json = await res.json();
    setSaving("");
    if (json.success) {
      setResult(json);
      fetchApps();
      if (action === "approve") {
        showToast(`✅ Agent "${selected.name}" approved successfully! Credentials sent to ${selected.email}.`, "success");
      } else {
        showToast(`Agent "${selected.name}" rejected.`, "error");
      }
    } else {
      showToast(json.message || "Action failed", "error");
    }
  };

  const handleViewAgent = (app: any) => {
    setSelected(app);
    setReviewNotes(app.reviewNotes ?? "");
    setResult(null);
    setTab("info");
    setReferredStudents([]);
    // If agent is approved and has an associated user with agentCode, fetch their students
    if (app.status === "approved" && app.user?.agentCode) {
      fetchReferredStudents(app.user.agentCode);
    }
  };

  const pending  = apps.filter(a => a.status === "pending");
  const approved = apps.filter(a => a.status === "approved");
  const rejected = apps.filter(a => a.status === "rejected");

  const filteredApps = filter === "all" ? apps : apps.filter(a => a.status === filter);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-4 rounded-xl shadow-2xl border-l-4 max-w-md animate-slide-in ${
          toast.type === "success"
            ? "bg-green-50 border-green-500 text-green-800"
            : "bg-red-50 border-red-500 text-red-800"
        }`}>
          <div className="flex items-start gap-3">
            {toast.type === "success" ? <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5"/> : <X size={20} className="text-red-500 shrink-0 mt-0.5"/>}
            <p className="text-sm font-medium">{toast.msg}</p>
            <button onClick={() => setToast(null)} className="ml-auto shrink-0"><X size={16}/></button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Agent Management</h1>
          <p className="text-gray-500 text-sm mt-1">Review applications, manage agents, track referred students</p>
        </div>
        <button onClick={() => {
          if (!apps.length) return;
          const headers = ["Name","Email","Phone","Company","Region","Status","Agent Code","Applied"];
          const rows = apps.map((a: any) => [
            a.name, a.email, a.phone || "", a.company || "", a.region || "",
            a.status, a.user?.agentCode || "", new Date(a.createdAt).toLocaleDateString(),
          ]);
          const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = `eduwave-agents-${Date.now()}.csv`; a.click();
          URL.revokeObjectURL(url);
        }} className="btn-secondary !py-2 text-sm flex items-center gap-2">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total",   value: apps.length,     color: "blue",   filter: "all" as const },
          { label: "Pending", value: pending.length,   color: "yellow", filter: "pending" as const },
          { label: "Approved",value: approved.length,  color: "green",  filter: "approved" as const },
          { label: "Rejected",value: rejected.length,  color: "red",    filter: "rejected" as const },
        ].map(s => (
          <button key={s.label} onClick={() => setFilter(s.filter)}
            className={`bg-white rounded-xl p-5 shadow-sm border text-center transition-all ${
              filter === s.filter ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-gray-100 hover:border-gray-200"
            }`}>
            <p className="text-3xl font-bold text-[var(--primary)]">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[var(--accent)]"/></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Name","Email","Phone","Company","Region","Students","Status","Applied","Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApps.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No agent applications found</td></tr>
              ) : filteredApps.map((app: any) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{app.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{app.email}</td>
                  <td className="px-4 py-3">
                    {app.phone ? (
                      <a href={`https://wa.me/${app.phone.replace(/[^0-9+]/g,'')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 flex items-center gap-1 text-xs">
                        <MessageSquare size={12}/> {app.phone}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{app.company ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{app.region ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-[var(--primary)]">
                      {app.user?.agentCode ? "—" : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_STYLES[app.status] ?? "bg-gray-100"}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleViewAgent(app)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Eye size={13}/></button>
                      <button onClick={() => setDeleteTarget(app)} title="Delete Agent"
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-bold text-[var(--primary)]">Agent Application</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)}><X size={20}/></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-6">
              {[
                { id: "info" as const, label: "Agent Info", icon: Handshake },
                { id: "students" as const, label: `Referred Students (${referredStudents.length})`, icon: GraduationCap },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    tab === t.id ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}>
                  <t.icon size={14}/> {t.label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">
              {/* Agent Info Tab */}
              {tab === "info" && (
                <>
                  {result && (
                    <div className={`p-4 rounded-xl text-sm ${result.message?.includes("approved") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      <p className="font-semibold flex items-center gap-2"><CheckCircle2 size={16}/> {result.message}</p>
                      {result.agentCode && (
                        <div className="mt-2 flex items-center gap-2">
                          <span>Agent Code:</span>
                          <code className="font-mono bg-white px-2 py-0.5 rounded border">{result.agentCode}</code>
                          <button onClick={() => copyToClipboard(result.agentCode, "code")} className="p-1 hover:bg-white rounded">
                            {copiedField === "code" ? <Check size={12} className="text-green-600"/> : <Copy size={12}/>}
                          </button>
                        </div>
                      )}
                      {result.tempPassword && (
                        <div className="mt-1 flex items-center gap-2">
                          <span>Temp Password:</span>
                          <code className="font-mono bg-white px-2 py-0.5 rounded border">{result.tempPassword}</code>
                          <button onClick={() => copyToClipboard(result.tempPassword, "pass")} className="p-1 hover:bg-white rounded">
                            {copiedField === "pass" ? <Check size={12} className="text-green-600"/> : <Copy size={12}/>}
                          </button>
                        </div>
                      )}
                      {result.emailSent && (
                        <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                          <Mail size={12}/> Credentials email sent to {selected.email}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { k: "Name", v: selected.name, icon: Users },
                      { k: "Email", v: selected.email, icon: Mail },
                      { k: "Phone", v: selected.phone ?? "—", icon: Phone },
                      { k: "Company", v: selected.company ?? "—", icon: Building },
                      { k: "Region", v: selected.region ?? "—", icon: MapPin },
                      { k: "Status", v: selected.status, icon: Clock },
                    ].map(({ k, v, icon: Icon }) => (
                      <div key={k} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Icon size={14} className="text-[var(--accent)] shrink-0"/>
                        <div>
                          <p className="text-gray-400 text-xs">{k}</p>
                          <p className="font-medium text-gray-700">{v}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Agent Code Display */}
                  {selected.user?.agentCode && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-500 font-medium">Agent Code</p>
                        <p className="text-lg font-bold font-mono text-blue-700">{selected.user.agentCode}</p>
                      </div>
                      <button onClick={() => copyToClipboard(selected.user.agentCode, "agentCode")}
                        className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200">
                        {copiedField === "agentCode" ? <Check size={16} className="text-green-600"/> : <Copy size={16} className="text-blue-600"/>}
                      </button>
                    </div>
                  )}

                  {/* WhatsApp link */}
                  {selected.phone && (
                    <a href={`https://wa.me/${selected.phone.replace(/[^0-9+]/g,'')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-green-700 border border-green-100 hover:bg-green-100 transition-colors text-sm font-medium">
                      <MessageSquare size={16}/> Open WhatsApp Chat
                      <ExternalLink size={12} className="ml-auto"/>
                    </a>
                  )}

                  {selected.experience && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Experience</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selected.experience}</p>
                    </div>
                  )}
                  {selected.motivation && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Motivation</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selected.motivation}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Notes (optional)</label>
                    <textarea value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none"/>
                  </div>

                  {selected.status === "pending" && (
                    <div className="flex gap-3 pt-2 border-t">
                      <button onClick={() => handleAction("approve")} disabled={!!saving}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors">
                        {saving === "approve" ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Approve & Send Email
                      </button>
                      <button onClick={() => handleAction("reject")} disabled={!!saving}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors">
                        {saving === "reject" ? <Loader2 size={14} className="animate-spin"/> : <X size={14}/>} Reject
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Referred Students Tab */}
              {tab === "students" && (
                <div className="space-y-3">
                  {loadingStudents ? (
                    <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-[var(--accent)]"/></div>
                  ) : referredStudents.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      <GraduationCap size={32} className="mx-auto mb-2 opacity-50"/>
                      {selected.status === "approved" ? "No students referred yet" : "Agent not yet approved"}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                          <p className="text-2xl font-bold text-blue-700">{referredStudents.length}</p>
                          <p className="text-xs text-blue-500">Total Referred</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                          <p className="text-2xl font-bold text-green-700">
                            {referredStudents.filter((s: any) => s.applications?.some((a: any) => a.status === "enrolled")).length}
                          </p>
                          <p className="text-xs text-green-500">Enrolled</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-100">
                          <p className="text-2xl font-bold text-orange-700">
                            {referredStudents.filter((s: any) => s.applications?.some((a: any) => !["enrolled","rejected"].includes(a.status))).length}
                          </p>
                          <p className="text-xs text-orange-500">In Progress</p>
                        </div>
                      </div>

                      {referredStudents.map((student: any) => (
                        <div key={student.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-800">{student.name || "—"}</p>
                              <p className="text-xs text-gray-400">{student.email}</p>
                            </div>
                            {student.phone && (
                              <a href={`https://wa.me/${student.phone.replace(/[^0-9+]/g,'')}`}
                                target="_blank" rel="noopener noreferrer"
                                className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 text-xs">
                                <MessageSquare size={12}/>
                              </a>
                            )}
                          </div>
                          {student.applications?.length > 0 ? (
                            <div className="space-y-1.5">
                              {student.applications.map((app: any) => (
                                <div key={app.id} className="flex items-center justify-between bg-white p-2 rounded-lg text-xs">
                                  <span className="text-gray-600">{app.universityName} — {app.programName}</span>
                                  <span className={`px-2 py-0.5 rounded-full font-medium ${APP_STATUS_STYLES[app.status] ?? "bg-gray-100"}`}>
                                    {app.status?.replace(/_/g," ")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">No applications yet</p>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-red-600 mb-2">Delete Agent</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete agent <strong>{deleteTarget.name}</strong>? This will also deactivate their account.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">Cancel</button>
              <button onClick={async () => {
                setDeleting(true);
                await fetch(`/api/admin/agents?id=${deleteTarget.id}`, { method: "DELETE" });
                setApps(prev => prev.filter(a => a.id !== deleteTarget.id));
                setDeleteTarget(null);
                setDeleting(false);
                showToast(`Agent "${deleteTarget.name}" deleted successfully.`, "success");
              }} disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 flex items-center justify-center gap-2">
                {deleting ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
