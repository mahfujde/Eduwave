"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, ArrowRight, Inbox, GraduationCap } from "lucide-react";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/messages")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setConversations(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)]">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">Your conversations with the Eduwave team</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-200">
          <Inbox size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-medium">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Messages will appear here when you communicate about your applications
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv: any) => {
            const lastMsg = conv.messages?.[0];
            return (
              <Link
                key={conv.id}
                href={`/portal/applications/${conv.id}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100
                  hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                  <GraduationCap size={22} className="text-[var(--primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {conv.program?.name ?? conv.programName ?? "Application"}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {lastMsg ? new Date(lastMsg.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {conv.university?.name ?? conv.universityName ?? ""} · {conv.trackingNumber}
                  </p>
                  {lastMsg && (
                    <p className="text-xs text-gray-500 truncate mt-1.5">
                      <span className="font-medium">{lastMsg.sender?.name}:</span> {lastMsg.message}
                    </p>
                  )}
                </div>
                <ArrowRight size={16} className="text-gray-300 shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
