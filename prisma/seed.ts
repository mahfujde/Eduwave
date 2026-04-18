import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Eduwave database...\n");

  const pw = await bcrypt.hash("Admin@123", 12);

  // ── Users ──
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@theeduwave.com" },
    update: { role: "SUPER_ADMIN", isApproved: true },
    create: { email: "admin@theeduwave.com", password: pw, name: "Super Admin", role: "SUPER_ADMIN", isApproved: true, isActive: true },
  });

  await prisma.user.upsert({
    where: { email: "editor@theeduwave.com" },
    update: {},
    create: { email: "editor@theeduwave.com", password: pw, name: "Content Editor", role: "EDITOR", isApproved: true, isActive: true },
  });

  const agent = await prisma.user.upsert({
    where: { email: "agent@theeduwave.com" },
    update: {},
    create: { email: "agent@theeduwave.com", password: pw, name: "Demo Agent", role: "AGENT", isApproved: true, isActive: true, agentCode: "AGT-DEMO01" },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@theeduwave.com" },
    update: {},
    create: { email: "student@theeduwave.com", password: pw, name: "Demo Student", role: "STUDENT", isApproved: true, isActive: true, referredBy: "AGT-DEMO01" },
  });

  // Second demo student
  const student2 = await prisma.user.upsert({
    where: { email: "student2@theeduwave.com" },
    update: {},
    create: { email: "student2@theeduwave.com", password: pw, name: "Rahim Ahmed", role: "STUDENT", isApproved: true, isActive: true, referredBy: "AGT-DEMO01" },
  });

  console.log("✅ Users seeded");

  // ── Student Profile ──
  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      dateOfBirth: "2000-05-15",
      nationality: "Bangladeshi",
      passportNo: "AA1234567",
      passportExpiry: "2030-12-31",
      address: "House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh",
      emergencyContact: "Father — +880 1712 345678",
      lastQualification: "A Level / HSC",
      lastInstitution: "Dhaka City College",
      gpa: "4.80/5.00",
      englishScore: "IELTS 6.5",
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: student2.id },
    update: {},
    create: { userId: student2.id, nationality: "Bangladeshi", lastQualification: "Bachelor's Degree", gpa: "3.6/4.0" },
  });
  console.log("✅ Student profiles seeded");

  // ── Universities ──
  const universities = [
    { name: "Multimedia University Malaysia (MMU)", slug: "multimedia-university-malaysia", shortName: "MMU", description: "Multimedia University (MMU) is a leading private university in Malaysia, offering a wide range of programs in engineering, IT, business, and creative multimedia. Established in 1996, MMU has two campuses in Cyberjaya and Melaka.", country: "Malaysia", city: "Cyberjaya", website: "https://www.mmu.edu.my", logo: "/images/universities/mmu-logo.png", ranking: "Top 200 in Asia (QS)", established: "1996", type: "Private", offerLetter: true, featured: true, isPublic: true, sortOrder: 1 },
    { name: "UCSI University Malaysia", slug: "ucsi-university-malaysia", shortName: "UCSI", description: "UCSI University is a leading private university in Malaysia, ranked among the top 300 universities in Asia.", country: "Malaysia", city: "Kuala Lumpur", website: "https://www.ucsiuniversity.edu.my", logo: "/images/universities/ucsi-logo.png", ranking: "Top 300 in Asia (QS)", established: "1986", type: "Private", offerLetter: true, featured: true, isPublic: true, sortOrder: 2 },
    { name: "Taylor's University Malaysia", slug: "taylors-university-malaysia", shortName: "Taylor's", description: "Taylor's University is one of Malaysia's most prestigious private universities.", country: "Malaysia", city: "Subang Jaya", website: "https://www.taylors.edu.my", logo: "/images/universities/taylors-logo.png", ranking: "#1 Private University in Malaysia (QS)", established: "1969", type: "Private", offerLetter: true, featured: true, isPublic: true, sortOrder: 3 },
    { name: "Asia Pacific University (APU)", slug: "asia-pacific-university", shortName: "APU", description: "Asia Pacific University of Technology & Innovation (APU) is Malaysia's premier university for technology and innovation.", country: "Malaysia", city: "Kuala Lumpur", website: "https://www.apu.edu.my", logo: "/images/universities/apu-logo.png", ranking: "Top 250 in Asia (QS)", established: "1993", type: "Private", offerLetter: true, featured: true, isPublic: true, sortOrder: 4 },
    { name: "Universiti Teknologi Malaysia (UTM)", slug: "universiti-teknologi-malaysia", shortName: "UTM", description: "Universiti Teknologi Malaysia (UTM) is Malaysia's premier engineering and technology university.", country: "Malaysia", city: "Johor Bahru", website: "https://www.utm.my", logo: "/images/universities/utm-logo.png", ranking: "Top 200 in Asia (QS)", established: "1975", type: "Public", offerLetter: true, featured: true, isPublic: true, sortOrder: 5 },
  ];

  for (const uni of universities) {
    await prisma.university.upsert({ where: { slug: uni.slug }, update: uni, create: uni });
  }
  console.log(`✅ ${universities.length} universities seeded`);

  const allUnis = await prisma.university.findMany();
  const uniMap: Record<string, string> = {};
  allUnis.forEach((u) => { uniMap[u.slug] = u.id; });

  // ── Programs ──
  const programs = [
    { name: "Bachelor of Computer Science", slug: "bachelor-computer-science-mmu", universityId: uniMap["multimedia-university-malaysia"], level: "Bachelor", duration: "3 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "A comprehensive program covering software development, AI, data science, and cybersecurity.", fees: JSON.stringify([{label:"Tuition Fee (per year)",amount:"RM 25,000",currency:"MYR"},{label:"Total Estimated Cost",amount:"RM 78,000",currency:"MYR"}]), featured: true, isPublic: true, sortOrder: 1 },
    { name: "Bachelor of Business Administration", slug: "bachelor-business-administration-ucsi", universityId: uniMap["ucsi-university-malaysia"], level: "Bachelor", duration: "3 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "UCSI's BBA program develops future business leaders.", fees: JSON.stringify([{label:"Total Estimated Cost",amount:"RM 68,000",currency:"MYR"}]), featured: true, isPublic: true, sortOrder: 2 },
    { name: "Master of Business Administration (MBA)", slug: "mba-taylors", universityId: uniMap["taylors-university-malaysia"], level: "Master", duration: "1.5 years", language: "English", intake: "March, July", mode: "Full-time", description: "Taylor's MBA focuses on strategic management and entrepreneurship.", fees: JSON.stringify([{label:"Total Tuition Fee",amount:"RM 55,000",currency:"MYR"}]), featured: true, isPublic: true, sortOrder: 3 },
    { name: "Bachelor of Engineering (Electrical)", slug: "bachelor-engineering-electrical-utm", universityId: uniMap["universiti-teknologi-malaysia"], level: "Bachelor", duration: "4 years", language: "English", intake: "February, September", mode: "Full-time", description: "UTM's Electrical Engineering program is accredited by the Board of Engineers Malaysia.", fees: JSON.stringify([{label:"Total Estimated Cost",amount:"RM 35,000",currency:"MYR"}]), featured: true, isPublic: true, sortOrder: 4 },
    { name: "Diploma in Information Technology", slug: "diploma-it-apu", universityId: uniMap["asia-pacific-university"], level: "Diploma", duration: "2 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "APU's Diploma in IT covers programming, networking, and web development.", fees: JSON.stringify([{label:"Total Estimated Cost",amount:"RM 37,000",currency:"MYR"}]), featured: false, isPublic: true, sortOrder: 5 },
    { name: "Bachelor of Hospitality Management", slug: "bachelor-hospitality-taylors", universityId: uniMap["taylors-university-malaysia"], level: "Bachelor", duration: "3 years", language: "English", intake: "January, March, July", mode: "Full-time", description: "Taylor's is ranked #1 in Malaysia for hospitality.", fees: JSON.stringify([{label:"Total Estimated Cost",amount:"RM 98,000",currency:"MYR"}]), featured: true, isPublic: true, sortOrder: 6 },
    { name: "Master of Computer Science", slug: "master-computer-science-mmu", universityId: uniMap["multimedia-university-malaysia"], level: "Master", duration: "1.5 years", language: "English", intake: "January, July", mode: "Full-time", description: "Advanced studies in AI, machine learning, and software engineering.", fees: JSON.stringify([{label:"Total Tuition Fee",amount:"RM 35,000",currency:"MYR"}]), featured: false, isPublic: true, sortOrder: 7 },
    { name: "Foundation in Science", slug: "foundation-science-ucsi", universityId: uniMap["ucsi-university-malaysia"], level: "Foundation", duration: "1 year", language: "English", intake: "January, May, September", mode: "Full-time", description: "Prepares students for degree programs in engineering, IT, and health sciences.", fees: JSON.stringify([{label:"Total Tuition Fee",amount:"RM 15,000",currency:"MYR"}]), featured: false, isPublic: true, sortOrder: 8 },
  ];

  for (const prog of programs) {
    await prisma.program.upsert({ where: { slug: prog.slug }, update: prog, create: prog });
  }
  console.log(`✅ ${programs.length} programs seeded`);

  // ── Demo Applications ──
  const allProgs = await prisma.program.findMany();
  const existingApps = await prisma.application.count();

  if (existingApps === 0) {
    const demoApps = [
      { trackingNumber: "EDU-2026-00001", studentId: student.id, universityId: uniMap["multimedia-university-malaysia"], programId: allProgs.find(p => p.slug === "bachelor-computer-science-mmu")?.id, universityName: "Multimedia University Malaysia (MMU)", programName: "Bachelor of Computer Science", intake: "September 2026", status: "offer_received", agentCode: "AGT-DEMO01", agentId: agent.id },
      { trackingNumber: "EDU-2026-00002", studentId: student.id, universityId: uniMap["taylors-university-malaysia"], programId: allProgs.find(p => p.slug === "mba-taylors")?.id, universityName: "Taylor's University Malaysia", programName: "Master of Business Administration (MBA)", intake: "March 2026", status: "under_review", agentCode: "AGT-DEMO01", agentId: agent.id },
      { trackingNumber: "EDU-2026-00003", studentId: student2.id, universityId: uniMap["ucsi-university-malaysia"], programId: allProgs.find(p => p.slug === "bachelor-business-administration-ucsi")?.id, universityName: "UCSI University Malaysia", programName: "Bachelor of Business Administration", intake: "May 2026", status: "enrolled", agentCode: "AGT-DEMO01", agentId: agent.id },
      { trackingNumber: "EDU-2026-00004", studentId: student2.id, universityId: uniMap["asia-pacific-university"], programId: allProgs.find(p => p.slug === "diploma-it-apu")?.id, universityName: "Asia Pacific University (APU)", programName: "Diploma in Information Technology", intake: "January 2026", status: "submitted", agentCode: "AGT-DEMO01", agentId: agent.id },
    ];

    for (const app of demoApps) {
      await prisma.application.create({ data: app as any });
    }

    // Add demo messages
    const apps = await prisma.application.findMany({ take: 2 });
    if (apps[0]) {
      await prisma.applicationMessage.createMany({
        data: [
          { applicationId: apps[0].id, senderId: student.id, senderRole: "STUDENT", message: "Hi, I submitted my application. When can I expect to hear back?" },
          { applicationId: apps[0].id, senderId: superAdmin.id, senderRole: "ADMIN", message: "Hello! Thank you for your application. We are currently reviewing your documents. You should hear from us within 3-5 business days." },
          { applicationId: apps[0].id, senderId: student.id, senderRole: "STUDENT", message: "Thank you for the update! I'll wait for the next steps." },
        ],
      });
    }
    console.log("✅ Demo applications & messages seeded");
  }

  // ── Testimonials ──
  const testimonials = [
    { name: "Tanvir Ahamed", photo: "/images/testimonials/TANVIR AHAMED.webp", university: "Asia Pacific University (APU)", program: "Master of Science in Cyber Security", country: "Bangladesh", quote: "I always wanted to pursue Cyber Security at a top university in Malaysia. Eduwave helped me choose APU and guided me through every step of the application and visa process.", rating: 5, featured: true, isPublic: true, sortOrder: 1 },
    { name: "Sadia Afrin", photo: "/images/testimonials/Sadia Afrin.webp", university: "Asia Pacific University (APU)", program: "Master of Business Administration (MBA)", country: "Bangladesh", quote: "Eduwave gave me honest and accurate information about APU from the very beginning. The process was smooth and stress-free.", rating: 5, featured: true, isPublic: true, sortOrder: 2 },
    { name: "Nayem Hossain", photo: "/images/testimonials/Naeem hossain.webp", university: "INTI International University", program: "BBA (American Transfer Programme)", country: "Bangladesh", quote: "Choosing the American Transfer Programme at INTI was one of the best decisions of my life, and Eduwave helped me make that decision with confidence.", rating: 5, featured: true, isPublic: true, sortOrder: 3 },
    { name: "Anika Tahsin", photo: "/images/testimonials/Anika Tahsin.webp", university: "Taylor's University", program: "Master of Business Administration (MBA)", country: "Bangladesh", quote: "Taylor's University was my dream, and Eduwave turned that dream into reality. Their knowledge of Malaysian universities is impressive.", rating: 5, featured: true, isPublic: true, sortOrder: 4 },
    { name: "Mostafijur Rahaman", photo: "/images/testimonials/mostafijur rahman.webp", university: "City University Malaysia", program: "Doctor of Philosophy in Business Administration", country: "Bangladesh", quote: "Pursuing a PhD is a major commitment and I needed trustworthy guidance. Eduwave provided exactly that.", rating: 5, featured: true, isPublic: true, sortOrder: 5 },
    { name: "Sabikun Nahar Tafhim", photo: "/images/testimonials/Sabikun nahar tafhim.webp", university: "University of Malaya (UM)", program: "Master of Data Science", country: "Bangladesh", quote: "Getting into University of Malaya was not easy, but Eduwave guided me through the entire process with patience and expertise.", rating: 5, featured: true, isPublic: true, sortOrder: 6 },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) await prisma.testimonial.create({ data: t });
  }
  console.log("✅ Testimonials seeded");

  // ── Blog Posts ──
  const blogPosts = [
    { title: "Top 10 Reasons to Study in Malaysia", slug: "top-10-reasons-study-malaysia", excerpt: "Discover why Malaysia is one of the best destinations for international students from Bangladesh.", content: "<h2>Why Choose Malaysia?</h2><p>Malaysia has emerged as one of the top study-abroad destinations for Bangladeshi students. Here are 10 compelling reasons:</p><ol><li><strong>Affordable Education</strong> — Tuition fees are significantly lower than in the UK, USA, or Australia.</li><li><strong>World-Class Universities</strong> — Multiple Malaysian universities rank in the top 200 in Asia.</li><li><strong>English Medium</strong> — Most programs are taught entirely in English.</li><li><strong>Cultural Similarity</strong> — Similar food, weather, and Muslim-friendly environment.</li><li><strong>Low Cost of Living</strong> — Monthly expenses can be as low as RM 1,200.</li><li><strong>Easy Visa Process</strong> — Student visa processing is straightforward.</li><li><strong>Work Opportunities</strong> — Students can work part-time during studies.</li><li><strong>Strategic Location</strong> — Gateway to Southeast Asia.</li><li><strong>Safe Environment</strong> — Low crime rate and welcoming community.</li><li><strong>Growing Economy</strong> — Excellent job prospects after graduation.</li></ol>", coverImage: "/images/blog/study-malaysia.jpg", tags: "study abroad,Malaysia,education", author: "Eduwave Team", isPublished: true, publishedAt: new Date("2026-01-15"), metaTitle: "Top 10 Reasons to Study in Malaysia | Eduwave", metaDesc: "Discover why Malaysia is the best study abroad destination for Bangladeshi students. Affordable, world-class education." },
    { title: "Complete Guide to Student Visa Malaysia 2026", slug: "student-visa-malaysia-guide-2026", excerpt: "Everything you need to know about getting a student visa for Malaysia in 2026.", content: "<h2>Malaysia Student Visa Guide</h2><p>Getting a student visa for Malaysia is relatively straightforward. Here's your complete guide:</p><h3>Requirements</h3><ul><li>Valid passport (min. 18 months validity)</li><li>University offer letter</li><li>Academic transcripts</li><li>Financial proof</li><li>Medical examination</li><li>Passport-sized photos</li></ul><h3>Process Timeline</h3><p>The entire visa process typically takes 4-8 weeks from submission.</p>", coverImage: "/images/blog/visa-guide.jpg", tags: "visa,Malaysia,guide", author: "Eduwave Team", isPublished: true, publishedAt: new Date("2026-02-10"), metaTitle: "Student Visa Malaysia 2026 Complete Guide | Eduwave", metaDesc: "Step-by-step guide to getting your Malaysian student visa. Requirements, timeline, and tips." },
    { title: "Scholarship Opportunities for Bangladeshi Students", slug: "scholarships-bangladeshi-students-malaysia", excerpt: "Explore scholarship opportunities available for Bangladeshi students studying in Malaysia.", content: "<h2>Scholarships in Malaysia</h2><p>Several Malaysian universities offer scholarships specifically for international students from Bangladesh.</p><h3>Merit-Based Scholarships</h3><p>Most universities offer 20-100% tuition fee waivers based on academic performance.</p><h3>Need-Based Financial Aid</h3><p>Some universities provide financial assistance based on family income.</p>", coverImage: "/images/blog/scholarships.jpg", tags: "scholarships,financial aid,Malaysia", author: "Eduwave Team", isPublished: true, publishedAt: new Date("2026-03-05"), metaTitle: "Scholarships for Bangladeshi Students in Malaysia | Eduwave", metaDesc: "Find scholarship opportunities for Bangladeshi students at Malaysian universities." },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({ where: { slug: post.slug }, update: post, create: post });
  }
  console.log("✅ Blog posts seeded");

  // ── Demo Inquiries ──
  const existingInqs = await prisma.inquiry.count();
  if (existingInqs === 0) {
    await prisma.inquiry.createMany({
      data: [
        { name: "Karim Rahman", email: "karim@example.com", phone: "+880 1812 345678", university: "Taylor's University", program: "MBA", message: "I want to know about the admission requirements for MBA at Taylor's University.", status: "new", source: "website" },
        { name: "Fatima Begum", email: "fatima@example.com", phone: "+880 1912 567890", university: "UCSI University", message: "Can you help me apply for the Foundation in Science program?", status: "contacted", source: "website" },
        { name: "Hassan Ali", email: "hassan@example.com", phone: "+880 1712 890123", message: "I'm interested in studying Computer Science in Malaysia. What are my options?", status: "new", source: "website" },
      ],
    });
    console.log("✅ Demo inquiries seeded");
  }

  // ── CMS Pages ──
  const cmsPages = [
    { title: "Home", slug: "home", status: "published", isSystem: true, metaTitle: "Eduwave Educational Consultancy | Study in Malaysia", metaDesc: "Your trusted partner for studying abroad in Malaysia. Free guidance for Bangladeshi students.", sortOrder: 1 },
    { title: "About Us", slug: "about", status: "published", isSystem: true, metaTitle: "About Eduwave | Educational Consultancy", metaDesc: "Learn about Eduwave — founded in 2022, operating from Malaysia, 350+ students enrolled.", sortOrder: 2 },
    { title: "Services", slug: "services", status: "published", isSystem: true, metaTitle: "Our Services | Eduwave", metaDesc: "Free university admission guidance, visa support, scholarship assistance, and more.", sortOrder: 3 },
    { title: "Contact Us", slug: "contact", status: "published", isSystem: true, metaTitle: "Contact Eduwave | Get in Touch", metaDesc: "Contact Eduwave for free study abroad consultation. Available 24/7 via WhatsApp.", sortOrder: 4 },
    { title: "Privacy Policy", slug: "privacy-policy", status: "published", isSystem: true, metaTitle: "Privacy Policy | Eduwave", metaDesc: "Eduwave privacy policy — how we collect, use, and protect your personal information.", sortOrder: 10 },
    { title: "Terms & Conditions", slug: "terms", status: "published", isSystem: true, metaTitle: "Terms & Conditions | Eduwave", metaDesc: "Eduwave terms and conditions of service.", sortOrder: 11 },
  ];

  for (const page of cmsPages) {
    await prisma.page.upsert({ where: { slug: page.slug }, update: { metaTitle: page.metaTitle, metaDesc: page.metaDesc }, create: page });
  }
  console.log("✅ CMS pages seeded");

  // ── Notifications ──
  const existingNotifs = await prisma.notification.count();
  if (existingNotifs === 0) {
    await prisma.notification.create({
      data: {
        title: "🎓 January 2026 Intake Now Open!",
        content: "Applications are now open for January 2026 intake at all partner universities. Apply now for early bird benefits!",
        type: "info",
        style: "bar",
        position: "top",
        isActive: true,
        targetPages: JSON.stringify(["*"]),
        isDismissible: true,
        linkText: "Apply Now",
        linkUrl: "/contact",
      },
    });
    console.log("✅ Notification seeded");
  }

  // ── Site Config ──
  const configs = [
    { key: "site_name", value: "Eduwave Educational Consultancy", group: "general", label: "Site Name" },
    { key: "site_tagline", value: "From Bangladesh to Global Universities.", group: "general", label: "Tagline" },
    { key: "site_description", value: "Founded in 2022 and operating directly from Malaysia, Eduwave is your local guardian on the ground. 350+ students successfully enrolled.", group: "general", label: "Site Description" },
    { key: "hero_title", value: "From Bangladesh to Global Universities.", group: "hero", label: "Hero Title" },
    { key: "hero_subtitle", value: "Malaysia-based. Available 24/7. Completely Free.", group: "hero", label: "Hero Subtitle" },
    { key: "hero_cta_text", value: "Start Your Journey Today", group: "hero", label: "Hero Button Text" },
    { key: "hero_cta_link", value: "/contact", group: "hero", label: "Hero Button Link" },
    { key: "stat_students", value: "350+", group: "stats", label: "Students Enrolled" },
    { key: "stat_community", value: "100,000+", group: "stats", label: "Community Members" },
    { key: "stat_universities", value: "32+", group: "stats", label: "Partner Universities" },
    { key: "stat_counselling", value: "24/7", group: "stats", label: "Virtual Counselling" },
    { key: "whatsapp_number", value: "+60112-4103692", group: "contact", label: "WhatsApp Number" },
    { key: "contact_email", value: "ceo.eduwave@gmail.com", group: "contact", label: "Contact Email" },
    { key: "contact_phone", value: "+60112-4103692", group: "contact", label: "Contact Phone" },
    { key: "office_address", value: "Operating directly from Malaysia", group: "contact", label: "Malaysia Base" },
    { key: "office_address_bd", value: "Akhteruzzaman Center (7th Floor), 21/22, Agrabad CIA, Chattogram, Bangladesh", group: "contact", label: "Bangladesh Office" },
    { key: "social_facebook", value: "https://www.facebook.com/EduwaveEducation", group: "social", label: "Facebook Page" },
    { key: "social_instagram", value: "https://www.instagram.com/the_eduwave", group: "social", label: "Instagram" },
    { key: "social_youtube", value: "https://youtube.com/@roamingwithnayem", group: "social", label: "YouTube" },
    { key: "social_linkedin", value: "", group: "social", label: "LinkedIn URL" },
    { key: "social_facebook_group", value: "https://www.facebook.com/share/g/1CVAqVmT6D/", group: "social", label: "Facebook Community Group" },
    { key: "google_analytics_id", value: "", group: "seo", label: "Google Analytics ID" },
    { key: "meta_title_suffix", value: "| Eduwave Educational Consultancy", group: "seo", label: "Meta Title Suffix" },
  ];

  for (const cfg of configs) {
    await prisma.siteConfig.upsert({ where: { key: cfg.key }, update: { value: cfg.value }, create: cfg });
  }
  console.log(`✅ ${configs.length} site config entries seeded`);

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Demo Login Credentials:");
  console.log("   Admin:   admin@theeduwave.com / change_me_123");
  console.log("   Student: student@theeduwave.com / change_me_123");
  console.log("   Agent:   agent@theeduwave.com / change_me_123");
  console.log("   Editor:  editor@theeduwave.com / change_me_123\n");
}

main()
  .catch((e) => { console.error("❌ Seeding failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
