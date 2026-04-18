"use client";

import { useState, useEffect } from "react";
import {
  Users, Plus, Edit2, Trash2, X, Loader2, Check, Eye,
  MessageSquare, User, GraduationCap, Phone, Mail,
  MapPin, Calendar, BookOpen, Award, Send, ChevronDown,
} from "lucide-react";
import DeleteModal from "@/components/admin/DeleteModal";
import { useForm } from "react-hook-form";

const ROLES = ["SUPER_ADMIN","ADMIN","EDITOR","AGENT","STUDENT"] as const;
const ROLE_COLORS: Record<string,string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700",
  ADMIN:       "bg-blue-100 text-blue-700",
  EDITOR:      "bg-teal-100 text-teal-700",
  AGENT:       "bg-orange-100 text-orange-700",
  STUDENT:     "bg-gray-100 text-gray-600",
};

// ── Profile View Modal ──────────────────────────────────────────
function ProfileModal({ user, onClose }: { user: any; onClose: () => void }) {
  const [profile,      setProfile]      = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [messages,     setMessages]     = useState<any[]>([]);
  const [newMsg,       setNewMsg]        = useState("");
  const [sending,      setSending]       = useState(false);
  const [activeTab,    setActiveTab]     = useState<"profile"|"applications"|"message">("profile");
  const [loading,      setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/users/${user.id}`).then(r => r.json()),
      fetch(`/api/admin/applications?studentId=${user.id}`).then(r => r.json()),
    ]).then(([ud, appd]) => {
      if (ud.success)   { setProfile(ud.data?.studentProfile); }
      if (appd.success) setApplications(appd.data ?? []);
    }).finally(() => setLoading(false));
  }, [user.id]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    await fetch("/api/admin/notifications/user-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, message: newMsg, userName: user.name }),
    });
    setMessages(prev => [...prev, { content: newMsg, from: "Admin", time: new Date().toLocaleTimeString() }]);
    setNewMsg("");
    setSending(false);
  };

  const tabs = [
    { id:"profile",      label:"Profile",      icon: User },
    { id:"applications", label:"Applications", icon: GraduationCap, count: applications.length },
    { id:"message",      label:"Send Message", icon: MessageSquare },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-xl">
              {user.name?.[0] ?? "U"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--primary)]">{user.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[user.role]}`}>{user.role}</span>
                <span className="text-xs text-gray-400">{user.email}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18}/></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6 pt-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors mr-1
                ${activeTab === tab.id ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              <tab.icon size={14}/>
              {tab.label}
              {"count" in tab && tab.count! > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-[var(--accent)] text-white text-[10px] flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[280px]">
          {loading && <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-[var(--accent)]"/></div>}

          {/* Profile Tab */}
          {!loading && activeTab === "profile" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label:"Full Name",      value: user.name,                icon: User      },
                  { label:"Email",          value: user.email,               icon: Mail      },
                  { label:"Phone",          value: user.phone ?? "—",        icon: Phone     },
                  { label:"Role",           value: user.role,                icon: Award     },
                  { label:"Account Status", value: user.isActive ? "Active" : "Inactive",   icon: Check },
                  { label:"Joined",         value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—", icon: Calendar },
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

              {profile && user.role === "STUDENT" && (
                <>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-bold text-[var(--primary)] mb-3">Academic Profile</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label:"Nationality",         value: profile.nationality          },
                        { label:"Date of Birth",       value: profile.dateOfBirth          },
                        { label:"Passport No.",        value: profile.passportNo           },
                        { label:"Last Qualification",  value: profile.lastQualification    },
                        { label:"GPA / Grade",         value: profile.gpa                  },
                        { label:"English Score",       value: profile.englishScore         },
                        { label:"Last Institution",    value: profile.lastInstitution      },
                        { label:"Intended Intake",     value: profile.intendedIntake       },
                      ].filter(r => r.value).map(row => (
                        <div key={row.label} className="p-2.5 bg-blue-50 rounded-lg">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">{row.label}</p>
                          <p className="text-sm font-medium text-gray-800">{row.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!profile && user.role === "STUDENT" && (
                <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl">
                  No academic profile submitted yet.
                </div>
              )}
            </div>
          )}

          {/* Applications Tab */}
          {!loading && activeTab === "applications" && (
            <div className="space-y-3">
              {applications.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">No applications yet.</div>
              ) : (
                applications.map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                    <div>
                      <p className="text-sm font-bold text-[var(--primary)]">{app.trackingNumber}</p>
                      <p className="text-xs text-gray-500">{app.universityName} — {app.programName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Intake: {app.intake}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0
                      ${app.status==="enrolled"   ? "bg-green-100 text-green-700" :
                        app.status==="rejected"   ? "bg-red-100 text-red-600" :
                        app.status==="offer_received" ? "bg-blue-100 text-blue-700" :
                        "bg-orange-100 text-orange-600"}`}>
                      {app.status?.replace(/_/g," ")}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Message Tab */}
          {!loading && activeTab === "message" && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-700 border border-blue-100">
                Send a direct notification message to <strong>{user.name}</strong>. They will receive it in their portal notifications.
              </div>
              {messages.map((m, i) => (
                <div key={i} className="p-3 bg-green-50 rounded-xl border border-green-100 text-sm">
                  <p className="text-xs text-gray-400 mb-1">Sent at {m.time}</p>
                  <p className="text-gray-700">{m.content}</p>
                </div>
              ))}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Message to {user.name}</label>
                <textarea
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  rows={4}
                  placeholder="Type your message here..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none"
                />
                <button onClick={sendMessage} disabled={sending || !newMsg.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  {sending ? <Loader2 size={14} className="animate-spin"/> : <Send size={14}/>}
                  Send Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users,     setUsers]     = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [viewing,   setViewing]   = useState<any>(null);
  const [saving,    setSaving]    = useState(false);
  const [filter,    setFilter]    = useState<string>("ALL");
  const [search,    setSearch]    = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { register, handleSubmit, reset } = useForm<any>();

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const d   = await res.json();
    if (d.success) setUsers(d.data);
    setLoading(false);
  };
  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => { setEditing(null); reset({ role:"STUDENT", isApproved:true, isActive:true }); setShowForm(true); };
  const openEdit   = (u: any) => { setEditing(u); reset(u); setShowForm(true); };

  const onSubmit = async (data: any) => {
    setSaving(true);
    if (editing) {
      await fetch(`/api/admin/users?id=${editing.id}`, { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data) });
    } else {
      await fetch("/api/admin/users", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data) });
    }
    await fetchUsers(); setShowForm(false); setSaving(false);
  };

  const deleteUser = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/users?id=${deleteTarget.id}`, { method:"DELETE" });
    fetchUsers();
    setDeleteTarget(null);
  };

  const toggleActive = async (u: any) => {
    await fetch(`/api/admin/users?id=${u.id}`, { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ isActive: !u.isActive }) });
    fetchUsers();
  };

  const filtered = users.filter(u => {
    if (filter !== "ALL" && u.role !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Users & Profiles</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} total users — view profiles, send messages</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5"><Plus size={16}/> Add User</button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[{role:"ALL",label:"All Users",count:users.length},...ROLES.map(r => ({ role:r, label:r.replace("_"," "), count:users.filter(u=>u.role===r).length }))].map(item => (
          <button key={item.role} onClick={() => setFilter(item.role)}
            className={`bg-white rounded-xl p-3 shadow-sm border text-center transition-all ${filter===item.role ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-gray-100 hover:border-gray-200"}`}>
            <p className="text-xl font-bold text-[var(--primary)]">{item.count}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{item.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
        />
        <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[var(--accent)]"/></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Name / Email","Role","Status","Phone","Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u: any) => (
                <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${!u.isActive ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {u.name?.[0] ?? "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{u.name || "—"}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ROLE_COLORS[u.role] ?? "bg-gray-100 text-gray-600"}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{u.phone ?? "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {/* View Profile */}
                      <button onClick={() => setViewing(u)} title="View Profile"
                        className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                        <Eye size={13}/>
                      </button>
                      {/* Edit */}
                      <button onClick={() => openEdit(u)} title="Edit User"
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                        <Edit2 size={13}/>
                      </button>
                      {/* Toggle active */}
                      <button onClick={() => toggleActive(u)} title={u.isActive ? "Deactivate" : "Activate"}
                        className={`p-1.5 rounded-lg transition-colors ${u.isActive ? "bg-orange-50 text-orange-500 hover:bg-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                        <Check size={13}/>
                      </button>
                      {/* Message */}
                      <button onClick={() => { setViewing(u); }} title="Send Message"
                        className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                        <MessageSquare size={13}/>
                      </button>
                      {/* Delete */}
                      <button onClick={() => setDeleteTarget({ id: u.id, name: u.name || u.email })} title="Delete"
                        className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Profile View Modal */}
      {viewing && <ProfileModal user={viewing} onClose={() => setViewing(null)} />}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-[var(--primary)]">{editing ? "Edit User" : "Add User"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input {...register("name")} className="input-field"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input {...register("email")} type="email" className="input-field" disabled={!!editing}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editing ? "New Password (leave blank to keep)" : "Password *"}
                </label>
                <input {...register("password")} type="password" className="input-field"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select {...register("role")} className="input-field">
                  {ROLES.map(r => <option key={r} value={r}>{r.replace("_"," ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input {...register("phone")} className="input-field"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent Code (AGENT role)</label>
                <input {...register("agentCode")} placeholder="e.g. AGT-ABCD1234" className="input-field"/>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("isApproved")} className="w-4 h-4 accent-[var(--accent)]"/>
                  <span className="text-sm text-gray-700">Approved</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("isActive")} className="w-4 h-4 accent-[var(--accent)]"/>
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2 border-t">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin"/>} {editing ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <DeleteModal
          title="Delete User"
          itemName={deleteTarget.name}
          warning="This cannot be undone. All user data will be lost."
          onConfirm={deleteUser}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
