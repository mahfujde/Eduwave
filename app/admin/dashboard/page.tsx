"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Building2, GraduationCap, MessageSquare, Quote,
  FileText, Users, Bell, Image, Layout, Search, Settings, Handshake,
  ExternalLink, Plus, Eye, ArrowRight, TrendingUp, CheckCircle2,
  Clock, AlertCircle, Globe, BookOpen, Loader2, Wallet, UserPlus,
} from "lucide-react";
import { getAdminNavForRole } from "@/lib/rbac";

// ── Individual stat card ────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, color, href, badge, desc, actions,
}: {
  label: string; value: string | number; icon: any; color: string;
  href: string; badge?: number; desc?: string;
  actions?: { label: string; href: string; icon?: any }[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
            <Icon size={22} className="text-white" />
          </div>
          {badge !== undefined && badge > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
              {badge} new
            </span>
          )}
        </div>
        <p className="text-3xl font-extrabold text-[var(--primary)]">{value}</p>
        <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>}
      </div>
      <div className="border-t border-gray-50 p-3 flex items-center gap-2 flex-wrap">
        <Link href={href}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:text-[var(--accent)] transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50">
          <Eye size={12} /> View All
        </Link>
        {actions?.map(a => (
          <Link key={a.href} href={a.href}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[var(--accent)] transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50">
            {a.icon && <a.icon size={12} />}
            {a.label}
          </Link>
        ))}
        <Link href={href} className="ml-auto">
          <ArrowRight size={14} className="text-gray-300 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}

// ── Section heading ─────────────────────────────────────────────
function SectionHeading({ icon: Icon, title, color }: { icon: any; title: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon size={16} className="text-white" />
      </div>
      <h2 className="font-bold text-[var(--primary)] text-lg">{title}</h2>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const role    = (session?.user as any)?.role ?? "ADMIN";
  const navLinks = getAdminNavForRole(role);

  const [counts, setCounts]   = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [recent,  setRecent]  = useState<{ inquiries: any[]; applications: any[]; users: any[] }>({ inquiries: [], applications: [], users: [] });
  const [adminNotifs, setAdminNotifs] = useState<any[]>([]);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    const apis = [
      { key: "universities", url: "/api/admin/universities" },
      { key: "programs",     url: "/api/admin/programs"     },
      { key: "inquiries",    url: "/api/admin/inquiries"    },
      { key: "testimonials", url: "/api/admin/testimonials" },
      { key: "blog",         url: "/api/admin/blog"         },
      { key: "applications", url: "/api/admin/applications" },
      { key: "users",        url: "/api/admin/users"        },
      { key: "agents",       url: "/api/admin/agents"       },
      { key: "notifications",url: "/api/admin/notifications"},
      { key: "media",        url: "/api/admin/media"        },
      { key: "pages",        url: "/api/admin/pages"        },
    ];
    Promise.allSettled(apis.map(a => fetch(a.url).then(r => r.json()).then(d => ({ key: a.key, data: d.data ?? [] }))))
      .then(results => {
        const c: Record<string, number> = {};
        const inqs: any[]  = [];
        const apps: any[]  = [];
        const usrs: any[]  = [];
        results.forEach(r => {
          if (r.status === "fulfilled") {
            const { key, data } = r.value;
            c[key] = Array.isArray(data) ? data.length : 0;
            if (key === "inquiries")    inqs.push(...(Array.isArray(data) ? data.slice(0,5) : []));
            if (key === "applications") apps.push(...(Array.isArray(data) ? data.slice(0,5) : []));
            if (key === "users")        usrs.push(...(Array.isArray(data) ? data.slice(0,5) : []));
          }
        });
        setCounts(c);
        setRecent({ inquiries: inqs, applications: apps, users: usrs });
      })
      .finally(() => setLoading(false));

    // Fetch admin notifications
    fetch("/api/admin/dashboard-notifications")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setAdminNotifs(d.data || []);
          setUnreadNotifs(d.unreadCount || 0);
        }
      })
      .catch(() => {});
  }, []);

  const newInquiries    = recent.inquiries.filter(i => i.status === "new").length;
  const pendingAgents   = counts.agents ?? 0;
  const activeApps      = recent.applications.filter(a => !["enrolled","rejected","withdrawn"].includes(a.status)).length;

  const hasSection = (href: string) => navLinks.some(l => l.href === href);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[#2A3B6F] rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-blue-200/70 text-sm mb-1">Welcome back,</p>
            <h1 className="text-2xl font-extrabold">{session?.user?.name ?? "Admin"} 👋</h1>
            <p className="text-blue-100/60 text-sm mt-1">
              {role.replace("_"," ")} · {new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">
              <ExternalLink size={13} /> View Website
            </Link>
            <Link href="/admin/cms"
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)] hover:bg-[#D04E18] rounded-xl text-sm font-medium transition-colors">
              <Plus size={13} /> New Page
            </Link>
          </div>
        </div>

        {/* Summary badges */}
        <div className="flex flex-wrap gap-3 mt-6">
          {newInquiries > 0 && (
            <Link href="/admin/inquiries"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-400/30 border border-red-400/20 rounded-lg text-xs font-medium">
              <AlertCircle size={12} /> {newInquiries} new inquir{newInquiries===1?"y":"ies"}
            </Link>
          )}
          {activeApps > 0 && (
            <Link href="/admin/applications"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-400/20 border border-orange-400/20 rounded-lg text-xs font-medium">
              <Clock size={12} /> {activeApps} active application{activeApps!==1?"s":""}
            </Link>
          )}
          {pendingAgents > 0 && (
            <Link href="/admin/agents"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-400/20 border border-purple-400/20 rounded-lg text-xs font-medium">
              <Handshake size={12} /> {pendingAgents} agent{pendingAgents!==1?"s":""} to review
            </Link>
          )}
          {unreadNotifs > 0 && (
            <Link href="/admin/commissions"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/20 border border-yellow-400/20 rounded-lg text-xs font-medium">
              <Wallet size={12} /> {unreadNotifs} new notification{unreadNotifs!==1?"s":""}
            </Link>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
        </div>
      )}

      {!loading && (
        <>
          {/* ── Portals & CRM ──────────────────────── */}
          <div>
            <SectionHeading icon={Users} title="Portals & CRM" color="from-blue-500 to-blue-700" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {hasSection("/admin/applications") && (
                <StatCard label="Applications" value={counts.applications ?? 0}
                  icon={FileText} color="from-[#E8622A] to-[#D04E18]"
                  href="/admin/applications" badge={activeApps}
                  desc="Student university applications"
                  actions={[{ label: "Review", href: "/admin/applications", icon: Eye }]} />
              )}
              {hasSection("/admin/users") && (
                <StatCard label="Users" value={counts.users ?? 0}
                  icon={Users} color="from-blue-500 to-blue-700"
                  href="/admin/users"
                  desc="Students, editors & admins"
                  actions={[{ label: "Add User", href: "/admin/users", icon: Plus }]} />
              )}
              {hasSection("/admin/agents") && (
                <StatCard label="Agents" value={counts.agents ?? 0}
                  icon={Handshake} color="from-green-500 to-green-700"
                  href="/admin/agents"
                  desc="Referral agents & applications"
                  actions={[{ label: "Review", href: "/admin/agents", icon: CheckCircle2 }]} />
              )}
              {hasSection("/admin/inquiries") && (
                <StatCard label="Inquiries" value={counts.inquiries ?? 0}
                  icon={MessageSquare} color="from-violet-500 to-violet-700"
                  href="/admin/inquiries" badge={newInquiries}
                  desc="Contact form submissions"
                  actions={[{ label: "New Inquiries", href: "/admin/inquiries", icon: AlertCircle }]} />
              )}
              {hasSection("/admin/commissions") && (
                <StatCard label="Commissions" value={unreadNotifs || "—"}
                  icon={Wallet} color="from-yellow-500 to-yellow-700"
                  href="/admin/commissions"
                  desc="Agent commission payments"
                  actions={[{ label: "Review Claims", href: "/admin/commissions", icon: Eye }]} />
              )}
            </div>
          </div>

          {/* ── Content Management ─────────────────── */}
          <div>
            <SectionHeading icon={Layout} title="Content Management" color="from-indigo-500 to-indigo-700" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {hasSection("/admin/universities") && (
                <StatCard label="Universities" value={counts.universities ?? 0}
                  icon={Building2} color="from-cyan-500 to-cyan-700"
                  href="/admin/universities"
                  desc="Partner universities"
                  actions={[{ label: "Add University", href: "/admin/universities", icon: Plus }]} />
              )}
              {hasSection("/admin/programs") && (
                <StatCard label="Programs / Courses" value={counts.programs ?? 0}
                  icon={GraduationCap} color="from-teal-500 to-teal-700"
                  href="/admin/programs"
                  desc="Degree programs & courses"
                  actions={[{ label: "Add Program", href: "/admin/programs", icon: Plus }]} />
              )}
              {hasSection("/admin/testimonials") && (
                <StatCard label="Testimonials" value={counts.testimonials ?? 0}
                  icon={Quote} color="from-pink-500 to-pink-700"
                  href="/admin/testimonials"
                  desc="Student success stories"
                  actions={[{ label: "Add Story", href: "/admin/testimonials", icon: Plus }]} />
              )}
              {hasSection("/admin/blog") && (
                <StatCard label="Blog Posts" value={counts.blog ?? 0}
                  icon={BookOpen} color="from-rose-500 to-rose-700"
                  href="/admin/blog"
                  desc="Articles & news"
                  actions={[{ label: "Write Post", href: "/admin/blog", icon: Plus }]} />
              )}
            </div>
          </div>

          {/* ── CMS & Pages ────────────────────────── */}
          <div>
            <SectionHeading icon={Globe} title="Pages, CMS & SEO" color="from-emerald-500 to-emerald-700" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {hasSection("/admin/cms") && (
                <StatCard label="CMS Pages" value={counts.pages ?? 0}
                  icon={Layout} color="from-emerald-500 to-emerald-700"
                  href="/admin/cms"
                  desc="Visual page builder. Create & edit any page."
                  actions={[{ label: "New Page", href: "/admin/cms", icon: Plus }, { label: "Edit Homepage", href: "/admin/cms", icon: Layout }]} />
              )}
              {hasSection("/admin/seo") && (
                <StatCard label="SEO Manager" value="10 pages"
                  icon={Search} color="from-sky-500 to-sky-700"
                  href="/admin/seo"
                  desc="Meta titles, descriptions & scores per page"
                  actions={[{ label: "Edit SEO", href: "/admin/seo", icon: Search }]} />
              )}
              {hasSection("/admin/media") && (
                <StatCard label="Media Library" value={counts.media ?? 0}
                  icon={Image} color="from-amber-500 to-amber-700"
                  href="/admin/media"
                  desc="Images, documents & uploads"
                  actions={[{ label: "Upload Files", href: "/admin/media", icon: Plus }]} />
              )}
              {hasSection("/admin/notifications") && (
                <StatCard label="Notifications" value={counts.notifications ?? 0}
                  icon={Bell} color="from-orange-500 to-orange-700"
                  href="/admin/notifications"
                  desc="Bars, popups & banners for visitors"
                  actions={[{ label: "Add Banner", href: "/admin/notifications", icon: Plus }]} />
              )}
              {hasSection("/admin/settings") && (
                <StatCard label="Site Settings" value="Config"
                  icon={Settings} color="from-gray-500 to-gray-700"
                  href="/admin/settings"
                  desc="Branding, contact info, social links"
                  actions={[{ label: "Edit Settings", href: "/admin/settings" }]} />
              )}
            </div>
          </div>

          {/* ── Recent Activity ─────────────────────── */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Applications */}
            {hasSection("/admin/applications") && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b">
                  <h3 className="font-bold text-[var(--primary)]">Recent Applications</h3>
                  <Link href="/admin/applications" className="text-xs text-[var(--accent)] hover:underline">View all →</Link>
                </div>
                {recent.applications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No applications yet</div>
                ) : (
                  <div className="divide-y">
                    {recent.applications.map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{app.student?.name ?? "Student"}</p>
                          <p className="text-xs text-gray-400 truncate">{app.trackingNumber} · {app.universityName ?? app.university?.name ?? "—"}</p>
                        </div>
                        <span className={`ml-3 shrink-0 text-xs px-2 py-1 rounded-full font-medium
                          ${app.status === "enrolled" ? "bg-green-100 text-green-700" :
                            app.status === "rejected" ? "bg-red-100 text-red-600" :
                            "bg-blue-100 text-blue-700"}`}>
                          {app.status?.replace(/_/g," ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recent Inquiries */}
            {hasSection("/admin/inquiries") && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b">
                  <h3 className="font-bold text-[var(--primary)]">Recent Inquiries</h3>
                  <Link href="/admin/inquiries" className="text-xs text-[var(--accent)] hover:underline">View all →</Link>
                </div>
                {recent.inquiries.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No inquiries yet</div>
                ) : (
                  <div className="divide-y">
                    {recent.inquiries.map((inq: any) => (
                      <div key={inq.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{inq.name}</p>
                          <p className="text-xs text-gray-400 truncate">{inq.email} · {inq.phone}</p>
                        </div>
                        <span className={`ml-3 shrink-0 text-xs px-2.5 py-1 rounded-full font-medium
                          ${inq.status === "new"         ? "bg-blue-100 text-blue-800" :
                            inq.status === "contacted"   ? "bg-yellow-100 text-yellow-800" :
                            inq.status === "in-progress" ? "bg-purple-100 text-purple-800" :
                            "bg-green-100 text-green-800"}`}>
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Agent Submissions Notifications */}
          {adminNotifs.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b">
                <h3 className="font-bold text-[var(--primary)] flex items-center gap-2">
                  <UserPlus size={16} className="text-[var(--accent)]" /> Agent Submissions & Commission Alerts
                </h3>
                <button onClick={async () => {
                  await fetch("/api/admin/dashboard-notifications?id=all", { method: "PATCH" });
                  setAdminNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
                  setUnreadNotifs(0);
                }} className="text-xs text-gray-400 hover:text-[var(--accent)]">
                  Mark all read
                </button>
              </div>
              <div className="divide-y max-h-64 overflow-y-auto">
                {adminNotifs.slice(0, 10).map((n: any) => (
                  <Link key={n.id} href={n.linkUrl || "/admin/applications"}
                    className={`block px-5 py-3 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-blue-50/50" : ""}`}>
                    <div className="flex items-center gap-2">
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                      <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-300 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Quick Page Links ─────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
              <Globe size={16} className="text-[var(--accent)]" /> Public Pages — Quick Access
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: "Homepage",      href: "/", editSlug: "home"          },
                { label: "About Us",      href: "/about", editSlug: "about"    },
                { label: "Services",      href: "/services", editSlug: "services"},
                { label: "Contact",       href: "/contact", editSlug: "contact" },
                { label: "Universities",  href: "/universities"                 },
                { label: "Courses",       href: "/courses"                      },
                { label: "Blog",          href: "/blog"                         },
                { label: "Track App",     href: "/track"                        },
                { label: "Privacy Policy",href: "/privacy-policy", editSlug: "privacy-policy"},
                { label: "Terms",         href: "/terms", editSlug: "terms"     },
              ].map(pg => (
                <div key={pg.href} className="flex flex-col gap-1.5 p-3 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                  <p className="text-xs font-semibold text-gray-700 truncate">{pg.label}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={pg.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-[var(--accent)] transition-colors">
                      <Eye size={10} /> View
                    </a>
                    {pg.editSlug && hasSection("/admin/cms") && (
                      <Link href="/admin/cms"
                        className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-[var(--accent)] transition-colors">
                        <Layout size={10} /> Edit CMS
                      </Link>
                    )}
                    {!pg.editSlug && (
                      <Link href={pg.href === "/universities" ? "/admin/universities" : pg.href === "/courses" ? "/admin/programs" : "/admin/blog"}
                        className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-[var(--accent)] transition-colors">
                        <Settings size={10} /> Manage
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
