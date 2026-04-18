"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  GraduationCap, FileCheck, Shield, Plane, Home, HeartHandshake,
  Award, Stethoscope, BookOpen, Globe, Headphones, Users,
  ArrowRight, CheckCircle2, MapPin, Clock, Star, MessageCircle,
} from "lucide-react";

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

const services = [
  {
    icon: GraduationCap,
    title: "University Selection & Free Admission Processing",
    desc: "Choosing the wrong university can cost you years. Our expert counsellors take the time to understand your academic profile, financial capacity, career goals, and personal preferences before recommending a shortlist perfectly matched to you. Once you decide, we handle your entire application process directly with our partner universities.",
  },
  {
    icon: FileCheck,
    title: "Document Preparation and Support",
    desc: "A rejected application is almost always a documentation problem. Our team reviews, prepares, and organizes every document required — transcripts, recommendation letters, and all supporting materials — ensuring everything meets university requirements before a single page is submitted.",
  },
  {
    icon: Shield,
    title: "Bank Statement & Income Source Preparation",
    desc: "Financial documentation is one of the most common reasons applications and visas are delayed or rejected. Eduwave provides detailed guidance on preparing bank statements and income documentation that meets Malaysian immigration requirements and builds visa officer confidence.",
  },
  {
    icon: Award,
    title: "Visa Consultation and Application Assistance",
    desc: "Malaysia's student visa process is precise. Our experienced visa team walks you through every requirement, reviews your documentation, prepares your visa application, and submits it correctly the first time. We keep you updated at every stage.",
  },
  {
    icon: HeartHandshake,
    title: "Visa Interview Support",
    desc: "If your university or visa process requires an interview, we make sure you are fully prepared. We conduct mock sessions, coach you on likely questions, and build your confidence so you walk in ready and walk out successful.",
  },
  {
    icon: Plane,
    title: "Airport Pickup Service",
    desc: "Arriving in a new country alone is one of the most overwhelming moments in a student's journey. Eduwave's team in Malaysia will be at the airport to receive you personally, with a personalized sign and assistance to your accommodation.",
  },
  {
    icon: Home,
    title: "Accommodation Arrangement and Management",
    desc: "Finding safe, affordable, well-located housing near your university requires local knowledge most students simply do not have. We source, verify, and arrange accommodation that matches your budget and preferences, and review rental agreements so you are never caught off guard.",
  },
  {
    icon: Stethoscope,
    title: "Medical Check-Up Support",
    desc: "International students in Malaysia must complete a medical examination as part of the visa process. Our team guides you to recognized clinics, explains the process, assists with appointments, and ensures this step is completed smoothly.",
  },
  {
    icon: BookOpen,
    title: "University Registration Accompaniment",
    desc: "We personally accompany every Eduwave student to their university on registration day. You will not be navigating an unfamiliar campus in a foreign country alone on one of the most important days of your academic life. Our team is physically there with you.",
  },
  {
    icon: Users,
    title: "Ongoing Local Guardian Support in Malaysia",
    desc: "Long after your visa is approved and bags are unpacked, we remain your local guardian in Malaysia. Need help with a university issue? Call us. Confused about accommodation, banking, or local logistics? We are here. Our dedicated team is committed to supporting every Eduwave student throughout their entire academic journey.",
  },
  {
    icon: Headphones,
    title: "24/7 Virtual Counselling from Malaysia",
    desc: "No matter where you are in Bangladesh, expert guidance from our Malaysia-based team is always available. Our counsellors provide virtual consultation sessions around the clock through video calls, WhatsApp, and phone. You get the same quality of guidance that students receive in person, delivered directly to you, any time you need it.",
  },
  {
    icon: Globe,
    title: "International Study Programs",
    desc: "Malaysia is one of the world's best study destinations, but Eduwave's reach goes further. We also facilitate admissions to universities in Australia, Canada, the United Kingdom, Europe, the USA, China, Japan, Korea, and beyond. If your dream university is outside Malaysia, our networks and expertise will help you reach it.",
  },
];

export default function ServicesPage() {
  const heroAnim = useInView(0.1);
  const introAnim = useInView(0.1);
  const gridAnim = useInView(0.05);
  const bannerAnim = useInView(0.1);
  const teamAnim = useInView(0.1);
  const ctaAnim = useInView(0.1);

  return (
    <>
      {/* Hero */}
      <section
        ref={heroAnim.ref}
        className="relative py-20 md:py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 40%, #2A3B6F 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent)]/[0.05] animate-float" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <div className={`transition-all duration-1000 ${heroAnim.visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[var(--accent)] text-sm font-semibold mb-4">
              100% Free of Charge
            </span>
            <h1 className="text-white text-4xl md:text-5xl font-extrabold">Our Complimentary Services</h1>
            <p className="mt-4 text-blue-100/70 text-lg max-w-2xl mx-auto">
              Most consultancies complete the paperwork and call it a day. We are built differently.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section ref={introAnim.ref} className="section bg-white">
        <div className="container-custom">
          <div className={`max-w-3xl mx-auto text-center transition-all duration-800 ${introAnim.visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}>
            <p className="text-gray-600 text-lg leading-relaxed">
              At Eduwave Educational Consultancy, we do not simply process your application and consider our
              responsibility finished. We act as your <strong className="text-[var(--primary)]">local guardian in Malaysia</strong>.
              From the moment you first reach out to the day you settle comfortably into your student life, our
              dedicated team on the ground in Malaysia is with you at every single step.
            </p>

            {/* Zero cost callout */}
            <div className="mt-8 p-6 rounded-2xl border-2 border-[var(--accent)]/20 bg-[var(--accent)]/5">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Shield size={24} className="text-[var(--accent)]" />
                <span className="text-lg font-bold text-[var(--primary)]">ZERO COST GUARANTEE</span>
              </div>
              <p className="text-sm text-gray-600">
                Every service listed below is provided <strong>completely free of charge</strong>. No consultation fees.
                No processing fees. No hidden costs. Not ever. We are funded by our university partners, which means
                you receive world-class consultancy support at zero cost to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={gridAnim.ref} className="section" style={{ background: "var(--muted)" }}>
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {services.map((svc, i) => (
              <div
                key={svc.title}
                className={`group bg-white rounded-2xl p-7 border border-gray-100 hover:border-[var(--accent)]/30
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-500
                         ${gridAnim.visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0
                               group-hover:bg-[var(--accent)] transition-all duration-300">
                    <svc.icon size={24} className="text-[var(--accent)] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--primary)] text-base mb-2 leading-snug">{svc.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated Team Banner */}
      <section ref={teamAnim.ref} className="section bg-white">
        <div className="container-custom">
          <div
            className={`max-w-4xl mx-auto rounded-3xl p-8 md:p-12 overflow-hidden relative
                      transition-all duration-800 ${teamAnim.visible ? "opacity-100 scale-100" : "opacity-100 scale-100"}`}
            style={{ background: "linear-gradient(135deg, #1A2B5F 0%, #0F1B3F 100%)" }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[var(--accent)]/10 -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center mb-5">
                  <MapPin size={32} className="text-[var(--accent)]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Our Dedicated Team in Malaysia</h3>
                <p className="text-blue-100/70 leading-relaxed">
                  Eduwave has a full-time team based in Malaysia providing all of the above services on the ground.
                  When you arrive, you are not relying on a remote office or a phone number. You have real people,
                  in your country of study, ready to support you in person.
                </p>
                <p className="mt-4 text-[var(--accent)] font-bold text-lg">This is the Eduwave difference.</p>
              </div>
              <div className="space-y-3">
                {[
                  "Real team, physically in Malaysia",
                  "Airport pickup for every student",
                  "Accompaniment to university registration",
                  "Local housing arrangement assistance",
                  "24/7 counselling via WhatsApp & video",
                  "Ongoing support throughout your studies",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                    <span className="text-sm text-blue-100/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaAnim.ref} className="py-16 bg-gradient-to-r from-[var(--accent)] to-[#D04E18]">
        <div className="container-custom text-center">
          <div className={`transition-all duration-800 ${ctaAnim.visible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}>
            <h2 className="text-white text-3xl font-extrabold mb-4">All These Services. Zero Cost. Always.</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Ready to take the first step? Reach out and get free, honest guidance from our Malaysia-based team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--accent)] font-bold rounded-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                Send My Free Inquiry <ArrowRight size={18} />
              </Link>
              <a href="https://wa.me/601124103692" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
                <MessageCircle size={18} /> WhatsApp 24/7
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
