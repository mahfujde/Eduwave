"use client";

import { useState, useEffect } from "react";
import {
  Wallet, Loader2, CheckCircle2, X, Clock, DollarSign,
  Eye, Download, ExternalLink, Banknote, ShieldCheck,
  XCircle, Upload, Send, Users, FileText, Search,
} from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending:  { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
  claimed:  { bg: "bg-blue-100",   text: "text-blue-700",   label: "Claimed" },
  approved: { bg: "bg-purple-100", text: "text-purple-700", label: "Approved" },
  paid:     { bg: "bg-green-100",  text: "text-green-700",  label: "Paid" },
  rejected: { bg: "bg-red-100",    text: "text-red-700",    label: "Rejected" },
};

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("all");
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState<any>(null);
  const [saving, setSaving]           = useState("");
  const [toast, setToast]             = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Modal form
  const [amountInput, setAmountInput]       = useState("");
  const [currencyInput, setCurrencyInput]   = useState("MYR");
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [receiptUrlInput, setReceiptUrlInput] = useState("");

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/commissions");
      const d = await res.json();
      if (d.success) setCommissions(d.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCommissions(); }, []);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleAction = async (id: string, action: string) => {
    setSaving(action);
    try {
      const body: any = { action, adminNotes: adminNotesInput };
      if (action === "set_amount") {
        body.amount = amountInput;
        body.currency = currencyInput;
      }
      if (action === "pay") {
        body.receiptUrl = receiptUrlInput;
      }
      const res = await fetch(`/api/admin/commissions?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (d.success) {
        showToast(d.message || "Action completed!", "success");
        fetchCommissions();
        // Refresh selected
        setSelected((prev: any) => prev ? { ...prev, ...d.data, status: d.data?.status || prev.status } : null);
      } else {
        showToast(d.message || "Action failed", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    }
    setSaving("");
  };

  const openDetail = (c: any) => {
    setSelected(c);
    setAmountInput(c.amount?.toString() || "");
    setCurrencyInput(c.currency || "MYR");
    setAdminNotesInput(c.adminNotes || "");
    setReceiptUrlInput(c.receiptUrl || "");
  };

  const filtered = commissions
    .filter(c => filter === "all" || c.status === filter)
    .filter(c => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.agent?.name?.toLowerCase().includes(q) ||
        c.agent?.email?.toLowerCase().includes(q) ||
        c.agent?.agentCode?.toLowerCase().includes(q) ||
        c.application?.trackingNumber?.toLowerCase().includes(q) ||
        c.application?.student?.name?.toLowerCase().includes(q)
      );
    });

  const stats = {
    total: commissions.length,
    pending: commissions.filter(c => c.status === "pending").length,
    claimed: commissions.filter(c => c.status === "claimed").length,
    paid: commissions.filter(c => c.status === "paid").length,
    totalPaid: commissions.filter(c => c.status === "paid").reduce((s, c) => s + (c.amount || 0), 0),
  };

  // Upload receipt — use media upload API
  const [uploading, setUploading] = useState(false);
  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "receipts");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const d = await res.json();
      if (d.url) {
        setReceiptUrlInput(d.url);
        showToast("Receipt uploaded successfully!", "success");
      }
    } catch {
      showToast("Upload failed", "error");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-4 rounded-xl shadow-2xl border-l-4 max-w-md animate-slide-in ${
          toast.type === "success" ? "bg-green-50 border-green-500 text-green-800" : "bg-red-50 border-red-500 text-red-800"
        }`}>
          <div className="flex items-start gap-3">
            {toast.type === "success" ? <CheckCircle2 size={20} className="text-green-500 shrink-0" /> : <XCircle size={20} className="text-red-500 shrink-0" />}
            <p className="text-sm font-medium">{toast.msg}</p>
            <button onClick={() => setToast(null)} className="ml-auto"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Commission Management</h1>
          <p className="text-gray-500 text-sm mt-1">Set amounts, approve claims, and process payments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, color: "blue" },
          { label: "Pending", value: stats.pending, color: "yellow" },
          { label: "Claimed", value: stats.claimed, color: "blue" },
          { label: "Paid", value: stats.paid, color: "green" },
          { label: "Total Paid Out", value: `MYR ${stats.totalPaid.toFixed(0)}`, color: "green" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-[var(--primary)]">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search agent, student, tracking..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "claimed", "approved", "paid", "rejected"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${filter === s ? "bg-[var(--primary)] text-white" : "bg-white border text-gray-500 hover:bg-gray-50"}`}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              {s === "claimed" && stats.claimed > 0 ? ` (${stats.claimed})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[var(--accent)]" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Agent", "Student", "Tracking", "University", "App Status", "Amount", "Commission Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400">No commissions found</td></tr>
                ) : filtered.map((c: any) => {
                  const st = STATUS_STYLES[c.status] || STATUS_STYLES.pending;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{c.agent?.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{c.agent?.agentCode}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700">{c.application?.student?.name || "—"}</p>
                        <p className="text-xs text-gray-400">{c.application?.student?.email}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--primary)] font-semibold">
                        {c.application?.trackingNumber}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {c.application?.university?.name || c.application?.universityName || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                          {c.application?.status?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {c.amount ? (
                          <span className="font-bold text-green-700">{c.currency} {c.amount.toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-400 text-xs">Not set</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${st.bg} ${st.text}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => openDetail(c)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                          <Eye size={13} />
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

      {/* Detail / Action Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-bold text-[var(--primary)]">Commission Details</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selected.application?.trackingNumber}</p>
              </div>
              <button onClick={() => setSelected(null)}><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Agent</p>
                  <p className="font-medium text-gray-800">{selected.agent?.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{selected.agent?.agentCode}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Student</p>
                  <p className="font-medium text-gray-800">{selected.application?.student?.name || "—"}</p>
                  <p className="text-xs text-gray-400">{selected.application?.student?.email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">University</p>
                  <p className="font-medium text-gray-700">{selected.application?.university?.name || selected.application?.universityName || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Application Status</p>
                  <p className="font-medium text-gray-700">{selected.application?.status?.replace(/_/g, " ")}</p>
                </div>
              </div>

              {/* Current Status */}
              <div className={`p-4 rounded-xl border ${STATUS_STYLES[selected.status]?.bg || "bg-gray-50"} ${STATUS_STYLES[selected.status]?.text || ""}`}>
                <p className="text-sm font-bold">Commission Status: {STATUS_STYLES[selected.status]?.label}</p>
                {selected.amount && <p className="text-lg font-bold mt-1">{selected.currency} {selected.amount.toFixed(2)}</p>}
                {selected.paidAt && <p className="text-xs mt-1">Paid on: {new Date(selected.paidAt).toLocaleDateString()}</p>}
                {selected.receiptUrl && (
                  <a href={selected.receiptUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs underline mt-1">
                    <Download size={11} /> View Receipt
                  </a>
                )}
              </div>

              {/* Set Amount (for pending commissions) */}
              {(selected.status === "pending" || selected.status === "claimed") && (
                <div className="space-y-3 p-4 bg-yellow-50/50 rounded-xl border border-yellow-100">
                  <p className="text-sm font-bold text-yellow-700 flex items-center gap-2">
                    <DollarSign size={16} /> Set Commission Amount
                  </p>
                  <div className="flex gap-2">
                    <select value={currencyInput} onChange={e => setCurrencyInput(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                      <option value="MYR">MYR</option>
                      <option value="USD">USD</option>
                      <option value="BDT">BDT</option>
                    </select>
                    <input type="number" step="0.01" value={amountInput}
                      onChange={e => setAmountInput(e.target.value)}
                      placeholder="e.g. 500.00"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
                    <button onClick={() => handleAction(selected.id, "set_amount")}
                      disabled={saving === "set_amount" || !amountInput}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:opacity-50 flex items-center gap-1">
                      {saving === "set_amount" ? <Loader2 size={14} className="animate-spin" /> : <DollarSign size={14} />}
                      Set
                    </button>
                  </div>
                </div>
              )}

              {/* Approve (for claimed) */}
              {selected.status === "claimed" && (
                <div className="space-y-3 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                  <p className="text-sm font-bold text-purple-700 flex items-center gap-2">
                    <ShieldCheck size={16} /> Approve & Pay
                  </p>

                  {/* Receipt upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Payment Receipt (optional)</label>
                    <div className="flex gap-2">
                      <input type="text" value={receiptUrlInput}
                        onChange={e => setReceiptUrlInput(e.target.value)}
                        placeholder="Receipt URL or upload below"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
                      <label className="px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center gap-1 text-xs text-gray-600">
                        {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        Upload
                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleReceiptUpload} />
                      </label>
                    </div>
                  </div>

                  {/* Admin notes */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Admin Notes</label>
                    <textarea value={adminNotesInput} onChange={e => setAdminNotesInput(e.target.value)}
                      rows={2} placeholder="Payment reference, notes..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none" />
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => handleAction(selected.id, "approve")}
                      disabled={!!saving}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-500 text-white font-medium rounded-xl hover:bg-purple-600 disabled:opacity-50">
                      {saving === "approve" ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                      Approve Only
                    </button>
                    <button onClick={() => handleAction(selected.id, "pay")}
                      disabled={!!saving}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 disabled:opacity-50">
                      {saving === "pay" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      Approve & Mark Paid
                    </button>
                  </div>

                  <button onClick={() => handleAction(selected.id, "reject")}
                    disabled={!!saving}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 text-sm border border-red-200 disabled:opacity-50">
                    {saving === "reject" ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                    Reject Commission
                  </button>
                </div>
              )}

              {/* Pay (for approved — already approved but not paid) */}
              {selected.status === "approved" && (
                <div className="space-y-3 p-4 bg-green-50/50 rounded-xl border border-green-100">
                  <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                    <Send size={16} /> Process Payment
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Payment Receipt</label>
                    <div className="flex gap-2">
                      <input type="text" value={receiptUrlInput}
                        onChange={e => setReceiptUrlInput(e.target.value)}
                        placeholder="Receipt URL"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
                      <label className="px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center gap-1 text-xs text-gray-600">
                        {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        Upload
                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleReceiptUpload} />
                      </label>
                    </div>
                  </div>
                  <textarea value={adminNotesInput} onChange={e => setAdminNotesInput(e.target.value)}
                    rows={2} placeholder="Payment reference..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none" />
                  <button onClick={() => handleAction(selected.id, "pay")}
                    disabled={!!saving}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 disabled:opacity-50">
                    {saving === "pay" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    Mark as Paid & Send Receipt
                  </button>
                </div>
              )}
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
