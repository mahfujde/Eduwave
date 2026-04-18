// types/index.ts — Extended TypeScript types for Eduwave Platform

// ─── Roles ───────────────────────────────────────────────────
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "AGENT" | "STUDENT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  phone?: string | null;
  isApproved: boolean;
  isActive: boolean;
  agentCode?: string | null;
  referredBy?: string | null;
  createdAt: string;
  updatedAt: string;
  studentProfile?: StudentProfile | null;
  agentApplication?: AgentApplication | null;
}

// ─── Student Profile ─────────────────────────────────────────
export interface StudentProfile {
  id: string;
  userId: string;
  dateOfBirth?: string | null;
  nationality?: string | null;
  passportNo?: string | null;
  passportExpiry?: string | null;
  address?: string | null;
  emergencyContact?: string | null;
  lastQualification?: string | null;
  lastInstitution?: string | null;
  gpa?: string | null;
  englishScore?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Application ─────────────────────────────────────────────
export interface Application {
  id: string;
  trackingNumber: string;
  studentId: string;
  student?: User;
  universityId?: string | null;
  university?: University | null;
  programId?: string | null;
  program?: Program | null;
  universityName?: string | null;
  programName?: string | null;
  intake?: string | null;
  status: string;
  agentCode?: string | null;
  agentId?: string | null;
  agent?: User | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: ApplicationMessage[];
  documents?: ApplicationDocument[];
}

export interface ApplicationMessage {
  id: string;
  applicationId: string;
  senderId: string;
  sender?: User;
  senderRole: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  createdAt: string;
}

// ─── Agent Application ───────────────────────────────────────
export interface AgentApplication {
  id: string;
  userId?: string | null;
  user?: User | null;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  experience?: string | null;
  region?: string | null;
  motivation?: string | null;
  status: string;
  reviewNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ────────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  content: string;
  type: "info" | "success" | "warning" | "danger";
  style: "bar" | "popup" | "banner";
  position?: string | null;
  isActive: boolean;
  targetPages?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  delay?: number | null;
  videoUrl?: string | null;
  linkText?: string | null;
  linkUrl?: string | null;
  isDismissible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── CMS Page ────────────────────────────────────────────────
export interface CmsSection {
  id: string;
  type: "hero" | "text" | "image" | "cards" | "cta" | "video" | "html" | "testimonials" | "form" | "team" | "stats" | "faq" | "gallery" | "youtube";
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  html?: string;
  bgColor?: string;
  textColor?: string;
  padding?: string;
  visible: boolean;
  columns?: number;
  items?: CmsSectionItem[];
  ctaText?: string;
  ctaUrl?: string;
  ctaSecondaryText?: string;
  ctaSecondaryUrl?: string;
  channelHandle?: string;  // for youtube sections
  channelId?: string;      // resolved YouTube channel ID
}

export interface CmsSectionItem {
  id: string;
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  icon?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  sections?: string | null; // JSON
  status: "draft" | "published";
  isSystem: boolean;
  metaTitle?: string | null;
  metaDesc?: string | null;
  ogImage?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Media File ──────────────────────────────────────────────
export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number | null;
  mimeType?: string | null;
  folder?: string | null;
  uploadedBy?: string | null;
  createdAt: string;
}

// ─── University ──────────────────────────────────────────────
export interface University {
  id: string;
  name: string;
  slug: string;
  shortName?: string | null;
  description?: string | null;
  country: string;
  city?: string | null;
  address?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  logo?: string | null;
  banner?: string | null;
  ranking?: string | null;
  established?: string | null;
  type?: string | null;
  offerLetter: boolean;
  featured: boolean;
  isPublic: boolean;
  sortOrder: number;
  metaTitle?: string | null;
  metaDesc?: string | null;
  createdAt: string;
  updatedAt: string;
  programs?: Program[];
  _count?: { programs: number };
}

// ─── Program ─────────────────────────────────────────────────
export interface Program {
  id: string;
  name: string;
  slug: string;
  universityId: string;
  university?: University;
  level: string;
  duration?: string | null;
  language?: string | null;
  intake?: string | null;
  mode?: string | null;
  description?: string | null;
  overview?: string | null;
  curriculum?: string | null;
  requirements?: string | null;
  careerProspects?: string | null;
  fees?: string | null;
  scholarships?: string | null;
  englishReq?: string | null;
  classType?: string | null;
  qualification?: string | null;
  featured: boolean;
  isPublic: boolean;
  sortOrder: number;
  metaTitle?: string | null;
  metaDesc?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FeeRow { label: string; amount: string; currency: string; }

// ─── Inquiry ─────────────────────────────────────────────────
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  university?: string | null;
  program?: string | null;
  message?: string | null;
  status: string;
  notes?: string | null;
  source?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Testimonial ─────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  photo?: string | null;
  university?: string | null;
  program?: string | null;
  country?: string | null;
  quote: string;
  rating: number;
  featured: boolean;
  isPublic: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Blog ────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  tags?: string | null;
  author?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Site Config ─────────────────────────────────────────────
export interface SiteConfig { id: string; key: string; value: string; group: string; label?: string | null; }
export interface SiteSettings { [key: string]: string; }
export interface ServiceItem { title: string; description: string; icon: string; }

// ─── API Helpers ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
