"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSiteStore } from "@/hooks/useStore";
import { useUniversities } from "@/hooks/useData";
import InquiryForm from "@/components/InquiryForm";
import { MapPin, Mail, Phone, Clock, MessageCircle, ExternalLink, Headphones } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

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

export default function ContactPage() {
  const { settings, fetchSettings } = useSiteStore();
  const { data: universities } = useUniversities();
  const heroAnim = useInView(0.1);
  const formAnim = useInView(0.1);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  return (
    <>

      {/* Hero */}
      <section
        ref={heroAnim.ref}
        className="dark-gradient-bg relative py-16 md:py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F1B3F 0%, #1A2B5F 40%, #2A3B6F 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/5 w-[300px] h-[300px] rounded-full bg-[var(--accent)]/[0.05] animate-float" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <div className={`transition-all duration-1000 ${heroAnim.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-4">
              <Headphones size={14} className="text-[var(--accent)]" />
              <span className="text-sm text-white/90">24/7 Virtual Counselling from Malaysia</span>
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-extrabold">Contact Us</h1>
            <p className="mt-4 text-blue-100/70 text-lg max-w-2xl mx-auto">
              Ready to take the first step? We are already here waiting for you. Reach out and one of our
              Malaysia-based counsellors will respond promptly with honest, practical guidance. No pressure.
              No obligation. Just real answers from people who genuinely want to help you succeed.
            </p>
          </div>
        </div>
      </section>

      <section ref={formAnim.ref} className="section bg-white -mt-8">
        <div className={`container-custom transition-all duration-800 ${formAnim.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card p-6 md:p-8">
                <h2 className="text-xl font-bold text-[var(--primary)] mb-2">
                  Send My Free Inquiry
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Fill out the form below and our team will get back to you promptly.
                </p>
                <InquiryForm
                  universities={universities?.map((u: any) => ({ name: u.name }))}
                />
              </div>
            </div>

            {/* Contact info sidebar */}
            <aside className="space-y-6">
              <div className="card p-6 space-y-5">
                <h3 className="text-lg font-bold text-[var(--primary)]">Get in Touch</h3>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">WhatsApp / Phone</p>
                    <a href="tel:+601124103692" className="text-sm text-[var(--accent)] font-semibold hover:underline">
                      +60112-4103692 (Malaysia, Primary)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <a href="mailto:ceo.eduwave@gmail.com" className="text-sm text-[var(--accent)] hover:underline">
                      ceo.eduwave@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Support Office</p>
                    <p className="text-sm text-gray-500">Akhteruzzaman Center (7th Floor), 21/22, Agrabad CIA, Chattogram, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Virtual Counselling</p>
                    <p className="text-sm text-gray-500">Available <strong>24/7</strong> from Malaysia via WhatsApp, Video Call, or Phone</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="card p-6 space-y-3">
                <h3 className="text-lg font-bold text-[var(--primary)] mb-1">Follow Us</h3>
                {[
                  { label: "Facebook", url: "https://www.facebook.com/EduwaveEducation", color: "text-blue-600" },
                  { label: "Instagram", url: "https://www.instagram.com/the_eduwave", color: "text-pink-600" },
                  { label: "YouTube", url: "https://youtube.com/@roamingwithnayem", color: "text-red-600" },
                ].map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--accent)] transition-colors">
                    <ExternalLink size={14} className={s.color} /> {s.label}
                  </a>
                ))}
                <div className="pt-2 border-t mt-2">
                  <a href="https://www.facebook.com/share/g/1CVAqVmT6D/" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-[var(--accent)] transition-colors">
                    🌟 Join our Facebook group: Bangladeshi Students in Malaysia
                  </a>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/601124103692"
                target="_blank"
                rel="noopener noreferrer"
                className="card p-6 flex items-center gap-4 bg-green-50 border-green-200
                         hover:bg-green-100 hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shrink-0
                              group-hover:scale-110 transition-transform">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-800">Chat on WhatsApp</p>
                  <p className="text-sm text-green-600">Available 24/7 from Malaysia</p>
                </div>
              </a>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
