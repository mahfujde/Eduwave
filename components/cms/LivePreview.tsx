"use client";

import { useState } from "react";
import type { CmsSection } from "@/types";

const PADDING = { none: "py-0", small: "py-4", normal: "py-12", large: "py-20", xl: "py-32" };

function FaqPreview({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3 text-left text-sm">
        <span className="font-semibold text-gray-800 pr-2">{q}</span>
        <span className="text-[var(--accent)] shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-3 text-gray-600 text-xs leading-relaxed">{a}</div>}
    </div>
  );
}

function renderSection(s: CmsSection) {
  if (!s.visible) return null;
  const py = PADDING[s.padding as keyof typeof PADDING] ?? PADDING.normal;
  const style: React.CSSProperties = {
    ...(s.bgColor   && { backgroundColor: s.bgColor }),
    ...(s.textColor && { color: s.textColor }),
  };

  switch (s.type) {
    case "hero":
      return (
        <section key={s.id} className={`relative ${py} px-6`} style={{ ...style, backgroundImage: s.imageUrl ? `url(${s.imageUrl})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
          {s.imageUrl && <div className="absolute inset-0 bg-black/50" />}
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {s.subtitle && <p className="text-xs font-semibold uppercase tracking-widest opacity-60 mb-2">{s.subtitle}</p>}
            {s.title   && <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{s.title}</h1>}
            {s.content && <p className="text-lg opacity-80 mb-8">{s.content}</p>}
            <div className="flex flex-wrap gap-3 justify-center">
              {s.ctaText && <a href={s.ctaUrl ?? "#"} className="px-6 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:opacity-90">{s.ctaText}</a>}
              {s.ctaSecondaryText && <a href={s.ctaSecondaryUrl ?? "#"} className="px-6 py-3 bg-white/20 text-white border border-white/40 font-semibold rounded-xl">{s.ctaSecondaryText}</a>}
            </div>
          </div>
        </section>
      );
    case "text":
      return (
        <section key={s.id} className={`${py} px-6`} style={style}>
          <div className="max-w-3xl mx-auto text-center">
            {s.subtitle && <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">{s.subtitle}</p>}
            {s.title   && <h2 className="text-3xl font-bold mb-4">{s.title}</h2>}
            {s.content && <p className="text-lg opacity-75 leading-relaxed whitespace-pre-wrap">{s.content}</p>}
          </div>
        </section>
      );
    case "image":
      return (
        <section key={s.id} className={`${py} px-6`} style={style}>
          <div className="max-w-4xl mx-auto">
            {s.imageUrl && <img src={s.imageUrl} alt={s.title ?? ""} className="rounded-2xl w-full object-cover max-h-[500px]" />}
            {s.content && <p className="text-center text-sm opacity-60 mt-3">{s.content}</p>}
          </div>
        </section>
      );
    case "video":
      return (
        <section key={s.id} className={`${py} px-6`} style={style}>
          <div className="max-w-3xl mx-auto">
            {s.title && <h2 className="text-2xl font-bold text-center mb-6">{s.title}</h2>}
            {s.videoUrl && <div className="aspect-video rounded-2xl overflow-hidden shadow-xl"><iframe src={s.videoUrl.replace("watch?v=","embed/").replace("youtu.be/","www.youtube.com/embed/")} className="w-full h-full" allowFullScreen /></div>}
          </div>
        </section>
      );
    case "cards": {
      const cols = s.columns ?? 3;
      const gc = ({"1":"grid-cols-1","2":"grid-cols-1 sm:grid-cols-2","3":"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3","4":"grid-cols-2 lg:grid-cols-4"} as any)[cols] ?? "grid-cols-3";
      return (
        <section key={s.id} className={`${py} px-6`} style={style}>
          <div className="max-w-6xl mx-auto">
            {s.title && <h2 className="text-3xl font-bold text-center mb-10">{s.title}</h2>}
            <div className={`grid ${gc} gap-4`}>
              {(s.items ?? []).map(item => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  {item.icon && <div className="text-2xl mb-2">{item.icon}</div>}
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title ?? ""} className="rounded-lg mb-3 w-full object-cover h-32" />}
                  {item.title   && <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>}
                  {item.content && <p className="text-gray-500 text-xs">{item.content}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "team": {
      const cols = s.columns ?? 2;
      const gc = ({"1":"grid-cols-1","2":"grid-cols-1 md:grid-cols-2","3":"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3","4":"grid-cols-2 lg:grid-cols-4"} as any)[cols] ?? "grid-cols-2";
      return (
        <section key={s.id} className={`${py} px-6`} style={{ background: style.backgroundColor ?? "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 100%)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              {s.subtitle && <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[var(--accent)] text-xs font-semibold mb-3">{s.subtitle}</span>}
              {s.title && <h2 className="text-white text-2xl font-bold">{s.title}</h2>}
              {s.content && <p className="mt-2 text-blue-100/60 text-sm">{s.content}</p>}
            </div>
            <div className={`grid ${gc} gap-4`}>
              {(s.items ?? []).map(m => (
                <div key={m.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  {m.imageUrl
                    ? <img src={m.imageUrl} alt={m.title ?? ""} className="w-14 h-14 rounded-full object-cover mb-3 border-2 border-white/20" />
                    : <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#F5733B] flex items-center justify-center mb-3 text-white font-bold">{(m.title ?? "U").split(" ").map((w: string) => w[0]).join("").slice(0,2)}</div>}
                  {m.title    && <h3 className="text-white font-bold text-sm">{m.title}</h3>}
                  {m.subtitle && <p className="text-[var(--accent)] text-xs font-semibold mb-2">{m.subtitle}</p>}
                  {m.content  && <p className="text-blue-100/60 text-xs leading-relaxed">{m.content}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "stats": {
      const cols = s.columns ?? 4;
      const gc = ({"2":"grid-cols-2","3":"grid-cols-3","4":"grid-cols-2 md:grid-cols-4","5":"grid-cols-2 md:grid-cols-5","6":"grid-cols-3 md:grid-cols-6"} as any)[cols] ?? "grid-cols-4";
      return (
        <section key={s.id} className={`${py} px-6`} style={style}>
          <div className="max-w-5xl mx-auto">
            {s.title && <h2 className="text-2xl font-bold text-center mb-6">{s.title}</h2>}
            <div className={`grid ${gc} gap-4`}>
              {(s.items ?? []).map(item => (
                <div key={item.id} className="text-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  {item.icon && <div className="text-2xl mb-1">{item.icon}</div>}
                  {item.title   && <p className="text-2xl font-extrabold text-[var(--primary)]">{item.title}</p>}
                  {item.content && <p className="text-xs text-gray-500">{item.content}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "faq":
      return (
        <section key={s.id} className={`${py} px-6`} style={style}>
          <div className="max-w-3xl mx-auto">
            {s.title && <h2 className="text-2xl font-bold text-center mb-6">{s.title}</h2>}
            <div className="space-y-2">
              {(s.items ?? []).map(item => <FaqPreview key={item.id} q={item.title ?? ""} a={item.content ?? ""} />)}
            </div>
          </div>
        </section>
      );
    case "gallery": {
      const cols = s.columns ?? 3;
      const gc = ({"2":"grid-cols-2","3":"grid-cols-2 lg:grid-cols-3","4":"grid-cols-2 lg:grid-cols-4","5":"grid-cols-2 lg:grid-cols-5"} as any)[cols] ?? "grid-cols-3";
      return (
        <section key={s.id} className={`${py} px-6`} style={style}>
          <div className="max-w-6xl mx-auto">
            {s.title && <h2 className="text-2xl font-bold text-center mb-6">{s.title}</h2>}
            <div className={`grid ${gc} gap-3`}>
              {(s.items ?? []).map(item => (
                <div key={item.id} className="rounded-lg overflow-hidden">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title ?? ""} className="w-full h-40 object-cover" />}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "cta":
      return (
        <section key={s.id} className={`${py} px-6`} style={style}>
          <div className="max-w-2xl mx-auto text-center">
            {s.title   && <h2 className="text-3xl font-bold mb-4">{s.title}</h2>}
            {s.content && <p className="text-lg opacity-75 mb-8">{s.content}</p>}
            {s.ctaText && <a href={s.ctaUrl ?? "#"} className="inline-block px-8 py-4 bg-[var(--accent)] text-white font-bold rounded-2xl">{s.ctaText}</a>}
          </div>
        </section>
      );
    case "html":
      return (<section key={s.id} className={`${py} px-6`} style={style}>{s.html && <div dangerouslySetInnerHTML={{ __html: s.html }} />}</section>);
    case "testimonials":
      return (
        <section key={s.id} className={`${py} px-6`} style={style}>
          <div className="max-w-4xl mx-auto text-center">
            {s.title && <h2 className="text-3xl font-bold mb-10">{s.title}</h2>}
            <p className="text-gray-400 italic">[Testimonials rendered from database]</p>
          </div>
        </section>
      );
    default: return null;
  }
}

interface LivePreviewProps { sections: CmsSection[]; }

export default function LivePreview({ sections }: LivePreviewProps) {
  const visible = sections.filter(s => s.visible);
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-gray-400 font-mono">Live Preview</span>
      </div>
      <div className="overflow-y-auto max-h-[600px]">
        {visible.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-300"><p>Add sections to preview</p></div>
        ) : (
          visible.map(s => renderSection(s))
        )}
      </div>
    </div>
  );
}
