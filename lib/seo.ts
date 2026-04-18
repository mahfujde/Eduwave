// lib/seo.ts — SEO & Structured Data Helpers for Eduwave

const SITE_NAME = "Eduwave Educational Consultancy";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://theeduwave.com";
const LOGO_URL = `${SITE_URL}/images/logos/eduwave-logo.png`;

/**
 * Generate Organization JSON-LD schema
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    description:
      "Eduwave Educational Consultancy — Your trusted partner for studying abroad in Malaysia. Free guidance, visa support, and university admissions for Bangladeshi students.",
    foundingDate: "2022",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+60112-4103692",
        contactType: "customer service",
        areaServed: ["BD", "MY"],
        availableLanguage: ["English", "Bengali"],
      },
    ],
    address: [
      {
        "@type": "PostalAddress",
        addressCountry: "MY",
        addressLocality: "Malaysia",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Akhteruzzaman Center (7th Floor), 21/22, Agrabad CIA",
        addressLocality: "Chattogram",
        addressCountry: "BD",
      },
    ],
    sameAs: [
      "https://www.facebook.com/EduwaveEducation",
      "https://www.instagram.com/the_eduwave",
      "https://youtube.com/@roamingwithnayem",
    ],
  };
}

/**
 * Generate WebSite JSON-LD schema
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/courses?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate Course schema for programs/courses
 */
export function getCourseSchema(course: {
  name: string;
  description?: string;
  provider: string;
  url: string;
  duration?: string;
  level?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description || `Study ${course.name} at ${course.provider} through Eduwave.`,
    provider: {
      "@type": "Organization",
      name: course.provider,
    },
    url: course.url.startsWith("http") ? course.url : `${SITE_URL}${course.url}`,
    ...(course.duration && { timeRequired: course.duration }),
    ...(course.level && {
      educationalLevel: course.level,
    }),
  };
}

/**
 * Generate Review/Testimonial schema
 */
export function getReviewSchema(reviews: {
  name: string;
  rating: number;
  text: string;
  university?: string;
}[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
      },
      reviewBody: r.text,
    })),
  };
}

/**
 * Generate FAQ schema
 */
export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article schema for blog posts
 */
export function getArticleSchema(article: {
  title: string;
  description?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description || article.title,
    author: {
      "@type": "Organization",
      name: article.author || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    url: article.url.startsWith("http") ? article.url : `${SITE_URL}${article.url}`,
    ...(article.image && {
      image: article.image.startsWith("http") ? article.image : `${SITE_URL}${article.image}`,
    }),
  };
}
