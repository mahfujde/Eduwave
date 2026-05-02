"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/utils";
import type {
  University, Program, Inquiry, Testimonial, BlogPost, SiteConfig, ApiResponse, PaginatedResponse,
} from "@/types";

/* ─── Public hooks ─── */
export function useUniversities(params?: string) {
  return useQuery<University[]>({
    queryKey: ["universities", params],
    queryFn: () => apiFetch(`/api/public/universities${params ? `?${params}` : ""}`).then((r: any) => r.data),
  });
}

export function useUniversity(slug: string) {
  return useQuery<University>({
    queryKey: ["university", slug],
    queryFn: () => apiFetch(`/api/public/universities?slug=${slug}`).then((r: any) => r.data),
    enabled: !!slug,
  });
}

export function usePrograms(params?: string) {
  return useQuery<Program[]>({
    queryKey: ["programs", params],
    queryFn: () => apiFetch(`/api/public/programs${params ? `?${params}` : ""}`).then((r: any) => r.data),
  });
}

export function useProgram(slug: string) {
  return useQuery<Program>({
    queryKey: ["program", slug],
    queryFn: () => apiFetch(`/api/public/programs?slug=${slug}`).then((r: any) => r.data),
    enabled: !!slug,
  });
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: () => apiFetch("/api/public/testimonials").then((r: any) => r.data),
  });
}

export function useBlogPosts(params?: string) {
  return useQuery<BlogPost[]>({
    queryKey: ["blog", params],
    queryFn: () => apiFetch(`/api/public/blog${params ? `?${params}` : ""}`).then((r: any) => r.data),
  });
}

export function useSiteSettings() {
  return useQuery<SiteConfig[]>({
    queryKey: ["settings"],
    queryFn: () => apiFetch("/api/public/settings").then((r: any) => r.data),
    staleTime: 1000 * 60 * 5,
  });
}

/* ─── Admin hooks ─── */
export function useAdminUniversities() {
  return useQuery<University[]>({
    queryKey: ["admin", "universities"],
    queryFn: () => apiFetch("/api/admin/universities").then((r: any) => r.data),
  });
}

export function useAdminPrograms() {
  return useQuery<Program[]>({
    queryKey: ["admin", "programs"],
    queryFn: () => apiFetch("/api/admin/programs").then((r: any) => r.data),
  });
}

export function useAdminInquiries() {
  return useQuery<Inquiry[]>({
    queryKey: ["admin", "inquiries"],
    queryFn: () => apiFetch("/api/admin/inquiries").then((r: any) => r.data),
  });
}

export function useAdminTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["admin", "testimonials"],
    queryFn: () => apiFetch("/api/admin/testimonials").then((r: any) => r.data),
  });
}

export function useAdminBlog() {
  return useQuery<BlogPost[]>({
    queryKey: ["admin", "blog"],
    queryFn: () => apiFetch("/api/admin/blog").then((r: any) => r.data),
  });
}

export function useAdminSettings() {
  return useQuery<SiteConfig[]>({
    queryKey: ["admin", "settings"],
    queryFn: () => apiFetch("/api/admin/settings").then((r: any) => r.data),
  });
}

/* ─── Mutation helpers (auto-toast on success/error) ─── */
import { useToastStore } from "@/hooks/useToast";

export function useCreateMutation<T>(endpoint: string, queryKey: string[], successMsg?: string) {
  const queryClient = useQueryClient();
  const addToast = useToastStore.getState().addToast;
  return useMutation({
    mutationFn: (data: Partial<T>) =>
      apiFetch(endpoint, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey });
      addToast(successMsg || res?.message || "Created successfully!", "success");
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to create. Please try again.", "error");
    },
  });
}

export function useUpdateMutation<T>(endpoint: string, queryKey: string[], successMsg?: string) {
  const queryClient = useQueryClient();
  const addToast = useToastStore.getState().addToast;
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
      apiFetch(`${endpoint}?id=${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey });
      addToast(successMsg || res?.message || "Saved successfully!", "success");
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to save. Please try again.", "error");
    },
  });
}

export function useDeleteMutation(endpoint: string, queryKey: string[], successMsg?: string) {
  const queryClient = useQueryClient();
  const addToast = useToastStore.getState().addToast;
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`${endpoint}?id=${id}`, { method: "DELETE" }),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey });
      addToast(successMsg || res?.message || "Deleted successfully!", "success");
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to delete. Please try again.", "error");
    },
  });
}

