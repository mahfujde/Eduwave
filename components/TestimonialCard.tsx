"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/types";

interface Props {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: Props) {
  return (
    <div className="card p-6 sm:p-8 relative overflow-hidden group">
      {/* Decorative quote */}
      <Quote
        size={48}
        className="absolute top-4 right-4 text-[var(--accent)]/10"
      />

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < testimonial.rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-700 leading-relaxed text-sm sm:text-base italic mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
          {testimonial.photo ? (
            <Image
              src={testimonial.photo}
              alt={testimonial.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center
                          bg-[var(--primary)] text-white font-bold text-lg">
              {testimonial.name[0]}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-[var(--primary)] text-sm">
            {testimonial.name}
          </h4>
          {(testimonial.university || testimonial.program) && (
            <p className="text-xs text-gray-500 mt-0.5">
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
