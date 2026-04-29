"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useTestimonials } from "@/hooks/useData";
import TestimonialCard from "@/components/TestimonialCard";
import { fetchCmsPage, alignClass } from "@/lib/cms-utils";
import type { CmsSection } from "@/types";
import {
  MapPin, Clock, Shield, Heart, ArrowRight, Users,
  GraduationCap, Globe, Star, ChevronLeft, ChevronRight as ChevronRightIcon,
  ExternalLink,
} from "lucide-react";

const LinkedinIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function AboutPage() {
  const { data: testimonials } = useTestimonials();

  // Unified CMS fetch for all about page sections
  const [cms, setCms] = useState<Record<string, CmsSection>>({});
  const [leadershipItems, setLeadershipItems] = useState<any[]>([]);
  useEffect(() => {
    fetchCmsPage("about").then(({ byId }) => {
      setCms(byId);
      if (byId["about-team"]?.items) setLeadershipItems(byId["about-team"].items);
    });
  }, []);
  const c = (id: string, field: string, fallback: string) => {
    const sec = cms[id];
    return sec && (sec as any)[field] ? (sec as any)[field] : fallback;
  };
  const cmsAlign = (id: string) => alignClass(cms[id]?.textAlign);

  const differences = [
    { icon: MapPin, title: "Malaysia-Based, Not Remote", desc: "We operate directly from Malaysia. No middlemen. No delays. Your application is handled by a team that lives and works in the country you are going to." },
    { icon: Clock, title: "24/7 Virtual Counselling", desc: "Our counsellors are available around the clock through virtual sessions — from Malaysia. Whether you are in Dhaka or Sylhet, expert guidance is always one call away." },
    { icon: Heart, title: "Your Local Guardian", desc: "After you arrive in Malaysia, we do not disappear. We remain your point of contact, your problem-solver, and your support system throughout your studies." },
    { icon: Shield, title: "Zero Charges, Always", desc: "Every single service we provide is completely free of charge. No consultation fees, no processing fees, no hidden costs. Education is a right, and our help should be too." },
  ];

  // Hardcoded leadership fallback
  const defaultLeaders = [
    { id: "t1", title: "Md. Nayem Uddin", subtitle: "Founder & Managing Director", initials: "MN", gradient: "from-[var(--accent)] to-[#F5733B]", content: "Nayem Uddin, Founder and Managing Director of Eduwave Educational Consultancy, brings hands on experience built through years of direct involvement in international student recruitment and university admissions across Malaysia. A graduate of Lincoln University College Malaysia with a Bachelor of Information Technology, he combines strong academic knowledge with practical understanding of the challenges Bangladeshi students face when studying abroad. Since founding Eduwave, Nayem has developed the consultancy into a trusted name in Malaysian education services, building partnerships with leading universities and personally guiding the successful placement of more than 350 students. His approach focuses on complete end to end support, including university selection, application processing, visa documentation, EMGS activation, accommodation guidance, and post arrival assistance, all provided with zero consultancy fees. What makes him unique is his strong connection with the student community he serves. As the administrator of the Bangladeshi Students in Malaysia Facebook group with over 13,000 active members, Nayem created one of the most important digital platforms for Bangladeshi students in Malaysia, a space where students share experiences, find guidance, and support one another. This initiative reflects his understanding that student success extends beyond placement. It includes community, access to information, and genuine human support." },
    { id: "t2", title: "Md. Nazim Uddin, PhD", subtitle: "General Manager", initials: "MN", gradient: "from-[var(--primary-light)] to-[var(--primary)]", content: "Nazim Uddin serves as General Manager at Eduwave Educational Consultancy, bringing over a decade of experience in the education sector along with an MBA and a PhD to his role. His academic foundation, combined with specialized training in counseling, coaching, and student motivation, gives him a deep and practical understanding of the challenges students face when pursuing education abroad. At Eduwave, Nazim plays a central role in guiding students through every stage of their academic journey, from initial counseling to university placement. His approach is grounded in empathy, patience, and genuine commitment to student success, qualities that have earned him strong trust among both students and university partners alike. Beyond his advisory work, Nazim has contributed to the broader education community through articles and research on student engagement, educational technology, and teacher development, and has presented his work at academic forums. His communication skills and collaborative mindset make him a key bridge between Eduwave and its growing network of partner universities. His leadership style reflects a belief that good education consulting is not about transactions. It is about truly understanding each student's potential, their family's concerns, and their long term goals, and then doing everything possible to help them succeed." },
  ];

  // Merge CMS image data into leadership
  const leaders = defaultLeaders.map((leader, i) => {
    const cmsItem = leadershipItems[i];
    return {
      ...leader,
      imageUrl: cmsItem?.imageUrl || cmsItem?.image || "",
      title: cmsItem?.title || leader.title,
      subtitle: cmsItem?.subtitle || leader.subtitle,
      content: cmsItem?.content || leader.content,
      linkUrl: cmsItem?.linkUrl || "",
    };
  });

  // ── Leadership Carousel State ──
  const [currentLeader, setCurrentLeader] = useState(0);

  const goTo = useCallback((idx: number) => {
    setCurrentLeader(idx);
  }, []);

  const prev = () => goTo(currentLeader === 0 ? leaders.length - 1 : currentLeader - 1);
  const next = () => goTo(currentLeader === leaders.length - 1 ? 0 : currentLeader + 1);

  // Auto-advance every 8 seconds
  useEffect(() => {
    if (leaders.length <= 1) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [currentLeader, leaders.length]);

  return (
    <>
      {/* Hero */}
      <section
        className="dark-gradient-bg relative py-20 md:py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 40%, #2A3B6F 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-white/[0.03] animate-float" />
          <div className="absolute bottom-1/3 left-1/4 w-[250px] h-[250px] rounded-full bg-[var(--accent)]/[0.05]" style={{ animation: "float 5s ease-in-out infinite reverse" }} />
        </div>
        <div className={`container-custom relative z-10 ${cmsAlign("about-hero")}`} data-anim="fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[var(--accent)] text-sm font-semibold mb-4">
            {c("about-hero", "subtitle", "About Eduwave")}
          </span>
          <h1 className="text-white text-4xl md:text-5xl font-extrabold">{c("about-hero", "title", "We Are More Than a Consultancy")}</h1>
          <p className="mt-4 text-blue-100/70 text-lg max-w-2xl mx-auto">
            {c("about-hero", "content", "We are your local guardian in Malaysia — from the moment you reach out until long after you settle into student life.")}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto" data-anim="fade-up">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold mb-3">{c("about-story", "subtitle", "Est. 2022")}</span>
                <h2 className="text-[var(--primary)] mb-6">{c("about-story", "title", "Our Story")}</h2>
                <p className="text-gray-600 leading-relaxed mb-4 text-justify">
                  Eduwave Educational Consultancy was born from a belief that every Bangladeshi student deserves
                  access to world-class education, completely honest guidance, and real support from people who
                  actually know what they are talking about.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4 text-justify">
                  We are not a website. We are not a phone number. We are a team based right here in Malaysia,
                  processing your admission, handling your visa, and standing beside you when you land at KLIA.
                </p>
                <p className="text-gray-600 leading-relaxed text-justify">
                  Since 2022, Eduwave has grown into one of the most recognized and trusted names in Malaysian
                  education consultancy for Bangladeshi students. We work directly with over 32 top Malaysian
                  universities, offering a fully end-to-end service that costs our students absolutely nothing.
                  Not a single ringgit. Not a single taka.
                </p>
              </div>
              <div className="space-y-4" data-anim-stagger="slide-right">
                {[
                  { num: "350+", label: "Students Enrolled", icon: Users },
                  { num: "32+", label: "Partner Universities", icon: GraduationCap },
                  { num: "100%", label: "Free Service", icon: Shield },
                  { num: "24/7", label: "Virtual Counselling", icon: Clock },
                ].map((item) => (
                  <div key={item.label}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-500"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                      <item.icon size={22} className="text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-[var(--primary)]">{item.num}</p>
                      <p className="text-sm text-gray-500">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" style={{ background: "var(--muted)" }}>
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" data-anim-stagger="fade-up">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-700">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mb-5">
                <Globe size={28} className="text-[var(--primary)]" />
              </div>
              <h3 className="text-[var(--primary)] text-xl mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-sm text-justify">
                To make high-quality international education genuinely accessible to every Bangladeshi student,
                by providing expert, honest, and completely free consultancy services from our base in Malaysia.
                We handle the complexity so our students can focus on what matters: building their future. From
                university selection to visa approval and beyond, we are the consistent, reliable presence that
                students deserve but rarely find.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-700">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-5">
                <Star size={28} className="text-[var(--accent)]" />
              </div>
              <h3 className="text-[var(--primary)] text-xl mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-sm text-justify">
                We envision a Bangladesh where geography is never a barrier to greatness. Where a student from
                Chittagong, Sylhet, or Rangpur has the same shot at a world-class education as anyone else, simply
                because they had access to the right guidance at the right time. Eduwave aims to become the most
                impactful and most trusted Bangladeshi student consultancy in Malaysia, recognized not for how
                large we have grown, but for how many lives we have genuinely transformed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className={`${cmsAlign("about-diff")} mb-12`} data-anim="fade-up">
            <h2 className="text-[var(--primary)]">{c("about-diff", "title", "Why We Are Different")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto" data-anim-stagger="fade-up">
            {differences.map((d) => (
              <div
                key={d.title}
                className="text-center p-6 rounded-2xl border border-gray-100 hover:border-[var(--accent)]/30
                         hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5
                             flex items-center justify-center mx-auto mb-4">
                  <d.icon size={28} className="text-[var(--accent)]" />
                </div>
                <h4 className="font-bold text-[var(--primary)] text-sm mb-2">{d.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership Carousel ── */}
      <section className="dark-gradient-bg section" style={{ background: "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 100%)" }}>
        <div className="container-custom">
          <div className={`${cmsAlign("about-team")} mb-12`} data-anim="fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[var(--accent)] text-sm font-semibold mb-4">
              {c("about-team", "subtitle", "Our Leadership")}
            </span>
            <h2 className="text-white">{c("about-team", "title", "Built by People Who Lived the Journey")}</h2>
            <p className="mt-4 text-blue-100/60 max-w-2xl mx-auto">
              {c("about-team", "content", "Eduwave was not built in a boardroom. It was built by people who lived the journey, understood the struggle, and decided to do something about it.")}
            </p>
          </div>

          {/* Carousel */}
          <div className="relative max-w-3xl mx-auto" data-anim="fade-up">
            {/* Navigation Arrows */}
            {leaders.length > 1 && (
              <>
                <button onClick={prev} aria-label="Previous leader"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
                  <ChevronLeft size={22} />
                </button>
                <button onClick={next} aria-label="Next leader"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all duration-300 hover:scale-110">
                  <ChevronRightIcon size={22} />
                </button>
              </>
            )}

            {/* Slide */}
            <div className="overflow-hidden rounded-2xl">
              {leaders.map((leader, idx) => (
                <div
                  key={leader.id}
                  className={`transition-all duration-700 ease-in-out ${idx === currentLeader ? "block animate-carousel-in" : "hidden"}`}
                >
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 md:p-10">
                    {/* Photo LEFT + Name/Designation/LinkedIn RIGHT */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                      {/* Photo - Left */}
                      {leader.imageUrl ? (
                        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/20 shrink-0 shadow-2xl">
                          <img src={leader.imageUrl} alt={leader.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br ${leader.gradient} flex items-center justify-center text-white text-5xl font-bold shrink-0 shadow-2xl`}>
                          {leader.initials}
                        </div>
                      )}
                      {/* Name, Designation, LinkedIn - Right */}
                      <div className="text-center md:text-left flex-1">
                        <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight">{leader.title}</h3>
                        <p className="text-[var(--accent)] text-base font-semibold mt-2">{leader.subtitle}</p>
                        {leader.linkUrl && (
                          <a href={leader.linkUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-300 border border-white/10">
                            <LinkedinIcon size={16} className="text-[#0A66C2]" />
                            LinkedIn Profile
                            <ExternalLink size={12} className="text-white/50" />
                          </a>
                        )}
                      </div>
                    </div>
                    {/* Bio - Full width below */}
                    <p className="text-blue-100/70 text-sm leading-relaxed text-justify max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                      {leader.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            {leaders.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                {leaders.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    aria-label={`Go to leader ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentLeader
                        ? "w-8 h-3 bg-[var(--accent)]"
                        : "w-3 h-3 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Counter */}
            {leaders.length > 1 && (
              <p className="text-center text-xs text-blue-100/40 mt-3">
                {currentLeader + 1} / {leaders.length}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="section bg-white">
          <div className="container-custom">
            <div className="text-center mb-12" data-anim="fade-up">
              <h2 className="text-[var(--primary)]">Words From Our Students</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-anim-stagger="fade-up">
              {testimonials.slice(0, 6).map((t: any) => (
                <div key={t.id}>
                  <TestimonialCard testimonial={t} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[var(--accent)] to-[#D04E18]">
        <div className="container-custom text-center">
          <h2 className="text-white text-3xl font-extrabold mb-4">{c("about-cta", "title", "Ready to Start Your Journey?")}</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            {c("about-cta", "content", "Get in touch with our Malaysia-based team today. Free, honest guidance — 24/7.")}
          </p>
          <Link href={c("about-cta", "ctaUrl", "/contact")} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--accent)] font-bold rounded-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {c("about-cta", "ctaText", "Contact Us Now")} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Carousel animation */}
      <style jsx>{`
        @keyframes carousel-in {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-carousel-in { animation: carousel-in 0.6s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>
    </>
  );
}
