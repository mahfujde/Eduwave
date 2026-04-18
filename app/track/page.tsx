"use client";

import { useState } from "react";
import { Search, CheckCircle2, Clock, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getPublicStatusInfo, APPLICATION_STATUSES } from "@/lib/tracking";

const STATUS_STEPS = [
  "submitted","under_review","documents_required","offer_received","visa_processing","enrolled"
] as const;

const STEP_COLORS: Record<string, string> = {
  green:"bg-green-500",  blue:"bg-blue-500",   orange:"bg-orange-500",
  teal:"bg-teal-500",   indigo:"bg-indigo-500", purple:"bg-purple-500",
  red:"bg-red-500",     gray:"bg-gray-300",
};

export default function TrackPage() {
  const [tn, setTn]         = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tn.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res  = await fetch(`/api/public/track?tn=${encodeURIComponent(tn.trim())}`);
      const json = await res.json();
      if (json.success) setResult(json.data);
      else setError(json.message ?? "Not found.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = result ? STATUS_STEPS.indexOf(result.status as any) : -1;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 60%, #2A3B6F 100%)" }}>
      {/* Header */}
      <div className="container-custom pt-20 pb-12 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm mb-5">
          🔍 No login required
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Track Your Application</h1>
        <p className="text-blue-100/60 text-lg max-w-xl mx-auto">
          Enter your tracking number (e.g. <span className="font-mono text-[var(--accent)]">EDU-2025-00042</span>) to check your application status in real time.
        </p>

        {/* Search form */}
        <form onSubmit={lookup} className="flex gap-3 mt-8 max-w-lg mx-auto">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              value={tn}
              onChange={e => setTn(e.target.value.toUpperCase())}
              placeholder="EDU-2025-00042"
              className="w-full pl-12 pr-4 py-4 rounded-xl text-base font-mono border border-white/20 bg-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:bg-white/15 transition-all"
            />
          </div>
          <button type="submit" disabled={loading || !tn.trim()}
            className="px-6 py-4 bg-[var(--accent)] hover:bg-[#d04e18] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 size={20} className="animate-spin"/> : <Search size={20}/>}
            Track
          </button>
        </form>

        {error && (
          <div className="mt-5 max-w-lg mx-auto flex items-center gap-2 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm">
            <AlertCircle size={16}/> {error}
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="container-custom pb-20">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Result header */}
            <div className="bg-gradient-to-r from-[#0F1B3F] to-[#1A2B5F] p-8 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-200/60 text-sm mb-1">Application for</p>
                  <h2 className="text-2xl font-bold">{result.studentName}</h2>
                  <p className="text-blue-100/70 mt-1">{result.program} — {result.university}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-200/60 text-xs mb-1">Tracking Number</p>
                  <p className="font-mono font-bold text-lg tracking-widest text-[var(--accent)]">{result.trackingNumber}</p>
                </div>
              </div>
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                ${STEP_COLORS[result.statusInfo.color] ?? "bg-gray-300"} text-white`}>
                <CheckCircle2 size={14}/>
                {result.statusInfo.label}
              </div>
            </div>

            {/* Status Timeline */}
            {result.status !== "rejected" && result.status !== "withdrawn" && (
              <div className="p-8 border-b">
                <h3 className="font-bold text-gray-800 mb-6">Application Progress</h3>
                <div className="flex items-start gap-0 overflow-x-auto">
                  {STATUS_STEPS.map((s, i) => {
                    const done    = currentStep > i;
                    const current = currentStep === i;
                    const si      = getPublicStatusInfo(s);
                    return (
                      <div key={s} className="flex items-start flex-1 min-w-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                            ${done ? "bg-green-500" : current ? "bg-[var(--accent)]" : "bg-gray-200"}`}>
                            {done    ? <CheckCircle2 size={18} className="text-white"/> :
                             current ? <Clock size={16} className="text-white"/> :
                             <span className="text-xs text-gray-400">{i+1}</span>}
                          </div>
                          <p className={`text-[10px] text-center mt-1.5 leading-tight max-w-[80px]
                            ${current ? "text-[var(--accent)] font-semibold" : done ? "text-green-600" : "text-gray-400"}`}>
                            {si.label}
                          </p>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mt-5 ${done ? "bg-green-400" : "bg-gray-200"}`}/>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-5 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border">{result.statusInfo.description}</p>
              </div>
            )}

            {/* Details */}
            <div className="p-8 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-4">Application Details</h3>
                <dl className="space-y-3 text-sm">
                  {[
                    ["University", result.university],
                    ["Program",    result.program],
                    ["Intake",     result.intake],
                    ["Submitted",  new Date(result.submittedAt).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })],
                    ["Last Update",new Date(result.lastUpdated).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })],
                  ].map(([k,v]) => (
                    <div key={k} className="flex gap-3">
                      <dt className="text-gray-400 w-28 shrink-0">{k}</dt>
                      <dd className="text-gray-700 font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {result.adminMessages?.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-4">Messages from Eduwave</h3>
                  <div className="space-y-2">
                    {result.adminMessages.map((m: any, i: number) => (
                      <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-gray-700">
                        <p>{m.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="bg-gray-50 p-6 text-center border-t">
              <p className="text-gray-500 text-sm mb-4">
                Have an account? Log in for full details, messaging, and document downloads.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/login" className="btn-primary">
                  Sign In <ArrowRight size={14}/>
                </Link>
                <a href="https://wa.me/601124103692" target="_blank" rel="noopener noreferrer"
                  className="btn-secondary">
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help text if no result */}
      {!result && !loading && (
        <div className="container-custom pb-20">
          <div className="max-w-2xl mx-auto grid md:grid-cols-3 gap-4 text-center">
            {[
              ["📋","Submit Application","Log in or register as a student, then submit your application."],
              ["🔢","Get Tracking Number","Your unique EDU-YYYY-NNNNN number is displayed immediately."],
              ["🔍","Track Anytime","Come back here anytime to check status — no login needed."],
            ].map(([e,t,d]) => (
              <div key={t} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white">
                <p className="text-3xl mb-3">{e}</p>
                <p className="font-semibold mb-1">{t}</p>
                <p className="text-white/50 text-xs">{d}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
