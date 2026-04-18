"use client";

import { useState } from "react";
import { Trash2, GripVertical, Plus, ChevronDown, ChevronUp, Eye, EyeOff, Upload } from "lucide-react";
import type { CmsSection, CmsSectionItem } from "@/types";
import { nanoid } from "nanoid";
import DeleteModal from "@/components/admin/DeleteModal";

export const SECTION_TYPES = [
  { type: "hero",         label: "Hero Banner",       icon: "🦸" },
  { type: "text",         label: "Text Block",        icon: "📝" },
  { type: "image",        label: "Image",             icon: "🖼️" },
  { type: "cards",        label: "Cards / Features",  icon: "🃏" },
  { type: "team",         label: "Team / People",     icon: "👥" },
  { type: "stats",        label: "Stats / Counters",  icon: "📊" },
  { type: "faq",          label: "FAQ",               icon: "❓" },
  { type: "gallery",      label: "Image Gallery",     icon: "🖼️" },
  { type: "youtube",      label: "YouTube Videos",    icon: "▶️" },
  { type: "cta",          label: "Call to Action",    icon: "🔔" },
  { type: "video",        label: "Video Embed",       icon: "📹" },
  { type: "html",         label: "Custom HTML",       icon: "🧩" },
  { type: "testimonials", label: "Testimonials",      icon: "💬" },
] as const;

// Upload helper
function UploadButton({ onUpload, folder = "cms" }: { onUpload: (url: string) => void; folder?: string }) {
  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files[0]; if (!file) return;
      const fd = new FormData(); fd.append("file", file); fd.append("folder", `images/${folder}`);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const r = await res.json();
      if (r.success) onUpload(r.data.url);
    };
    input.click();
  };
  return <button type="button" onClick={handleClick} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 shrink-0" title="Upload image"><Upload size={14} /></button>;
}

// Label helper
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{children}</label>
);

function SectionBlock({ section, index, total, onChange, onDelete, onMove }: {
  section: CmsSection; index: number; total: number;
  onChange: (u: CmsSection) => void; onDelete: () => void; onMove: (d: "up"|"down") => void;
}) {
  const [open, setOpen] = useState(true);
  const up = (f: string, v: any) => onChange({ ...section, [f]: v });

  const addItem = (defaults: Partial<CmsSectionItem> = {}) => {
    const items = [...(section.items ?? []), { id: nanoid(6), title: "", content: "", imageUrl: "", linkUrl: "", icon: "", subtitle: "", ...defaults }];
    up("items", items);
  };
  const updateItem = (i: number, f: string, v: string) => {
    up("items", (section.items ?? []).map((it, idx) => idx === i ? { ...it, [f]: v } : it));
  };
  const removeItem = (i: number) => up("items", (section.items ?? []).filter((_, idx) => idx !== i));

  const typeInfo = SECTION_TYPES.find(s => s.type === section.type);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <GripVertical size={16} className="text-gray-300 cursor-grab shrink-0" />
        <button onClick={() => setOpen(o => !o)} className="flex-1 flex items-center gap-2 text-left">
          <span className="text-base">{typeInfo?.icon ?? "📄"}</span>
          <span className="font-medium text-gray-800 text-sm">{section.title || typeInfo?.label || section.type}</span>
          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">{section.type}</span>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => up("visible", !section.visible)} className={`p-1.5 rounded-lg ${section.visible ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}>
            {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button onClick={() => onMove("up")} disabled={index === 0} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronUp size={14} className="text-gray-500" /></button>
          <button onClick={() => onMove("down")} disabled={index === total - 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronDown size={14} className="text-gray-500" /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
          <button onClick={() => setOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-gray-100">
            {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="p-5 space-y-4">
          {/* Common: Title */}
          <div>
            <Label>Section Title / Heading</Label>
            <input value={section.title ?? ""} onChange={e => up("title", e.target.value)} className="input-field" placeholder="e.g. Why Choose Us" />
          </div>

          {/* Subtitle for most section types */}
          {["hero","text","team","stats","faq","gallery","youtube"].includes(section.type) && (
            <div>
              <Label>Subtitle / Tag Line</Label>
              <input value={section.subtitle ?? ""} onChange={e => up("subtitle", e.target.value)} className="input-field" placeholder="e.g. Our Leadership" />
            </div>
          )}

          {/* ── HERO ── */}
          {section.type === "hero" && (
            <>
              <div><Label>Content / Description</Label><textarea value={section.content ?? ""} onChange={e => up("content", e.target.value)} rows={3} className="input-field resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>CTA Button Text</Label><input value={section.ctaText ?? ""} onChange={e => up("ctaText", e.target.value)} className="input-field" placeholder="Get Started" /></div>
                <div><Label>CTA Button URL</Label><input value={section.ctaUrl ?? ""} onChange={e => up("ctaUrl", e.target.value)} className="input-field" placeholder="/contact" /></div>
                <div><Label>Secondary Button Text</Label><input value={section.ctaSecondaryText ?? ""} onChange={e => up("ctaSecondaryText", e.target.value)} className="input-field" /></div>
                <div><Label>Secondary Button URL</Label><input value={section.ctaSecondaryUrl ?? ""} onChange={e => up("ctaSecondaryUrl", e.target.value)} className="input-field" /></div>
              </div>
              <div><Label>Background Image URL</Label>
                <div className="flex gap-2"><input value={section.imageUrl ?? ""} onChange={e => up("imageUrl", e.target.value)} className="input-field flex-1" placeholder="/uploads/cms/hero.jpg" /><UploadButton onUpload={url => up("imageUrl", url)} /></div>
              </div>
            </>
          )}

          {/* ── TEXT ── */}
          {section.type === "text" && (
            <div><Label>Content</Label><textarea value={section.content ?? ""} onChange={e => up("content", e.target.value)} rows={5} className="input-field resize-none" /></div>
          )}

          {/* ── IMAGE ── */}
          {section.type === "image" && (
            <>
              <div><Label>Image URL</Label><div className="flex gap-2"><input value={section.imageUrl ?? ""} onChange={e => up("imageUrl", e.target.value)} className="input-field flex-1" /><UploadButton onUpload={url => up("imageUrl", url)} /></div></div>
              {section.imageUrl && <img src={section.imageUrl} alt="preview" className="rounded-xl max-h-48 object-cover border" />}
              <div><Label>Caption</Label><input value={section.content ?? ""} onChange={e => up("content", e.target.value)} className="input-field" /></div>
            </>
          )}

          {/* ── VIDEO ── */}
          {section.type === "video" && (
            <div><Label>Video URL (YouTube / Vimeo)</Label><input value={section.videoUrl ?? ""} onChange={e => up("videoUrl", e.target.value)} className="input-field" placeholder="https://www.youtube.com/watch?v=..." /></div>
          )}

          {/* ── HTML ── */}
          {section.type === "html" && (
            <div><Label>Custom HTML</Label><textarea value={section.html ?? ""} onChange={e => up("html", e.target.value)} rows={8} className="input-field resize-y font-mono text-xs" /></div>
          )}

          {/* ── CTA ── */}
          {section.type === "cta" && (
            <>
              <div><Label>Body Text</Label><textarea value={section.content ?? ""} onChange={e => up("content", e.target.value)} rows={3} className="input-field resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Button Text</Label><input value={section.ctaText ?? ""} onChange={e => up("ctaText", e.target.value)} className="input-field" /></div>
                <div><Label>Button URL</Label><input value={section.ctaUrl ?? ""} onChange={e => up("ctaUrl", e.target.value)} className="input-field" /></div>
              </div>
            </>
          )}

          {/* ── CARDS ── */}
          {section.type === "cards" && (
            <>
              <div><Label>Content / Description</Label><textarea value={section.content ?? ""} onChange={e => up("content", e.target.value)} rows={2} className="input-field resize-none" /></div>
              <div><Label>Columns (1–4)</Label><select value={section.columns ?? 3} onChange={e => up("columns", parseInt(e.target.value))} className="input-field w-28">{[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
              <div className="space-y-3">
                {(section.items ?? []).map((item, i) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500">Card {i + 1}</span>
                      <button onClick={() => removeItem(i)} className="p-1 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={12} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input value={item.title ?? ""} onChange={e => updateItem(i, "title", e.target.value)} className="input-field text-sm" placeholder="Card title" />
                      <input value={item.icon ?? ""} onChange={e => updateItem(i, "icon", e.target.value)} className="input-field text-sm" placeholder="Icon emoji" />
                    </div>
                    <textarea value={item.content ?? ""} onChange={e => updateItem(i, "content", e.target.value)} rows={2} className="input-field text-sm resize-none w-full" placeholder="Description" />
                    <div className="flex gap-2"><input value={item.imageUrl ?? ""} onChange={e => updateItem(i, "imageUrl", e.target.value)} className="input-field text-sm flex-1" placeholder="Image URL" /><UploadButton onUpload={url => updateItem(i, "imageUrl", url)} /></div>
                    <input value={item.linkUrl ?? ""} onChange={e => updateItem(i, "linkUrl", e.target.value)} className="input-field text-sm w-full" placeholder="Link URL (optional)" />
                  </div>
                ))}
                <button onClick={() => addItem()} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"><Plus size={15} /> Add Card</button>
              </div>
            </>
          )}

          {/* ── TEAM ── */}
          {section.type === "team" && (
            <>
              <div><Label>Section Description</Label><textarea value={section.content ?? ""} onChange={e => up("content", e.target.value)} rows={2} className="input-field resize-none" placeholder="Brief intro about the team..." /></div>
              <div><Label>Columns (1–4)</Label><select value={section.columns ?? 2} onChange={e => up("columns", parseInt(e.target.value))} className="input-field w-28">{[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
              <div className="space-y-3">
                {(section.items ?? []).map((item, i) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">👤 Member {i + 1}</span>
                      <button onClick={() => removeItem(i)} className="p-1 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={12} /></button>
                    </div>
                    <div><Label>Photo</Label><div className="flex gap-2"><input value={item.imageUrl ?? ""} onChange={e => updateItem(i, "imageUrl", e.target.value)} className="input-field text-sm flex-1" placeholder="Photo URL or upload" /><UploadButton onUpload={url => updateItem(i, "imageUrl", url)} folder="team" /></div></div>
                    {item.imageUrl && <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />}
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label>Full Name</Label><input value={item.title ?? ""} onChange={e => updateItem(i, "title", e.target.value)} className="input-field text-sm" placeholder="John Doe" /></div>
                      <div><Label>Designation / Role</Label><input value={item.subtitle ?? ""} onChange={e => updateItem(i, "subtitle", e.target.value)} className="input-field text-sm" placeholder="CEO & Founder" /></div>
                    </div>
                    <div><Label>Bio</Label><textarea value={item.content ?? ""} onChange={e => updateItem(i, "content", e.target.value)} rows={3} className="input-field text-sm resize-none w-full" placeholder="Brief bio..." /></div>
                    <div><Label>LinkedIn / Website (optional)</Label><input value={item.linkUrl ?? ""} onChange={e => updateItem(i, "linkUrl", e.target.value)} className="input-field text-sm" placeholder="https://linkedin.com/in/..." /></div>
                  </div>
                ))}
                <button onClick={() => addItem({ subtitle: "" })} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"><Plus size={15} /> Add Team Member</button>
              </div>
            </>
          )}

          {/* ── STATS ── */}
          {section.type === "stats" && (
            <>
              <div><Label>Section Description</Label><textarea value={section.content ?? ""} onChange={e => up("content", e.target.value)} rows={2} className="input-field resize-none" /></div>
              <div><Label>Columns (2–6)</Label><select value={section.columns ?? 4} onChange={e => up("columns", parseInt(e.target.value))} className="input-field w-28">{[2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
              <div className="space-y-3">
                {(section.items ?? []).map((item, i) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <input value={item.icon ?? ""} onChange={e => updateItem(i, "icon", e.target.value)} className="input-field text-sm" placeholder="📊 icon" />
                      <input value={item.title ?? ""} onChange={e => updateItem(i, "title", e.target.value)} className="input-field text-sm" placeholder="350+" />
                      <input value={item.content ?? ""} onChange={e => updateItem(i, "content", e.target.value)} className="input-field text-sm" placeholder="Students Enrolled" />
                    </div>
                    <button onClick={() => removeItem(i)} className="p-1 hover:bg-red-50 rounded-lg text-red-500 shrink-0"><Trash2 size={12} /></button>
                  </div>
                ))}
                <button onClick={() => addItem({ icon: "📊" })} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"><Plus size={15} /> Add Stat</button>
              </div>
            </>
          )}

          {/* ── FAQ ── */}
          {section.type === "faq" && (
            <>
              <div><Label>Section Description</Label><textarea value={section.content ?? ""} onChange={e => up("content", e.target.value)} rows={2} className="input-field resize-none" /></div>
              <div className="space-y-3">
                {(section.items ?? []).map((item, i) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">Q{i + 1}</span>
                      <button onClick={() => removeItem(i)} className="p-1 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={12} /></button>
                    </div>
                    <div><Label>Question</Label><input value={item.title ?? ""} onChange={e => updateItem(i, "title", e.target.value)} className="input-field text-sm" placeholder="What is...?" /></div>
                    <div><Label>Answer</Label><textarea value={item.content ?? ""} onChange={e => updateItem(i, "content", e.target.value)} rows={3} className="input-field text-sm resize-none" placeholder="The answer..." /></div>
                  </div>
                ))}
                <button onClick={() => addItem()} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"><Plus size={15} /> Add FAQ</button>
              </div>
            </>
          )}

          {/* ── GALLERY ── */}
          {section.type === "gallery" && (
            <>
              <div><Label>Columns (2–5)</Label><select value={section.columns ?? 3} onChange={e => up("columns", parseInt(e.target.value))} className="input-field w-28">{[2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
              <div className="space-y-3">
                {(section.items ?? []).map((item, i) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex items-center gap-3">
                    {item.imageUrl && <img src={item.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 border" />}
                    <div className="flex-1 space-y-1">
                      <div className="flex gap-2"><input value={item.imageUrl ?? ""} onChange={e => updateItem(i, "imageUrl", e.target.value)} className="input-field text-sm flex-1" placeholder="Image URL" /><UploadButton onUpload={url => updateItem(i, "imageUrl", url)} folder="gallery" /></div>
                      <input value={item.title ?? ""} onChange={e => updateItem(i, "title", e.target.value)} className="input-field text-sm" placeholder="Caption (optional)" />
                    </div>
                    <button onClick={() => removeItem(i)} className="p-1 hover:bg-red-50 rounded-lg text-red-500 shrink-0"><Trash2 size={12} /></button>
                  </div>
                ))}
                <button onClick={() => addItem()} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"><Plus size={15} /> Add Image</button>
              </div>
            </>
          )}

          {/* ── YOUTUBE ── */}
          {section.type === "youtube" && (
            <>
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                🎬 <strong>How to use:</strong> Add each YouTube video URL below (any format — watch link, youtu.be, shorts, etc). The section will show thumbnails and play them inline.
              </div>
              <div>
                <Label>Section Description (shown under title)</Label>
                <textarea value={section.content ?? ""} onChange={e => up("content", e.target.value)} rows={3} className="input-field resize-none" placeholder="Every dream deserves the right direction..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Channel CTA Button Text</Label><input value={section.ctaText ?? ""} onChange={e => up("ctaText", e.target.value)} className="input-field" placeholder="Visit Our Channel" /></div>
                <div><Label>Channel URL</Label><input value={section.ctaUrl ?? ""} onChange={e => up("ctaUrl", e.target.value)} className="input-field" placeholder="https://youtube.com/@..." /></div>
              </div>
              <div className="space-y-3">
                <Label>Videos (paste YouTube links)</Label>
                {(section.items ?? []).map((item, i) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-3 bg-gray-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">▶ Video {i + 1}</span>
                      <button onClick={() => removeItem(i)} className="p-1 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={12} /></button>
                    </div>
                    <input value={item.linkUrl ?? ""} onChange={e => updateItem(i, "linkUrl", e.target.value)} className="input-field text-sm w-full" placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..." />
                    <input value={item.title ?? ""} onChange={e => updateItem(i, "title", e.target.value)} className="input-field text-sm" placeholder="Video title (optional — shown below thumbnail)" />
                    {item.linkUrl && (() => {
                      const patterns = [/[?&]v=([^&#]+)/, /youtu\.be\/([^?&#]+)/, /youtube\.com\/shorts\/([^?&#]+)/];
                      const id = patterns.map(p => item.linkUrl!.match(p)?.[1]).find(Boolean);
                      return id ? <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="thumb" className="rounded-lg h-24 object-cover border" /> : null;
                    })()}
                  </div>
                ))}
                <button onClick={() => addItem({ linkUrl: "", title: "" })} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"><Plus size={15} /> Add Video Link</button>
              </div>
            </>
          )}

          {/* Common: styling */}
          <details className="border border-gray-100 rounded-xl">
            <summary className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none">Styling Options</summary>
            <div className="px-4 pb-4 grid grid-cols-2 gap-3 mt-3">
              <div><label className="block text-xs text-gray-500 mb-1">Background Color</label><input value={section.bgColor ?? ""} onChange={e => up("bgColor", e.target.value)} className="input-field" placeholder="#ffffff" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Text Color</label><input value={section.textColor ?? ""} onChange={e => up("textColor", e.target.value)} className="input-field" placeholder="#000000" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Padding</label><select value={section.padding ?? "normal"} onChange={e => up("padding", e.target.value)} className="input-field">{["none","small","normal","large","xl"].map(p => <option key={p} value={p}>{p}</option>)}</select></div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

// ─── Main Section Editor ─────────────────────────────────────
interface SectionEditorProps { sections: CmsSection[]; onChange: (s: CmsSection[]) => void; }

export default function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  const addSection = (type: CmsSection["type"]) => {
    const hasItems = ["cards","team","stats","faq","gallery","youtube"].includes(type);
    const newSection: CmsSection = {
      id: nanoid(8), type, visible: true, title: "",
      columns: type === "team" ? 2 : type === "stats" ? 4 : type === "gallery" ? 3 : type === "cards" ? 3 : undefined,
      items: hasItems ? [{ id: nanoid(6), title: "", content: "", imageUrl: "", linkUrl: "", icon: "", subtitle: "" }] : undefined,
      ctaUrl: type === "youtube" ? "https://youtube.com/@roamingwithnayem" : undefined,
      ctaText: type === "youtube" ? "Visit Our Channel" : undefined,
    };
    onChange([...sections, newSection]);
    setShowPicker(false);
  };

  const confirmDelete = async () => {
    if (deleteIdx === null) return;
    onChange(sections.filter((_, i) => i !== deleteIdx));
    setDeleteIdx(null);
  };

  const moveSection = (index: number, dir: "up"|"down") => {
    const arr = [...sections]; const to = dir === "up" ? index - 1 : index + 1;
    if (to < 0 || to >= arr.length) return;
    [arr[index], arr[to]] = [arr[to], arr[index]];
    onChange(arr);
  };

  return (
    <div className="space-y-3">
      {sections.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <p className="text-gray-400 font-medium">No sections yet</p>
          <p className="text-gray-300 text-sm mt-1">Add your first section below</p>
        </div>
      )}

      {sections.map((section, index) => (
        <SectionBlock key={section.id} section={section} index={index} total={sections.length}
          onChange={updated => onChange(sections.map((s, i) => i === index ? updated : s))}
          onDelete={() => setDeleteIdx(index)} onMove={dir => moveSection(index, dir)} />
      ))}

      {deleteIdx !== null && (
        <DeleteModal title="Remove Section" itemName={sections[deleteIdx]?.title || sections[deleteIdx]?.type || "this section"}
          onConfirm={confirmDelete} onClose={() => setDeleteIdx(null)} />
      )}

      {showPicker ? (
        <div className="bg-white border-2 border-[var(--accent)] rounded-2xl p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Choose a section type:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SECTION_TYPES.map(st => (
              <button key={st.type} onClick={() => addSection(st.type as CmsSection["type"])}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all text-sm">
                <span className="text-2xl">{st.icon}</span>
                <span className="text-xs font-medium text-gray-700">{st.label}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowPicker(false)} className="mt-3 text-xs text-gray-400 hover:text-gray-600">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowPicker(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-medium text-gray-500 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all">
          <Plus size={17} /> Add Section
        </button>
      )}
    </div>
  );
}
