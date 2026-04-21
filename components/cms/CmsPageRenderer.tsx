"use client";

import { useEffect, useState } from "react";
import type { CmsSection } from "@/types";
import Link from "next/link";
import YouTubeSection from "@/components/YouTubeSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import TestimonialCard from "@/components/TestimonialCard";

/** Testimonials section that fetches from API and renders carousel */
function TestimonialsRenderer({ section: s }: { section: CmsSection }) {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/public/testimonials")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setTestimonials(d.data); })
      .catch(() => {});
  }, []);

  const display = testimonials.length > 0 ? testimonials : (s.items ?? []).map((it: any) => ({
    id: it.id, name: it.title, quote: it.content, university: it.subtitle,
    photo: it.imageUrl, rating: 5,
  }));

  return (
    <section className="section" style={{ background: "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 100%)" }}>
      <div className="container-custom">
        <div className="text-center mb-12" data-anim="fade-up">
          {s.subtitle && <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[var(--accent)] text-sm font-semibold mb-4">{s.subtitle}</span>}
          {s.title && <h2 className="text-white">{s.title}</h2>}
          {s.content && <p className="mt-4 text-blue-100/60 max-w-xl mx-auto">{s.content}</p>}
        </div>
        {display.length > 0 && <TestimonialsCarousel testimonials={display.slice(0, 8)} />}
        {display.length > 8 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {display.slice(8).map((t: any) => (
              <div key={t.id}><TestimonialCard testimonial={t} /></div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const PADDING: Record<string, string> = {
  none:   "py-0",
  small:  "py-6",
  normal: "py-12 md:py-20",
  large:  "py-20 md:py-28",
  xl:     "py-28 md:py-36",
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-[var(--primary)] pr-4">{q}</span>
        <span className="text-[var(--accent)] text-xl shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{a}</div>}
    </div>
  );
}

function renderSection(s: CmsSection, idx: number) {
  if (!s.visible) return null;
  const py    = PADDING[s.padding ?? "normal"] ?? PADDING.normal;
  const style: React.CSSProperties = {
    ...(s.bgColor   && { backgroundColor: s.bgColor }),
    ...(s.textColor && { color: s.textColor }),
  };

  const align = (s as any).textAlign ?? "justify";
  const alignCls = align === "center" ? "text-center" : align === "left" ? "text-left" : align === "right" ? "text-right" : "text-justify";

  switch (s.type) {
    case "hero":
      return (
        <section key={s.id ?? idx} className={`relative min-h-[80vh] flex items-center ${py} px-6 overflow-hidden`}
          style={{ ...style, backgroundImage: s.imageUrl ? `url(${s.imageUrl})` : "linear-gradient(135deg,#0F1B3F 0%,#1A2B5F 40%,#2A3B6F 100%)", backgroundSize: "cover", backgroundPosition: "center" }}>
          {s.imageUrl && <div className="absolute inset-0 bg-black/50" />}
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-white/[0.03] animate-float" />
            <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-[var(--accent)]/[0.05]" style={{ animation: "float 4s ease-in-out infinite reverse" }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white w-full" data-anim="fade-up">
            {s.subtitle && <p className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-3">{s.subtitle}</p>}
            {s.title   && <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-white">{s.title}</h1>}
            {s.content && <p className="text-lg md:text-xl text-blue-100/70 mb-8 max-w-2xl mx-auto leading-relaxed">{s.content}</p>}
            <div className="flex flex-wrap gap-4 justify-center">
              {s.ctaText          && <Link href={s.ctaUrl ?? "#"}          className="btn-primary text-base !px-8 !py-4">{s.ctaText}</Link>}
              {s.ctaSecondaryText && <Link href={s.ctaSecondaryUrl ?? "#"} className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-lg border-2 border-white/20 text-white hover:bg-white/10 transition-all">{s.ctaSecondaryText}</Link>}
            </div>
          </div>
        </section>
      );

    case "text":
      return (
        <section key={s.id ?? idx} className={`${py} px-6`} style={style} data-anim="fade-up">
          <div className="max-w-3xl mx-auto text-center">
            {s.subtitle && <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-3">{s.subtitle}</p>}
            {s.title    && <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-5">{s.title}</h2>}
            {s.content  && <div className={`text-lg text-gray-700 leading-relaxed whitespace-pre-wrap ${alignCls}`}>{s.content}</div>}
          </div>
        </section>
      );

    case "html":
      return (
        <section key={s.id ?? idx} className={`${py}`} style={style}>
          {s.html && <div dangerouslySetInnerHTML={{ __html: s.html }} />}
        </section>
      );

    case "image":
      return (
        <section key={s.id ?? idx} className={`${py} px-6`} style={style}>
          <div className="max-w-5xl mx-auto">
            {s.title    && <h2 className="text-2xl font-bold text-center text-[var(--primary)] mb-6">{s.title}</h2>}
            {s.imageUrl && <img src={s.imageUrl} alt={s.title ?? "Section"} className="rounded-2xl w-full object-cover max-h-[500px] shadow-lg" />}
            {s.content  && <p className="text-center text-sm text-gray-500 mt-3">{s.content}</p>}
          </div>
        </section>
      );

    case "video":
      return (
        <section key={s.id ?? idx} className={`${py} px-6`} style={style}>
          <div className="max-w-3xl mx-auto">
            {s.title    && <h2 className="text-2xl font-bold text-center text-[var(--primary)] mb-6">{s.title}</h2>}
            {s.videoUrl && (
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                <iframe src={s.videoUrl.replace("watch?v=","embed/").replace("youtu.be/","www.youtube.com/embed/")} className="w-full h-full" allowFullScreen />
              </div>
            )}
          </div>
        </section>
      );

    case "cards": {
      const cols = s.columns ?? 3;
      const gridClass = ({"1":"grid-cols-1","2":"grid-cols-1 sm:grid-cols-2","3":"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3","4":"grid-cols-2 lg:grid-cols-4"} as any)[cols] ?? "grid-cols-3";
      return (
        <section key={s.id ?? idx} className={`${py} px-6`} style={style}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10" data-anim="fade-up">
              {s.subtitle && <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-3">{s.subtitle}</p>}
              {s.title    && <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">{s.title}</h2>}
              {s.content  && <p className={`text-gray-600 max-w-2xl mx-auto ${alignCls}`}>{s.content}</p>}
            </div>
            <div className={`grid ${gridClass} gap-6`} data-anim-stagger="fade-up">
              {(s.items ?? []).map((item: any, i: number) => (
                <div key={item.id ?? i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  {item.icon     && <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-2xl mb-3">{item.icon}</div>}
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title ?? ""} className="rounded-xl mb-4 w-full h-40 object-cover" />}
                  {item.title    && <h3 className="font-bold text-[var(--primary)] mb-2">{item.title}</h3>}
                  {item.content  && <p className={`text-gray-600 text-sm leading-relaxed ${alignCls}`}>{item.content}</p>}
                  {item.linkUrl  && <Link href={item.linkUrl} className="mt-3 inline-block text-[var(--accent)] text-sm font-medium hover:underline">Learn more →</Link>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "team": {
      const cols = s.columns ?? 2;
      const gridClass = ({"1":"grid-cols-1","2":"grid-cols-1 md:grid-cols-2","3":"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3","4":"grid-cols-2 lg:grid-cols-4"} as any)[cols] ?? "grid-cols-2";
      return (
        <section key={s.id ?? idx} className={`${py} px-6`} style={{ background: style.backgroundColor ?? "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 100%)", color: style.color }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              {s.subtitle && <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[var(--accent)] text-sm font-semibold mb-4">{s.subtitle}</span>}
              {s.title    && <h2 className="text-white text-3xl md:text-4xl font-bold">{s.title}</h2>}
              {s.content  && <p className="mt-4 text-blue-100/60 max-w-2xl mx-auto">{s.content}</p>}
            </div>
            <div className={`grid ${gridClass} gap-8`}>
              {(s.items ?? []).map((m: any, i: number) => (
                <div key={m.id ?? i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500">
                  {m.imageUrl ? (
                    <img src={m.imageUrl} alt={m.title ?? ""} className="w-20 h-20 rounded-full object-cover mb-5 border-2 border-white/20" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#F5733B] flex items-center justify-center mb-5 text-white text-2xl font-bold">
                      {(m.title ?? "U").split(" ").map((w: string) => w[0]).join("").slice(0,2).toUpperCase()}
                    </div>
                  )}
                  {m.title    && <h3 className="text-white text-xl font-bold">{m.title}</h3>}
                  {m.subtitle && <p className="text-[var(--accent)] text-sm font-semibold mb-4">{m.subtitle}</p>}
                  {m.content  && <p className="text-blue-100/70 text-sm leading-relaxed">{m.content}</p>}
                  {m.linkUrl  && <a href={m.linkUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[var(--accent)] text-sm hover:underline">Profile →</a>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "stats": {
      const cols = s.columns ?? 4;
      const gridClass = ({"2":"grid-cols-2","3":"grid-cols-3","4":"grid-cols-2 md:grid-cols-4","5":"grid-cols-2 md:grid-cols-5","6":"grid-cols-3 md:grid-cols-6"} as any)[cols] ?? "grid-cols-4";
      return (
        <section key={s.id ?? idx} className={`${py} px-6`} style={style}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10" data-anim="fade-up">
              {s.subtitle && <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-3">{s.subtitle}</p>}
              {s.title    && <h2 className="text-3xl font-bold text-[var(--primary)] mb-4">{s.title}</h2>}
              {s.content  && <p className="text-gray-600 max-w-xl mx-auto">{s.content}</p>}
            </div>
            <div className={`grid ${gridClass} gap-6`} data-anim-stagger="fade-up">
              {(s.items ?? []).map((item: any, i: number) => (
                <div key={item.id ?? i} className="text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  {item.icon && <div className="text-3xl mb-2">{item.icon}</div>}
                  {item.title   && <p className="text-3xl font-extrabold text-[var(--primary)]">{item.title}</p>}
                  {item.content && <p className="text-sm text-gray-500 mt-1">{item.content}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "faq":
      return (
        <section key={s.id ?? idx} className={`${py} px-6`} style={style}>
          <div className="max-w-3xl mx-auto">
            {s.subtitle && <p className="text-center text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-3">{s.subtitle}</p>}
            {s.title    && <h2 className="text-3xl font-bold text-center text-[var(--primary)] mb-4">{s.title}</h2>}
            {s.content  && <p className="text-center text-gray-500 mb-10">{s.content}</p>}
            <div className="space-y-3">
              {(s.items ?? []).map((item: any, i: number) => (
                <FaqItem key={item.id ?? i} q={item.title ?? ""} a={item.content ?? ""} />
              ))}
            </div>
          </div>
        </section>
      );

    case "gallery": {
      const cols = s.columns ?? 3;
      const gridClass = ({"2":"grid-cols-2","3":"grid-cols-2 lg:grid-cols-3","4":"grid-cols-2 lg:grid-cols-4","5":"grid-cols-2 lg:grid-cols-5"} as any)[cols] ?? "grid-cols-3";
      return (
        <section key={s.id ?? idx} className={`${py} px-6`} style={style}>
          <div className="max-w-6xl mx-auto">
            {s.title && <h2 className="text-3xl font-bold text-center text-[var(--primary)] mb-10">{s.title}</h2>}
            <div className={`grid ${gridClass} gap-4`}>
              {(s.items ?? []).map((item: any, i: number) => (
                <div key={item.id ?? i} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title ?? ""} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />}
                  {item.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm font-medium">{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "cta":
      return (
        <section key={s.id ?? idx} className={`${py} px-6 bg-white`}>
          <div className="container-custom">
            <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center" data-anim="zoom"
              style={{ background: style.backgroundColor ?? "linear-gradient(135deg, #1A2B5F 0%, #0F1B3F 100%)" }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--accent)]/10 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                {s.title   && <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{s.title}</h2>}
                {s.content && <p className="text-blue-100/70 text-lg max-w-xl mx-auto mb-8">{s.content}</p>}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {s.ctaText          && <Link href={s.ctaUrl ?? "#"}          className="btn-primary text-base !px-10 !py-4">{s.ctaText}</Link>}
                  {s.ctaSecondaryText && <Link href={s.ctaSecondaryUrl ?? "#"} className="inline-flex items-center gap-2 px-10 py-4 rounded-lg border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all">{s.ctaSecondaryText}</Link>}
                </div>
              </div>
            </div>
          </div>
        </section>
      );

    case "youtube":
      return (
        <YouTubeSection
          key={s.id ?? idx}
          title={s.title}
          subtitle={s.subtitle}
          content={s.content}
          ctaText={s.ctaText}
          ctaUrl={s.ctaUrl}
          items={(s.items ?? []).map(i => ({ id: i.id, title: i.title, linkUrl: i.linkUrl }))}
        />
      );

    case "testimonials":
      return <TestimonialsRenderer key={s.id ?? idx} section={s} />;

    default:
      return null;
  }
}

interface CmsPageRendererProps {
  slug: string;
  children: React.ReactNode;
}

/**
 * CmsPageRenderer — shows `children` immediately (no blank flash).
 * If a published CMS page exists for this slug with visible sections,
 * it silently replaces the children after fetching.
 */
export default function CmsPageRenderer({ slug, children }: CmsPageRendererProps) {
  const [cmsSections, setCmsSections] = useState<CmsSection[] | null>(null);

  useEffect(() => {
    fetch(`/api/public/pages?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.sections) {
          try {
            const parsed = JSON.parse(d.data.sections);
            const visible = parsed.filter((s: CmsSection) => s.visible);
            if (visible.length > 0) setCmsSections(visible);
          } catch {}
        }
      })
      .catch(() => {});
  }, [slug]);

  if (cmsSections) {
    return <>{cmsSections.map((s, i) => renderSection(s, i))}</>;
  }

  return <>{children}</>;
}
