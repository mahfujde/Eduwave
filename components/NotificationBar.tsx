"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Info, CheckCircle, AlertTriangle, AlertCircle, ExternalLink } from "lucide-react";

const TYPE_CONFIG = {
  info:    { bg: "bg-blue-600",   icon: Info,          text: "text-white" },
  success: { bg: "bg-green-600",  icon: CheckCircle,   text: "text-white" },
  warning: { bg: "bg-yellow-500", icon: AlertTriangle, text: "text-white" },
  danger:  { bg: "bg-red-600",    icon: AlertCircle,   text: "text-white" },
};

const STORAGE_KEY = "eduwave_bar_dismissed";

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

export default function NotificationBar() {
  const pathname = usePathname();
  const [bars, setBars] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Hydrate dismissed state from localStorage on mount
  useEffect(() => { setDismissed(getDismissed()); }, []);

  useEffect(() => {
    fetch(`/api/public/notifications?page=${encodeURIComponent(pathname)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setBars(d.data.filter((n: any) => n.style === "bar"));
        }
      })
      .catch(() => {});
  }, [pathname]);

  const visible = bars.filter(b => !dismissed.has(b.id));
  if (!visible.length) return null;

  const dismiss = (id: string) => {
    const next = new Set(Array.from(dismissed).concat(id));
    setDismissed(next);
    saveDismissed(next);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col">
      {visible.map((bar) => {
        const cfg  = TYPE_CONFIG[bar.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.info;
        const Icon = cfg.icon;
        return (
          <div key={bar.id} className={`${cfg.bg} ${cfg.text} px-4 py-2.5 flex items-center gap-3`}>
            <Icon size={16} className="shrink-0 opacity-90" />
            <p className="flex-1 text-sm font-medium text-center">
              {bar.content}
              {bar.linkText && bar.linkUrl && (
                <a href={bar.linkUrl} onClick={() => dismiss(bar.id)} className="ml-2 underline inline-flex items-center gap-1 opacity-90 hover:opacity-100">
                  {bar.linkText} <ExternalLink size={12} />
                </a>
              )}
            </p>
            {bar.isDismissible && (
              <button
                onClick={() => dismiss(bar.id)}
                className="shrink-0 opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
