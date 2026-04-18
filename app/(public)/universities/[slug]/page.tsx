"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUniversity } from "@/hooks/useData";
import {
  MapPin, Globe, Phone, Mail, Calendar, Building2, Award,
  FileCheck, ArrowLeft, Loader2, ExternalLink, ChevronDown,
  ChevronUp, BookOpen, GraduationCap,
} from "lucide-react";

type Tab = "overview" | "courses";

const DEPARTMENT_GROUPS: Record<string, string[]> = {
  "Computer Science & IT": ["Bachelor", "Diploma", "Master", "Foundation"],
  "Business & Management": ["Bachelor", "Master"],
  "Engineering & Applied Sciences": ["Bachelor", "Master"],
  "Natural Sciences": ["Bachelor", "Master"],
  "Social Sciences & Humanities": ["Bachelor", "Master"],
  "Law & Legal Studies": ["Bachelor", "Master"],
  "Art & Design": ["Bachelor", "Diploma"],
  "Communication & Media": ["Bachelor", "Diploma"],
};

function DepartmentAccordion({ title, programs }: { title: string; programs: any[] }) {
  const [open, setOpen] = useState(false);
  if (programs.length === 0) return null;
  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/8 flex items-center justify-center">
            <BookOpen size={15} className="text-[var(--primary)]" />
          </div>
          <span className="font-semibold text-[var(--primary)] text-sm">{title}</span>
          <span className="text-xs text-gray-400 font-medium">({programs.length})</span>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && (
        <div className="border-t border-[var(--border)] bg-gray-50/60 divide-y divide-gray-100">
          {programs.map((prog) => (
            <div key={prog.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{prog.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{prog.duration} · {prog.mode}</p>
              </div>
              <Link
                href={`/courses/${prog.slug}`}
                className="text-xs font-semibold text-[var(--accent)] hover:underline shrink-0 ml-4"
              >
                View Course →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UniversityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: university, isLoading } = useUniversity(slug);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!university) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">University Not Found</h2>
        <Link href="/universities" className="btn-primary">Back to Universities</Link>
      </div>
    );
  }

  // Group programs into departments by level
  const programsByDept: Record<string, typeof university.programs> = {};
  if (university.programs) {
    for (const dept of Object.keys(DEPARTMENT_GROUPS)) {
      programsByDept[dept] = university.programs.filter((p) =>
        dept === "Computer Science & IT"
          ? p.name.toLowerCase().includes("computer") || p.name.toLowerCase().includes("it") || p.name.toLowerCase().includes("information") || p.name.toLowerCase().includes("software") || p.name.toLowerCase().includes("cyber")
          : dept === "Business & Management"
          ? p.name.toLowerCase().includes("business") || p.name.toLowerCase().includes("management") || p.name.toLowerCase().includes("mba") || p.name.toLowerCase().includes("commerce") || p.name.toLowerCase().includes("accounting")
          : dept === "Engineering & Applied Sciences"
          ? p.name.toLowerCase().includes("engineer") || p.name.toLowerCase().includes("electrical") || p.name.toLowerCase().includes("mechanic") || p.name.toLowerCase().includes("civil")
          : dept === "Art & Design"
          ? p.name.toLowerCase().includes("art") || p.name.toLowerCase().includes("design") || p.name.toLowerCase().includes("multimedia") || p.name.toLowerCase().includes("creative")
          : dept === "Communication & Media"
          ? p.name.toLowerCase().includes("media") || p.name.toLowerCase().includes("communication") || p.name.toLowerCase().includes("journalism")
          : []
      );
    }

    // Uncategorized programs go into "Other Programs"
    const categorized = new Set(Object.values(programsByDept).flat().filter(Boolean).map((p) => p!.id));
    const uncategorized = university.programs.filter((p) => !categorized.has(p.id));
    if (uncategorized.length > 0) programsByDept["Other Programs"] = uncategorized;
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] pt-6 pb-8">
        <div className="container-custom">
          <Link
            href="/universities"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Universities
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center shrink-0 overflow-hidden p-2">
              {university.logo ? (
                <Image
                  src={university.logo}
                  alt={university.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-3xl font-bold text-[var(--primary)]">
                  {university.shortName?.[0] || university.name[0]}
                </span>
              )}
            </div>

            {/* Name + Location */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {university.name}
              </h1>
              {university.shortName && (
                <p className="text-white/60 text-sm mt-0.5">({university.shortName})</p>
              )}
              {university.city && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/90 text-sm font-medium">
                    <MapPin size={13} />
                    Location: {university.city}, {university.country}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 bg-white/10 rounded-xl p-1 w-fit">
            {(["overview", "courses"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-[var(--primary)] shadow"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-custom py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: tab content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "overview" && (
              <>
                {/* About */}
                {university.description && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--primary)] mb-4">
                      About the University
                    </h2>
                    <div className="prose-eduwave">
                      {university.description.split("\n").map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Banner / Scholarship image */}
                {university.banner && (
                  <div className="rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm">
                    <Image
                      src={university.banner}
                      alt={`${university.name} scholarship`}
                      width={800}
                      height={450}
                      className="w-full object-cover"
                    />
                  </div>
                )}
              </>
            )}

            {activeTab === "courses" && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-[var(--primary)] mb-2">
                    Departments and Courses
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    {university.programs?.length || 0} programme{(university.programs?.length || 0) !== 1 ? "s" : ""} available
                  </p>
                  {(!university.programs || university.programs.length === 0) ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <GraduationCap size={32} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 text-sm">No programs listed yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(programsByDept).map(([dept, progs]) => (
                        progs && progs.length > 0 ? (
                          <DepartmentAccordion key={dept} title={dept} programs={progs} />
                        ) : null
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Quick Info */}
            <div className="card p-5 space-y-4">
              <h3 className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-3">
                Quick Info
              </h3>

              {university.city && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Location</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{university.city}, {university.country}</p>
                  </div>
                </div>
              )}

              {university.established && (
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Established</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{university.established}</p>
                  </div>
                </div>
              )}

              {university.type && (
                <div className="flex items-start gap-3">
                  <Building2 size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Type</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{university.type}</p>
                  </div>
                </div>
              )}

              {university.ranking && (
                <div className="flex items-start gap-3">
                  <Award size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Ranking</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{university.ranking}</p>
                  </div>
                </div>
              )}

              {university.offerLetter && (
                <div className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <FileCheck size={16} className="text-emerald-600 shrink-0" />
                  <span className="text-sm font-semibold text-emerald-700">Offer Letter Available</span>
                </div>
              )}
            </div>

            {/* Contact */}
            {(university.website || university.email || university.phone) && (
              <div className="card p-5 space-y-3">
                <h3 className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-3">
                  Contact
                </h3>
                {university.website && (
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--accent)] hover:underline font-medium"
                  >
                    <Globe size={14} /> Official Website <ExternalLink size={11} />
                  </a>
                )}
                {university.email && (
                  <a
                    href={`mailto:${university.email}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--accent)]"
                  >
                    <Mail size={14} /> {university.email}
                  </a>
                )}
                {university.phone && (
                  <a
                    href={`tel:${university.phone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--accent)]"
                  >
                    <Phone size={14} /> {university.phone}
                  </a>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] text-white text-center shadow-lg">
              <GraduationCap size={32} className="mx-auto mb-3 opacity-90" />
              <h3 className="text-lg font-bold mb-1">Interested?</h3>
              <p className="text-sm text-white/80 mb-4">
                Get free consultation about studying at {university.shortName || university.name}.
              </p>
              <Link
                href="/contact"
                className="block w-full py-3 rounded-xl bg-white text-[var(--accent)]
                           font-bold text-sm hover:bg-white/90 active:scale-95
                           transition-all duration-200 shadow-sm"
              >
                Apply Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
