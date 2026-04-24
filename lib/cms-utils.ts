// lib/cms-utils.ts — Shared CMS utilities for frontend rendering

import type { CmsSection } from "@/types";

/**
 * Maps CMS textAlign value to a Tailwind class.
 */
export function alignClass(align?: string): string {
  switch (align) {
    case "left":    return "text-left";
    case "right":   return "text-right";
    case "justify": return "text-justify";
    case "center":  return "text-center";
    default:        return "text-center";
  }
}

/**
 * Parses CMS page sections JSON into a lookup map keyed by section ID.
 * Returns { byId, byType } maps for flexible lookup.
 */
export function parseCmsSections(sectionsJson?: string | null): {
  byId: Record<string, CmsSection>;
  byType: Record<string, CmsSection>;
  all: CmsSection[];
} {
  const byId: Record<string, CmsSection> = {};
  const byType: Record<string, CmsSection> = {};
  let all: CmsSection[] = [];

  if (!sectionsJson) return { byId, byType, all };

  try {
    const sections: CmsSection[] = JSON.parse(sectionsJson);
    all = sections.filter(s => s.visible !== false);
    all.forEach(sec => {
      if (sec.id) byId[sec.id] = sec;
      byType[sec.type] = sec; // last one wins if duplicates
    });
  } catch {}

  return { byId, byType, all };
}

/**
 * Fetches a CMS page by slug and returns parsed section maps.
 */
export async function fetchCmsPage(slug: string): Promise<{
  byId: Record<string, CmsSection>;
  byType: Record<string, CmsSection>;
  all: CmsSection[];
}> {
  try {
    const res = await fetch(`/api/public/pages?slug=${slug}`);
    const d = await res.json();
    if (d.success && d.data?.sections) {
      return parseCmsSections(d.data.sections);
    }
  } catch {}
  return { byId: {}, byType: {}, all: [] };
}

/**
 * Helper: get a CMS field value by section ID, with fallback.
 */
export function cmsText(
  byId: Record<string, CmsSection>,
  sectionId: string,
  field: keyof CmsSection,
  fallback: string
): string {
  const sec = byId[sectionId];
  if (!sec) return fallback;
  const val = (sec as any)[field];
  return val || fallback;
}
