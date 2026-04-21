"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap, Loader2, Eye, X, Search, Phone, Mail,
  MapPin, Calendar, BookOpen, Award, FileText, User,
  MessageSquare, Send, ExternalLink, Filter, Trash2, Download,
} from "lucide-react";

const APP_STATUS_STYLES: Record<string,string> = {
  submitted:        "bg-orange-100 text-orange-600",
  under_review:     "bg-blue-100 text-blue-600",
  documents_required: "bg-yellow-100 text-yellow-600",
  offer_received:   "bg-indigo-100 text-indigo-600",
  visa_processing:  "bg-purple-100 text-purple-600",
  enrolled:         "bg-green-100 text-green-700",
  rejected:         "bg-red-100 text-red-600",
  withdrawn:        "bg-gray-100 text-gray-500",
};

// ── Student Detail Modal ──────────────────────────────────
function StudentDetailModal({ student, onClose }: { student: any; onClose: () => void }) {
  const [profile, setProfile]           = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState<"profile"|"applications"|"message">("profile");
  const [newMsg, setNewMsg]             = useState("");
  const [sending, setSending]           = useState(false);
  const [messages, setMessages]         = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/users/${student.id}`).then(r => r.json()),
      fetch(`/api/admin/applications?studentId=${student.id}`).then(r => r.json()),
    ]).then(([ud, appd]) => {
      if (ud.success) setProfile(ud.data?.studentProfile);
      if (appd.success) setApplications(appd.data ?? []);
    }).finally(() => setLoading(false));
  }, [student.id]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    await fetch("/api/admin/notifications/user-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: student.id, message: newMsg, userName: student.name }),
    });
    setMessages(prev => [...prev, { content: newMsg, from: "Admin", time: new Date().toLocaleTimeString() }]);
    setNewMsg("");
    setSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-xl">
              {student.name?.[0] ?? "S"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--primary)]">{student.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400">{student.email}</span>
                {student.referredBy && (
                  <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                    Agent: {student.referredBy}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18}/></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6 pt-2">
          {[
            { id: "profile" as const, label: "Profile", icon: User },
            { id: "applications" as const, label: `Applications (${applications.length})`, icon: FileText },
            { id: "message" as const, label: "Send Message", icon: MessageSquare },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors mr-1 ${
                tab === t.id ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <t.icon size={14}/> {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[280px] max-h-[60vh] overflow-y-auto">
          {loading && <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-[var(--accent)]"/></div>}

          {/* Profile Tab */}
          {!loading && tab === "profile" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label:"Full Name", value: student.name, icon: User },
                  { label:"Email", value: student.email, icon: Mail },
                  { label:"Phone", value: student.phone ?? "—", icon: Phone },
                  { label:"Status", value: student.isActive ? "Active" : "Inactive", icon: Award },
                  { label:"Joined", value: student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "—", icon: Calendar },
                  { label:"Referred By", value: student.referredBy ?? "Direct", icon: GraduationCap },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <row.icon size={16} className="text-[var(--accent)] shrink-0"/>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">{row.label}</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {profile && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-bold text-[var(--primary)] mb-3">Academic Profile</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label:"Nationality", value: profile.nationality },
                      { label:"Date of Birth", value: profile.dateOfBirth },
                      { label:"Passport No.", value: profile.passportNo },
                      { label:"Last Qualification", value: profile.lastQualification },
                      { label:"GPA / Grade", value: profile.gpa },
                      { label:"English Score", value: profile.englishScore },
                      { label:"Last Institution", value: profile.lastInstitution },
                    ].filter(r => r.value).map(row => (
                      <div key={row.label} className="p-2.5 bg-blue-50 rounded-lg">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{row.label}</p>
                        <p className="text-sm font-medium text-gray-800">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!profile && (
                <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl">
                  No academic profile submitted yet.
                </div>
              )}
            </div>
          )}

          {/* Applications Tab */}
          {!loading && tab === "applications" && (
            <div className="space-y-3">
              {applications.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  <FileText size={32} className="mx-auto mb-2 opacity-50"/>
                  No applications yet.
                </div>
              ) : (
                applications.map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                    <div>
                      <p className="text-sm font-bold text-[var(--primary)]">{app.trackingNumber}</p>
                      <p className="text-xs text-gray-500">{app.universityName} — {app.programName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Intake: {app.intake}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${APP_STATUS_STYLES[app.status] ?? "bg-gray-100"}`}>
                      {app.status?.replace(/_/g," ")}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Message Tab */}
          {!loading && tab === "message" && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-700 border border-blue-100">
                Send a direct notification message to <strong>{student.name}</strong>.
              </div>
              {messages.map((m, i) => (
                <div key={i} className="p-3 bg-green-50 rounded-xl border border-green-100 text-sm">
                  <p className="text-xs text-gray-400 mb-1">Sent at {m.time}</p>
                  <p className="text-gray-700">{m.content}</p>
                </div>
              ))}
              <div className="space-y-2">
                <textarea value={newMsg} onChange={e => setNewMsg(e.target.value)} rows={4} placeholder="Type your message here..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none"/>
                <button onClick={sendMessage} disabled={sending || !newMsg.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  {sending ? <Loader2 size={14} className="animate-spin"/> : <Send size={14}/>} Send Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Students Page ──────────────────────────────────────
export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [viewing, setViewing]   = useState<any>(null);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/users?role=STUDENT")
      .then(r => r.json())
      .then(d => { if (d.success) setStudents(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s => {
    if (search) {
      const q = search.toLowerCase();
      if (!s.name?.toLowerCase().includes(q) && !s.email?.toLowerCase().includes(q)) return false;
    }
    if (statusFilter === "ACTIVE" && !s.isActive) return false;
    if (statusFilter === "INACTIVE" && s.isActive) return false;
    if (statusFilter === "REFERRED" && !s.referredBy) return false;
    return true;
  });

  const totalActive = students.filter(s => s.isActive).length;
  const totalReferred = students.filter(s => s.referredBy).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Students</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} total students — view profiles, applications & messages</p>
        </div>
        <button onClick={() => {
          if (!students.length) return;
          const headers = ["Name","Email","Phone","Status","Referred By","Joined"];
          const rows = students.map((s: any) => [
            s.name || "", s.email, s.phone || "", s.isActive ? "Active" : "Inactive",
            s.referredBy || "Direct", new Date(s.createdAt).toLocaleDateString(),
          ]);
          const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = `eduwave-students-${Date.now()}.csv`; a.click();
          URL.revokeObjectURL(url);
        }} className="btn-secondary !py-2 text-sm flex items-center gap-2">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: students.length, filter: "ALL" },
          { label: "Active", value: totalActive, filter: "ACTIVE" },
          { label: "Inactive", value: students.length - totalActive, filter: "INACTIVE" },
          { label: "Agent Referred", value: totalReferred, filter: "REFERRED" },
        ].map(s => (
          <button key={s.filter} onClick={() => setStatusFilter(s.filter)}
            className={`bg-white rounded-xl p-4 shadow-sm border text-center transition-all ${
              statusFilter === s.filter ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-gray-100 hover:border-gray-200"
            }`}>
            <p className="text-2xl font-bold text-[var(--primary)]">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"/>
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[var(--accent)]"/></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Name / Email","Phone","Referred By","Status","Joined","Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No students found</td></tr>
              ) : filtered.map((s: any) => (
                <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${!s.isActive ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {s.name?.[0] ?? "S"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{s.name || "—"}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {s.phone ? (
                      <a href={`https://wa.me/${s.phone.replace(/[^0-9+]/g,'')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 flex items-center gap-1 text-xs">
                        <MessageSquare size={12}/> {s.phone}
                      </a>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    {s.referredBy ? (
                      <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-mono">{s.referredBy}</span>
                    ) : <span className="text-xs text-gray-400">Direct</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setViewing(s)} title="View Profile"
                        className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                        <Eye size={13}/>
                      </button>
                      {s.phone && (
                        <a href={`https://wa.me/${s.phone.replace(/[^0-9+]/g,'')}`}
                          target="_blank" rel="noopener noreferrer" title="WhatsApp"
                          className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                          <ExternalLink size={13}/>
                        </a>
                      )}
                      <button onClick={() => setDeleteTarget(s)} title="Delete Student"
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {viewing && <StudentDetailModal student={viewing} onClose={() => setViewing(null)} />}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-red-600 mb-2">Delete Student</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete <strong>{deleteTarget.name || deleteTarget.email}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">Cancel</button>
              <button onClick={async () => {
                setDeleting(true);
                await fetch(`/api/admin/users?id=${deleteTarget.id}`, { method: "DELETE" });
                setStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
                setDeleteTarget(null);
                setDeleting(false);
              }} disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 flex items-center justify-center gap-2">
                {deleting ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
