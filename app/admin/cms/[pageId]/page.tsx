"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff, Loader2, Globe, FileX, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import SectionEditor from "@/components/cms/SectionEditor";
import LivePreview from "@/components/cms/LivePreview";
import type { CmsSection } from "@/types";

export default function PageEditorPage() {
  const { pageId } = useParams<{ pageId: string }>();
  const router     = useRouter();

  const [page, setPage]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<CmsSection[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Meta fields
  const [title,    setTitle]    = useState("");
  const [metaTitle,setMetaTitle]= useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [ogImage,  setOgImage]  = useState("");
  const [status,   setStatus]   = useState<"draft" | "published">("draft");
  const [metaOpen, setMetaOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/pages`)
      .then(r => r.json())
      .then(d => {
        const found = d.data?.find((p: any) => p.id === pageId);
        if (found) {
          setPage(found);
          setTitle(found.title);
          setMetaTitle(found.metaTitle ?? "");
          setMetaDesc(found.metaDesc  ?? "");
          setOgImage(found.ogImage    ?? "");
          setStatus(found.status      ?? "draft");
          try { setSections(JSON.parse(found.sections ?? "[]")); } catch { setSections([]); }
        }
      })
      .finally(() => setLoading(false));
  }, [pageId]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const save = useCallback(async (publishStatus?: "draft" | "published") => {
    setSaving(true);
    const res = await fetch(`/api/admin/pages?id=${pageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        sections: JSON.stringify(sections),
        metaTitle: metaTitle || null,
        metaDesc:  metaDesc  || null,
        ogImage:   ogImage   || null,
        status: publishStatus ?? status,
      }),
    });
    const json = await res.json();
    if (json.success) {
      setStatus(json.data.status);
      showToast("success", publishStatus === "published" ? "Page published!" : "Changes saved.");
    } else {
      showToast("error", json.message ?? "Save failed.");
    }
    setSaving(false);
  }, [pageId, title, sections, metaTitle, metaDesc, ogImage, status]);

  // Auto-save every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => { if (page) save(); }, 60000);
    return () => clearInterval(timer);
  }, [save, page]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={36} className="animate-spin text-[var(--accent)]" />
    </div>
  );
  if (!page) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Page not found.</p>
      <Link href="/admin/cms" className="text-[var(--accent)] hover:underline mt-2 inline-block">← Back to Pages</Link>
    </div>
  );

  return (
    <div className="space-y-0">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
          ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur border-b -mx-4 lg:-mx-8 px-4 lg:px-8 py-3 flex items-center gap-3 shadow-sm mb-6">
        <Link href="/admin/cms" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>

        {/* Editable title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="flex-1 text-lg font-bold text-[var(--primary)] bg-transparent focus:outline-none border-b-2 border-transparent focus:border-[var(--accent)] px-1 py-0.5 transition-colors"
        />

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {status === "published" ? <><Globe size={10} className="inline mr-1" />Published</> : <><FileX size={10} className="inline mr-1" />Draft</>}
          </span>
          <button onClick={() => setShowPreview(p => !p)}
            className={`p-2 rounded-lg transition-colors ${showPreview ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button onClick={() => save()} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save
          </button>
          <button onClick={() => save(status === "published" ? "draft" : "published")} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[#d04e18] disabled:opacity-50">
            {status === "published" ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-3xl"}`}>
        {/* Editor panel */}
        <div className="space-y-4">
          {/* SEO meta accordion */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setMetaOpen(o => !o)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
              <span className="font-semibold text-gray-800 text-sm">SEO & Page Settings</span>
              <span className="text-xs text-gray-400">{metaOpen ? "▲ Hide" : "▼ Show"}</span>
            </button>
            {metaOpen && (
              <div className="px-5 pb-5 space-y-3 border-t">
                <div className="pt-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Meta Title</label>
                  <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="input-field" placeholder="Page title for search engines" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Meta Description</label>
                  <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={2} className="input-field resize-none" placeholder="150-160 characters for best results" />
                  <p className={`text-xs mt-1 ${metaDesc.length > 160 ? "text-red-500" : "text-gray-400"}`}>{metaDesc.length}/160</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">OG Image URL</label>
                  <input value={ogImage} onChange={e => setOgImage(e.target.value)} className="input-field" placeholder="/uploads/og/page-image.jpg" />
                </div>
              </div>
            )}
          </div>

          {/* Section editor */}
          <SectionEditor sections={sections} onChange={setSections} />
        </div>

        {/* Live preview */}
        {showPreview && <div className="sticky top-32 self-start"><LivePreview sections={sections} /></div>}
      </div>
    </div>
  );
}
