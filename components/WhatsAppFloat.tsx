"use client";

import { MessageCircle } from "lucide-react";
import { useSiteStore } from "@/hooks/useStore";
import { getWhatsAppUrl } from "@/lib/utils";

export default function WhatsAppFloat() {
  const { settings } = useSiteStore();
  const number = settings.whatsapp_number || "+60112-4103692";
  const url = getWhatsAppUrl(number, "Hi Eduwave! I'm interested in studying in Malaysia. Please provide more information.");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float group"
    >
      <svg
        viewBox="0 0 32 32"
        fill="white"
        className="w-8 h-8 relative z-10"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.382L1.054 31.29l6.156-1.952C9.77 30.932 12.77 32 16.004 32 24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.53 22.606c-.396 1.116-2.326 2.134-3.21 2.27-.884.134-2.008.19-3.24-.204-.746-.238-1.704-.556-2.932-1.088-5.158-2.234-8.528-7.454-8.788-7.8-.258-.348-2.108-2.806-2.108-5.352 0-2.546 1.334-3.798 1.808-4.318.474-.52 1.034-.65 1.378-.65.346 0 .69.004 .988.018.318.014.744-.12 1.164.888.42 1.01 1.43 3.494 1.556 3.748.126.254.21.55.042.888-.168.338-.252.55-.502.844-.252.296-.528.66-.754.886-.252.252-.514.526-.22 1.034.294.506 1.31 2.162 2.814 3.502 1.934 1.722 3.564 2.256 4.07 2.51.506.254.802.214 1.098-.126.294-.338 1.264-1.47 1.6-1.976.336-.506.672-.42 1.134-.252.462.168 2.928 1.382 3.43 1.634.504.254.838.378.964.588.124.208.124 1.232-.272 2.348z" />
      </svg>
      {/* Tooltip */}
      <span
        className="absolute right-[72px] top-1/2 -translate-y-1/2
                   bg-white text-gray-800 text-sm font-medium
                   px-4 py-2 rounded-lg shadow-lg
                   whitespace-nowrap
                   opacity-0 group-hover:opacity-100
                   translate-x-2 group-hover:translate-x-0
                   transition-all duration-300 pointer-events-none"
      >
        Chat with us
        <span className="absolute right-[-6px] top-1/2 -translate-y-1/2
                       w-3 h-3 bg-white rotate-45" />
      </span>
    </a>
  );
}
