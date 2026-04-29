// lib/rbac.ts — Role-Based Access Control for Eduwave

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  AGENT: "AGENT",
  STUDENT: "STUDENT",
} as const;

export type Role = keyof typeof ROLES;

// ─── Permission Definitions ──────────────────────────────────
export const PERMISSIONS = {
  // User management
  MANAGE_USERS:       ["SUPER_ADMIN"],
  VIEW_USERS:         ["SUPER_ADMIN", "ADMIN"],
  VIEW_STUDENTS:      ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  CREATE_ADMIN:       ["SUPER_ADMIN"],
  APPROVE_AGENTS:     ["SUPER_ADMIN", "ADMIN"],
  MANAGE_AGENTS:      ["SUPER_ADMIN", "ADMIN"],

  // Applications
  VIEW_ALL_APPS:      ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  MANAGE_APPS:        ["SUPER_ADMIN", "ADMIN"],
  VIEW_OWN_APPS:      ["STUDENT"],
  SUBMIT_APP:         ["STUDENT"],

  // Agent
  VIEW_AGENT_DASH:    ["AGENT"],
  VIEW_REFERRED:      ["AGENT"],

  // Commissions
  MANAGE_COMMISSIONS: ["SUPER_ADMIN", "ADMIN"],
  VIEW_COMMISSIONS:   ["SUPER_ADMIN", "ADMIN", "AGENT"],

  // Content
  MANAGE_CONTENT:     ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  MANAGE_UNIVERSITIES:["SUPER_ADMIN", "ADMIN", "EDITOR"],
  MANAGE_PROGRAMS:    ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  MANAGE_BLOG:        ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  MANAGE_TESTIMONIALS:["SUPER_ADMIN", "ADMIN"],
  MANAGE_SETTINGS:    ["SUPER_ADMIN", "ADMIN"],
  MANAGE_CMS:         ["SUPER_ADMIN", "ADMIN"],
  MANAGE_SEO:         ["SUPER_ADMIN", "ADMIN", "EDITOR"],

  // Notifications
  MANAGE_NOTIFICATIONS:["SUPER_ADMIN", "ADMIN"],

  // Media
  UPLOAD_MEDIA:       ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  MANAGE_MEDIA:       ["SUPER_ADMIN", "ADMIN"],

  // Inquiries
  VIEW_INQUIRIES:     ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  MANAGE_INQUIRIES:   ["SUPER_ADMIN", "ADMIN"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

// ─── Role Checks ─────────────────────────────────────────────
export function hasPermission(userRole: string, permission: Permission): boolean {
  const allowed = PERMISSIONS[permission] as readonly string[];
  return allowed.includes(userRole);
}

export function isAdmin(role: string): boolean {
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
}

export function isStaff(role: string): boolean {
  return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role);
}

export function isAgent(role: string): boolean {
  return role === "AGENT";
}

export function isStudent(role: string): boolean {
  return role === "STUDENT";
}

export function isSuperAdmin(role: string): boolean {
  return role === "SUPER_ADMIN";
}

// ─── Route Guards ────────────────────────────────────────────
export const ROUTE_ROLES: Record<string, string[]> = {
  "/admin":        ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "/portal":       ["STUDENT"],
  "/agent":        ["AGENT"],
};

export function canAccessRoute(role: string, path: string): boolean {
  for (const [prefix, roles] of Object.entries(ROUTE_ROLES)) {
    if (path.startsWith(prefix)) {
      return roles.includes(role);
    }
  }
  return true; // public route
}

// ─── Admin Nav Items per Role ────────────────────────────────
export function getAdminNavForRole(role: string) {
  const all = [
    { href: "/admin/dashboard",      label: "Dashboard",      icon: "LayoutDashboard", roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
    { href: "/admin/applications",   label: "Applications",   icon: "FileText",        roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
    { href: "/admin/users",          label: "Users",          icon: "Users",           roles: ["SUPER_ADMIN","ADMIN"] },
    { href: "/admin/students",       label: "Students",       icon: "GraduationCap",   roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
    { href: "/admin/agents",         label: "Agents",         icon: "Handshake",       roles: ["SUPER_ADMIN","ADMIN"] },
    { href: "/admin/commissions",    label: "Commissions",    icon: "Wallet",          roles: ["SUPER_ADMIN","ADMIN"] },
    { href: "/admin/universities",   label: "Universities",   icon: "Building2",       roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
    { href: "/admin/programs",       label: "Programs",       icon: "GraduationCap",   roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
    { href: "/admin/inquiries",      label: "Inquiries",      icon: "MessageSquare",   roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
    { href: "/admin/testimonials",   label: "Testimonials",   icon: "Quote",           roles: ["SUPER_ADMIN","ADMIN"] },
    { href: "/admin/blog",           label: "Blog",           icon: "BookOpen",        roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
    { href: "/admin/notifications",  label: "Notifications",  icon: "Bell",            roles: ["SUPER_ADMIN","ADMIN"] },
    { href: "/admin/media",          label: "Media Library",  icon: "Image",           roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
    { href: "/admin/cms",            label: "Pages (CMS)",    icon: "Layout",          roles: ["SUPER_ADMIN","ADMIN"] },
    { href: "/admin/seo",            label: "SEO",            icon: "Search",          roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
    { href: "/admin/header-footer",  label: "Header & Footer", icon: "Globe",           roles: ["SUPER_ADMIN","ADMIN"] },
    { href: "/admin/theme",          label: "Theme & Colors",  icon: "Palette",         roles: ["SUPER_ADMIN","ADMIN"] },
    { href: "/admin/settings",       label: "Settings",       icon: "Settings",        roles: ["SUPER_ADMIN"] },
  ];
  return all.filter((item) => item.roles.includes(role));
}
