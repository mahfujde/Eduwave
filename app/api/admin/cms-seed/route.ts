import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/rbac";

// Sections for each page
const ABOUT_SECTIONS = JSON.stringify([
  { id: "about-hero", type: "hero", visible: true, subtitle: "About Eduwave", title: "We Are More Than a Consultancy", content: "We are your local guardian in Malaysia — from the moment you reach out until long after you settle into student life.", padding: "large" },
  { id: "about-story", type: "text", visible: true, subtitle: "Est. 2022", title: "Our Story", content: "Eduwave Educational Consultancy was born from a belief that every Bangladeshi student deserves access to world-class education, completely honest guidance, and real support from people who actually know what they are talking about.\n\nWe are not a website. We are not a phone number. We are a team based right here in Malaysia, processing your admission, handling your visa, and standing beside you when you land at KLIA.\n\nSince 2022, Eduwave has grown into one of the most recognized and trusted names in Malaysian education consultancy for Bangladeshi students. We work directly with over 32 top Malaysian universities, offering a fully end-to-end service that costs our students absolutely nothing." },
  { id: "about-stats", type: "stats", visible: true, title: "Our Impact", columns: 4, items: [
    { id: "s1", icon: "👥", title: "350+", content: "Students Enrolled" },
    { id: "s2", icon: "🎓", title: "32+", content: "Partner Universities" },
    { id: "s3", icon: "🛡️", title: "100%", content: "Free Service" },
    { id: "s4", icon: "🕐", title: "24/7", content: "Virtual Counselling" },
  ]},
  { id: "about-mission", type: "cards", visible: true, title: "Mission & Vision", columns: 2, items: [
    { id: "m1", icon: "🌍", title: "Our Mission", content: "To make high-quality international education genuinely accessible to every Bangladeshi student, by providing expert, honest, and completely free consultancy services from our base in Malaysia. We handle the complexity so our students can focus on what matters: building their future." },
    { id: "m2", icon: "⭐", title: "Our Vision", content: "We envision a Bangladesh where geography is never a barrier to greatness. Where a student from Chittagong, Sylhet, or Rangpur has the same shot at a world-class education as anyone else, simply because they had access to the right guidance at the right time." },
  ]},
  { id: "about-diff", type: "cards", visible: true, title: "Why We Are Different", columns: 4, items: [
    { id: "d1", icon: "📍", title: "Malaysia-Based, Not Remote", content: "We operate directly from Malaysia. No middlemen. No delays." },
    { id: "d2", icon: "🕐", title: "24/7 Virtual Counselling", content: "Our counsellors are available around the clock through virtual sessions." },
    { id: "d3", icon: "❤️", title: "Your Local Guardian", content: "After you arrive in Malaysia, we remain your support system." },
    { id: "d4", icon: "🛡️", title: "Zero Charges, Always", content: "Every service is completely free. No consultation or processing fees." },
  ]},
  { id: "about-team", type: "team", visible: true, subtitle: "Our Leadership", title: "Built by People Who Lived the Journey", content: "Eduwave was not built in a boardroom. It was built by people who lived the journey, understood the struggle, and decided to do something about it.", columns: 2, items: [
    { id: "t1", title: "Md. Nayem Uddin", subtitle: "Founder & Managing Director", content: "As the Founder and Managing Director, Md. Nayem Uddin has turned a deeply personal understanding of what Bangladeshi students face into a company that has guided over 350+ students to universities across Malaysia. Currently pursuing his Master's of Information Technology in Malaysia, Nayem brings academic depth, real-world expertise, and an unshakeable commitment to transparency.", imageUrl: "" },
    { id: "t2", title: "Md. Nazim Uddin, PhD", subtitle: "General Manager", content: "Md. Nazim Uddin serves as General Manager with a PhD and specialized expertise in counselling, student motivation, and visa processing. With over a decade of experience in education, he is the operational backbone of Eduwave. Dr. Nazim has a rare combination of deep expertise and genuine empathy.", imageUrl: "" },
  ]},
  { id: "about-cta", type: "cta", visible: true, title: "Ready to Start Your Journey?", content: "Get in touch with our Malaysia-based team today. Free, honest guidance — 24/7.", ctaText: "Contact Us Now", ctaUrl: "/contact", padding: "large" },
]);

const HOME_SECTIONS = JSON.stringify([
  { id: "home-hero", type: "hero", visible: true, subtitle: "Free Educational Consultancy", title: "Your Gateway to World-Class Education in Malaysia", content: "Eduwave is a Malaysia-based educational consultancy that provides completely free admission, visa, and settlement support to Bangladeshi students.", ctaText: "Free Consultation", ctaUrl: "/contact", ctaSecondaryText: "Our Services", ctaSecondaryUrl: "/services", padding: "xl" },
  { id: "home-stats", type: "stats", visible: true, title: "Trusted by Students Across Bangladesh", columns: 4, items: [
    { id: "hs1", icon: "🎓", title: "350+", content: "Students Enrolled" },
    { id: "hs2", icon: "🏛️", title: "32+", content: "Partner Universities" },
    { id: "hs3", icon: "🌏", title: "10+", content: "Countries Covered" },
    { id: "hs4", icon: "💯", title: "100%", content: "Free Service" },
  ]},
  { id: "home-services", type: "cards", visible: true, subtitle: "What We Do", title: "Our Services", content: "From university selection to post-arrival support — everything you need, completely free.", columns: 3, items: [
    { id: "sv1", icon: "🎓", title: "University Selection", content: "Expert guidance on choosing the perfect university and program based on your profile and goals." },
    { id: "sv2", icon: "📋", title: "Admission Processing", content: "Complete application handling including document preparation, submission, and follow-up." },
    { id: "sv3", icon: "🛂", title: "Visa Support", content: "Full visa application assistance with document verification, interview prep, and tracking." },
    { id: "sv4", icon: "✈️", title: "Airport Pickup", content: "Personal airport reception in Malaysia with assistance to your accommodation." },
    { id: "sv5", icon: "🏠", title: "Accommodation", content: "Safe, affordable housing arrangement near your university with lease review." },
    { id: "sv6", icon: "🤝", title: "Local Guardian", content: "Ongoing support throughout your studies — we never disappear after enrollment." },
  ]},
  { id: "home-cta", type: "cta", visible: true, title: "Start Your Journey Today", content: "Join 350+ students who have trusted Eduwave for their educational journey. 100% free, always.", ctaText: "Get Free Consultation", ctaUrl: "/contact" },
]);

const SERVICES_SECTIONS = JSON.stringify([
  { id: "svc-hero", type: "hero", visible: true, subtitle: "100% Free of Charge", title: "Our Complimentary Services", content: "Most consultancies complete the paperwork and call it a day. We are built differently.", padding: "large" },
  { id: "svc-intro", type: "text", visible: true, title: "Your Local Guardian in Malaysia", content: "At Eduwave Educational Consultancy, we do not simply process your application and consider our responsibility finished. We act as your local guardian in Malaysia. From the moment you first reach out to the day you settle comfortably into your student life, our dedicated team on the ground in Malaysia is with you at every single step.\n\nEvery service listed below is provided completely free of charge. No consultation fees. No processing fees. No hidden costs. Not ever." },
  { id: "svc-grid", type: "cards", visible: true, title: "Everything You Need — Free", columns: 2, items: [
    { id: "sg1", icon: "🎓", title: "University Selection & Free Admission", content: "Expert counsellors match your profile to the perfect university. Complete application handling." },
    { id: "sg2", icon: "📄", title: "Document Preparation", content: "We review, prepare, and organize every document required — transcripts, letters, and all supporting materials." },
    { id: "sg3", icon: "🏦", title: "Bank Statement & Income Source Prep", content: "Detailed guidance on financial documentation that meets Malaysian immigration requirements." },
    { id: "sg4", icon: "🛂", title: "Visa Application Assistance", content: "Full visa application preparation, document review, submission, and status tracking." },
    { id: "sg5", icon: "🎤", title: "Visa Interview Support", content: "Mock sessions, coaching on likely questions, and confidence building for interviews." },
    { id: "sg6", icon: "✈️", title: "Airport Pickup Service", content: "Personal reception at KLIA with assistance to your accommodation." },
    { id: "sg7", icon: "🏠", title: "Accommodation Arrangement", content: "Safe, affordable housing near your university with lease review and assistance." },
    { id: "sg8", icon: "🏥", title: "Medical Check-Up Support", content: "Guidance to recognized clinics, appointment assistance, and process support." },
    { id: "sg9", icon: "📚", title: "University Registration", content: "We personally accompany you to registration day. You are never alone." },
    { id: "sg10", icon: "🤝", title: "Ongoing Local Guardian Support", content: "Long after visa approval, we remain your problem-solver and support system." },
    { id: "sg11", icon: "📞", title: "24/7 Virtual Counselling", content: "Expert guidance via video calls, WhatsApp, and phone — any time you need it." },
    { id: "sg12", icon: "🌍", title: "International Study Programs", content: "We also facilitate admissions to Australia, Canada, UK, Europe, USA, China, Japan, Korea, and beyond." },
  ]},
  { id: "svc-cta", type: "cta", visible: true, title: "All These Services. Zero Cost. Always.", content: "Ready to take the first step? Reach out and get free, honest guidance from our Malaysia-based team.", ctaText: "Send My Free Inquiry", ctaUrl: "/contact" },
]);

const CONTACT_SECTIONS = JSON.stringify([
  { id: "ct-hero", type: "hero", visible: true, subtitle: "24/7 Virtual Counselling from Malaysia", title: "Contact Us", content: "Ready to take the first step? We are already here waiting for you. Reach out and one of our Malaysia-based counsellors will respond promptly with honest, practical guidance.", padding: "normal" },
  { id: "ct-info", type: "cards", visible: true, title: "Get in Touch", columns: 4, items: [
    { id: "ci1", icon: "📞", title: "+60112-4103692", subtitle: "WhatsApp / Phone", content: "Malaysia (Primary)" },
    { id: "ci2", icon: "✉️", title: "ceo.eduwave@gmail.com", subtitle: "Email", content: "We respond within 24 hours" },
    { id: "ci3", icon: "📍", title: "Chattogram Office", subtitle: "Support Office", content: "Akhteruzzaman Center (7th Floor), 21/22, Agrabad CIA" },
    { id: "ci4", icon: "🕐", title: "24/7 Available", subtitle: "Virtual Counselling", content: "Via WhatsApp, Video Call, or Phone from Malaysia" },
  ]},
  { id: "ct-faq", type: "faq", visible: true, subtitle: "Common Questions", title: "Frequently Asked Questions", items: [
    { id: "f1", title: "Is your service really free?", content: "Yes, 100%. Every service Eduwave provides is completely free of charge. We are funded by our university partners, so students pay nothing." },
    { id: "f2", title: "How long does the admission process take?", content: "Typically 2-4 weeks from application submission to offer letter, depending on the university and program." },
    { id: "f3", title: "Do you help with visa processing?", content: "Yes, our experienced visa team handles the entire visa application process including document preparation, submission, and tracking." },
    { id: "f4", title: "Can I change my university after arriving?", content: "Yes, we can assist with university transfers. Contact our team and we will guide you through the process." },
    { id: "f5", title: "What if I need help after arriving in Malaysia?", content: "We are your local guardian. Our Malaysia-based team provides ongoing support throughout your entire academic journey." },
  ]},
  { id: "ct-cta", type: "cta", visible: true, title: "Prefer WhatsApp?", content: "Chat directly with our Malaysia-based team anytime, 24/7.", ctaText: "Chat on WhatsApp", ctaUrl: "https://wa.me/601124103692" },
]);

const PAGES = [
  { slug: "about", title: "About Us", sections: ABOUT_SECTIONS, sortOrder: 2, isSystem: true, metaTitle: "About Eduwave Educational Consultancy", metaDesc: "Learn about Eduwave, Malaysia's trusted free educational consultancy for Bangladeshi students." },
  { slug: "home", title: "Home", sections: HOME_SECTIONS, sortOrder: 1, isSystem: true, metaTitle: "Eduwave - Free Educational Consultancy for Malaysia", metaDesc: "Free admission, visa, and settlement support for Bangladeshi students studying in Malaysia." },
  { slug: "services", title: "Services", sections: SERVICES_SECTIONS, sortOrder: 3, isSystem: true, metaTitle: "Our Free Services - Eduwave", metaDesc: "Complete list of free services: university selection, visa support, accommodation, and more." },
  { slug: "contact", title: "Contact Us", sections: CONTACT_SECTIONS, sortOrder: 4, isSystem: true, metaTitle: "Contact Eduwave - Free Consultation", metaDesc: "Contact our Malaysia-based team for free educational consultation. Available 24/7." },
];

export async function POST() {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any)?.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const results = [];
    for (const page of PAGES) {
      const existing = await prisma.page.findFirst({ where: { slug: page.slug } });
      if (existing) {
        // Update only if sections are empty/default
        const currentSections = existing.sections ?? "[]";
        const parsed = JSON.parse(currentSections);
        if (!parsed.length || parsed.length < 2) {
          await prisma.page.update({ where: { id: existing.id }, data: { sections: page.sections, status: "published", metaTitle: page.metaTitle, metaDesc: page.metaDesc } });
          results.push({ slug: page.slug, action: "updated" });
        } else {
          results.push({ slug: page.slug, action: "skipped (already has sections)" });
        }
      } else {
        await prisma.page.create({ data: { ...page, status: "published" } });
        results.push({ slug: page.slug, action: "created" });
      }
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
