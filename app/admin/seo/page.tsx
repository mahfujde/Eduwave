"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2, AlertTriangle, AlertCircle, ExternalLink, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface SeoData {
  page: string;
  label: string;
  metaTitle: string;
  metaDesc: string;
  ogImage: string;
  keywords: string;
}

const STATIC_PAGES: SeoData[] = [
  { page: "/",             label: "Homepage",         metaTitle: "", metaDesc: "", ogImage: "", keywords: "" },
  { page: "/about",        label: "About Us",         metaTitle: "", metaDesc: "", ogImage: "", keywords: "" },
  { page: "/services",     label: "Services",         metaTitle: "", metaDesc: "", ogImage: "", keywords: "" },
  { page: "/universities", label: "Universities",     metaTitle: "", metaDesc: "", ogImage: "", keywords: "" },
  { page: "/courses",      label: "Courses",          metaTitle: "", metaDesc: "", ogImage: "", keywords: "" },
  { page: "/blog",         label: "Blog",             metaTitle: "", metaDesc: "", ogImage: "", keywords: "" },
  { page: "/contact",      label: "Contact",          metaTitle: "", metaDesc: "", ogImage: "", keywords: "" },
  { page: "/track",        label: "Track Application",metaTitle: "", metaDesc: "", ogImage: "", keywords: "" },
];

// ─── Rule-based keyword density scorer ──────────────────────
function analyseContent(title: string, desc: string) {
  const suggestions: { type: "success" | "warning" | "error"; msg: string }[] = [];

  if (!title)              suggestions.push({ type: "error",   msg: "Meta title is missing." });
  else if (title.length < 30) suggestions.push({ type: "warning", msg: `Meta title is short (${title.length} chars). Aim for 50–60.` });
  else if (title.length > 60) suggestions.push({ type: "warning", msg: `Meta title is too long (${title.length} chars). Keep under 60.` });
  else                     suggestions.push({ type: "success", msg: `Meta title length is perfect (${title.length} chars).` });

  if (!desc)              suggestions.push({ type: "error",   msg: "Meta description is missing." });
  else if (desc.length < 100) suggestions.push({ type: "warning", msg: `Meta description is short (${desc.length} chars). Aim for 150–160.` });
  else if (desc.length > 160) suggestions.push({ type: "error",   msg: `Meta description too long (${desc.length} chars). Keep under 160.` });
  else                    suggestions.push({ type: "success", msg: `Meta description length is perfect (${desc.length} chars).` });

  return suggestions;
}

const ICON_MAP = { success: CheckCircle2, warning: AlertTriangle, error: AlertCircle };
const COLOR_MAP = {
  success: "text-green-600 bg-green-50 border-green-200",
  warning: "text-yellow-700 bg-yellow-50 border-yellow-200",
  error:   "text-red-600 bg-red-50 border-red-200",
};

export default function AdminSeoPage() {
  const [selected, setSelected]   = useState<SeoData>(STATIC_PAGES[0]);
  const [seoData, setSeoData]     = useState<Record<string, SeoData>>({});
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [cmsPages, setCmsPages]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  // Load CMS pages + existing SEO config from site_config
  useEffect(() => {
    Promise.all([
      fetch("/api/admin/pages").then(r => r.json()),
      fetch("/api/public/settings").then(r => r.json()),
    ]).then(([pagesRes, settingsRes]) => {
      if (pagesRes.success) setCmsPages(pagesRes.data);

      // Restore saved SEO data from settings
      const settings = settingsRes.data ?? {};
      const restored: Record<string, SeoData> = {};
      STATIC_PAGES.forEach(p => {
        const key = `seo_${p.page.replace(/\//g, "_") || "_home"}`;
        try {
          const saved = settings[key] ? JSON.parse(settings[key]) : {};
          restored[p.page] = { ...p, ...saved };
        } catch {
          restored[p.page] = { ...p };
        }
      });
      setSeoData(restored);
      setSelected(restored[STATIC_PAGES[0].page] ?? STATIC_PAGES[0]);
    }).finally(() => setLoading(false));
  }, []);

  const updateField = (field: keyof SeoData, val: string) => {
    const updated = { ...selected, [field]: val };
    setSelected(updated);
    setSeoData(prev => ({ ...prev, [selected.page]: updated }));
  };

  const saveSeo = async () => {
    setSaving(true);
    const key   = `seo_${selected.page.replace(/\//g, "_") || "_home"}`;
    const value = JSON.stringify({
      metaTitle: selected.metaTitle,
      metaDesc:  selected.metaDesc,
      ogImage:   selected.ogImage,
      keywords:  selected.keywords,
    });
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, group: "seo", label: `SEO: ${selected.label}` }),
      });
      toast.success(`SEO settings saved for "${selected.label}"!`);
      setSaving(false); setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error("Failed to save SEO settings.");
      setSaving(false);
    }
  };

  const suggestions = analyseContent(selected.metaTitle, selected.metaDesc);
  const score = Math.round((suggestions.filter(s => s.type === "success").length / suggestions.length) * 100);

  const allPages = [
    ...STATIC_PAGES,
    ...cmsPages.map(p => ({ page: `/${p.slug}`, label: p.title, metaTitle: p.metaTitle ?? "", metaDesc: p.metaDesc ?? "", ogImage: p.ogImage ?? "", keywords: "" })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)]">SEO Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Manage meta titles, descriptions, and keywords for every page</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[var(--accent)]" /></div>
      ) : (
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Page list */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-1 self-start">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-2">Pages</p>
            {allPages.map(p => {
              const d = seoData[p.page] ?? p;
              const ok = d.metaTitle && d.metaDesc;
              return (
                <button key={p.page} onClick={() => setSelected(seoData[p.page] ?? p)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-colors
                    ${selected.page === p.page ? "bg-[var(--primary)] text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                  <span className="flex-1 truncate">{p.label}</span>
                  <span title={ok ? "SEO configured" : "SEO missing"}>
                    {ok
                      ? <CheckCircle2 size={13} className={selected.page === p.page ? "text-green-300" : "text-green-500"} />
                      : <AlertCircle size={13} className={selected.page === p.page ? "text-red-300" : "text-red-400"} />}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Editor */}
          <div className="space-y-4">
            {/* Score */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800">{selected.label}</h2>
                <div className="flex items-center gap-2">
                  <div className={`text-lg font-black ${score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                    {score}%
                  </div>
                  <span className="text-xs text-gray-400">SEO Score</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div className={`h-2 rounded-full transition-all duration-500 ${score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-400"}`}
                  style={{ width: `${score}%` }} />
              </div>
              <div className="space-y-2">
                {suggestions.map((s, i) => {
                  const Icon = ICON_MAP[s.type];
                  return (
                    <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${COLOR_MAP[s.type]}`}>
                      <Icon size={13} className="mt-0.5 shrink-0" />
                      {s.msg}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fields */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                  <span className={`text-xs ${selected.metaTitle.length > 60 ? "text-red-500" : "text-gray-400"}`}>
                    {selected.metaTitle.length}/60
                  </span>
                </div>
                <input
                  value={selected.metaTitle}
                  onChange={e => updateField("metaTitle", e.target.value)}
                  className="input-field"
                  placeholder={`Eduwave | ${selected.label}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                  <span className={`text-xs ${selected.metaDesc.length > 160 ? "text-red-500" : "text-gray-400"}`}>
                    {selected.metaDesc.length}/160
                  </span>
                </div>
                <textarea
                  value={selected.metaDesc}
                  onChange={e => updateField("metaDesc", e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Describe this page for search engines (150–160 characters ideal)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                <input
                  value={selected.ogImage}
                  onChange={e => updateField("ogImage", e.target.value)}
                  className="input-field"
                  placeholder="/uploads/og/page-og.jpg"
                />
                {selected.ogImage && (
                  <img src={selected.ogImage} alt="OG preview" className="mt-2 rounded-xl h-28 object-cover border w-full" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Keywords</label>
                <input
                  value={selected.keywords}
                  onChange={e => updateField("keywords", e.target.value)}
                  className="input-field"
                  placeholder="study in malaysia, international students, eduwave…"
                />
                <p className="text-xs text-gray-400 mt-1">Comma-separated. Use naturally in your page content.</p>
              </div>

              {/* Google preview */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Google Search Preview</p>
                <p className="text-[#1a0dab] font-medium text-base hover:underline cursor-pointer line-clamp-1">
                  {selected.metaTitle || `Eduwave | ${selected.label}`}
                </p>
                <p className="text-green-700 text-xs mt-0.5">theeduwave.com{selected.page}</p>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {selected.metaDesc || "No meta description set. Add one for better search results."}
                </p>
              </div>

              <div className="flex gap-3 pt-2 border-t">
                <button onClick={saveSeo} disabled={saving} className="btn-primary">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saved ? "Saved!" : "Save SEO"}
                </button>
                <a href={selected.page} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 text-gray-500 hover:text-[var(--accent)] text-sm">
                  <ExternalLink size={14} /> Preview page
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
