"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteStore } from "@/hooks/useStore";
import {
  MapPin, Mail, Phone, ArrowUpRight, ExternalLink,
  Search, UserPlus, Handshake,
} from "lucide-react";

const FbIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const IgIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const YtIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/></svg>;
const LiIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;

const QUICK_LINKS = [
  { label: "Home",            href: "/" },
  { label: "Universities",    href: "/universities" },
  { label: "Courses",         href: "/courses" },
  { label: "Services",        href: "/services" },
  { label: "About Us",        href: "/about" },
  { label: "Blog",            href: "/blog" },
  { label: "Contact",         href: "/contact" },
  { label: "Track Application", href: "/track" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy",  href: "/privacy-policy" },
  { label: "Terms of Service",href: "/terms" },
];

export default function Footer() {
  const { settings } = useSiteStore();

  const socialLinks = [
    { key: "social_facebook",  icon: FbIcon, label: "Facebook"  },
    { key: "social_instagram", icon: IgIcon, label: "Instagram" },
    { key: "social_youtube",   icon: YtIcon, label: "YouTube"   },
    { key: "social_linkedin",  icon: LiIcon, label: "LinkedIn"  },
  ];

  const phone     = settings.contact_phone   || "+60112-4103692";
  const email     = settings.contact_email   || "ceo.eduwave@gmail.com";
  const address   = settings.contact_address || "Akhteruzzaman Center (7th Floor), 21/22, Agrabad CIA, Chattogram, Bangladesh";
  const siteName  = settings.site_name       || "Eduwave Educational Consultancy";
  const siteDesc  = settings.site_description|| "From Bangladesh to Global Universities. Malaysia-based. Available 24/7. Completely Free.";
  const ctaBanner = settings.footer_cta_banner || "Ready to start your study abroad journey?";
  const ctaSub    = settings.footer_cta_sub    || "Join thousands of students who chose Eduwave";
  const fbGroup   = settings.footer_fb_group   || "https://www.facebook.com/share/g/1CVAqVmT6D/";
  const copyright = settings.footer_copyright  || siteName;

  // Parse footer quick links from settings with fallback
  const quickLinks: { label: string; href: string }[] = (() => {
    if (settings.footer_quick_links) {
      try { return JSON.parse(settings.footer_quick_links); } catch {}
    }
    return QUICK_LINKS as { label: string; href: string }[];
  })();

  return (
    <footer className="bg-[var(--primary)] text-white">
      {/* CTA Banner */}
      <div className="bg-[var(--accent)] py-6">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-lg">{ctaBanner}</p>
            <p className="text-white/80 text-sm">{ctaSub}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-[var(--accent)] font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm">
              <UserPlus size={15} /> Create Free Account
            </Link>
            <Link href="/track"
              className="flex items-center gap-2 px-5 py-2.5 border border-white/50 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm">
              <Search size={15} /> Track Application
            </Link>
            <Link href="/agent-apply"
              className="flex items-center gap-2 px-5 py-2.5 border border-white/50 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm">
              <Handshake size={15} /> Become an Agent
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <div className="w-[160px] h-[72px] relative">
                <Image
                  src={settings.site_logo || "/images/logos/eduwave-logo.png"}
                  alt={siteName}
                  fill
                  className="object-contain object-left brightness-0 invert"
                />
              </div>
            </Link>
            <p className="mt-4 text-sm text-blue-100/80 leading-relaxed">{siteDesc}</p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map(({ key, icon: Icon, label }) => {
                const url = settings[key];
                if (!url) return null;
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--accent)] transition-all duration-300 hover:scale-110">
                    <Icon />
                  </a>
                );
              })}
            </div>
            <a href={fbGroup} target="_blank" rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 text-xs text-blue-200/60 hover:text-[var(--accent)] transition-colors">
              <ExternalLink size={12} /> Join: Bangladeshi Students in Malaysia
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-blue-100/70 hover:text-[var(--accent)] transition-colors flex items-center gap-1 group">
                    <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
                <div>
                  <a href={`tel:${phone}`} className="text-sm text-blue-100/80 hover:text-[var(--accent)] transition-colors block">{phone}</a>
                  <span className="text-xs text-blue-200/50">24/7 Virtual Counselling</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
                <a href={`mailto:${email}`} className="text-sm text-blue-100/80 hover:text-[var(--accent)] transition-colors">{email}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
                <span className="text-sm text-blue-100/80">{address}</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Student & Agent</h4>
            <div className="space-y-3">
              <Link href="/register"
                className="flex items-center gap-2 w-full px-4 py-3 bg-[var(--accent)] rounded-xl text-white text-sm font-medium hover:bg-[#d04e18] transition-colors">
                <UserPlus size={16} /> Student Registration
              </Link>
              <Link href="/login"
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-white/20 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors">
                🔐 Student / Agent Login
              </Link>
              <Link href="/track"
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-white/20 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors">
                <Search size={15} /> Check Application Status
              </Link>
              <Link href="/agent-apply"
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-[var(--accent)]/50 text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent)]/10 transition-colors">
                <Handshake size={15} /> Become an Agent
              </Link>
              <a href="https://wa.me/601124103692" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-white/20 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors">
                💬 WhatsApp Us 24/7
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-blue-100/60">
            © {new Date().getFullYear()} {copyright}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="text-xs text-blue-100/60 hover:text-white transition-colors">{l.label}</Link>
            ))}
            <Link href="/track" className="text-xs text-blue-100/60 hover:text-[var(--accent)] transition-colors flex items-center gap-1">
              <Search size={11} /> Track Application
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
