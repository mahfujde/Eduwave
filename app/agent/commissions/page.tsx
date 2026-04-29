"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Wallet, Loader2, CheckCircle2, X, Clock, DollarSign,
  FileText, Eye, AlertCircle, Download, ExternalLink,
  TrendingUp, Banknote, ShieldCheck, XCircle,
} from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string; icon: any }> = {
  pending:  { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", label: "Pending", icon: Clock },
  claimed:  { bg: "bg-blue-50 border-blue-200",     text: "text-blue-700",   label: "Claimed", icon: FileText },
  approved: { bg: "bg-purple-50 border-purple-200",  text: "text-purple-700", label: "Approved", icon: ShieldCheck },
  paid:     { bg: "bg-green-50 border-green-200",    text: "text-green-700",  label: "Paid", icon: CheckCircle2 },
  rejected: { bg: "bg-red-50 border-red-200",        text: "text-red-700",    label: "Rejected", icon: XCircle },
};

export default function AgentCommissionsPage() {
  const { data: session } = useSession();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [claiming, setClaiming]       = useState<string | null>(null);
  const [toast, setToast]             = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filter, setFilter]           = useState("all");
  const [selected, setSelected]       = useState<any>(null);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/commissions");
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

  const handleClaim = async (id: string) => {
    setClaiming(id);
    try {
      const res = await fetch(`/api/agent/commissions?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentNotes: "" }),
      });
      const d = await res.json();
      if (d.success) {
        showToast("Commission claimed successfully! Admin will review and process payment.", "success");
        fetchCommissions();
      } else {
        showToast(d.message || "Failed to claim commission", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    }
    setClaiming(null);
  };

  const filtered = commissions.filter(c => filter === "all" || c.status === filter);

  const totalEarned = commissions.filter(c => c.status === "paid").reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalPending = commissions.filter(c => ["pending", "claimed", "approved"].includes(c.status)).reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalClaimable = commissions.filter(c => {
    const eligible = ["visa_processing", "enrolled"].includes(c.application?.status);
    return c.status === "pending" && c.amount && eligible;
  }).length;

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
            <button onClick={() => setToast(null)} className="ml-auto shrink-0"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B3A2F] to-[#2A5C45] rounded-2xl p-6 md:p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Commissions</h1>
            <p className="text-green-200/60 text-sm mt-0.5">Track and claim your referral commissions</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Commissions", value: commissions.length, icon: FileText, color: "blue" },
          { label: "Total Earned", value: `MYR ${totalEarned.toFixed(0)}`, icon: Banknote, color: "green" },
          { label: "Pending / In Review", value: `MYR ${totalPending.toFixed(0)}`, icon: Clock, color: "yellow" },
          { label: "Ready to Claim", value: totalClaimable, icon: TrendingUp, color: "purple" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <s.icon size={22} className="text-[var(--accent)] mb-3" />
            <p className="text-2xl font-extrabold text-[var(--primary)]">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "claimed", "approved", "paid", "rejected"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0
              ${filter === s ? "bg-[var(--primary)] text-white" : "bg-white border text-gray-500 hover:bg-gray-50"}`}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Commissions List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-[var(--accent)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-200">
          <Wallet size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-medium">No commissions found</p>
          <p className="text-gray-400 text-sm mt-1">Submit student applications to earn commissions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c: any) => {
            const st = STATUS_STYLES[c.status] || STATUS_STYLES.pending;
            const StIcon = st.icon;
            const app = c.application;
            const canClaim = c.status === "pending" && c.amount && ["visa_processing", "enrolled"].includes(app?.status);

            return (
              <div key={c.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all`}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${st.bg} border flex items-center justify-center`}>
                        <StIcon size={18} className={st.text} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{app?.student?.name || "Student"}</p>
                        <p className="text-xs text-gray-400">{app?.trackingNumber} · {app?.student?.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${st.bg} border ${st.text}`}>
                      {st.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-400 mb-0.5">University</p>
                      <p className="font-medium text-gray-700">{app?.university?.name || app?.universityName || "TBD"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-400 mb-0.5">Program</p>
                      <p className="font-medium text-gray-700">{app?.program?.name || app?.programName || "TBD"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-400 mb-0.5">App Status</p>
                      <p className="font-medium text-gray-700">{app?.status?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                    </div>
                    <div className={`rounded-lg p-3 ${c.amount ? "bg-green-50 border border-green-100" : "bg-gray-50"}`}>
                      <p className="text-gray-400 mb-0.5">Commission</p>
                      <p className={`font-bold ${c.amount ? "text-green-700 text-base" : "text-gray-400"}`}>
                        {c.amount ? `${c.currency} ${c.amount.toFixed(2)}` : "Not set yet"}
                      </p>
                    </div>
                  </div>

                  {/* Receipt link for paid commissions */}
                  {c.status === "paid" && c.receiptUrl && (
                    <a href={c.receiptUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium hover:bg-green-100 transition-colors mb-3 w-fit">
                      <Download size={14} /> View Payment Receipt <ExternalLink size={12} />
                    </a>
                  )}

                  {/* Paid timestamp */}
                  {c.status === "paid" && c.paidAt && (
                    <p className="text-xs text-green-600 flex items-center gap-1 mb-3">
                      <CheckCircle2 size={12} /> Paid on {new Date(c.paidAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}

                  {/* Claim Button */}
                  {canClaim && (
                    <button onClick={() => handleClaim(c.id)} disabled={claiming === c.id}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E8622A] to-[#D04E18] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm">
                      {claiming === c.id ? (
                        <><Loader2 size={14} className="animate-spin" /> Claiming...</>
                      ) : (
                        <><Banknote size={14} /> Claim Commission — {c.currency} {c.amount?.toFixed(2)}</>
                      )}
                    </button>
                  )}

                  {/* Info messages */}
                  {c.status === "pending" && !c.amount && (
                    <p className="text-xs text-yellow-600 flex items-center gap-1">
                      <AlertCircle size={12} /> Commission amount not yet set by admin
                    </p>
                  )}
                  {c.status === "pending" && c.amount && !["visa_processing", "enrolled"].includes(app?.status) && (
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <AlertCircle size={12} /> You can claim once the student reaches visa processing or enrolled status
                    </p>
                  )}
                  {c.status === "claimed" && (
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <Clock size={12} /> Claimed — waiting for admin approval and payment
                    </p>
                  )}
                  {c.status === "approved" && (
                    <p className="text-xs text-purple-600 flex items-center gap-1">
                      <ShieldCheck size={12} /> Approved — payment is being processed
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
