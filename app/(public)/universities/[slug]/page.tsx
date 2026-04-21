"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUniversity } from "@/hooks/useData";
import {
  MapPin, Globe, Phone, Mail, Calendar, Building2, Award,
  FileCheck, ArrowLeft, Loader2, ExternalLink, ChevronDown,
  ChevronUp, BookOpen, GraduationCap, Play, ChevronRight,
  Users,
} from "lucide-react";

// FIX: Tawakkul-style university detail page – light hero, breadcrumbs, full-width sections
type Tab = "overview" | "courses" | "campus-tour";

function DepartmentAccordion({ title, programs }: { title: string; programs: any[] }) {
  const [open, setOpen] = useState(false);
  if (programs.length === 0) return null;
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
            <BookOpen size={15} className="text-[var(--accent)]" />
          </div>
          <span className="font-semibold text-[var(--primary)] text-sm">{title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">{programs.length}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && (
        <div className="border-t border-gray-100 bg-gray-50/60 divide-y divide-gray-100">
          {programs.map((prog) => (
            <div key={prog.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{prog.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{prog.duration} · {prog.mode}</p>
              </div>
              <Link href={`/courses/${prog.slug}`}
                className="text-xs font-semibold text-[var(--accent)] hover:underline shrink-0 ml-4">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Department grouping now uses the `department` field from the Program model

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

  // FIX: Group programs by department field from database
  const programsByDept: Record<string, any[]> = {};
  if (university.programs) {
    for (const prog of university.programs) {
      const dept = prog.department || "General";
      if (!programsByDept[dept]) programsByDept[dept] = [];
      programsByDept[dept].push(prog);
    }
  }

  const tabs = [
    { key: "overview" as Tab, label: "Overview", icon: BookOpen },
    { key: "courses" as Tab, label: `Courses (${university.programs?.length || 0})`, icon: GraduationCap },
    ...(university.campusTourVideo ? [{ key: "campus-tour" as Tab, label: "Campus Tour", icon: Play }] : []),
  ];

  const videoId = university.campusTourVideo ? getYouTubeId(university.campusTourVideo) : null;

  // Quick info items
  const quickInfo = [
    university.city && { icon: MapPin, label: "Location", value: `${university.city}, ${university.country}` },
    university.established && { icon: Calendar, label: "Established", value: university.established },
    university.type && { icon: Building2, label: "Type", value: university.type },
    university.ranking && { icon: Award, label: "Ranking", value: university.ranking },
    university.programs && { icon: Users, label: "Programs", value: `${university.programs.length} Available` },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  return (
    <div className="bg-[var(--background)]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
            <ChevronRight size={12} />
            <Link href="/universities" className="hover:text-[var(--accent)]">Universities</Link>
            <ChevronRight size={12} />
            <span className="text-gray-800 font-medium truncate max-w-[250px]">{university.shortName || university.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero – light gradient */}
      <section style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #FFF7ED 50%, #F0FDF4 100%)" }}>
        <div className="container-custom py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-3">
              {university.logo ? (
                <Image src={university.logo} alt={university.name} width={120} height={120} className="w-full h-full object-contain" />
              ) : (
                <span className="text-3xl font-bold text-[var(--primary)]">
                  {university.shortName?.[0] || university.name[0]}
                </span>
              )}
            </div>

            {/* Name + info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[var(--primary)] leading-tight mb-2">
                {university.name}
              </h1>
              {university.shortName && (
                <p className="text-gray-500 text-sm mb-2">({university.shortName})</p>
              )}
              {university.city && (
                <p className="text-gray-600 flex items-center gap-1.5 text-sm mb-4">
                  <MapPin size={14} className="text-[var(--accent)]" />
                  {university.city}, {university.country}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary !px-8 !py-3">
                  Apply Now <ChevronRight size={14} />
                </Link>
                {university.website && (
                  <a href={university.website} target="_blank" rel="noopener noreferrer"
                    className="btn-secondary !px-6 !py-3 text-sm">
                    <Globe size={14} /> Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      {quickInfo.length > 0 && (
        <section className="bg-white border-b border-gray-100">
          <div className="container-custom py-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickInfo.map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                    <p className="text-sm font-bold text-[var(--primary)] truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[96px] z-30">
        <div className="container-custom">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container-custom py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "overview" && (
              <>
                {/* Banner */}
                {university.banner && (
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <Image src={university.banner} alt={`${university.name} campus`} width={800} height={450} className="w-full object-cover" />
                  </div>
                )}

                {/* Description */}
                {university.description ? (
                  <section>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[var(--primary)] mb-4">
                      About {university.shortName || university.name}
                    </h2>
                    <div className="prose-eduwave max-w-none">
                      {university.description.split("\n").filter(Boolean).map((para, i) => (
                        <p key={i} className="text-gray-700 leading-relaxed mb-3 text-justify">{para}</p>
                      ))}
                    </div>
                  </section>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Building2 size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 text-sm">University description will be available soon.</p>
                  </div>
                )}
              </>
            )}

            {activeTab === "courses" && (
              <section>
                <h2 className="text-xl font-bold text-[var(--primary)] mb-2">
                  Available Programs
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
              </section>
            )}

            {activeTab === "campus-tour" && (
              <section>
                <h2 className="text-xl font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
                  <Play size={20} className="text-[var(--accent)]" />
                  Campus Tour
                </h2>
                {videoId ? (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-black">
                    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                        title={`${university.name} Campus Tour`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Play size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 text-sm">Campus tour video coming soon.</p>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar (1/3) */}
          <aside className="space-y-5 lg:sticky lg:top-[160px] self-start">
            {/* Contact card */}
            {(university.website || university.email || university.phone) && (
              <div className="card p-5 space-y-3">
                <h3 className="text-base font-bold text-[var(--primary)] border-b border-gray-100 pb-3">Contact</h3>
                {university.website && (
                  <a href={university.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--accent)] hover:underline font-medium">
                    <Globe size={14} /> Official Website <ExternalLink size={11} />
                  </a>
                )}
                {university.email && (
                  <a href={`mailto:${university.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--accent)]">
                    <Mail size={14} /> {university.email}
                  </a>
                )}
                {university.phone && (
                  <a href={`tel:${university.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--accent)]">
                    <Phone size={14} /> {university.phone}
                  </a>
                )}
              </div>
            )}

            {university.offerLetter && (
              <div className="flex items-center gap-2.5 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <FileCheck size={16} className="text-emerald-600 shrink-0" />
                <span className="text-sm font-semibold text-emerald-700">Offer Letter Available</span>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-2xl p-6 text-white text-center shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)" }}>
              <GraduationCap size={32} className="mx-auto mb-3 opacity-90" />
              <h3 className="text-lg font-bold mb-1 text-white">Interested?</h3>
              <p className="text-sm text-white/80 mb-4">
                Get free consultation about studying at {university.shortName || university.name}.
              </p>
              <Link href="/contact"
                className="block w-full py-3 rounded-xl bg-white text-[var(--accent)] font-bold text-sm hover:bg-white/90 transition-all shadow-sm">
                Apply Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
