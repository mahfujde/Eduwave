"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useProgram } from "@/hooks/useData";
import { safeJsonParse, getWhatsAppUrl } from "@/lib/utils";
import type { FeeRow } from "@/types";
import {
  ArrowLeft, Loader2, MapPin, Clock, Calendar, Globe,
  GraduationCap, BookOpen, CheckCircle2, Briefcase,
  Building2, DollarSign, FileText, Copy, Check,
  ChevronRight, Languages, Monitor, Users,
} from "lucide-react";

// FIX: Tawakkul-style course detail page – light hero, full-width sections, 5-card info bar
interface CurriculumCategory { category: string; subjects: string[]; }
interface CareerItem { icon: string; label: string; }

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: program, isLoading } = useProgram(slug);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Program Not Found</h2>
        <Link href="/courses" className="btn-primary">Back to Courses</Link>
      </div>
    );
  }

  const fees: FeeRow[] = safeJsonParse(program.fees, []);
  const tuitionFees = fees.filter((f: any) => f.type !== "other");
  const otherFees = fees.filter((f: any) => f.type === "other");
  const curriculum: CurriculumCategory[] = safeJsonParse(program.curriculum, []);
  const careerProspects: CareerItem[] = safeJsonParse(program.careerProspects, []);
  const requirements: string[] = program.requirements
    ? program.requirements.split("\n").filter(Boolean)
    : [];

  const whatsappUrl = getWhatsAppUrl(
    "+60112-4103692",
    `Hi! I'm interested in ${program.name} at ${program.university?.name || "your university"}.`
  );

  // FIX: Quick stats cards data
  const quickStats = [
    { icon: GraduationCap, label: "Qualification", value: program.qualification || program.level },
    { icon: Clock, label: "Duration", value: program.duration },
    { icon: Calendar, label: "Intake", value: program.intake },
    { icon: Languages, label: "English Req", value: program.englishReq || program.language },
    { icon: Monitor, label: "Class Type", value: program.classType || program.mode },
  ].filter((s) => s.value);

  // Copy course details handler
  const handleCopy = () => {
    const url = `https://theeduwave.com/courses/${program.slug}`;
    let text = `🏛️ ${program.university?.name || "University"}\n🎓 ${program.name}\n\n`;
    if (program.qualification || program.level) text += `🎓 Qualification: ${program.qualification || program.level}\n`;
    if (program.duration) text += `⏳ Duration: ${program.duration}\n`;
    if (program.intake) text += `📅 Intake: ${program.intake}\n`;
    if (tuitionFees.length > 0) {
      text += "\n💸 Tuition Fees:\n";
      tuitionFees.forEach((f: any) => { text += `- ${f.label}: ${f.amount}\n`; });
    }
    if (otherFees.length > 0) {
      text += "\n💰 Other Fees:\n";
      otherFees.forEach((f: any) => { text += `- ${f.label}: ${f.amount}\n`; });
    }
    text += `\n🔗 ${url}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="bg-[var(--background)]">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
            <ChevronRight size={12} />
            <Link href="/courses" className="hover:text-[var(--accent)]">Courses</Link>
            <ChevronRight size={12} />
            <span className="text-gray-800 font-medium truncate max-w-[250px]">{program.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero Section – Light gradient with university logo ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FFF7ED 0%, #F0FDF4 50%, #EFF6FF 100%)" }}
      >
        <div className="container-custom py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            {/* University logo */}
            {program.university && (
              <Link
                href={`/universities/${program.university.slug}`}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-3 hover:shadow-xl transition-shadow"
              >
                {program.university.logo ? (
                  <Image src={program.university.logo} alt={program.university.name} width={120} height={120} className="w-full h-full object-contain" />
                ) : (
                  <Building2 size={40} className="text-gray-300" />
                )}
              </Link>
            )}

            {/* Title + University + CTA */}
            <div className="flex-1 min-w-0">
              {/* Level badge */}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                {program.level} Program
              </span>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[var(--primary)] leading-tight mb-2">
                {program.name}
              </h1>

              {program.university && (
                <p className="text-gray-600 text-base md:text-lg mb-1 flex items-center gap-2">
                  <Building2 size={16} className="text-gray-400" />
                  {program.university.name}
                  {program.university.city && (
                    <span className="text-gray-400 flex items-center gap-1 text-sm">
                      <MapPin size={12} /> {program.university.city}
                    </span>
                  )}
                </p>
              )}

              <div className="flex flex-wrap gap-3 mt-5">
                <Link href="/contact" className="btn-primary !px-8 !py-3">
                  Apply Now <ChevronRight size={14} />
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary !px-6 !py-3 text-sm">
                  WhatsApp Us
                </a>
                <button onClick={handleCopy}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium border transition-all ${
                    copied ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}>
                  {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Details</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Info Cards Row ── */}
      {quickStats.length > 0 && (
        <section className="bg-white border-b border-gray-100">
          <div className="container-custom py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickStats.map((s) => (
                <div key={s.label} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                    <s.icon size={18} className="text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                    <p className="text-sm font-bold text-[var(--primary)] truncate">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Fee Structure (Side-by-side tables) ── */}
      {fees.length > 0 && (
        <section className="bg-white">
          <div className="container-custom py-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--primary)] mb-6 text-center">
              Fee Structure
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Tuition fees table */}
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="px-5 py-3.5 font-bold text-sm text-white uppercase tracking-wide bg-[var(--accent)]">
                  Yearly Tuition Fees
                </div>
                <div className="divide-y divide-gray-100">
                  {(tuitionFees.length > 0 ? tuitionFees : fees).map((fee, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm text-gray-600">{fee.label}</span>
                      <span className="text-sm font-bold text-[var(--accent)]">{fee.amount}</span>
                    </div>
                  ))}
                </div>
                {/* FIX: Auto-calculated Total Tuition */}
                {(() => {
                  const rows = tuitionFees.length > 0 ? tuitionFees : fees;
                  if (rows.length < 2) return null;
                  const total = rows.reduce((sum, f) => {
                    const num = parseFloat(String(f.amount).replace(/[^0-9.]/g, ""));
                    return sum + (isNaN(num) ? 0 : num);
                  }, 0);
                  if (total <= 0) return null;
                  return (
                    <div className="flex items-center justify-between px-5 py-3.5 bg-[var(--accent)]/5 border-t-2 border-[var(--accent)]/20">
                      <span className="text-sm font-bold text-[var(--primary)]">Total Tuition</span>
                      <span className="text-base font-extrabold text-[var(--accent)]">MYR {total.toLocaleString()}</span>
                    </div>
                  );
                })()}
              </div>
              {/* Other fees table */}
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="px-5 py-3.5 font-bold text-sm text-white uppercase tracking-wide bg-[var(--primary)]">
                  <DollarSign size={14} className="inline mr-1" /> Other Fees
                </div>
                {otherFees.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {otherFees.map((fee, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3.5">
                        <span className="text-sm text-gray-600">{fee.label}</span>
                        <span className="text-sm font-semibold text-gray-800">{fee.amount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center text-sm text-gray-400">
                    Contact us for other fee details
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Main Content Sections (Full Width) ── */}
      <div className="container-custom py-10 space-y-12">

        {/* Overview / About */}
        {(program.description || program.overview) && (
          <section>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--primary)] mb-4">
              Overview
            </h2>
            <div className="prose-eduwave max-w-none">
              {(program.overview || program.description || "").split("\n").filter(Boolean).map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-3 text-justify">{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* Entry Requirements */}
        {requirements.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--primary)] mb-4">
              Entry Requirements
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 leading-relaxed">{req}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Future Careers */}
        {careerProspects.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--primary)] mb-4">
              Future Careers
            </h2>
            <div className="flex flex-wrap gap-3">
              {careerProspects.map((career, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/10 text-sm font-medium text-[var(--primary)]">
                  <Briefcase size={14} className="text-[var(--accent)]" />
                  {career.label}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Curriculum */}
        {curriculum.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--primary)] mb-4">
              Curriculum
            </h2>
            {program.duration && (
              <p className="text-gray-500 text-sm mb-6">
                Programme can be completed in {program.duration}.
              </p>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {curriculum.map((cat, i) => (
                <div key={i} className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 bg-[var(--primary)]/5 border-b border-gray-100 flex items-center gap-2">
                    <FileText size={14} className="text-[var(--accent)]" />
                    <h4 className="font-bold text-[var(--primary)] text-sm">{cat.category}</h4>
                  </div>
                  <ul className="p-4 space-y-2">
                    {cat.subjects.map((sub, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1.5" />
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="rounded-2xl p-8 md:p-12 text-center overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #E8622A 0%, transparent 70%)" }} />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 relative z-10">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100/70 text-sm mb-6 max-w-lg mx-auto relative z-10">
            Take the first step towards your dream career in {program.name}
          </p>
          <div className="flex flex-wrap justify-center gap-3 relative z-10">
            <Link href="/contact"
              className="px-8 py-3 rounded-xl font-bold text-[var(--primary)] bg-white text-sm hover:bg-white/90 transition-all">
              Apply Now
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl font-bold text-white bg-white/15 border border-white/30 text-sm hover:bg-white/25 transition-all">
              Download Brochure
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
