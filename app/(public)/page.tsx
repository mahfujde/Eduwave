"use client";


import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSiteSettings, useUniversities, useTestimonials } from "@/hooks/useData";
import UniversityCard from "@/components/UniversityCard";
import TestimonialCard from "@/components/TestimonialCard";
import YouTubeSection from "@/components/YouTubeSection";
import type { CmsSection } from "@/types";
import {
  ArrowRight, MessageCircle, GraduationCap, Building2, Shield,
  Users, Clock, Headphones, Star, ChevronRight, Plane,
  FileCheck, Home, Award, HeartHandshake, Stethoscope,
  BookOpen, Globe, CheckCircle2, TrendingUp,
} from "lucide-react";

/* ─── Scroll-triggered animation hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const numericPart = parseInt(target.replace(/[^0-9]/g, "")) || 0;
  const { ref, visible } = useInView();

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

function TestimonialsExpander({ testimonials }: { testimonials: any[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mt-8">
      {!expanded ? (
        <div className="text-center">
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white border-2 border-white/20 hover:bg-white/10 transition-all active:scale-95"
          >
            See More Reviews ({testimonials.length}+) <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {testimonials.map((t: any) => (
            <div key={t.id} className="anim-hidden">
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

  const heroAnim = useInView(0.1);
  const statsAnim = useInView(0.2);
  const introAnim = useInView(0.15);
  const uniAnim = useInView(0.1);
  const servicesAnim = useInView(0.1);
  const testimonialsAnim = useInView(0.1);
  const ctaAnim = useInView(0.15);

  // Fetch YouTube section from CMS
  const [ytSection, setYtSection] = useState<CmsSection | null>(null);
  useEffect(() => {
    fetch("/api/public/pages?slug=home")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.sections) {
          try {
            const sections: CmsSection[] = JSON.parse(d.data.sections);
            const yt = sections.find(sec => sec.type === "youtube" && sec.visible);
            if (yt) setYtSection(yt);
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

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
        ref={heroAnim.ref}
        className="relative min-h-[92vh] flex items-center overflow-hidden"
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
            <div className={`transition-all duration-1000 ${heroAnim.visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}>
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

              <p className="mt-6 text-lg md:text-xl text-blue-100/70 leading-relaxed max-w-lg">
                Malaysia-based. Available 24/7. Completely Free. <br className="hidden md:block" />
                350+ students successfully enrolled.
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
            <div className={`hidden lg:block transition-all duration-1000 delay-300 ${heroAnim.visible ? "opacity-100 translate-x-0" : "opacity-100 translate-x-0"}`}>
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
      <section ref={statsAnim.ref} className="relative -mt-12 z-20">
        <div className="container-custom">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-all duration-800 ${statsAnim.visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}>
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

      {/* ═══ TOP PARTNERED UNIVERSITIES CAROUSEL ═══ */}
      {universities && universities.length > 0 && (
        <section className="section bg-white overflow-hidden">
          <div className="container-custom">
            <div className="text-center mb-10 anim-hidden">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold mb-4">
                Trusted Partners
              </span>
              <h2 className="text-[var(--primary)]">Top Partnered Universities</h2>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
                We have direct partnerships with Malaysia&apos;s finest universities, ensuring seamless admission for our students.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
            <div className="logo-carousel-track">
              {[...universities, ...universities].map((uni: any, i: number) => (
                <Link
                  key={`${uni.id}-${i}`}
                  href={`/universities/${uni.slug}`}
                  className="flex items-center justify-center mx-6 shrink-0 w-32 h-20 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-lg hover:border-[var(--accent)]/30 transition-all duration-300 p-3 group"
                >
                  {uni.logo ? (
                    <Image
                      src={uni.logo}
                      alt={uni.name}
                      width={100}
                      height={60}
                      className="object-contain w-full h-full opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-400 text-center leading-tight group-hover:text-[var(--primary)]">
                      {uni.shortName || uni.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ INTRO SECTION ═══ */}
      <section ref={introAnim.ref} className="section bg-white">
        <div className="container-custom">
          <div className={`max-w-3xl mx-auto text-center transition-all duration-800 ${introAnim.visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-semibold mb-4">
              Who We Are
            </span>
            <h2 className="text-[var(--primary)]">Your Local Guardian in Malaysia</h2>
            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              Every great journey begins with a single, courageous decision. At Eduwave Educational Consultancy,
              we make sure that decision leads somewhere extraordinary. Founded in 2022 and operating directly
              from Malaysia, we are more than a consultancy. We are your local guardian on the ground, your guide
              through the process, and your strongest support system from the moment you reach out until long
              after you settle into student life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/about" className="btn-primary">
                Learn About Us <ChevronRight size={16} />
              </Link>
              <Link href="/services" className="btn-secondary">
                Our Free Services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES OVERVIEW (12 from PDF) ═══ */}
      <section ref={servicesAnim.ref} className="section" style={{ background: "var(--muted)" }}>
        <div className="container-custom">
          <div className={`text-center mb-12 transition-all duration-700 ${servicesAnim.visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-semibold mb-4">
              100% Free Services
            </span>
            <h2 className="text-[var(--primary)]">Everything We Do — At Zero Cost</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              No consultation fees. No processing fees. No hidden costs. Not ever.
              We are funded by our university partners, which means world-class support at zero cost to you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.map((svc, i) => {
              const Icon = serviceIcons[svc.icon] || GraduationCap;
              return (
                <div
                  key={svc.title}
                  className={`group bg-white rounded-xl p-6 border border-gray-100 hover:border-[var(--accent)]/30
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-500
                           ${servicesAnim.visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
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
          <div className={`mt-10 p-6 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[#D04E18] text-white text-center
                        transition-all duration-700 delay-300 ${servicesAnim.visible ? "opacity-100 scale-100" : "opacity-100 scale-100"}`}>
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
      <section ref={uniAnim.ref} className="section bg-white">
        <div className="container-custom">
          <div className={`text-center mb-12 transition-all duration-700 ${uniAnim.visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold mb-4">
              Our Partners
            </span>
            <h2 className="text-[var(--primary)]">32+ Partner Universities</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We have carefully built direct partnerships with some of Malaysia&apos;s finest universities.
              Every institution has been evaluated for academic quality, career outcomes, and suitability
              for Bangladeshi students.
            </p>
          </div>

          {universities && universities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.slice(0, 6).map((uni: any, i: number) => (
                <div
                  key={uni.id}
                  className={`transition-all duration-600 ${uniAnim.visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
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

          <div className="text-center mt-10">
            <Link href="/universities" className="btn-secondary group">
              View All Universities <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section
        ref={testimonialsAnim.ref}
        className="section"
        style={{ background: "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 100%)" }}
      >
        <div className="container-custom">
          <div className="text-center mb-12 anim-hidden">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[var(--accent)] text-sm font-semibold mb-4">
              Student Stories
            </span>
            <h2 className="text-white">What Our Students Say</h2>
            <p className="mt-4 text-blue-100/60 max-w-xl mx-auto">
              350+ students have trusted Eduwave for their study abroad journey. Here&apos;s what some of them have to say.
            </p>
          </div>

          {displayTestimonials.length > 0 && (
            <>
              {/* Horizontal carousel - 4 cards */}
              <div className="testimonial-carousel pb-4">
                {displayTestimonials.slice(0, 4).map((t: any) => (
                  <div key={t.id} className="anim-hidden">
                    <TestimonialCard testimonial={t} />
                  </div>
                ))}
              </div>

              {/* See More - expands to full grid */}
              {displayTestimonials.length > 4 && (
                <TestimonialsExpander testimonials={displayTestimonials.slice(4)} />
              )}
            </>
          )}
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section ref={ctaAnim.ref} className="section bg-white">
        <div className="container-custom">
          <div
            className={`relative overflow-hidden rounded-3xl p-10 md:p-16 text-center
                      transition-all duration-1000 ${ctaAnim.visible ? "opacity-100 scale-100" : "opacity-100 scale-100"}`}
            style={{ background: "linear-gradient(135deg, #1A2B5F 0%, #0F1B3F 100%)" }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--accent)]/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-blue-100/70 text-lg max-w-xl mx-auto mb-8">
                Reach out and one of our Malaysia-based counsellors will respond promptly with honest, practical guidance.
                No pressure. No obligation. Just real answers.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary text-base !px-10 !py-4 group">
                  Send My Free Inquiry
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://wa.me/601124103692"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-lg border-2 border-white/20
                           text-white font-semibold hover:bg-white/10 transition-all"
                >
                  <MessageCircle size={18} /> WhatsApp 24/7
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
