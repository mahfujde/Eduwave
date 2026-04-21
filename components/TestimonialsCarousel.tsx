"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import TestimonialCard from "@/components/TestimonialCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  testimonials: any[];
  showSeeAll?: boolean;
}

/**
 * Testimonial carousel with responsive mobile cards,
 * auto-scroll, arrows, and optional "See All" grid.
 */
export default function TestimonialsCarousel({ testimonials, showSeeAll = true }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const GAP = 24;

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
  }, [updateArrows, testimonials]);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (showAll) return;
    const el = scrollRef.current;
    if (!el) return;
    const timer = setInterval(() => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [showAll, testimonials]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  // "See All" view — grid layout
  if (showAll) {
    return (
      <div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t: any) => (
            <div key={t.id}>
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => setShowAll(false)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/15 border border-white/30 hover:bg-white/25 transition-all">
            ← Back to Carousel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left arrow */}
      {canLeft && (
        <button onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white transition-all -ml-2"
          aria-label="Previous">
          <ChevronLeft size={20} className="text-[var(--primary)]" />
        </button>
      )}

      {/* Right arrow */}
      {canRight && (
        <button onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white transition-all -mr-2"
          aria-label="Next">
          <ChevronRight size={20} className="text-[var(--primary)]" />
        </button>
      )}

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(15,27,63,0.8), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, rgba(15,27,63,0.8), transparent)" }} />

      {/* Scrollable track — FIX: responsive card width for mobile */}
      <div ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2 px-1"
        style={{ scrollSnapType: "x mandatory" }}>
        {testimonials.map((t: any, i: number) => (
          <div key={`${t.id}-${i}`}
            className="shrink-0 w-[88vw] sm:w-[380px] md:w-[400px] scroll-snap-align-start"
            style={{ scrollSnapAlign: "start" }}>
            <div className="[&>.card]:shadow-none [&>.card]:hover:shadow-none">
              <TestimonialCard testimonial={t} />
            </div>
          </div>
        ))}
      </div>

      {/* See All button */}
      {showSeeAll && testimonials.length > 3 && (
        <div className="text-center mt-6">
          <button onClick={() => setShowAll(true)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/15 border border-white/30 hover:bg-white/25 transition-all">
            See All {testimonials.length} Reviews →
          </button>
        </div>
      )}
    </div>
  );
}
