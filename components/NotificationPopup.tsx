"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, ExternalLink } from "lucide-react";

const TYPE_CONFIG = {
  info:    { accent: "bg-blue-600",   ring: "ring-blue-500/20"   },
  success: { accent: "bg-green-600",  ring: "ring-green-500/20"  },
  warning: { accent: "bg-yellow-500", ring: "ring-yellow-500/20" },
  danger:  { accent: "bg-red-600",    ring: "ring-red-500/20"    },
};

const STORAGE_KEY = "eduwave_popup_dismissed";

function getDismissed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveDismissed(ids: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids))); } catch {}
}

/** Convert any YouTube URL to an embeddable URL */
function toEmbedUrl(url: string): string {
  if (!url) return "";
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // youtube.com/embed/ID already
  if (url.includes("/embed/")) return url;
  return url;
}

export default function NotificationPopup() {
  const pathname  = usePathname();
  const [popups, setPopups]   = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => { setDismissed(getDismissed()); }, []);

  useEffect(() => {
    fetch(`/api/public/notifications?page=${encodeURIComponent(pathname)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setPopups(d.data.filter((n: any) => n.style === "popup"));
      })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const next = popups.find(p => !dismissed.has(p.id));
    if (!next) { setCurrent(null); setVisible(false); return; }
    const delay = (next.delay ?? 0) * 1000;
    const timer = setTimeout(() => { setCurrent(next); setVisible(true); }, delay);
    return () => clearTimeout(timer);
  }, [popups, dismissed]);

  if (!visible || !current) return null;

  const cfg = TYPE_CONFIG[current.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.info;
  const hasMedia = current.imageUrl || current.videoUrl;

  const dismiss = () => {
    setVisible(false);
    const next = new Set(Array.from(dismissed).concat(current.id));
    setDismissed(next);
    saveDismissed(next);
  };

  const handleLearnMore = () => { dismiss(); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className={`relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ${cfg.ring}`}
        style={{ maxWidth: hasMedia ? "720px" : "520px" }}
      >
        {/* Colour accent top bar */}
        <div className={`${cfg.accent} h-1.5 w-full`} />

        {/* Close button */}
        {current.isDismissible && (
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm transition-colors"
          >
            <X size={18} className="text-gray-700" />
          </button>
        )}

        {/* Uploaded Image — displayed at natural size */}
        {current.imageUrl && (
          <div className="w-full flex justify-center bg-gray-50">
            <img
              src={current.imageUrl}
              alt={current.title}
              className="w-full h-auto max-h-[50vh] object-contain"
            />
          </div>
        )}

        {/* YouTube Video Embed */}
        {current.videoUrl && (
          <div className="w-full bg-black">
            <div className="aspect-video w-full">
              <iframe
                src={toEmbedUrl(current.videoUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={current.title}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pt-5 pb-2">
          <h3 className="font-bold text-xl text-gray-900 leading-tight">{current.title}</h3>
        </div>
        <div className="px-6 pb-3">
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{current.content}</p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-2 flex items-center gap-3">
          {current.linkText && current.linkUrl && (
            <a
              href={current.linkUrl}
              onClick={handleLearnMore}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-white text-sm font-semibold ${cfg.accent} hover:opacity-90 transition-opacity`}
            >
              {current.linkText} <ExternalLink size={13} />
            </a>
          )}
          {current.isDismissible && (
            <button
              onClick={dismiss}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
