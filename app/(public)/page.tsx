"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSiteSettings, useUniversities, useTestimonials } from "@/hooks/useData";
import UniversityCard from "@/components/UniversityCard";

import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import YouTubeSection from "@/components/YouTubeSection";
import type { CmsSection } from "@/types";
import { fetchCmsPage, alignClass } from "@/lib/cms-utils";
import {
  ArrowRight, MessageCircle, GraduationCap, Building2, Shield,
  Users, Clock, Headphones, Star, ChevronRight, Plane,
  FileCheck, Home, Award, HeartHandshake, Stethoscope,
  BookOpen, Globe, CheckCircle2, TrendingUp,
} from "lucide-react";

/* ─── Animated counter ─── */
function Counter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const numericPart = parseInt(target.replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || numericPart === 0) return;
    let start = 0;
    const step = Math.ceil(numericPart / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericPart) { setCount(numericPart); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [visible, numericPart]);

  return (
    <span ref={ref}>
      {visible ? count : 0}{suffix || target.replace(/[0-9]/g, "")}
    </span>
  );
}

/* ─── Service icon map ─── */
const serviceIcons: Record<string, any> = {
  GraduationCap, FileCheck, Shield, Plane, Home, HeartHandshake,
  Award, Stethoscope, BookOpen, Globe, Headphones, Users,
};



const fallbackTestimonials = [
  { id: "t1", name: "Tanvir Ahamed", photo: "/images/testimonials/TANVIR AHAMED.webp", university: "Asia Pacific University (APU)", program: "Master of Science in Cyber Security", quote: "I always wanted to pursue Cyber Security at a top university in Malaysia. Eduwave helped me choose APU and guided me through every step of the application and visa process. Their support was professional and genuine. I am now living my dream in Malaysia, and Eduwave made it possible.", rating: 5 },
  { id: "t2", name: "Sadia Afrin", photo: "/images/testimonials/Sadia Afrin.webp", university: "Asia Pacific University (APU)", program: "Master of Business Administration (MBA)", quote: "Eduwave gave me honest and accurate information about APU from the very beginning. The process was smooth and stress-free. I am grateful for their consistent support throughout my admission and visa journey. I confidently recommend Eduwave to anyone planning to study in Malaysia.", rating: 5 },
  { id: "t3", name: "Nayem Hossain", photo: "/images/testimonials/Naeem hossain.webp", university: "INTI International University and College", program: "BBA (American Transfer Programme)", quote: "Choosing the American Transfer Programme at INTI was one of the best decisions of my life, and Eduwave helped me make that decision with confidence. They explained the programme in full detail and handled my documentation with great care. A truly trustworthy consultancy.", rating: 5 },
  { id: "t4", name: "Rahaman Mashukur", photo: "/images/testimonials/Mashukur Rahman.webp", university: "UCSI University", program: "Bachelor of Arts (Hons) in Business Administration", quote: "I had many questions before applying to UCSI and Eduwave answered every single one patiently and honestly. From offer letter to visa approval, they were always there. I am now studying Business Administration at UCSI and could not be happier with my decision.", rating: 5 },
  { id: "t5", name: "Fasiha Ayman Ahmed", photo: "/images/testimonials/FASHA AYMAN AHMED.webp", university: "UCSI University", program: "Foundation in Science (Applied Sciences)", quote: "Eduwave guided me perfectly for my Foundation programme at UCSI. As a fresh student planning to study abroad for the first time, I was nervous, but the Eduwave team made the entire process simple and clear. I felt supported every step of the way.", rating: 5 },
  { id: "t6", name: "Anika Tahsin", photo: "/images/testimonials/Anika Tahsin.webp", university: "Taylor's University", program: "Master of Business Administration (MBA)", quote: "Taylor's University was my dream, and Eduwave turned that dream into reality. Their knowledge of Malaysian universities is impressive and their guidance was always accurate. My visa came through without any complications. Eduwave is the most reliable consultancy I have encountered.", rating: 5 },
  { id: "t7", name: "Mostafijur Rahaman", photo: "/images/testimonials/mostafijur rahman.webp", university: "City University Malaysia", program: "Doctor of Philosophy in Business Administration", quote: "Pursuing a PhD is a major commitment and I needed trustworthy guidance. Eduwave provided exactly that. They helped me prepare my research documents, understand the admission requirements, and complete my visa application smoothly. I am deeply grateful for their professional support.", rating: 5 },
  { id: "t8", name: "Shahriar Abrar", photo: "/images/testimonials/SHAHRIAR ABRAR.webp", university: "Unirazak University", program: "Diploma in Information Technology", quote: "Eduwave introduced me to Unirazak University, which I had not considered before. Their honest explanation of the programme and career prospects convinced me, and I have not regretted my decision at all. The visa process was fast and the team was always responsive.", rating: 5 },
  { id: "t9", name: "Sabikun Nahar Tafhim", photo: "/images/testimonials/Sabikun nahar tafhim.webp", university: "University of Malaya (UM)", program: "Master of Data Science", quote: "Getting into University of Malaya was not easy, but Eduwave guided me through the entire process with patience and expertise. They helped me prepare my documents to the highest standard. I am proud to be studying Data Science at one of Malaysia's top universities, and Eduwave deserves full credit for that.", rating: 5 },
  { id: "t10", name: "Sanjana Rashid Taiva", photo: "/images/testimonials/SANJANA RASHID TAIVA.webp", university: "International Islamic University Malaysia (IIUM)", program: "Master of Business Administration (MBA)", quote: "Eduwave was professional, honest, and efficient from day one. They understood my goals and recommended IIUM as the perfect fit. The entire admission and visa process was handled with great attention to detail. I am now studying at IIUM with full confidence, thanks to Eduwave.", rating: 5 },
  { id: "t11", name: "Sakibul Hoque Sadan", photo: "/images/testimonials/SAKIBUL HOQUE SADAN.webp", university: "Universiti Tun Hussein Onn Malaysia (UTHM)", program: "Master of Science in Technology Management", quote: "I chose Eduwave based on a recommendation from a friend, and I was not disappointed. The team was thorough, transparent, and very supportive throughout the process. My offer letter and visa were processed without any issues. Eduwave truly cares about the success of every student.", rating: 5 },
  { id: "t12", name: "Saad Islam Nehal", photo: "/images/testimonials/saad Islam nehal.webp", university: "University of Cyberjaya", program: "Diploma in Information Technology", quote: "Eduwave helped me understand everything about studying in Malaysia clearly and honestly. They recommended University of Cyberjaya based on my profile and budget, and it turned out to be the perfect choice. The application and visa process was smooth from start to finish. I am very thankful to the Eduwave team.", rating: 5 },
];

export default function HomePage() {
  const { data: settingsArr } = useSiteSettings();
  const { data: universities } = useUniversities("featured=true");
  const { data: testimonials } = useTestimonials();
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;


  // Build settings map
  const s: Record<string, string> = {};
  settingsArr?.forEach((c: any) => { s[c.key] = c.value; });

  // Unified CMS fetch — single lookup by ID
  const [cms, setCms] = useState<Record<string, CmsSection>>({});
  const [ytSection, setYtSection] = useState<CmsSection | null>(null);
  useEffect(() => {
    fetchCmsPage("home").then(({ byId }) => {
      setCms(byId);
      if (byId["home-youtube"]) setYtSection(byId["home-youtube"]);
    });
  }, []);
  const c = (id: string, field: string, fallback: string) => {
    const sec = cms[id];
    return sec && (sec as any)[field] ? (sec as any)[field] : fallback;
  };
  const cmsAlign = (id: string) => alignClass(cms[id]?.textAlign);

  // Services list from PDF
  const services = [
    { icon: "GraduationCap", title: "University Selection & Free Admission", desc: "Expert counsellors matched to your profile, goals, and budget. Complete application handling." },
    { icon: "FileCheck", title: "Document Preparation", desc: "We review, prepare, and organize every document — transcripts, letters, and supporting materials." },
    { icon: "Shield", title: "Bank Statement & Income Support", desc: "Detailed guidance on financial documentation that meets Malaysian immigration requirements." },
    { icon: "Award", title: "Visa Consultation & Application", desc: "Experienced team walks you through every requirement, reviews and submits correctly the first time." },
    { icon: "HeartHandshake", title: "Visa Interview Preparation", desc: "Mock sessions, likely questions coaching, and confidence building for a successful outcome." },
    { icon: "Plane", title: "Airport Pickup Service", desc: "Our Malaysia team receives you personally with assistance to your accommodation." },
    { icon: "Home", title: "Accommodation Arrangement", desc: "Safe, affordable, well-located housing sourced, verified, and arranged near your campus." },
    { icon: "Stethoscope", title: "Medical Check-Up Support", desc: "Guided to recognized clinics with appointment assistance for visa medical requirements." },
    { icon: "BookOpen", title: "University Registration", desc: "We personally accompany every student to their university on registration day." },
    { icon: "Users", title: "Ongoing Local Guardian Support", desc: "Your support system throughout your entire academic journey in Malaysia." },
    { icon: "Headphones", title: "24/7 Virtual Counselling", desc: "Expert guidance via video calls, WhatsApp, and phone — from Malaysia, around the clock." },
    { icon: "Globe", title: "International Study Programs", desc: "Beyond Malaysia: Australia, Canada, UK, Europe, USA, China, Japan, Korea, and more." },
  ];

  return (
    <>

      {/* ═══ HERO SECTION ═══ */}
      <section
        className="dark-gradient-bg relative min-h-[92vh] flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 40%, #2A3B6F 100%)" }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-white/[0.03] animate-float" />
          <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-[var(--accent)]/[0.05]" style={{ animation: "float 4s ease-in-out infinite reverse" }} />
          <div className="absolute top-1/2 right-1/6 w-[200px] h-[200px] rounded-full bg-white/[0.02]" style={{ animation: "float 5s ease-in-out infinite 1s" }} />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div data-anim="fade-up">
              {/* 24/7 badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-white/90 font-medium">Available 24/7 from Malaysia</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
                From Bangladesh to{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-[var(--accent)] to-[#F5A623] bg-clip-text text-transparent">
                    Global Universities
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[var(--accent)]/20 -skew-x-6 rounded" />
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-blue-100/70 leading-relaxed max-w-lg text-justify">
                {c("home-hero", "content", "Malaysia-based. Available 24/7. Completely Free. 350+ students successfully enrolled.")}
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/contact"
                  className="btn-primary text-base !px-8 !py-4 group"
                >
                  Start Your Journey Today
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://wa.me/601124103692"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-lg
                           border-2 border-white/20 text-white hover:bg-white/10
                           transition-all duration-300 active:scale-95"
                >
                  <MessageCircle size={18} /> WhatsApp Us
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-4 mt-8 text-sm text-blue-100/50">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-green-400" /> Zero Fees
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-green-400" /> 32+ Universities
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-green-400" /> Local Guardian
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="hidden lg:block" data-anim="slide-right" data-delay="0.3">
              <div className="relative">
                {/* Main hero card */}
                <div className="w-full aspect-square max-w-md mx-auto relative">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--accent)] to-[#D04E18] rotate-6 transform hover:rotate-3 transition-transform duration-700" />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--accent)] to-[#F5733B] flex items-center justify-center">
                    <GraduationCap size={120} className="text-white/80" strokeWidth={1.2} />
                  </div>
                </div>

                {/* Floating stat cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <TrendingUp size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Success Rate</p>
                      <p className="text-xl font-bold text-[var(--primary)]">98%</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-4" style={{ animation: "float 3s ease-in-out infinite 1.5s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Users size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Students Placed</p>
                      <p className="text-xl font-bold text-[var(--primary)]">350+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="relative -mt-12 z-20">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" data-anim-stagger="fade-up">
            {[
              { num: "350", suffix: "+", label: "Students Enrolled", icon: Users, color: "blue" },
              { num: "100000", suffix: "+", label: "Community Members", icon: Building2, color: "purple" },
              { num: "32", suffix: "+", label: "Partner Universities", icon: GraduationCap, color: "orange" },
              { num: "24", suffix: "/7", label: "Virtual Counselling", icon: Headphones, color: "green" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl
                         hover:-translate-y-1 transition-all duration-500"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <stat.icon size={28} className="mx-auto mb-2 text-[var(--accent)]" />
                <p className="text-3xl md:text-4xl font-extrabold text-[var(--primary)]">
                  <Counter target={stat.num} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTRO / WHO WE ARE ═══ */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className={`max-w-4xl mx-auto ${cmsAlign("home-intro")}`} data-anim="fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-semibold mb-4">
              {c("home-intro", "subtitle", "Who We Are")}
            </span>
            <h2 className="text-[var(--primary)] mb-6">{c("home-intro", "title", "Your Local Guardian in Malaysia")}</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {c("home-intro", "content", "Every great journey begins with a single, courageous decision. At Eduwave Educational Consultancy, we make sure that decision leads somewhere extraordinary. Founded in 2022 and operating directly from Malaysia, we are more than a consultancy. We are your local guardian on the ground, your guide through the process, and your strongest support system from the moment you reach out until long after you settle into student life.")}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ TOP PARTNERED UNIVERSITIES CAROUSEL — Continuous Infinite Scroll ═══ */}
      {universities && universities.length > 0 && (
        <section className="section bg-white overflow-hidden">
          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Infinite marquee track — logos duplicated for seamless loop */}
            <div className="logo-carousel-track" style={{ gap: '1.25rem' }}>
              {/* First set */}
              {universities.map((uni: any, i: number) => (
                <Link
                  key={`a-${uni.id}`}
                  href={`/universities/${uni.slug}`}
                  className="flex items-center justify-center shrink-0 w-36 h-24 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-lg hover:border-[var(--accent)]/30 transition-all duration-300 p-3 group"
                >
                  {uni.logo ? (
                    <Image src={uni.logo} alt={uni.name} width={100} height={60}
                      className="object-contain w-full h-full opacity-70 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: `hsl(${(i * 37) % 360}, 55%, 45%)` }}>
                        {(uni.shortName || uni.name).slice(0, 3)}
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500 text-center leading-tight max-w-[80px] truncate group-hover:text-[var(--primary)]">
                        {uni.shortName || uni.name}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
              {/* Duplicate set for seamless loop */}
              {universities.map((uni: any, i: number) => (
                <Link
                  key={`b-${uni.id}`}
                  href={`/universities/${uni.slug}`}
                  className="flex items-center justify-center shrink-0 w-36 h-24 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-lg hover:border-[var(--accent)]/30 transition-all duration-300 p-3 group"
                >
                  {uni.logo ? (
                    <Image src={uni.logo} alt={uni.name} width={100} height={60}
                      className="object-contain w-full h-full opacity-70 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: `hsl(${(i * 37) % 360}, 55%, 45%)` }}>
                        {(uni.shortName || uni.name).slice(0, 3)}
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500 text-center leading-tight max-w-[80px] truncate group-hover:text-[var(--primary)]">
                        {uni.shortName || uni.name}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ═══ SERVICES OVERVIEW (12 from PDF) ═══ */}
      <section className="section" style={{ background: "var(--muted)" }}>
        <div className="container-custom">
          <div className={`${cmsAlign("home-services")} mb-12`} data-anim="fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-semibold mb-4">
              {c("home-services", "subtitle", "100% Free Services")}
            </span>
            <h2 className="text-[var(--primary)]">{c("home-services", "title", "Everything We Do — At Zero Cost")}</h2>
            <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
              {c("home-services", "content", "No consultation fees. No processing fees. No hidden costs. Not ever. We are funded by our university partners, which means world-class support at zero cost to you.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" data-anim-stagger="fade-up">
            {services.map((svc, i) => {
              const Icon = serviceIcons[svc.icon] || GraduationCap;
              return (
                <div
                  key={svc.title}
                  className="group bg-white rounded-xl p-6 border border-gray-100 hover:border-[var(--accent)]/30
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center
                               group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300">
                    <Icon size={22} className="text-[var(--accent)] group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="mt-4 font-bold text-[var(--primary)] text-sm leading-snug">{svc.title}</h4>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">{svc.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Zero charge banner */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[#D04E18] text-white text-center" data-anim="zoom">
            <p className="text-lg font-bold">🎓 Every service above is 100% FREE for all students</p>
            <p className="text-sm text-white/80 mt-1">Eduwave has a full-time team based in Malaysia providing all services on the ground</p>
          </div>
        </div>
      </section>

      {/* ═══ YOUTUBE SECTION ═══ */}
      {ytSection && (
        <YouTubeSection
          title={ytSection.title}
          subtitle={ytSection.subtitle}
          content={ytSection.content}
          ctaText={ytSection.ctaText}
          ctaUrl={ytSection.ctaUrl}
          items={(ytSection.items ?? []).map(i => ({ id: i.id, title: i.title, linkUrl: i.linkUrl }))}
        />
      )}

      {/* ═══ FEATURED UNIVERSITIES ═══ */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className={`${cmsAlign("home-featured-unis")} mb-12`} data-anim="fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold mb-4">
              {c("home-featured-unis", "subtitle", "Our Partners")}
            </span>
            <h2 className="text-[var(--primary)]">{c("home-featured-unis", "title", "Featured Partner Universities")}</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
              {c("home-featured-unis", "content", "Explore our featured partner universities offering world-class education for Bangladeshi students.")}
            </p>
          </div>

          {universities && universities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-anim-stagger="fade-up">
              {universities.slice(0, 6).map((uni: any) => (
                <div key={uni.id}>
                  <UniversityCard university={uni} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Building2 size={48} className="mx-auto mb-4 opacity-30" />
              <p>Universities will appear here once the database is connected.</p>
            </div>
          )}

          <div className="text-center mt-10" data-anim="fade-up">
            <Link href="/universities" className="btn-secondary group">
              View All Universities <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SUCCESS STORIES ═══ */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className={`${cmsAlign("home-testimonials")} mb-12`} data-anim="fade-up">
            <h2 className="text-[var(--primary)] text-3xl md:text-4xl font-extrabold">
              {c("home-testimonials", "title", "Success Stories")}
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
              {c("home-testimonials", "content", "350+ students have trusted Eduwave for their study abroad journey. Here's what some of them have to say.")}
            </p>
          </div>

          {displayTestimonials.length > 0 && (
            <TestimonialsCarousel testimonials={displayTestimonials.slice(0, 12)} />
          )}
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="section bg-white">
        <div className="container-custom">
          <div
            className="dark-gradient-bg relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
            data-anim="zoom"
            style={{ background: "linear-gradient(135deg, #1A2B5F 0%, #0F1B3F 100%)" }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--accent)]/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {c("home-cta", "title", "Ready to Start Your Journey?")}
              </h2>
              <p className="text-blue-100/70 text-lg max-w-xl mx-auto mb-8">
                {c("home-cta", "content", "Reach out and one of our Malaysia-based counsellors will respond promptly with honest, practical guidance. No pressure. No obligation. Just real answers.")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={c("home-cta", "ctaUrl", "/contact")} className="btn-primary text-base !px-10 !py-4 group">
                  {c("home-cta", "ctaText", "Send My Free Inquiry")}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={c("home-cta", "ctaSecondaryUrl", "https://wa.me/601124103692")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-lg border-2 border-white/20
                           text-white font-semibold hover:bg-white/10 transition-all"
                >
                  <MessageCircle size={18} /> {c("home-cta", "ctaSecondaryText", "WhatsApp 24/7")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
