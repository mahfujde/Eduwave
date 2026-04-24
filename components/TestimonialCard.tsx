"use client";

import Image from "next/image";
import { Star, StarHalf } from "lucide-react";
import type { Testimonial } from "@/types";

interface Props {
  testimonial: Testimonial;
}

/**
 * Clean testimonial card matching the "Success Stories" design.
 * - White card with thin border
 * - Stars with half-star support at top-left
 * - Full quote text (no truncation), justified
 * - Author: photo + bold name + program/university on two lines, left-aligned
 */
export default function TestimonialCard({ testimonial }: Props) {
  const fullStars = Math.floor(testimonial.rating);
  const hasHalf = testimonial.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 p-5 sm:p-6 transition-shadow duration-300 hover:shadow-md">
      {/* Stars row — supports half stars */}
      <div className="flex gap-0.5 mb-4 shrink-0">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`f-${i}`} size={18} className="fill-amber-400 text-amber-400" />
        ))}
        {hasHalf && <StarHalf size={18} className="fill-amber-400 text-amber-400" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`e-${i}`} size={18} className="text-gray-200" />
        ))}
      </div>

      {/* Quote text — full visible, no truncation */}
      <p className="text-gray-700 leading-relaxed text-sm sm:text-[15px] mb-6 flex-1">
        {testimonial.quote}
      </p>

      {/* Author bar */}
      <div className="flex items-center gap-3 pt-4 mt-auto border-t border-gray-100 shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
          {testimonial.photo ? (
            <Image
              src={testimonial.photo}
              alt={testimonial.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white font-bold text-sm">
              {testimonial.name[0]}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-gray-900 text-sm leading-snug">
            {testimonial.name}
          </h4>
          {(testimonial.university || testimonial.program) && (
            <p className="text-xs text-gray-500 leading-snug mt-0.5">
              {[testimonial.program, testimonial.university]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
