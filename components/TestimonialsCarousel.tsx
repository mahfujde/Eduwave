"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import TestimonialCard from "@/components/TestimonialCard";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  testimonials: any[];
  showSeeAll?: boolean;
}

/**
 * Success Stories carousel + expandable grid.
 * Default: horizontal carousel with arrow navigation.
 * "See All": expands into a full responsive grid.
 */
export default function TestimonialsCarousel({ testimonials, showSeeAll = true }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const pausedRef = useRef(false);

  /* ── Arrow visibility ── */
  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows, testimonials, showAll]);

  /* ── Auto-scroll every 3.5s, pause on hover ── */
  useEffect(() => {
    if (showAll) return;
    const el = scrollRef.current;
    if (!el) return;
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const cardWidth = el.querySelector<HTMLElement>(":scope > div")?.offsetWidth ?? 380;
        el.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(timer);
  }, [showAll, testimonials]);

  /* ── Scroll handler ── */
  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(":scope > div")?.offsetWidth ?? 380;
    el.scrollBy({ left: dir === "left" ? -cardWidth - 24 : cardWidth + 24, behavior: "smooth" });
  };

  /* ═══ Expanded grid view ═══ */
  if (showAll) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t: any) => (
            <div key={t.id} data-anim="fade-up">
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(false)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold
                       border-2 border-gray-300 text-gray-700 bg-white
                       hover:border-[var(--accent)] hover:text-[var(--accent)]
                       transition-all duration-300 active:scale-95"
          >
            Show Less <ChevronUp size={16} />
          </button>
        </div>
      </div>
    );
  }

  /* ═══ Carousel view (default) — auto-scrolls, pauses on hover ═══ */
  return (
    <div>
      <div
        className="relative"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        {/* Left arrow */}
        {canLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full
                       bg-white shadow-lg border border-gray-200 flex items-center justify-center
                       hover:bg-gray-50 hover:scale-110 transition-all -ml-3 md:-ml-5"
            aria-label="Previous"
          >
            <ChevronLeft size={20} className="text-[var(--primary)]" />
          </button>
        )}

        {/* Right arrow */}
        {canRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full
                       bg-white shadow-lg border border-gray-200 flex items-center justify-center
                       hover:bg-gray-50 hover:scale-110 transition-all -mr-3 md:-mr-5"
            aria-label="Next"
          >
            <ChevronRight size={20} className="text-[var(--primary)]" />
          </button>
        )}

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2 px-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {testimonials.map((t: any, i: number) => (
            <div
              key={`${t.id}-${i}`}
              className="shrink-0 w-[85vw] sm:w-[360px] md:w-[calc(33.333%-1rem)]"
              style={{ scrollSnapAlign: "start" }}
            >
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      </div>

      {/* See All Reviews button */}
      {showSeeAll && testimonials.length > 3 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold
                       border-2 border-gray-300 text-gray-700 bg-white
                       hover:border-[var(--accent)] hover:text-[var(--accent)]
                       transition-all duration-300 active:scale-95"
          >
            See All {testimonials.length} Reviews <ChevronDown size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
