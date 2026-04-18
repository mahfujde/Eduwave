"use client";

import Link from "next/link";
import { Clock, BookOpen, Globe, Calendar, ArrowRight } from "lucide-react";
import type { Program } from "@/types";

interface Props {
  program: Program;
}

export default function ProgramCard({ program }: Props) {
  const levelColors: Record<string, string> = {
    Foundation: "bg-emerald-100 text-emerald-800",
    Diploma: "bg-blue-100 text-blue-800",
    Bachelor: "bg-purple-100 text-purple-800",
    Master: "bg-amber-100 text-amber-800",
    PhD: "bg-rose-100 text-rose-800",
  };

  return (
    <div className="card group overflow-hidden">
      {/* Level badge header */}
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <span className={`badge ${levelColors[program.level] || "bg-gray-100 text-gray-800"}`}>
          {program.level}
        </span>
      </div>

      <div className="p-5 sm:p-6 pt-3">
        <h3 className="text-lg font-bold text-[var(--primary)] leading-tight
                     group-hover:text-[var(--accent)] transition-colors line-clamp-2">
          {program.name}
        </h3>

        {program.university && (
          <p className="text-sm text-gray-500 mt-1.5 font-medium">
            {program.university.name}
          </p>
        )}

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {program.duration && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} className="text-[var(--accent)] shrink-0" />
              <span>{program.duration}</span>
            </div>
          )}
          {program.language && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe size={14} className="text-[var(--accent)] shrink-0" />
              <span>{program.language}</span>
            </div>
          )}
          {program.mode && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen size={14} className="text-[var(--accent)] shrink-0" />
              <span>{program.mode}</span>
            </div>
          )}
          {program.intake && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} className="text-[var(--accent)] shrink-0" />
              <span className="truncate">{program.intake}</span>
            </div>
          )}
        </div>

        {program.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
            {program.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-5 pt-4 border-t">
          <Link
            href="/contact"
            className="px-4 py-2 text-sm font-semibold rounded-lg border-2
                     border-[var(--primary)] text-[var(--primary)]
                     hover:bg-[var(--primary)] hover:text-white transition-all"
          >
            Apply Now
          </Link>
          <Link
            href={`/courses/${program.slug}`}
            className="px-4 py-2 text-sm font-semibold rounded-lg
                     bg-[var(--accent)] text-white
                     hover:bg-[var(--accent-light)] transition-all
                     flex items-center gap-1.5"
          >
            View Details
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
