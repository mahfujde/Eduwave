/** Site-wide constants — editable values come from DB, these are fallback defaults */
export const SITE_DEFAULTS = {
  name: "Eduwave Educational Consultancy",
  tagline: "Your Gateway to World-Class Education in Malaysia",
  url: "https://theeduwave.com",
  whatsapp: "+60112-4103692",
  email: "info@theeduwave.com",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Universities", href: "/universities" },
  { label: "Courses", href: "/courses" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Universities", href: "/admin/universities", icon: "Building2" },
  { label: "Programs", href: "/admin/programs", icon: "GraduationCap" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "MessageSquare" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "Quote" },
  { label: "Blog", href: "/admin/blog", icon: "FileText" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

export const INQUIRY_STATUSES = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-100 text-yellow-800" },
  { value: "in-progress", label: "In Progress", color: "bg-purple-100 text-purple-800" },
  { value: "closed", label: "Closed", color: "bg-green-100 text-green-800" },
] as const;

export const PROGRAM_LEVELS = [
  "Foundation",
  "Diploma",
  "Bachelor",
  "Master",
  "PhD",
] as const;

export const PROGRAM_MODES = ["Full-time", "Part-time", "Online"] as const;

export const COLORS = {
  primary: "#1A2B5F",
  accent: "#E8622A",
  primaryLight: "#2A3B6F",
  accentLight: "#F5733B",
  dark: "#0F172A",
  gray: "#64748B",
} as const;
