"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Layout, Plus, Edit2, Trash2, Eye, Globe, FileX, Loader2, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import DeleteModal from "@/components/admin/DeleteModal";

export default function AdminCmsPage() {
  const [pages, setPages]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPages = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/pages");
    const d   = await res.json();
    if (d.success) setPages(d.data);
    setLoading(false);
  };
  useEffect(() => { fetchPages(); }, []);

  const onCreate = async (data: any) => {
    setSaving(true);
    const res  = await fetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, sections: "[]", status: "draft" }),
    });
    const json = await res.json();
    if (json.success) { setShowCreate(false); reset(); fetchPages(); showToast("Page created!", "success"); }
    else showToast(json.message || "Failed to create page", "error");
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/pages?id=${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast(`"${deleteTarget.title}" deleted successfully`, "success");
        fetchPages();
      } else {
        showToast(json.message || "Failed to delete page", "error");
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (page: any) => {
    const res = await fetch(`/api/admin/pages?id=${page.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: page.status === "published" ? "draft" : "published" }),
    });
    const json = await res.json();
    if (json.success) {
      showToast(`Page ${page.status === "published" ? "unpublished" : "published"}`, "success");
      fetchPages();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-right ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Pages (CMS)</h1>
          <p className="text-gray-500 text-sm mt-1">Build and manage all website pages with visual sections</p>
        </div>
        <button onClick={() => { reset({ sortOrder: 0 }); setShowCreate(true); }} className="btn-primary">
          <Plus size={16} /> New Page
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[var(--accent)]" /></div>
      ) : pages.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-200">
          <Layout size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-medium">No pages yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first CMS page</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pages.map((page: any) => {
            let sectionCount = 0;
            try { sectionCount = JSON.parse(page.sections ?? "[]").length; } catch {}
            return (
              <div key={page.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                  {page.status === "published" ? <Globe size={20} className="text-[var(--primary)]" /> : <FileX size={20} className="text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800">{page.title}</h3>
                    {page.isSystem && <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">system</span>}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${page.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {page.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">
                    <span className="font-mono">/{page.slug}</span>
                    <span className="mx-2">·</span>
                    {sectionCount} section{sectionCount !== 1 ? "s" : ""}
                    {page.updatedAt && <><span className="mx-2">·</span>Updated {new Date(page.updatedAt).toLocaleDateString()}</>}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublish(page)}
                    title={page.status === "published" ? "Unpublish" : "Publish"}
                    className={`p-2 rounded-xl transition-colors ${page.status === "published" ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    <Eye size={15} />
                  </button>
                  <Link href={`/admin/cms/${page.id}`}
                    className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                    <Edit2 size={15} />
                  </Link>
                  {!page.isSystem ? (
                    <button onClick={() => setDeleteTarget({ id: page.id, title: page.title })}
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  ) : (
                    <button disabled
                      className="p-2 bg-gray-50 text-gray-300 rounded-xl cursor-not-allowed">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          title="Delete Page"
          itemName={deleteTarget.title}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* Create page modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mt-10 mb-10">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-[var(--primary)]">Create New Page</h2>
              <button onClick={() => setShowCreate(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onCreate)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title *</label>
                <input {...register("title", { required: "Title is required" })} className="input-field" placeholder="e.g. Scholarship Guide" />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL path) *</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-400">/</span>
                  <input {...register("slug", { required: true, pattern: /^[a-z0-9-]+$/ })} className="input-field rounded-l-none flex-1" placeholder="scholarship-guide" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Lowercase letters, numbers, and hyphens only</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea {...register("excerpt")} rows={2} className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
                <input {...register("metaDesc")} className="input-field" placeholder="For search engine results…" />
              </div>
              <div className="flex gap-3 pt-2 border-t">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving && <Loader2 size={14} className="animate-spin" />} Create Page
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
