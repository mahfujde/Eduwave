import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string */
export function formatDate(date: string | Date, locale = "en-US"): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Truncate text to a specified length */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

/** Generate a URL-safe slug from text */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Parse JSON safely with fallback */
export function safeJsonParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/** Build WhatsApp URL */
export function getWhatsAppUrl(number: string, message?: string): string {
  const cleaned = number.replace(/[^+\d]/g, "");
  const base = `https://wa.me/${cleaned.replace("+", "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Format currency */
export function formatCurrency(amount: string | number, currency = "MYR"): string {
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.]/g, "")) : amount;
  if (isNaN(num)) return String(amount);
  return `RM ${num.toLocaleString()}`;
}

/** API fetch helper */
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}
