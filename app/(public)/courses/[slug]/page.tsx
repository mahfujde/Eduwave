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
} from "lucide-react";

interface CurriculumCategory { category: string; subjects: string[]; }
interface CareerItem { icon: string; label: string; }

const CAREER_ICONS: Record<string, string> = {
  government: "🏛️", banking: "🏦", "real estate": "🏠", investment: "📈",
  engineering: "⚙️", technology: "💻", business: "💼", entrepreneurship: "🚀",
  healthcare: "🏥", education: "📚", media: "📡", hospitality: "🏨",
  "non-profit": "🤝", "small & medium": "🏪",
};

function getCareerIcon(label: string): string {
  const lower = label.toLowerCase();
  for (const [key, icon] of Object.entries(CAREER_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "🎯";
}

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
  const totalFees = fees.reduce((sum, f) => {
    const n = parseFloat(String(f.amount).replace(/[^0-9.]/g, ""));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const curriculum: CurriculumCategory[] = safeJsonParse(program.curriculum, []);
  const careerProspects: CareerItem[] = safeJsonParse(program.careerProspects, []);
  const requirements: string[] = program.requirements
    ? program.requirements.split("\n").filter(Boolean)
    : [];

  const whatsappUrl = getWhatsAppUrl(
    "+60112-4103692",
    `Hi! I'm interested in ${program.name} at ${program.university?.name || "your university"}. Could you send me the brochure?`
  );

  const quickStats = [
    { icon: GraduationCap, label: "Qualification", value: program.qualification || program.level },
    { icon: Clock, label: "Duration", value: program.duration },
    { icon: Calendar, label: "Intake", value: program.intake },
    { icon: Globe, label: "English Req", value: program.englishReq || program.language },
    { icon: BookOpen, label: "Class Type", value: program.classType || program.mode },
  ].filter((s) => s.value);

  return (
    <div>
      {/* ── Dark Hero ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1A2B5F 60%, #0F172A 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #E8622A 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />

        <div className="container-custom relative z-10 py-8 md:py-12">
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to Courses
          </Link>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left: hero text */}
            <div className="lg:col-span-3">
              {/* Level badge */}
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                style={{ background: "rgba(232,98,42,0.2)", border: "1px solid rgba(232,98,42,0.4)", color: "#F5733B" }}>
                {program.level} Program
              </span>

              {/* Programme name — first word(s) white, discipline word orange italic */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                {(() => {
                  const words = program.name.split(" ");
                  const midpoint = Math.ceil(words.length / 2);
                  const first = words.slice(0, midpoint).join(" ");
                  const second = words.slice(midpoint).join(" ");
                  return second ? (
                    <>
                      {first}{" "}
                      <span className="italic" style={{ color: "#E8622A" }}>{second}</span>
                    </>
                  ) : first;
                })()}
              </h1>

              {/* University card */}
              {program.university && (
                <Link
                  href={`/universities/${program.university.slug}`}
                  className="inline-flex items-center gap-3 px-4 py-3 rounded-xl mb-6 transition-all hover:scale-[1.02]"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  {program.university.logo ? (
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 p-1">
                      <Image src={program.university.logo} alt="" width={36} height={36} className="object-contain w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <Building2 size={16} className="text-white" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{program.university.name}</p>
                    {program.university.city && (
                      <p className="text-xs text-white/60 flex items-center gap-1">
                        <MapPin size={10} />{program.university.city}, {program.university.country}
                      </p>
                    )}
                  </div>
                </Link>
              )}

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 active:scale-95"
                style={{ background: "var(--accent)" }}
              >
                Apply Now →
              </Link>
            </div>

            {/* Right: Programme Overview card */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl p-5 shadow-2xl"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Programme Overview</p>
                <div className="space-y-4">
                  {quickStats.map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-white/60">
                        <s.icon size={15} />
                        <span className="text-sm">{s.label}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container-custom py-10 md:py-14">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left column (2/3) */}
          <div className="lg:col-span-2 space-y-14">

            {/* Programme Overview Section */}
            {(program.description || program.overview) && (
              <section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-[var(--primary)]">Program Overview</h2>
                  <p className="text-gray-400 text-sm mt-1">Your pathway to academic excellence</p>
                </div>
                <div className="rounded-2xl p-6 md:p-8 text-white space-y-4"
                  style={{ background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" }}>
                  <h3 className="text-lg font-bold">About This Program</h3>
                  {(program.overview || program.description || "").split("\n").filter(Boolean).map((p, i) => (
                    <p key={i} className="text-gray-300 leading-relaxed text-sm">{p}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Fee Structure */}
            {fees.length > 0 && (
              <section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-[var(--primary)]">Fee Structure</h2>
                  <p className="text-gray-400 text-sm mt-1">Transparent and affordable tuition rates</p>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Tuition fees */}
                  <div className="rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm">
                    <div className="px-5 py-3.5 font-bold text-sm text-white uppercase tracking-wide"
                      style={{ background: "var(--accent)" }}>
                      Yearly Tuition Fees
                    </div>
                    <div className="divide-y divide-gray-100">
                      {(tuitionFees.length > 0 ? tuitionFees : fees).map((fee, i) => (
                        <div key={i} className="flex items-center justify-between px-5 py-3.5">
                          <span className="text-sm text-gray-600">{fee.label}</span>
                          <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{fee.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other fees */}
                  <div className="rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm">
                    <div className="px-5 py-3.5 font-bold text-sm text-white uppercase tracking-wide flex items-center gap-2"
                      style={{ background: "#1E293B" }}>
                      <DollarSign size={14} /> Other Fees
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
              </section>
            )}

            {/* Entry Requirements */}
            {requirements.length > 0 && (
              <section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-[var(--primary)]">Entry Requirements</h2>
                  <p className="text-gray-400 text-sm mt-1">Basic qualifications needed for admission</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-2.5">
                    <GraduationCap size={18} className="text-[var(--accent)]" />
                    <h3 className="font-bold text-[var(--primary)]">Academic Requirements</h3>
                  </div>
                  <div className="p-5 grid sm:grid-cols-2 gap-3">
                    {requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                        <CheckCircle2 size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 leading-snug">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Career Opportunities */}
            {careerProspects.length > 0 && (
              <section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-[var(--primary)]">Career Opportunities</h2>
                  <p className="text-gray-400 text-sm mt-1">Diverse career paths available after graduation</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {careerProspects.map((career, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-[var(--border)] hover:border-[var(--accent)]/30 hover:shadow-md transition-all duration-200 text-center group">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ background: "#1E293B" }}>
                        {career.icon || getCareerIcon(career.label)}
                      </div>
                      <span className="text-xs font-semibold text-gray-700 leading-snug">{career.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curriculum Overview */}
            {curriculum.length > 0 && (
              <section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-[var(--primary)]">Curriculum Overview</h2>
                  <p className="text-gray-400 text-sm mt-1">Comprehensive subjects for holistic development</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {curriculum.map((cat, i) => (
                    <div key={i} className="rounded-2xl border-l-4 border border-[var(--border)] p-5 hover:shadow-md transition-all"
                      style={{ borderLeftColor: "var(--accent)" }}>
                      <div className="flex items-center gap-2 mb-4">
                        <FileText size={15} className="text-[var(--accent)]" />
                        <h4 className="font-bold text-[var(--primary)] text-sm">{cat.category}</h4>
                      </div>
                      <ul className="space-y-1.5">
                        {cat.subjects.map((sub, j) => (
                          <li key={j} className="text-xs text-gray-600 leading-snug">{sub}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA Banner */}
            <section className="rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, var(--accent) 0%, #D04E18 100%)" }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
              <h2 className="text-2xl md:text-3xl font-black mb-2 relative z-10">Ready to Start Your Journey?</h2>
              <p className="text-white/80 text-sm mb-7 relative z-10">
                Take the first step towards your dream career in {program.name}
              </p>
              <div className="flex flex-wrap justify-center gap-3 relative z-10">
                <Link href="/contact"
                  className="px-7 py-3 rounded-xl font-bold text-[var(--accent)] bg-white text-sm hover:bg-white/90 active:scale-95 transition-all">
                  Apply Now
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="px-7 py-3 rounded-xl font-bold text-white bg-white/15 border border-white/30 text-sm hover:bg-white/25 active:scale-95 transition-all">
                  Download Brochure
                </a>
              </div>
            </section>
          </div>

          {/* Sidebar (1/3) */}
          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* Start Application */}
            <div className="rounded-2xl p-6 text-white text-center shadow-xl"
              style={{ background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" }}>
              <Briefcase size={28} className="mx-auto mb-3 opacity-70" />
              <h3 className="text-lg font-bold mb-1">Start Your Journey</h3>
              <p className="text-xs text-white/60 mb-5">Begin your academic career today</p>
              <Link href="/contact"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 active:scale-95 transition-all"
                style={{ background: "var(--accent)" }}>
                Start Application →
              </Link>
              <button
                onClick={() => {
                  const fees: FeeRow[] = safeJsonParse(program.fees, []);
                  const tuition = fees.filter((f: any) => f.type !== 'other');
                  const other = fees.filter((f: any) => f.type === 'other');
                  const url = `https://theeduwave.com/courses/${program.slug}`;
                  let text = `🏛️ ${program.university?.name || 'University'}\n🎓 ${program.name}\n\n`;
                  if (program.qualification || program.level) text += `🎓 Qualification: ${program.qualification || program.level}\n`;
                  if (program.englishReq) text += `💬 English requirement: ${program.englishReq}\n`;
                  if (program.duration) text += `⏳ Duration: ${program.duration}\n`;
                  text += '\n';
                  if (program.intake) text += `📅 Intake: ${program.intake}\n`;
                  if (program.classType || program.mode) text += `📚 Class Type: ${program.classType || program.mode}\n`;
                  if (tuition.length > 0) {
                    text += '\n💸 Tuition Fees:\n';
                    tuition.forEach((f: any) => { text += `- ${f.label}: ${f.amount}\n`; });
                  }
                  if (other.length > 0) {
                    text += '\n💰 Other Fees:\n';
                    other.forEach((f: any) => { text += `- ${f.label}: ${f.amount}\n`; });
                  }
                  text += `\n🔗 More details visit the link below:\n${url}`;
                  navigator.clipboard.writeText(text).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                  });
                }}
                className={`flex items-center justify-center gap-2 w-full py-3 mt-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Details</>}
              </button>
              <p className="text-xs text-white/40 mt-3">Free consultation available</p>
            </div>

            {/* Course Details */}
            <div className="card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Course Details</p>
              <div className="space-y-4">
                {program.university?.city && (
                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Campus</p>
                      <p className="text-sm font-semibold text-gray-800">{program.university.city}</p>
                    </div>
                  </div>
                )}
                {program.duration && (
                  <div className="flex items-start gap-3">
                    <Clock size={15} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="text-sm font-semibold text-gray-800">{program.duration}</p>
                    </div>
                  </div>
                )}
                {program.intake && (
                  <div className="flex items-start gap-3">
                    <Calendar size={15} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Intake</p>
                      <p className="text-sm font-semibold text-gray-800">{program.intake}</p>
                    </div>
                  </div>
                )}
                {(program.englishReq || program.language) && (
                  <div className="flex items-start gap-3">
                    <Globe size={15} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Language / English Req</p>
                      <p className="text-sm font-semibold text-gray-800">{program.englishReq || program.language}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Estimated Total Cost */}
            {totalFees > 0 && (
              <div className="rounded-2xl p-5 text-white"
                style={{ background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" }}>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Estimated Total Cost</p>
                <p className="text-3xl font-black mb-4" style={{ color: "var(--accent)" }}>
                  MYR {totalFees.toLocaleString()}
                </p>
                <div className="space-y-2 text-xs text-white/60">
                  {tuitionFees.length > 0 && (
                    <div className="flex justify-between">
                      <span>Tuition</span>
                      <span>{tuitionFees.reduce((s, f) => {
                        const n = parseFloat(String(f.amount).replace(/[^0-9.]/g, ""));
                        return s + (isNaN(n) ? 0 : n);
                      }, 0).toLocaleString()}</span>
                    </div>
                  )}
                  {otherFees.length > 0 && (
                    <div className="flex justify-between">
                      <span>Other Fees</span>
                      <span>{otherFees.reduce((s, f) => {
                        const n = parseFloat(String(f.amount).replace(/[^0-9.]/g, ""));
                        return s + (isNaN(n) ? 0 : n);
                      }, 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
