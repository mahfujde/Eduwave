"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, FileCheck, ArrowRight, Building2 } from "lucide-react";
import type { University } from "@/types";

interface Props {
  university: University;
}

export default function UniversityCard({ university }: Props) {
  return (
    <div
      className="bg-white rounded-2xl border border-[var(--border)] shadow-sm
                 hover:shadow-lg hover:border-[var(--accent)]/30
                 transition-all duration-300 ease-out group overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Logo */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-gray-100 bg-gray-50
                       flex items-center justify-center shrink-0 overflow-hidden
                       group-hover:border-[var(--accent)]/20 transition-colors"
          >
            {university.logo ? (
              <Image
                src={university.logo}
                alt={university.name}
                width={96}
                height={96}
                className="object-contain p-2 w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 p-2">
                <Building2 size={28} className="text-[var(--primary)]/30" />
                <span className="text-xs font-bold text-[var(--primary)] text-center leading-tight">
                  {university.shortName || university.name.slice(0, 3).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-base sm:text-lg font-bold text-[var(--primary)] leading-snug
                         group-hover:text-[var(--accent)] transition-colors line-clamp-2"
            >
              {university.name}
              {university.shortName && (
                <span className="ml-1.5 text-sm font-normal text-gray-400">({university.shortName})</span>
              )}
            </h3>

            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin size={13} className="text-[var(--accent)] shrink-0" />
                <span>{university.city ? `${university.city},` : ""}{university.country}</span>
              </div>

              {university.offerLetter && (
                <div className="flex items-center gap-1.5 text-sm text-emerald-700">
                  <FileCheck size={13} className="text-emerald-500 shrink-0" />
                  <span className="font-medium">Offer Letter Applicable: Yes</span>
                </div>
              )}

              {university.ranking && (
                <p className="text-xs text-gray-400 truncate">{university.ranking}</p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            id={`apply-now-${university.slug}`}
            className="px-5 py-2.5 text-sm font-bold rounded-lg
                       bg-[var(--primary)] text-white
                       hover:bg-[var(--primary-light)] active:scale-95
                       transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Apply Now
          </Link>
          <Link
            href={`/universities/${university.slug}`}
            id={`details-${university.slug}`}
            className="px-5 py-2.5 text-sm font-bold rounded-lg
                       bg-sky-500 text-white
                       hover:bg-sky-400 active:scale-95
                       transition-all duration-200 shadow-sm hover:shadow-md
                       flex items-center gap-1.5"
          >
            Details
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {university._count?.programs !== undefined && university._count.programs > 0 && (
            <span className="ml-auto text-xs text-gray-400 font-medium">
              {university._count.programs} program{university._count.programs !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
