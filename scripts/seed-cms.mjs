// scripts/seed-cms.mjs — Run with: node scripts/seed-cms.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const ABOUT_SECTIONS = JSON.stringify([
  { id: "about-hero", type: "hero", visible: true, subtitle: "About Eduwave", title: "We Are More Than a Consultancy", content: "We are your local guardian in Malaysia — from the moment you reach out until long after you settle into student life.", padding: "large" },
  { id: "about-story", type: "text", visible: true, subtitle: "Est. 2022", title: "Our Story", content: "Eduwave Educational Consultancy was born from a belief that every Bangladeshi student deserves access to world-class education, completely honest guidance, and real support from people who actually know what they are talking about.\n\nWe are not a website. We are not a phone number. We are a team based right here in Malaysia, processing your admission, handling your visa, and standing beside you when you land at KLIA.\n\nSince 2022, Eduwave has grown into one of the most recognized and trusted names in Malaysian education consultancy for Bangladeshi students." },
  { id: "about-stats", type: "stats", visible: true, title: "Our Impact", columns: 4, items: [
    { id: "s1", icon: "👥", title: "350+", content: "Students Enrolled" },
    { id: "s2", icon: "🎓", title: "32+", content: "Partner Universities" },
    { id: "s3", icon: "🛡️", title: "100%", content: "Free Service" },
    { id: "s4", icon: "🕐", title: "24/7", content: "Virtual Counselling" },
  ]},
  { id: "about-mission", type: "cards", visible: true, title: "Mission & Vision", columns: 2, items: [
    { id: "m1", icon: "🌍", title: "Our Mission", content: "To make high-quality international education genuinely accessible to every Bangladeshi student, by providing expert, honest, and completely free consultancy services from our base in Malaysia." },
    { id: "m2", icon: "⭐", title: "Our Vision", content: "We envision a Bangladesh where geography is never a barrier to greatness. Where a student has the same shot at a world-class education as anyone else." },
  ]},
  { id: "about-diff", type: "cards", visible: true, title: "Why We Are Different", columns: 4, items: [
    { id: "d1", icon: "📍", title: "Malaysia-Based, Not Remote", content: "We operate directly from Malaysia. No middlemen. No delays." },
    { id: "d2", icon: "🕐", title: "24/7 Virtual Counselling", content: "Our counsellors are available around the clock through virtual sessions." },
    { id: "d3", icon: "❤️", title: "Your Local Guardian", content: "After you arrive in Malaysia, we remain your support system." },
    { id: "d4", icon: "🛡️", title: "Zero Charges, Always", content: "Every service is completely free. No consultation or processing fees." },
  ]},
  { id: "about-team", type: "team", visible: true, subtitle: "Our Leadership", title: "Built by People Who Lived the Journey", content: "Eduwave was not built in a boardroom. It was built by people who lived the journey.", columns: 2, items: [
    { id: "t1", title: "Md. Nayem Uddin", subtitle: "Founder & Managing Director", content: "As the Founder and Managing Director, Md. Nayem Uddin has guided over 350+ students to universities across Malaysia. Currently pursuing his Master's of Information Technology.", imageUrl: "" },
    { id: "t2", title: "Md. Nazim Uddin, PhD", subtitle: "General Manager", content: "Md. Nazim Uddin serves as General Manager with a PhD and specialized expertise in counselling, student motivation, and visa processing.", imageUrl: "" },
  ]},
  { id: "about-cta", type: "cta", visible: true, title: "Ready to Start Your Journey?", content: "Get in touch with our Malaysia-based team today. Free, honest guidance — 24/7.", ctaText: "Contact Us Now", ctaUrl: "/contact" },
]);

const HOME_SECTIONS = JSON.stringify([
  {
    id: "home-hero", type: "hero", visible: true,
    subtitle: "Available 24/7 from Malaysia",
    title: "From Bangladesh to Global Universities",
    content: "Malaysia-based. Available 24/7. Completely Free. 350+ students successfully enrolled. We are your local guardian on the ground — from application to arrival and beyond.",
    ctaText: "Start Your Journey Today", ctaUrl: "/contact",
    ctaSecondaryText: "WhatsApp Us", ctaSecondaryUrl: "https://wa.me/601124103692",
    padding: "xl",
  },
  {
    id: "home-stats", type: "stats", visible: true,
    subtitle: "Our Track Record",
    title: "Trusted by Students Across Bangladesh",
    columns: 4,
    items: [
      { id: "hs1", icon: "👥", title: "350+", content: "Students Enrolled" },
      { id: "hs2", icon: "🌐", title: "100,000+", content: "Community Members" },
      { id: "hs3", icon: "🎓", title: "32+", content: "Partner Universities" },
      { id: "hs4", icon: "🕐", title: "24/7", content: "Virtual Counselling" },
    ],
  },
  {
    id: "home-intro", type: "text", visible: true,
    subtitle: "Who We Are",
    title: "Your Local Guardian in Malaysia",
    content: "Every great journey begins with a single, courageous decision. At Eduwave Educational Consultancy, we make sure that decision leads somewhere extraordinary. Founded in 2022 and operating directly from Malaysia, we are more than a consultancy. We are your local guardian on the ground, your guide through the process, and your strongest support system from the moment you reach out until long after you settle into student life.",
  },
  {
    id: "home-services", type: "cards", visible: true,
    subtitle: "100% Free Services",
    title: "Everything We Do — At Zero Cost",
    content: "No consultation fees. No processing fees. No hidden costs. Not ever. We are funded by our university partners, which means world-class support at zero cost to you.",
    columns: 4,
    items: [
      { id: "sv1",  icon: "🎓", title: "University Selection & Free Admission", content: "Expert counsellors matched to your profile, goals, and budget. Complete application handling." },
      { id: "sv2",  icon: "📄", title: "Document Preparation", content: "We review, prepare, and organize every document — transcripts, letters, and supporting materials." },
      { id: "sv3",  icon: "🏦", title: "Bank Statement & Income Support", content: "Detailed guidance on financial documentation that meets Malaysian immigration requirements." },
      { id: "sv4",  icon: "🛂", title: "Visa Consultation & Application", content: "Experienced team walks you through every requirement and submits correctly the first time." },
      { id: "sv5",  icon: "🎤", title: "Visa Interview Preparation", content: "Mock sessions, likely questions coaching, and confidence building for a successful outcome." },
      { id: "sv6",  icon: "✈️", title: "Airport Pickup Service", content: "Our Malaysia team receives you personally with assistance to your accommodation." },
      { id: "sv7",  icon: "🏠", title: "Accommodation Arrangement", content: "Safe, affordable, well-located housing sourced, verified, and arranged near your campus." },
      { id: "sv8",  icon: "🏥", title: "Medical Check-Up Support", content: "Guided to recognized clinics with appointment assistance for visa medical requirements." },
      { id: "sv9",  icon: "📚", title: "University Registration", content: "We personally accompany every student to their university on registration day." },
      { id: "sv10", icon: "🤝", title: "Ongoing Local Guardian Support", content: "Your support system throughout your entire academic journey in Malaysia." },
      { id: "sv11", icon: "📞", title: "24/7 Virtual Counselling", content: "Expert guidance via video calls, WhatsApp, and phone — from Malaysia, around the clock." },
      { id: "sv12", icon: "🌍", title: "International Study Programs", content: "Beyond Malaysia: Australia, Canada, UK, Europe, USA, China, Japan, Korea, and more." },
    ],
  },
  {
    id: "home-youtube", type: "youtube", visible: true,
    subtitle: "Watch Our Story",
    title: "Why Students Choose Us & What Makes Us Different!!",
    content: "Every dream deserves the right direction. Without expert guidance, even the strongest ambitions can lose their path. We go beyond services — we become your trusted partner in shaping a successful future.\nWatch our videos before making your first move.",
    ctaText: "Visit Our Channel",
    ctaUrl: "https://youtube.com/@roamingwithnayem",
    items: [
      { id: "yt1", title: "Study in Malaysia — Everything You Need to Know", linkUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { id: "yt2", title: "Eduwave Student Success Story — APU Malaysia", linkUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { id: "yt3", title: "Free Visa Consultation — How We Help You", linkUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { id: "yt4", title: "Malaysia University Life — Student Guide 2024", linkUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { id: "yt5", title: "Eduwave Airport Pickup Experience", linkUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { id: "yt6", title: "Why Study in Malaysia? Top Reasons", linkUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
  },
  {
    id: "home-universities", type: "text", visible: true,
    subtitle: "Our Partners",
    title: "32+ Partner Universities",
    content: "We have carefully built direct partnerships with some of Malaysia's finest universities. Every institution has been evaluated for academic quality, career outcomes, and suitability for Bangladeshi students. Featured universities are shown dynamically from the database.",
  },
  {
    id: "home-testimonials", type: "testimonials", visible: true,
    subtitle: "Student Stories",
    title: "What Our Students Say",
    content: "350+ students have trusted Eduwave for their study abroad journey.",
  },
  {
    id: "home-cta", type: "cta", visible: true,
    title: "Ready to Start Your Journey?",
    content: "Reach out and one of our Malaysia-based counsellors will respond promptly with honest, practical guidance. No pressure. No obligation. Just real answers.",
    ctaText: "Send My Free Inquiry", ctaUrl: "/contact",
    ctaSecondaryText: "WhatsApp 24/7", ctaSecondaryUrl: "https://wa.me/601124103692",
  },
]);

const SERVICES_SECTIONS = JSON.stringify([
  { id: "svc-hero", type: "hero", visible: true, subtitle: "100% Free of Charge", title: "Our Complimentary Services", content: "Most consultancies complete the paperwork and call it a day. We are built differently.", padding: "large" },
  { id: "svc-intro", type: "text", visible: true, title: "Your Local Guardian in Malaysia", content: "At Eduwave, we act as your local guardian in Malaysia. From the moment you first reach out to the day you settle comfortably into student life, our team is with you at every step.\n\nEvery service below is provided completely free of charge. No consultation fees. No processing fees. No hidden costs." },
  { id: "svc-grid", type: "cards", visible: true, title: "Everything You Need — Free", columns: 2, items: [
    { id: "sg1", icon: "🎓", title: "University Selection & Admission", content: "Expert counsellors match your profile to the perfect university." },
    { id: "sg2", icon: "📄", title: "Document Preparation", content: "We review and organize every document required." },
    { id: "sg3", icon: "🏦", title: "Financial Documentation", content: "Guidance on bank statements and income documentation." },
    { id: "sg4", icon: "🛂", title: "Visa Application", content: "Full visa application preparation and tracking." },
    { id: "sg5", icon: "🎤", title: "Interview Support", content: "Mock sessions and coaching for visa interviews." },
    { id: "sg6", icon: "✈️", title: "Airport Pickup", content: "Personal reception at KLIA." },
    { id: "sg7", icon: "🏠", title: "Accommodation", content: "Safe housing near your university with lease review." },
    { id: "sg8", icon: "🏥", title: "Medical Check-Up", content: "Guidance to recognized clinics and appointment assistance." },
    { id: "sg9", icon: "📚", title: "University Registration", content: "We accompany you to registration day." },
    { id: "sg10", icon: "🤝", title: "Ongoing Guardian Support", content: "We remain your support system throughout studies." },
    { id: "sg11", icon: "📞", title: "24/7 Virtual Counselling", content: "Expert guidance via video calls, WhatsApp, and phone." },
    { id: "sg12", icon: "🌍", title: "International Programs", content: "Admissions to Australia, Canada, UK, Europe, and beyond." },
  ]},
  { id: "svc-cta", type: "cta", visible: true, title: "All These Services. Zero Cost. Always.", content: "Ready to take the first step? Reach out for free, honest guidance.", ctaText: "Send My Free Inquiry", ctaUrl: "/contact" },
]);

const CONTACT_SECTIONS = JSON.stringify([
  { id: "ct-hero", type: "hero", visible: true, subtitle: "24/7 Virtual Counselling", title: "Contact Us", content: "Ready to take the first step? Reach out and one of our Malaysia-based counsellors will respond promptly.", padding: "normal" },
  { id: "ct-info", type: "cards", visible: true, title: "Get in Touch", columns: 4, items: [
    { id: "ci1", icon: "📞", title: "+60112-4103692", subtitle: "WhatsApp / Phone", content: "Malaysia (Primary)" },
    { id: "ci2", icon: "✉️", title: "ceo.eduwave@gmail.com", subtitle: "Email", content: "We respond within 24 hours" },
    { id: "ci3", icon: "📍", title: "Chattogram Office", subtitle: "Support Office", content: "Akhteruzzaman Center, Agrabad CIA" },
    { id: "ci4", icon: "🕐", title: "24/7 Available", subtitle: "Virtual Counselling", content: "Via WhatsApp, Video Call, or Phone" },
  ]},
  { id: "ct-faq", type: "faq", visible: true, subtitle: "Common Questions", title: "Frequently Asked Questions", items: [
    { id: "f1", title: "Is your service really free?", content: "Yes, 100%. We are funded by our university partners." },
    { id: "f2", title: "How long does the admission process take?", content: "Typically 2-4 weeks depending on the university." },
    { id: "f3", title: "Do you help with visa processing?", content: "Yes, our team handles the entire visa application process." },
    { id: "f4", title: "What if I need help after arriving?", content: "We are your local guardian — ongoing support throughout your studies." },
  ]},
  { id: "ct-cta", type: "cta", visible: true, title: "Prefer WhatsApp?", content: "Chat with our team anytime, 24/7.", ctaText: "Chat on WhatsApp", ctaUrl: "https://wa.me/601124103692" },
]);

const PAGES = [
  { slug: "about", title: "About Us", sections: ABOUT_SECTIONS, sortOrder: 2, isSystem: true, metaTitle: "About Eduwave Educational Consultancy", metaDesc: "Learn about Eduwave, Malaysia's trusted free educational consultancy." },
  { slug: "home", title: "Home", sections: HOME_SECTIONS, sortOrder: 1, isSystem: true, metaTitle: "Eduwave - Free Educational Consultancy", metaDesc: "Free admission, visa, and settlement support for Bangladeshi students." },
  { slug: "services", title: "Services", sections: SERVICES_SECTIONS, sortOrder: 3, isSystem: true, metaTitle: "Our Free Services - Eduwave", metaDesc: "Complete list of free services from Eduwave." },
  { slug: "contact", title: "Contact Us", sections: CONTACT_SECTIONS, sortOrder: 4, isSystem: true, metaTitle: "Contact Eduwave", metaDesc: "Contact our Malaysia-based team for free educational consultation." },
];

async function main() {
  for (const page of PAGES) {
    const existing = await prisma.page.findFirst({ where: { slug: page.slug } });
    if (existing) {
      await prisma.page.update({ where: { id: existing.id }, data: { sections: page.sections, status: "published", metaTitle: page.metaTitle, metaDesc: page.metaDesc } });
      console.log(`✅ Updated: ${page.slug}`);
    } else {
      await prisma.page.create({ data: { ...page, status: "published" } });
      console.log(`✅ Created: ${page.slug}`);
    }
  }
  console.log("🎉 All CMS pages seeded!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
