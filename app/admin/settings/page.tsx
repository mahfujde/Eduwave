"use client";

import { useState, useEffect } from "react";
import { useAdminSettings } from "@/hooks/useData";
import type { SiteConfig } from "@/types";
import { Loader2, Save, CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const { data: settings, isLoading, refetch } = useAdminSettings();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s) => { map[s.key] = s.value; });
      setForm(map);
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const settingsArray = Object.entries(form).map(([key, value]) => ({ key, value }));
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsArray }),
      });
      setSaved(true);
      refetch();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Group settings by category
  const groups: Record<string, { key: string; label: string | null }[]> = {};
  settings?.forEach((s) => {
    if (!groups[s.group]) groups[s.group] = [];
    groups[s.group].push({ key: s.key, label: s.label ?? null });
  });

  const groupLabels: Record<string, string> = {
    general: "🏢 General",
    hero: "🎯 Hero Section",
    stats: "📊 Statistics",
    contact: "📞 Contact Info",
    social: "🔗 Social Media",
    seo: "🔍 SEO",
    about: "📄 About Page",
    services: "⚙️ Services",
    theme: "🎨 Theme & Colors",
  };

  const groupOrder = ["general", "hero", "stats", "contact", "social", "seo", "about", "services"];

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[var(--accent)]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all website content and configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle size={16} /> Settings saved successfully. Changes are now live on the website.
        </div>
      )}

      <div className="space-y-6">
        {groupOrder.map((groupKey) => {
          const items = groups[groupKey];
          if (!items) return null;

          return (
            <div key={groupKey} className="card">
              <div className="px-6 py-4 border-b bg-gray-50/50">
                <h3 className="font-bold text-[var(--primary)]">{groupLabels[groupKey] || groupKey}</h3>
              </div>
              <div className="p-6 space-y-4">
                {items.map((item) => {
                  const value = form[item.key] || "";
                  const isLong = value.length > 100 || item.key.includes("content") || item.key.includes("json") || item.key.includes("description");

                  return (
                    <div key={item.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {item.label || item.key}
                        <span className="text-xs text-gray-400 ml-2 font-normal">({item.key})</span>
                      </label>
                      {isLong ? (
                        <textarea
                          value={value}
                          onChange={(e) => updateField(item.key, e.target.value)}
                          rows={item.key.includes("json") ? 8 : 4}
                          className="input-field resize-none font-mono text-sm"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateField(item.key, e.target.value)}
                          className="input-field"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky save bar on mobile */}
      <div className="sticky bottom-4 flex justify-end lg:hidden">
        <button onClick={handleSave} disabled={saving} className="btn-primary shadow-lg">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
