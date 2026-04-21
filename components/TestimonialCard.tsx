"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/types";

interface Props {
  testimonial: Testimonial;
}

/**
 * Premium testimonial card — bigger padding, larger photo, elegant quote styling.
 * line-clamp-5 ensures uniform height across all cards.
 */
export default function TestimonialCard({ testimonial }: Props) {
  return (
    <div className="card p-6 sm:p-7 relative overflow-hidden group flex flex-col rounded-2xl">
      {/* Decorative quote icon */}
      <Quote
        size={48}
        className="absolute -top-1 right-3 text-[var(--accent)]/[0.07] rotate-180"
        aria-hidden="true"
      />

      {/* Stars row */}
      <div className="flex gap-1 mb-4 shrink-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < testimonial.rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-200"
            }
          />
        ))}
      </div>

      {/* Quote text — line-clamp-5 for uniform card height */}
      <p className="text-gray-600 leading-[1.75] text-[15px] italic line-clamp-5 mb-5 flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author bar */}
      <div className="flex items-center gap-3.5 pt-4 mt-auto border-t border-gray-100/80 shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 ring-2 ring-[var(--accent)]/20 ring-offset-2">
          {testimonial.photo ? (
            <Image
              src={testimonial.photo}
              alt={testimonial.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white font-bold text-base">
              {testimonial.name[0]}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-[var(--primary)] text-[15px] truncate">
            {testimonial.name}
          </h4>
          {(testimonial.university || testimonial.program) && (
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {[testimonial.program, testimonial.university]
                .filter(Boolean)
                .join(" — ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
