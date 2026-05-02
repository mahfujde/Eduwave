"use client";

import { useToastStore } from "@/hooks/useToast";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const icons = {
  success: <CheckCircle2 size={18} className="shrink-0 text-green-500" />,
  error: <XCircle size={18} className="shrink-0 text-red-500" />,
  info: <Info size={18} className="shrink-0 text-blue-500" />,
};

const bgColors = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 min-w-[320px] max-w-[420px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in ${bgColors[toast.type]}`}
          style={{
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {icons[toast.type]}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-0.5 hover:opacity-70 shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
