"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTestimonials } from "@/hooks/useData";
import TestimonialCard from "@/components/TestimonialCard";
import { fetchCmsPage, alignClass } from "@/lib/cms-utils";
import type { CmsSection } from "@/types";
import {
  MapPin, Clock, Shield, Heart, ArrowRight, Users,
  GraduationCap, Globe, Award, Star,
} from "lucide-react";

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
    { id: "t1", title: "Md. Nayem Uddin", subtitle: "Founder & Managing Director", initials: "MN", gradient: "from-[var(--accent)] to-[#F5733B]", content: "As the Founder and Managing Director, Md. Nayem Uddin has turned a deeply personal understanding of what Bangladeshi students face into a company that has guided over 350+ students to universities across Malaysia. Currently pursuing his Master\u2019s of Information Technology in Malaysia, Nayem brings academic depth, real-world expertise, and an unshakeable commitment to transparency. He is also the heartbeat behind one of the largest Bangladeshi student communities in Malaysia." },
    { id: "t2", title: "Md. Nazim Uddin, PhD", subtitle: "General Manager", initials: "MN", gradient: "from-[var(--primary-light)] to-[var(--primary)]", content: "Md. Nazim Uddin serves as General Manager with a PhD and specialized expertise in counselling, student motivation, and visa processing. With over a decade of experience in education, he is the operational backbone of Eduwave. Dr. Nazim has a rare combination of deep expertise and genuine empathy — making complex processes feel simple and anxious students feel heard. Every case is a personal responsibility." },
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
    };
  });

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

      {/* Leadership — uses CMS photos with fallback to initials */}
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

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" data-anim-stagger="fade-up">
            {leaders.map((leader) => (
              <div key={leader.id}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500">
                {/* Show uploaded photo or fallback to initials circle */}
                {leader.imageUrl ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-5 border-2 border-white/20">
                    {/* Use native img — Next.js Image fails on dynamically uploaded CMS paths */}
                    <img src={leader.imageUrl} alt={leader.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${leader.gradient} flex items-center justify-center mb-5 text-white text-2xl font-bold`}>
                    {leader.initials}
                  </div>
                )}
                <h3 className="text-white text-xl font-bold">{leader.title}</h3>
                <p className="text-[var(--accent)] text-sm font-semibold mb-4">{leader.subtitle}</p>
                <p className="text-blue-100/70 text-sm leading-relaxed text-justify">{leader.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — FIX: uses data-anim-stagger instead of broken useInView */}
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
    </>
  );
}
