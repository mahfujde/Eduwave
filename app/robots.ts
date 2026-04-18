import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theeduwave.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/services",
          "/contact",
          "/universities",
          "/universities/*",
          "/courses",
          "/courses/*",
          "/blog",
          "/blog/*",
          "/track",
          "/privacy-policy",
          "/terms",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/portal",
          "/portal/*",
          "/agent",
          "/agent/*",
          "/api",
          "/api/*",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/portal", "/agent", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
