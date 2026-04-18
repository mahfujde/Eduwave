"use client";

import { useEffect } from "react";

/**
 * ThemeLoader — reads saved theme colors from the site settings API
 * and applies them as CSS custom properties on :root.
 * Runs once on mount. Falls back to the CSS-defined defaults if no
 * theme settings are stored in the database.
 */

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

export default function ThemeLoader() {
  useEffect(() => {
    fetch("/api/public/settings")
      .then(r => r.json())
      .then(d => {
        if (!d.success) return;
        const settings: { key: string; value: string }[] = d.data;
        settings.forEach(({ key, value }) => {
          const cssVar = CSS_VAR_MAP[key];
          if (cssVar && value) {
            document.documentElement.style.setProperty(cssVar, value);
          }
        });
      })
      .catch(() => {});
  }, []);

  return null; // renders nothing — side-effect only
}
