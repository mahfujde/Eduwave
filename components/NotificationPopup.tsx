"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Info, CheckCircle, AlertTriangle, AlertCircle, ExternalLink } from "lucide-react";

const TYPE_CONFIG = {
  info:    { accent: "bg-blue-600",   header: "bg-blue-700"   },
  success: { accent: "bg-green-600",  header: "bg-green-700"  },
  warning: { accent: "bg-yellow-500", header: "bg-yellow-600" },
  danger:  { accent: "bg-red-600",    header: "bg-red-700"    },
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

export default function NotificationPopup() {
  const pathname  = usePathname();
  const [popups, setPopups]   = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Hydrate dismissed state from localStorage on mount
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
  const dismiss = () => {
    setVisible(false);
    const next = new Set(Array.from(dismissed).concat(current.id));
    setDismissed(next);
    saveDismissed(next);
  };

  // "Learn More" link also dismisses the popup permanently
  const handleLearnMore = () => { dismiss(); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Colour accent top bar */}
        <div className={`${cfg.accent} h-1.5 w-full`} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 className="font-bold text-lg text-gray-900">{current.title}</h3>
          {current.isDismissible && (
            <button onClick={dismiss} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 pb-2">
          <p className="text-gray-600 text-sm leading-relaxed">{current.content}</p>
        </div>

        {/* Optional YouTube embed */}
        {current.videoUrl && (
          <div className="px-6 pb-3">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe
                src={current.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-5 pt-2 flex items-center gap-3">
          {current.linkText && current.linkUrl && (
            <a
              href={current.linkUrl}
              onClick={handleLearnMore}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-sm font-medium ${cfg.accent} hover:opacity-90 transition-opacity`}
            >
              {current.linkText} <ExternalLink size={13} />
            </a>
          )}
          {current.isDismissible && (
            <button
              onClick={dismiss}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
