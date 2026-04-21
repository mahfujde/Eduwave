// lib/tracking.ts — Application Tracking Number Generator

import prisma from "@/lib/prisma";

/**
 * Generates a unique tracking number like: EDU-2026-00042
 * FIX: Uses MAX sequence from existing tracking numbers instead of COUNT
 * to prevent collisions when applications are deleted.
 * Falls back to random suffix if collision still occurs.
 */
export async function generateTrackingNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `EDU-${year}-`;

  // Find the highest existing sequence number for this year
  const latest = await prisma.application.findFirst({
    where: { trackingNumber: { startsWith: prefix } },
    orderBy: { trackingNumber: "desc" },
    select: { trackingNumber: true },
  });

  let nextSeq = 1;
  if (latest?.trackingNumber) {
    const parts = latest.trackingNumber.split("-");
    const lastSeq = parseInt(parts[2], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }

  const candidate = `${prefix}${String(nextSeq).padStart(5, "0")}`;

  // Safety: verify uniqueness — if still collides, append random chars
  const exists = await prisma.application.findUnique({
    where: { trackingNumber: candidate },
  });

  if (exists) {
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${String(nextSeq + 1).padStart(5, "0")}${rand}`;
  }

  return candidate;
}

/**
 * Validates tracking number format
 */
export function isValidTrackingNumber(tn: string): boolean {
  return /^EDU-\d{4}-\d{5}/.test(tn);
}

/**
 * Returns public-safe application status data for /track page
 */
export function getPublicStatusInfo(status: string): {
  label: string;
  color: string;
  description: string;
  step: number;
} {
  const statusMap: Record<string, { label: string; color: string; description: string; step: number }> = {
    submitted:           { label: "Application Submitted",    color: "blue",   description: "Your application has been received and is in our queue.", step: 1 },
    under_review:        { label: "Under Review",             color: "purple", description: "Our team is reviewing your application and documents.", step: 2 },
    documents_required:  { label: "Documents Required",       color: "orange", description: "Additional documents are needed. Please log in to upload.", step: 3 },
    offer_received:      { label: "Offer Letter Received",    color: "teal",   description: "Congratulations! You have received an offer letter.", step: 4 },
    visa_processing:     { label: "Visa Processing",          color: "indigo", description: "Your student visa application is being processed.", step: 5 },
    enrolled:            { label: "Successfully Enrolled",    color: "green",  description: "Congratulations! You are officially enrolled.", step: 6 },
    rejected:            { label: "Application Rejected",     color: "red",    description: "Unfortunately your application was not successful.", step: 0 },
    withdrawn:           { label: "Application Withdrawn",    color: "gray",   description: "This application has been withdrawn.", step: 0 },
  };
  return statusMap[status] ?? { label: "Unknown", color: "gray", description: "", step: 0 };
}

export const APPLICATION_STATUSES = [
  "submitted",
  "under_review",
  "documents_required",
  "offer_received",
  "visa_processing",
  "enrolled",
  "rejected",
  "withdrawn",
] as const;

export type ApplicationStatus = typeof APPLICATION_STATUSES[number];
