"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Info, CheckCircle, AlertTriangle, AlertCircle, ExternalLink } from "lucide-react";

const TYPE_CONFIG = {
  info:    { bg: "bg-blue-50",    border: "border-blue-200",    icon: Info,          text: "text-blue-800",    iconColor: "text-blue-500"    },
  success: { bg: "bg-green-50",   border: "border-green-200",   icon: CheckCircle,   text: "text-green-800",   iconColor: "text-green-500"   },
  warning: { bg: "bg-yellow-50",  border: "border-yellow-200",  icon: AlertTriangle, text: "text-yellow-800",  iconColor: "text-yellow-500"  },
  danger:  { bg: "bg-red-50",     border: "border-red-200",     icon: AlertCircle,   text: "text-red-800",     iconColor: "text-red-500"     },
};

const STORAGE_KEY = "eduwave_banner_dismissed";

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
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  if (url.includes("/embed/")) return url;
  return url;
}

export default function SectionBanner() {
  const pathname = usePathname();
  const [banners, setBanners] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => { setDismissed(getDismissed()); }, []);

  useEffect(() => {
    fetch(`/api/public/notifications?page=${encodeURIComponent(pathname)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setBanners(d.data.filter((n: any) => n.style === "banner"));
        }
      })
      .catch(() => {});
  }, [pathname]);

  const visible = banners.filter(b => !dismissed.has(b.id));
  if (!visible.length) return null;

  const dismiss = (id: string) => {
    const next = new Set(Array.from(dismissed).concat(id));
    setDismissed(next);
    saveDismissed(next);
  };

  return (
    <div className="container-custom space-y-4 mb-6">
      {visible.map((banner) => {
        const cfg = TYPE_CONFIG[banner.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.info;
        const Icon = cfg.icon;
        const hasMedia = banner.imageUrl || banner.videoUrl;

        return (
          <div
            key={banner.id}
            className={`${cfg.bg} ${cfg.border} border rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300`}
          >
            {/* Text content */}
            <div className="p-5 flex items-start gap-3">
              <Icon size={20} className={`${cfg.iconColor} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                {banner.title && (
                  <p className={`font-bold text-base ${cfg.text}`}>{banner.title}</p>
                )}
                <p className={`text-sm ${cfg.text} opacity-90 mt-1 whitespace-pre-line`}>{banner.content}</p>
                {banner.linkText && banner.linkUrl && (
                  <a
                    href={banner.linkUrl}
                    className={`inline-flex items-center gap-1 text-sm font-semibold mt-3 ${cfg.iconColor} hover:underline`}
                  >
                    {banner.linkText} <ExternalLink size={12} />
                  </a>
                )}
              </div>
              {banner.isDismissible && (
                <button
                  onClick={() => dismiss(banner.id)}
                  className={`shrink-0 p-1.5 rounded-lg hover:bg-black/5 transition-colors ${cfg.text} opacity-50 hover:opacity-80`}
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Image — full width, natural height */}
            {banner.imageUrl && (
              <div className="w-full">
                <img
                  src={banner.imageUrl}
                  alt={banner.title || "Banner image"}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}

            {/* YouTube Video Embed */}
            {banner.videoUrl && (
              <div className="px-5 pb-5">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-sm">
                  <iframe
                    src={toEmbedUrl(banner.videoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={banner.title || "Video"}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
