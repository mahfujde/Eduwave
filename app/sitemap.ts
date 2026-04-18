import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://theeduwave.com";

  // Static pages
  const staticPages = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/universities`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/track`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  // Dynamic university pages
  let universityPages: MetadataRoute.Sitemap = [];
  try {
    const universities = await prisma.university.findMany({
      where: { isPublic: true },
      select: { slug: true, updatedAt: true },
    });
    universityPages = universities.map((uni) => ({
      url: `${baseUrl}/universities/${uni.slug}`,
      lastModified: uni.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (e) {
    // DB might not be available during build
  }

  // Dynamic course pages
  let coursePages: MetadataRoute.Sitemap = [];
  try {
    const courses = await prisma.program.findMany({
      where: { isPublic: true },
      select: { slug: true, updatedAt: true },
    });
    coursePages = courses.map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (e) {
    // DB might not be available during build
  }

  // Dynamic blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (e) {
    // DB might not be available during build
  }

  return [...staticPages, ...universityPages, ...coursePages, ...blogPages];
}
