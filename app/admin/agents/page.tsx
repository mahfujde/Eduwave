"use client";

import { useState, useEffect } from "react";
import { Handshake, Check, X, Loader2, Eye, Clock } from "lucide-react";

const STATUS_STYLES: Record<string,string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminAgentsPage() {
  const [apps, setApps]       = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [saving, setSaving]   = useState<"approve"|"reject"|"">("");
  const [result, setResult]   = useState<any>(null);

  const fetchApps = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/agents");
    const d   = await res.json();
    if (d.success) setApps(d.data);
    setLoading(false);
  };
  useEffect(() => { fetchApps(); }, []);

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
    }
  };

  const pending  = apps.filter(a => a.status === "pending");
  const approved = apps.filter(a => a.status === "approved");
  const rejected = apps.filter(a => a.status === "rejected");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)]">Agent Management</h1>
        <p className="text-gray-500 text-sm mt-1">Review and approve agent applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Review", value: pending.length,  color: "yellow" },
          { label: "Approved Agents", value: approved.length, color: "green"  },
          { label: "Rejected",        value: rejected.length, color: "red"    },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-[var(--primary)]">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[var(--accent)]"/></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Name","Email","Company","Region","Status","Applied","Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {apps.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No agent applications yet</td></tr>
              ) : apps.map((app: any) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{app.name}</td>
                  <td className="px-5 py-3 text-gray-500">{app.email}</td>
                  <td className="px-5 py-3 text-gray-500">{app.company ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500">{app.region ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_STYLES[app.status] ?? "bg-gray-100"}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => { setSelected(app); setReviewNotes(app.reviewNotes ?? ""); setResult(null); }}
                      className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Eye size={13}/></button>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-[var(--primary)]">Agent Application</h2>
              <button onClick={() => setSelected(null)}><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              {result && (
                <div className={`p-4 rounded-xl text-sm ${result.message?.includes("approved") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  <p className="font-semibold">{result.message}</p>
                  {result.agentCode && <p className="mt-1">Agent Code: <strong className="font-mono">{result.agentCode}</strong></p>}
                  {result.tempPassword && <p>Temp Password: <strong className="font-mono">{result.tempPassword}</strong></p>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Name", selected.name], ["Email", selected.email],
                  ["Phone", selected.phone ?? "—"], ["Company", selected.company ?? "—"],
                  ["Region", selected.region ?? "—"], ["Status", selected.status],
                ].map(([k,v]) => (
                  <div key={k}>
                    <p className="text-gray-400 text-xs">{k}</p>
                    <p className="font-medium text-gray-700">{v}</p>
                  </div>
                ))}
              </div>

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
                <textarea value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} rows={2} className="input-field resize-none"/>
              </div>

              {selected.status === "pending" && (
                <div className="flex gap-3 pt-2 border-t">
                  <button onClick={() => handleAction("approve")} disabled={!!saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors">
                    {saving === "approve" ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Approve
                  </button>
                  <button onClick={() => handleAction("reject")} disabled={!!saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors">
                    {saving === "reject" ? <Loader2 size={14} className="animate-spin"/> : <X size={14}/>} Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
