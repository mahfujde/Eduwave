"use client";

import { create } from "zustand";
import type { SiteSettings } from "@/types";

interface SiteStore {
  settings: SiteSettings;
  loading: boolean;
  setSettings: (settings: SiteSettings) => void;
  fetchSettings: () => Promise<void>;
}

export const useSiteStore = create<SiteStore>((set) => ({
  settings: {},
  loading: true,
  setSettings: (settings) => set({ settings, loading: false }),
  fetchSettings: async () => {
    try {
      const res = await fetch("/api/public/settings");
      const data = await res.json();
      if (data.success) {
        const map: SiteSettings = {};
        data.data.forEach((item: { key: string; value: string }) => {
          map[item.key] = item.value;
        });
        set({ settings: map, loading: false });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      set({ loading: false });
    }
  },
}));

/* ── Admin sidebar state ── */
interface SidebarStore {
  open: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  setOpen: (open) => set({ open }),
}));
