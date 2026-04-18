"use client";

import { useState, useEffect } from "react";
import { Play, ChevronDown, ChevronUp } from "lucide-react";

// Inline YouTube icon (not in this lucide-react version)
const YtIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/>
  </svg>
);

interface VideoItem {
  id: string;
  title?: string;
  linkUrl?: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  content?: string;
  ctaText?: string;
  ctaUrl?: string;
  items?: VideoItem[];
}

/** Extract YouTube video ID from any YouTube URL format */
function extractVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /[?&]v=([^&#]+)/,                       // watch?v=ID
    /youtu\.be\/([^?&#]+)/,                  // youtu.be/ID
    /youtube\.com\/embed\/([^?&#]+)/,         // embed/ID
    /youtube\.com\/shorts\/([^?&#]+)/,        // shorts/ID
    /youtube\.com\/v\/([^?&#]+)/,             // v/ID
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <div className="relative w-full max-w-4xl z-10" onClick={e => e.stopPropagation()}>
        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
        <button
          onClick={onClose}
          className="absolute -top-9 right-0 text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5"
        >
          ✕ Close (Esc)
        </button>
      </div>
    </div>
  );
}

function VideoCard({ item, onPlay }: { item: VideoItem; onPlay: (id: string) => void }) {
  const videoId = item.linkUrl ? extractVideoId(item.linkUrl) : null;
  if (!videoId) return null;

  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      onClick={() => onPlay(videoId)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer
                 border border-white/10 hover:border-[var(--accent)]/50
                 bg-[#0F1B3F]/60 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[var(--accent)]/10
                 transition-all duration-400"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumb}
          alt={item.title ?? "Eduwave video"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center
                          shadow-xl shadow-[var(--accent)]/40
                          group-hover:scale-110 group-hover:bg-[#D04E18] transition-all duration-300">
            <Play size={22} className="text-white ml-1" fill="white" />
          </div>
        </div>

        {/* YouTube badge */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 backdrop-blur-sm">
            <YtIcon size={11} className="text-white" />
            <span className="text-white text-[10px] font-bold tracking-wide">YouTube</span>
          </div>
        </div>
      </div>

      {/* Title */}
      {item.title && (
        <div className="p-4">
          <p className="text-white text-sm font-semibold leading-snug line-clamp-2
                        group-hover:text-[var(--accent)] transition-colors duration-300">
            {item.title}
          </p>
        </div>
      )}
    </div>
  );
}

const INITIAL_COUNT = 6;

export default function YouTubeSection({
  title = "Why Students Choose Us & What Makes Us Different!!",
  subtitle = "Watch Our Story",
  content = "Every dream deserves the right direction. Without expert guidance, even the strongest ambitions can lose their path. We go beyond services — we become your trusted partner in shaping a successful future.\nWatch our videos before making your first move.",
  ctaText = "Visit Our Channel",
  ctaUrl = "https://youtube.com/@roamingwithnayem",
  items = [],
}: Props) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const validVideos = items.filter(i => i.linkUrl && extractVideoId(i.linkUrl));
  const displayed   = showAll ? validVideos : validVideos.slice(0, INITIAL_COUNT);
  const hasMore     = validVideos.length > INITIAL_COUNT;

  return (
    <>
      {activeVideo && <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />}

      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1428 0%, #0F1B3F 50%, #1A2B5F 100%)" }}
      >
        {/* Decorative background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/3 w-[500px] h-[500px] rounded-full bg-[var(--accent)]/[0.04] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/[0.05] blur-3xl" />
        </div>

        <div className="container-custom relative z-10">

          {/* ── Section Header ── */}
          <div className="text-center mb-14 max-w-3xl mx-auto">
            {subtitle && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                               bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-semibold mb-6">
                <YtIcon size={14} /> {subtitle}
              </span>
            )}
            <h2 className="text-white text-3xl md:text-4xl font-extrabold leading-tight mb-6">
              {title}
            </h2>
            {content && content.split("\n").map((line, i) => (
              <p key={i} className={`text-base leading-relaxed ${i === 0 ? "text-blue-100/70" : "mt-3 text-[var(--accent)] font-semibold"}`}>
                {line}
              </p>
            ))}
          </div>

          {/* ── Video Grid ── */}
          {validVideos.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
              <YtIcon size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/30 text-sm">No videos added yet. Add YouTube links in the CMS editor.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayed.map((item) => (
                  <VideoCard key={item.id} item={item} onPlay={setActiveVideo} />
                ))}
              </div>

              {/* ── Action Buttons ── */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                {hasMore && (
                  <button
                    onClick={() => setShowAll(s => !s)}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl
                               bg-white/10 hover:bg-white/15 border border-white/20
                               text-white font-semibold transition-all duration-300 group"
                  >
                    {showAll
                      ? <><ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" /> Show Less</>
                      : <><ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" /> See All {validVideos.length} Videos</>
                    }
                  </button>
                )}
                {ctaUrl && (
                  <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl
                               bg-red-600 hover:bg-red-700 text-white font-semibold
                               shadow-lg shadow-red-900/30 transition-all duration-300 group"
                  >
                    <YtIcon size={18} className="group-hover:scale-110 transition-transform" />
                    {ctaText}
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
