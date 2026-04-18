"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Save, CheckCircle, Palette, RotateCcw, Eye } from "lucide-react";

interface ColorSetting {
  key: string;
  label: string;
  description: string;
  defaultValue: string;
}

const COLOR_SETTINGS: ColorSetting[] = [
  { key: "theme_primary",       label: "Primary Color",        description: "Main brand color — navbar, headings, sidebar (default: navy #1A2B5F)",   defaultValue: "#1A2B5F" },
  { key: "theme_primary_light", label: "Primary Light",        description: "Lighter variant of primary (default: #2A3B6F)",                          defaultValue: "#2A3B6F" },
  { key: "theme_primary_dark",  label: "Primary Dark",         description: "Darker variant of primary — footer, dark sections (default: #0F1B3F)",   defaultValue: "#0F1B3F" },
  { key: "theme_accent",        label: "Accent Color",         description: "Action buttons, CTAs, highlights (default: orange #E8622A)",              defaultValue: "#E8622A" },
  { key: "theme_accent_light",  label: "Accent Light",         description: "Hover state for accent buttons (default: #F5733B)",                      defaultValue: "#F5733B" },
  { key: "theme_accent_dark",   label: "Accent Dark",          description: "Darker accent — pressed states (default: #D04E18)",                      defaultValue: "#D04E18" },
  { key: "theme_background",    label: "Background",           description: "Page background color (default: #FAFBFD)",                               defaultValue: "#FAFBFD" },
  { key: "theme_foreground",    label: "Text Color",           description: "Default body text color (default: #0F172A)",                              defaultValue: "#0F172A" },
];

const PRESETS: { name: string; colors: Record<string, string> }[] = [
  {
    name: "🌊 Default (Navy & Orange)",
    colors: { theme_primary: "#1A2B5F", theme_primary_light: "#2A3B6F", theme_primary_dark: "#0F1B3F", theme_accent: "#E8622A", theme_accent_light: "#F5733B", theme_accent_dark: "#D04E18", theme_background: "#FAFBFD", theme_foreground: "#0F172A" },
  },
  {
    name: "🌿 Forest Green",
    colors: { theme_primary: "#1B4332", theme_primary_light: "#2D6A4F", theme_primary_dark: "#0B2F1F", theme_accent: "#D4A843", theme_accent_light: "#E0BB5A", theme_accent_dark: "#B8912F", theme_background: "#FAFBF7", theme_foreground: "#0F172A" },
  },
  {
    name: "🔵 Ocean Blue",
    colors: { theme_primary: "#1E3A5F", theme_primary_light: "#2A5B8F", theme_primary_dark: "#0F2441", theme_accent: "#0EA5E9", theme_accent_light: "#38BDF8", theme_accent_dark: "#0284C7", theme_background: "#F8FAFC", theme_foreground: "#0F172A" },
  },
  {
    name: "🍇 Royal Purple",
    colors: { theme_primary: "#312E81", theme_primary_light: "#4338CA", theme_primary_dark: "#1E1B4B", theme_accent: "#F59E0B", theme_accent_light: "#FBBF24", theme_accent_dark: "#D97706", theme_background: "#FAF5FF", theme_foreground: "#0F172A" },
  },
  {
    name: "🖤 Elegant Dark",
    colors: { theme_primary: "#1F2937", theme_primary_light: "#374151", theme_primary_dark: "#111827", theme_accent: "#EF4444", theme_accent_light: "#F87171", theme_accent_dark: "#DC2626", theme_background: "#F9FAFB", theme_foreground: "#111827" },
  },
  {
    name: "🌸 Rose Pink",
    colors: { theme_primary: "#881337", theme_primary_light: "#9F1239", theme_primary_dark: "#4C0519", theme_accent: "#FB923C", theme_accent_light: "#FDBA74", theme_accent_dark: "#EA580C", theme_background: "#FFF1F2", theme_foreground: "#1C1917" },
  },
];

// CSS variable name mapping
const CSS_VAR_MAP: Record<string, string> = {
  theme_primary:       "--primary",
  theme_primary_light: "--primary-light",
  theme_primary_dark:  "--primary-dark",
  theme_accent:        "--accent",
  theme_accent_light:  "--accent-light",
  theme_accent_dark:   "--accent-dark",
  theme_background:    "--background",
  theme_foreground:    "--foreground",
};

function ColorSwatch({ color, size = "w-8 h-8" }: { color: string; size?: string }) {
  return (
    <div
      className={`${size} rounded-lg border-2 border-white shadow-md shrink-0`}
      style={{ backgroundColor: color }}
    />
  );
}

export default function AdminThemePage() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch current color settings
  const fetchColors = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const d = await res.json();
      if (d.success) {
        const map: Record<string, string> = {};
        d.data.forEach((s: any) => {
          if (s.key.startsWith("theme_")) map[s.key] = s.value;
        });
        // Fill defaults for any missing
        COLOR_SETTINGS.forEach(cs => {
          if (!map[cs.key]) map[cs.key] = cs.defaultValue;
        });
        setColors(map);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchColors(); }, [fetchColors]);

  // Live preview — apply colors to CSS variables in real time
  useEffect(() => {
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = CSS_VAR_MAP[key];
      if (cssVar && value) {
        document.documentElement.style.setProperty(cssVar, value);
      }
    });
  }, [colors]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const settingsArray = Object.entries(colors).map(([key, value]) => ({
        key,
        value,
        group: "theme",
        label: COLOR_SETTINGS.find(c => c.key === key)?.label || key,
      }));
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsArray }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setColors(prev => ({ ...prev, ...preset.colors }));
  };

  const resetDefaults = () => {
    const defaults: Record<string, string> = {};
    COLOR_SETTINGS.forEach(cs => { defaults[cs.key] = cs.defaultValue; });
    setColors(defaults);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[var(--accent)]" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
            <Palette size={24} /> Theme & Colors
          </h1>
          <p className="text-gray-500 text-sm mt-1">Customize the website color scheme — changes preview in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetDefaults} className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saved ? "Saved!" : "Save Colors"}
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle size={16} /> Theme saved! Colors are now live on the website.
        </div>
      )}

      {/* Live Preview Bar */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50/50">
          <h3 className="font-bold text-[var(--primary)] flex items-center gap-2"><Eye size={16} /> Live Preview</h3>
        </div>
        <div className="p-6">
          <div className="rounded-2xl overflow-hidden border shadow-sm">
            {/* Preview navbar */}
            <div className="px-6 py-3 flex items-center justify-between" style={{ backgroundColor: colors.theme_primary || "#1A2B5F" }}>
              <span className="text-white font-bold text-sm">Eduwave</span>
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-xs">Home</span>
                <span className="text-white/70 text-xs">About</span>
                <span className="text-white/70 text-xs">Services</span>
                <button className="px-3 py-1 rounded-md text-white text-xs font-semibold" style={{ backgroundColor: colors.theme_accent || "#E8622A" }}>Apply Now</button>
              </div>
            </div>
            {/* Preview content */}
            <div className="p-6" style={{ backgroundColor: colors.theme_background || "#FAFBFD" }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.theme_primary || "#1A2B5F" }}>Welcome to Eduwave</h3>
              <p className="text-sm mb-4" style={{ color: colors.theme_foreground || "#0F172A" }}>This is a preview of how your website will look with these colors.</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: colors.theme_accent || "#E8622A" }}>Primary Button</button>
                <button className="px-4 py-2 rounded-lg border-2 text-sm font-semibold" style={{ borderColor: colors.theme_primary || "#1A2B5F", color: colors.theme_primary || "#1A2B5F" }}>Secondary Button</button>
              </div>
            </div>
            {/* Preview footer */}
            <div className="px-6 py-3" style={{ backgroundColor: colors.theme_primary_dark || "#0F1B3F" }}>
              <span className="text-white/70 text-xs">© 2025 Eduwave Educational Consultancy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Color Presets */}
      <div className="card">
        <div className="px-6 py-4 border-b bg-gray-50/50">
          <h3 className="font-bold text-[var(--primary)]">🎨 Color Presets</h3>
          <p className="text-gray-400 text-xs mt-1">Click a preset to apply it instantly. You can further customize individual colors below.</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[var(--accent)] hover:shadow-md transition-all text-left group"
            >
              <div className="flex -space-x-1.5">
                <ColorSwatch color={preset.colors.theme_primary} />
                <ColorSwatch color={preset.colors.theme_accent} />
                <ColorSwatch color={preset.colors.theme_primary_dark} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[var(--accent)] transition-colors">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Individual Color Controls */}
      <div className="card">
        <div className="px-6 py-4 border-b bg-gray-50/50">
          <h3 className="font-bold text-[var(--primary)]">🎨 Individual Colors</h3>
          <p className="text-gray-400 text-xs mt-1">Fine-tune each color. Changes preview instantly.</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {COLOR_SETTINGS.map((cs) => (
            <div key={cs.key} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              {/* Color picker */}
              <div className="relative shrink-0">
                <input
                  type="color"
                  value={colors[cs.key] || cs.defaultValue}
                  onChange={(e) => setColors(prev => ({ ...prev, [cs.key]: e.target.value }))}
                  className="w-12 h-12 rounded-xl cursor-pointer border-2 border-white shadow-md"
                  style={{ padding: 0 }}
                />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-semibold text-gray-800">{cs.label}</label>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{cs.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={colors[cs.key] || cs.defaultValue}
                    onChange={(e) => setColors(prev => ({ ...prev, [cs.key]: e.target.value }))}
                    className="w-28 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]"
                    placeholder="#000000"
                  />
                  {colors[cs.key] !== cs.defaultValue && (
                    <button
                      onClick={() => setColors(prev => ({ ...prev, [cs.key]: cs.defaultValue }))}
                      className="text-xs text-gray-400 hover:text-[var(--accent)] transition-colors"
                      title="Reset to default"
                    >
                      <RotateCcw size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky save bar on mobile */}
      <div className="sticky bottom-4 flex justify-end lg:hidden">
        <button onClick={handleSave} disabled={saving} className="btn-primary shadow-lg">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Colors
        </button>
      </div>
    </div>
  );
}
