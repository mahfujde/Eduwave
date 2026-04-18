"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Send, FileText, CheckCircle2, Clock, Loader2, Download, Upload } from "lucide-react";
import Link from "next/link";
import { getPublicStatusInfo, APPLICATION_STATUSES } from "@/lib/tracking";

const STATUS_STEPS = [
  "submitted","under_review","documents_required","offer_received","visa_processing","enrolled"
];

const STATUS_COLORS: Record<string, string> = {
  green:"bg-green-100 text-green-700 border-green-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  orange:"bg-orange-100 text-orange-700 border-orange-200",
  teal:"bg-teal-100 text-teal-700 border-teal-200",
  indigo:"bg-indigo-100 text-indigo-700 border-indigo-200",
  purple:"bg-purple-100 text-purple-700 border-purple-200",
  red:"bg-red-100 text-red-700 border-red-200",
  gray:"bg-gray-100 text-gray-600 border-gray-200",
};

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [app, setApp]           = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [msgText, setMsgText]   = useState("");
  const [sending, setSending]   = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  const fetchApp = () => fetch(`/api/student/applications/${id}`).then(r => r.json()).then(d => { if (d.success) setApp(d.data); }).finally(() => setLoading(false));
  useEffect(() => { fetchApp(); }, [id]);
  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [app?.messages]);

  const sendMessage = async () => {
    if (!msgText.trim() || sending) return;
    setSending(true);
    await fetch("/api/student/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: id, message: msgText }),
    });
    setMsgText("");
    await fetchApp();
    setSending(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"/></div>;
  if (!app) return <div className="text-center py-20 text-gray-500">Application not found.</div>;

  const si = getPublicStatusInfo(app.status);
  const currentStep = STATUS_STEPS.indexOf(app.status);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/portal/applications" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-gray-600"/>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[var(--primary)]">
            {app.program?.name ?? app.programName ?? "Application Detail"}
          </h1>
          <p className="text-gray-500 text-sm">{app.university?.name ?? app.universityName}</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[si.color] ?? ""}`}>
          {si.label}
        </span>
      </div>

      {/* Tracking Number */}
      <div className="bg-gradient-to-r from-[#0F1B3F] to-[#1A2B5F] rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <p className="text-blue-200/70 text-xs mb-1">Tracking Number</p>
          <p className="text-2xl font-mono font-bold tracking-widest">{app.trackingNumber}</p>
        </div>
        <p className="text-xs text-blue-200/60 text-right">Share this to track<br/>without logging in</p>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-5">Application Progress</h2>
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {STATUS_STEPS.map((s, i) => {
            const done    = currentStep > i;
            const current = currentStep === i;
            const info    = getPublicStatusInfo(s);
            return (
              <div key={s} className="flex items-start flex-1 min-w-0">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${done ? "bg-green-500" : current ? "bg-[var(--accent)]" : "bg-gray-200"}`}>
                    {done ? <CheckCircle2 size={16} className="text-white"/> :
                      current ? <Clock size={14} className="text-white"/> :
                      <span className="text-xs text-gray-400">{i+1}</span>}
                  </div>
                  <p className={`text-[10px] text-center mt-1 leading-tight max-w-[70px]
                    ${current ? "text-[var(--accent)] font-semibold" : done ? "text-green-600" : "text-gray-400"}`}>
                    {info.label}
                  </p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mt-4 ${done ? "bg-green-400" : "bg-gray-200"}`}/>
                )}
              </div>
            );
          })}
        </div>
        {si.description && (
          <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">{si.description}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Documents */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={16}/> Documents
          </h2>
          {app.documents?.length === 0 ? (
            <p className="text-gray-400 text-sm">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {app.documents?.map((doc: any) => (
                <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-sm">
                  <FileText size={14} className="text-[var(--accent)] shrink-0"/>
                  <span className="flex-1 truncate text-gray-700">{doc.name}</span>
                  <Download size={12} className="text-gray-400"/>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">Details</h2>
          <dl className="space-y-3 text-sm">
            {[
              ["University", app.university?.name ?? app.universityName ?? "—"],
              ["Program",    app.program?.name    ?? app.programName    ?? "—"],
              ["Intake",     app.intake ?? "—"],
              ["Submitted",  new Date(app.createdAt).toLocaleDateString()],
              ["Last Updated", new Date(app.updatedAt).toLocaleDateString()],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <dt className="text-gray-400 w-28 shrink-0">{k}</dt>
                <dd className="text-gray-700 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Messaging */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">Messages with Eduwave Team</h2>
        </div>
        <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
          {!app.messages?.length ? (
            <p className="text-gray-400 text-sm text-center py-6">No messages yet. Send a message to the Eduwave team.</p>
          ) : (
            app.messages?.map((msg: any) => {
              const isMe = msg.sender?.role === "STUDENT";
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm
                    ${isMe ? "bg-[var(--accent)] text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                    <p className="font-semibold text-xs mb-1 opacity-70">{msg.sender?.name}</p>
                    <p>{msg.message}</p>
                    <p className={`text-xs mt-1 opacity-60`}>{new Date(msg.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEnd}/>
        </div>
        <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
          <input
            value={msgText}
            onChange={e => setMsgText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 input-field !py-2.5"
          />
          <button onClick={sendMessage} disabled={sending || !msgText.trim()}
            className="p-2.5 bg-[var(--accent)] text-white rounded-xl hover:bg-[#d04e18] disabled:opacity-50 transition-colors">
            {sending ? <Loader2 size={18} className="animate-spin"/> : <Send size={18}/>}
          </button>
        </div>
      </div>
    </div>
  );
}
