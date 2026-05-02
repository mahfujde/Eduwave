"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, CheckCircle2, GripVertical, Globe, Layout, Upload } from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface NavLink { label: string; href: string; }
interface QuickLink { label: string; href: string; }

const DEFAULT_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Universities", href: "/universities" },
  { label: "Courses", href: "/courses" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const DEFAULT_QUICK: QuickLink[] = [
  { label: "Home", href: "/" },
  { label: "Universities", href: "/universities" },
  { label: "Courses", href: "/courses" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Track Application", href: "/track" },
];

function UploadButton({ onUpload }: { onUpload: (url: string) => void }) {
  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files[0]; if (!file) return;
      const fd = new FormData(); fd.append("file", file); fd.append("folder", "images/logos");
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const r = await res.json();
      if (r.success) onUpload(r.data.url);
    };
    input.click();
  };
  return (
    <button type="button" onClick={handleClick} className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 shrink-0">
      <Upload size={14} /> Upload
    </button>
  );
}

function LinkEditor({ links, onChange, addLabel }: { links: { label: string; href: string }[]; onChange: (v: { label: string; href: string }[]) => void; addLabel: string }) {
  const add = () => onChange([...links, { label: "New Link", href: "/" }]);
  const remove = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const update = (i: number, field: "label" | "href", val: string) => onChange(links.map((l, idx) => idx === i ? { ...l, [field]: val } : l));

  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2">
          <GripVertical size={14} className="text-gray-300 shrink-0 cursor-grab" />
          <input value={link.label} onChange={e => update(i, "label", e.target.value)} className="input-field text-sm flex-1" placeholder="Label" />
          <input value={link.href} onChange={e => update(i, "href", e.target.value)} className="input-field text-sm flex-1" placeholder="/path or https://..." />
          <button onClick={() => remove(i)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 shrink-0"><Trash2 size={13} /></button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline mt-1">
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

export default function HeaderFooterPage() {
  const [tab, setTab] = useState<"header" | "footer">("header");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Header state
  const [logoText, setLogoText] = useState("Eduwave");
  const [logoSubtext, setLogoSubtext] = useState("Educational Consultancy");
  const [logoUrl, setLogoUrl] = useState("/images/logos/eduwave-logo.png");
  const [navLinks, setNavLinks] = useState<NavLink[]>(DEFAULT_NAV);
  const [headerCtaText, setHeaderCtaText] = useState("Apply Now");
  const [headerCtaUrl, setHeaderCtaUrl] = useState("/contact");
  const [headerPhone, setHeaderPhone] = useState("+60112-4103692");

  // Footer state
  const [footerTagline, setFooterTagline] = useState("From Bangladesh to Global Universities. Malaysia-based. Available 24/7. Completely Free.");
  const [footerCtaBanner, setFooterCtaBanner] = useState("Ready to start your study abroad journey?");
  const [footerCtaSub, setFooterCtaSub] = useState("Join thousands of students who chose Eduwave");
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(DEFAULT_QUICK);
  const [footerEmail, setFooterEmail] = useState("ceo.eduwave@gmail.com");
  const [footerPhone, setFooterPhone] = useState("+60112-4103692");
  const [footerAddress, setFooterAddress] = useState("Akhteruzzaman Center (7th Floor), 21/22, Agrabad CIA, Chattogram, Bangladesh");
  const [footerFb, setFooterFb] = useState("https://www.facebook.com/EduwaveEducation");
  const [footerIg, setFooterIg] = useState("https://www.instagram.com/the_eduwave");
  const [footerYt, setFooterYt] = useState("https://youtube.com/@roamingwithnayem");
  const [footerLi, setFooterLi] = useState("");
  const [fbGroup, setFbGroup] = useState("https://www.facebook.com/share/g/1CVAqVmT6D/");
  const [copyright, setCopyright] = useState("Eduwave Educational Consultancy");

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.json()).then(d => {
      if (d.success && d.data) {
        const s: Record<string, string> = {};
        d.data.forEach((item: any) => { s[item.key] = item.value; });
        if (s.site_name) setLogoText(s.site_name);
        if (s.site_logo) setLogoUrl(s.site_logo);
        if (s.contact_phone) { setHeaderPhone(s.contact_phone); setFooterPhone(s.contact_phone); }
        if (s.contact_email) setFooterEmail(s.contact_email);
        if (s.contact_address) setFooterAddress(s.contact_address);
        if (s.social_facebook) setFooterFb(s.social_facebook);
        if (s.social_instagram) setFooterIg(s.social_instagram);
        if (s.social_youtube) setFooterYt(s.social_youtube);
        if (s.social_linkedin) setFooterLi(s.social_linkedin);
        if (s.site_description) setFooterTagline(s.site_description);
        if (s.nav_links) { try { setNavLinks(JSON.parse(s.nav_links)); } catch {} }
        if (s.footer_quick_links) { try { setQuickLinks(JSON.parse(s.footer_quick_links)); } catch {} }
        if (s.header_cta_text) setHeaderCtaText(s.header_cta_text);
        if (s.header_cta_url) setHeaderCtaUrl(s.header_cta_url);
        if (s.logo_subtext) setLogoSubtext(s.logo_subtext);
        if (s.footer_cta_banner) setFooterCtaBanner(s.footer_cta_banner);
        if (s.footer_cta_sub) setFooterCtaSub(s.footer_cta_sub);
        if (s.footer_fb_group) setFbGroup(s.footer_fb_group);
        if (s.footer_copyright) setCopyright(s.footer_copyright);
      }
    }).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    const updates = [
      { key: "site_name", value: logoText },
      { key: "site_logo", value: logoUrl },
      { key: "logo_subtext", value: logoSubtext },
      { key: "nav_links", value: JSON.stringify(navLinks) },
      { key: "header_cta_text", value: headerCtaText },
      { key: "header_cta_url", value: headerCtaUrl },
      { key: "contact_phone", value: footerPhone },
      { key: "contact_email", value: footerEmail },
      { key: "contact_address", value: footerAddress },
      { key: "social_facebook", value: footerFb },
      { key: "social_instagram", value: footerIg },
      { key: "social_youtube", value: footerYt },
      { key: "social_linkedin", value: footerLi },
      { key: "site_description", value: footerTagline },
      { key: "footer_quick_links", value: JSON.stringify(quickLinks) },
      { key: "footer_cta_banner", value: footerCtaBanner },
      { key: "footer_cta_sub", value: footerCtaSub },
      { key: "footer_fb_group", value: fbGroup },
      { key: "footer_copyright", value: copyright },
    ];
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: updates }),
      });
      toast.success("Header & Footer settings saved!");
      setSaving(false); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save settings.");
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[var(--accent)]" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Header & Footer</h1>
          <p className="text-gray-500 text-sm mt-1">Manage navigation links, logo, contact info, and footer content</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} /> Changes saved. They will be reflected on the website.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button onClick={() => setTab("header")} className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "header" ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
          <Layout size={15} /> Header / Navbar
        </button>
        <button onClick={() => setTab("footer")} className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "footer" ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
          <Globe size={15} /> Footer
        </button>
      </div>

      {/* ── HEADER TAB ── */}
      {tab === "header" && (
        <div className="space-y-6">
          {/* Logo */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-[var(--primary)]">🏷️ Logo & Brand</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Site / Brand Name</label>
                <input value={logoText} onChange={e => setLogoText(e.target.value)} className="input-field" placeholder="Eduwave" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tagline Under Logo</label>
                <input value={logoSubtext} onChange={e => setLogoSubtext(e.target.value)} className="input-field" placeholder="Educational Consultancy" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Logo Image</label>
              <div className="flex items-center gap-3">
                {logoUrl && <img src={logoUrl} alt="Logo preview" className="w-12 h-12 object-contain rounded-lg border bg-gray-50 p-1" />}
                <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="input-field flex-1" placeholder="/images/logos/eduwave-logo.png" />
                <UploadButton onUpload={url => setLogoUrl(url)} />
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-[var(--primary)]">🔗 Navigation Menu Links</h3>
            <p className="text-sm text-gray-500">These links appear in the top navigation bar. Drag to reorder.</p>
            <LinkEditor links={navLinks} onChange={setNavLinks} addLabel="Add Nav Link" />
          </div>

          {/* CTA Button */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-[var(--primary)]">🎯 CTA Button (Top Right)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Button Text</label>
                <input value={headerCtaText} onChange={e => setHeaderCtaText(e.target.value)} className="input-field" placeholder="Apply Now" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Button URL</label>
                <input value={headerCtaUrl} onChange={e => setHeaderCtaUrl(e.target.value)} className="input-field" placeholder="/contact" />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="card p-4 bg-gray-50">
            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Preview</p>
            <div className="bg-white rounded-xl shadow-sm border p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {logoUrl && <img src={logoUrl} alt="" className="w-8 h-8 object-contain" />}
                <div><p className="text-sm font-bold text-[var(--primary)]">{logoText}</p><p className="text-xs text-gray-400 -mt-0.5">{logoSubtext}</p></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                {navLinks.slice(0,4).map(l => <span key={l.href} className="px-2 py-1 rounded hover:bg-gray-100">{l.label}</span>)}
                {navLinks.length > 4 && <span className="text-gray-400">+{navLinks.length - 4} more</span>}
              </div>
              <span className="px-3 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-bold">{headerCtaText}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER TAB ── */}
      {tab === "footer" && (
        <div className="space-y-6">
          {/* Brand */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-[var(--primary)]">📝 Footer Brand & Description</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Footer Tagline / Description</label>
              <textarea value={footerTagline} onChange={e => setFooterTagline(e.target.value)} rows={3} className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Copyright Entity Name</label>
              <input value={copyright} onChange={e => setCopyright(e.target.value)} className="input-field" placeholder="Eduwave Educational Consultancy" />
            </div>
          </div>

          {/* CTA Banner */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-[var(--primary)]">🔔 Footer CTA Banner (Orange Strip)</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Banner Headline</label>
              <input value={footerCtaBanner} onChange={e => setFooterCtaBanner(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Banner Subtext</label>
              <input value={footerCtaSub} onChange={e => setFooterCtaSub(e.target.value)} className="input-field" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-[var(--primary)]">🔗 Footer Quick Links</h3>
            <LinkEditor links={quickLinks} onChange={setQuickLinks} addLabel="Add Quick Link" />
          </div>

          {/* Contact */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-[var(--primary)]">📞 Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone / WhatsApp</label>
                <input value={footerPhone} onChange={e => setFooterPhone(e.target.value)} className="input-field" placeholder="+60112-4103692" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</label>
                <input value={footerEmail} onChange={e => setFooterEmail(e.target.value)} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</label>
              <textarea value={footerAddress} onChange={e => setFooterAddress(e.target.value)} rows={2} className="input-field resize-none" />
            </div>
          </div>

          {/* Social Links */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-[var(--primary)]">📱 Social Media Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Facebook Page</label>
                <input value={footerFb} onChange={e => setFooterFb(e.target.value)} className="input-field" placeholder="https://facebook.com/..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Instagram</label>
                <input value={footerIg} onChange={e => setFooterIg(e.target.value)} className="input-field" placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">YouTube</label>
                <input value={footerYt} onChange={e => setFooterYt(e.target.value)} className="input-field" placeholder="https://youtube.com/..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">LinkedIn</label>
                <input value={footerLi} onChange={e => setFooterLi(e.target.value)} className="input-field" placeholder="https://linkedin.com/..." />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Facebook Community Group URL</label>
              <input value={fbGroup} onChange={e => setFbGroup(e.target.value)} className="input-field" placeholder="https://facebook.com/groups/..." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
