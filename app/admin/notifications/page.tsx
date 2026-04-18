"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Edit2, Trash2, X, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import DeleteModal from "@/components/admin/DeleteModal";
import { useForm } from "react-hook-form";

const TYPE_COLORS: Record<string,string> = {
  info:"bg-blue-100 text-blue-700", success:"bg-green-100 text-green-700",
  warning:"bg-yellow-100 text-yellow-700", danger:"bg-red-100 text-red-700",
};
const STYLE_LABELS: Record<string,string> = { bar:"Notification Bar", popup:"Popup", banner:"Section Banner" };

export default function AdminNotificationsPage() {
  const [items, setItems]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { register, handleSubmit, reset, watch } = useForm<any>();

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/notifications");
    const d   = await res.json();
    if (d.success) setItems(d.data);
    setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ type: "info", style: "bar", position: "top", isActive: true, isDismissible: true, sortOrder: 0, targetPages: '["*"]', delay: 0 });
    setShowForm(true);
  };
  const openEdit = (item: any) => { setEditing(item); reset({ ...item, targetPages: item.targetPages ?? '["*"]' }); setShowForm(true); };

  const onSubmit = async (data: any) => {
    setSaving(true);
    if (editing) {
      await fetch(`/api/admin/notifications?id=${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else {
      await fetch("/api/admin/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    await fetchItems(); setShowForm(false); setSaving(false);
  };

  const deleteItem = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/notifications?id=${deleteTarget.id}`, { method: "DELETE" });
    fetchItems();
    setDeleteTarget(null);
  };

  const toggleActive = async (item: any) => {
    await fetch(`/api/admin/notifications?id=${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !item.isActive }) });
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Notifications & Popups</h1>
          <p className="text-gray-500 text-sm mt-1">Manage notification bars, popups, and announcements</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16}/> Add Notification</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[var(--accent)]"/></div>
      ) : (
        <div className="grid gap-4">
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-200">
              <Bell size={48} className="mx-auto mb-4 text-gray-300"/>
              <p className="text-gray-500 font-medium">No notifications yet</p>
              <p className="text-gray-400 text-sm mt-1">Create bars, popups, or banners to display on your website</p>
            </div>
          ) : items.map((item: any) => (
            <div key={item.id} className={`bg-white rounded-xl p-5 border shadow-sm transition-all ${!item.isActive ? "opacity-60" : ""}`}>
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${TYPE_COLORS[item.type] ?? "bg-gray-100"}`}>{item.type}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{STYLE_LABELS[item.style] ?? item.style}</span>
                    {item.isActive
                      ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Active</span>
                      : <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">Inactive</span>}
                  </div>
                  <h3 className="font-semibold text-gray-800 mt-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.content}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    {item.startDate && <span>From: {new Date(item.startDate).toLocaleDateString()}</span>}
                    {item.endDate   && <span>Until: {new Date(item.endDate).toLocaleDateString()}</span>}
                    {item.delay > 0 && <span>Delay: {item.delay}s</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive(item)} title={item.isActive ? "Deactivate" : "Activate"}
                    className={`p-2 rounded-xl ${item.isActive ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                    {item.isActive ? <ToggleRight size={18}/> : <ToggleLeft size={18}/>}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Edit2 size={15}/></button>
                  <button onClick={() => setDeleteTarget({ id: item.id, name: item.title })} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><Trash2 size={15}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-[var(--primary)]">{editing ? "Edit Notification" : "New Notification"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select {...register("type")} className="input-field">
                    {["info","success","warning","danger"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                  <select {...register("style")} className="input-field">
                    {["bar","popup","banner"].map(s => <option key={s} value={s}>{STYLE_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input {...register("title", { required: true })} className="input-field"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea {...register("content", { required: true })} rows={3} className="input-field resize-none"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                  <input {...register("linkText")} className="input-field" placeholder="e.g. Learn more"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                  <input {...register("linkUrl")} className="input-field" placeholder="https://..."/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input {...register("startDate")} type="datetime-local" className="input-field"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input {...register("endDate")} type="datetime-local" className="input-field"/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Pages (JSON)</label>
                <input {...register("targetPages")} className="input-field font-mono text-xs"
                  placeholder='["*"] for all, or ["/","/about"]'/>
                <p className="text-xs text-gray-400 mt-1">Use ["*"] for all pages, or specify paths like ["/","/universities"]</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Popup Delay (seconds)</label>
                <input {...register("delay", { valueAsNumber: true })} type="number" min="0" className="input-field"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (optional)</label>
                <input {...register("videoUrl")} className="input-field" placeholder="YouTube or Vimeo URL"/>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("isActive")} className="w-4 h-4 accent-[var(--accent)]"/>
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("isDismissible")} className="w-4 h-4 accent-[var(--accent)]"/>
                  <span className="text-sm text-gray-700">Dismissible</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2 border-t">
                <button type="submit" disabled={saving} className="btn-primary">
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
          title="Delete Notification"
          itemName={deleteTarget.name}
          onConfirm={deleteItem}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
