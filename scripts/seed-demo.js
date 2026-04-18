const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo data…');

  const pw = await bcrypt.hash('change_me_123', 10);

  // ── 1. Student users ────────────────────────────────────────────
  const student1 = await p.user.upsert({
    where: { email: 'rashida@student.com' },
    update: {},
    create: { name: 'Rashida Begum',  email: 'rashida@student.com', password: pw, role: 'STUDENT', isApproved: true },
  });
  const student2 = await p.user.upsert({
    where: { email: 'karim@student.com' },
    update: {},
    create: { name: 'Abdul Karim',    email: 'karim@student.com',   password: pw, role: 'STUDENT', isApproved: true },
  });
  const student3 = await p.user.upsert({
    where: { email: 'nasrin@student.com' },
    update: {},
    create: { name: 'Nasrin Akter',   email: 'nasrin@student.com',  password: pw, role: 'STUDENT', isApproved: true },
  });
  console.log('✅ Students created');

  // ── 2. Student profiles ─────────────────────────────────────────
  await p.studentProfile.upsert({
    where: { userId: student1.id },
    update: {},
    create: { userId: student1.id, nationality: 'Bangladeshi', dateOfBirth: '2000-05-14', passportNo: 'BD1234567', lastQualification: "Bachelor's Degree", gpa: '3.2/4.0', englishScore: 'IELTS 6.0', lastInstitution: 'Chittagong University' },
  });
  await p.studentProfile.upsert({
    where: { userId: student2.id },
    update: {},
    create: { userId: student2.id, nationality: 'Bangladeshi', dateOfBirth: '1999-11-22', passportNo: 'BD7654321', lastQualification: 'A Level / HSC', gpa: '4.8/5.0', englishScore: 'IELTS 5.5', lastInstitution: 'Dhaka College' },
  });
  console.log('✅ Student profiles created');

  // ── 3. Applications ─────────────────────────────────────────────
  const unis = await p.university.findMany({ take: 4 });
  const prgs = await p.program.findMany({ take: 4 });
  const year = new Date().getFullYear();
  let seq = 42;
  const nextTN = () => `EDU-${year}-${String(seq++).padStart(5,'0')}`;

  const appData = [
    { trackingNumber: nextTN(), studentId: student1.id, universityId: unis[0]?.id, programId: prgs[0]?.id, universityName: unis[0]?.name ?? 'University of Malaya',   programName: prgs[0]?.name ?? 'Bachelor of Computer Science',       intake: 'September 2025', status: 'under_review',       notes: 'Documents received. Under review.' },
    { trackingNumber: nextTN(), studentId: student2.id, universityId: unis[1]?.id, programId: prgs[1]?.id, universityName: unis[1]?.name ?? 'Multimedia University',  programName: prgs[1]?.name ?? 'Bachelor of Business Administration', intake: 'February 2026',  status: 'offer_received',     notes: 'Conditional offer letter issued.' },
    { trackingNumber: nextTN(), studentId: student3.id, universityId: unis[2]?.id, programId: prgs[2]?.id, universityName: unis[2]?.name ?? 'Sunway University',       programName: prgs[2]?.name ?? 'Bachelor of Engineering',             intake: 'September 2025', status: 'documents_required', notes: 'Missing: Bank statement, police clearance.' },
    { trackingNumber: nextTN(), studentId: student1.id, universityName: "Taylor's University",      programName: 'Master of Business Administration',    intake: 'January 2026', status: 'submitted',       notes: 'Application received and being processed.' },
    { trackingNumber: nextTN(), studentId: student2.id, universityName: 'INTI International University', programName: 'Diploma in Hospitality Management', intake: 'March 2026',   status: 'visa_processing', notes: 'Student visa submitted to EMGS.' },
    { trackingNumber: nextTN(), studentId: student3.id, universityName: 'UCSI University',          programName: 'Bachelor of Pharmacy',                 intake: 'September 2025', status: 'enrolled',       notes: 'Student successfully enrolled! 🎉' },
  ];

  for (const app of appData) {
    const exists = await p.application.findUnique({ where: { trackingNumber: app.trackingNumber } });
    if (!exists) await p.application.create({ data: app });
  }
  console.log('✅ Applications created');

  // ── 4. Agent applications ────────────────────────────────────────
  const agentData = [
    { name: 'Mohammad Rafiqul Islam', email: 'rafiq.agent@gmail.com', phone: '+8801712345678', experience: '3 years consulting', region: 'Dhaka, Bangladesh', motivation: 'I have strong connections with students in Dhaka. I want to help them access quality education in Malaysia through Eduwave.', status: 'pending' },
    { name: 'Fatema Khatun',          email: 'fatema.agent@gmail.com', phone: '+8801898765432', experience: '1 year teaching',    region: 'Chittagong, Bangladesh', motivation: 'Many of my students ask about studying abroad. I want to guide them properly through Eduwave.', status: 'approved' },
    { name: 'Sohel Rana',             email: 'sohel.rana@gmail.com',   phone: '+8801611223344', experience: '2 years consulting', region: 'Sylhet, Bangladesh',     motivation: 'I have referred 8 students to Malaysian universities. Would love to officially partner with Eduwave.', status: 'pending' },
  ];

  for (const ag of agentData) {
    const exists = await p.agentApplication.findFirst({ where: { email: ag.email } });
    if (!exists) await p.agentApplication.create({ data: ag });
  }
  console.log('✅ Agent applications created');

  // ── 5. Notifications ─────────────────────────────────────────────
  const notifData = [
    { type: 'info',    style: 'bar',   title: '🎓 September 2025 Intake Now Open!',  content: 'Applications for the September 2025 intake are now being accepted. Apply early to secure your spot.', linkText: 'Apply Now', linkUrl: '/contact',  isActive: true,  isDismissible: true },
    { type: 'success', style: 'popup', title: '🏆 Free Scholarship Assistance!',       content: 'Eduwave now provides free scholarship application support for all eligible students. Book your consultation today.', linkText: 'Learn More', linkUrl: '/services', isActive: true,  isDismissible: true, delay: 5 },
    { type: 'warning', style: 'bar',   title: '⚠️ Document Deadline: 15 May 2025',    content: 'All students must submit documents by 15 May 2025 for the September intake.', isActive: false, isDismissible: true },
  ];

  for (const n of notifData) {
    const exists = await p.notification.findFirst({ where: { title: n.title } });
    if (!exists) await p.notification.create({ data: n });
  }
  console.log('✅ Notifications created');

  // ── 6. Extra blog posts ──────────────────────────────────────────
  const adminUser = await p.user.findFirst({ where: { role: { in: ['SUPER_ADMIN','ADMIN'] } } });
  const blogData = [
    { title: 'Top 10 Reasons to Study in Malaysia in 2025', slug: 'top-10-reasons-study-malaysia-2025', excerpt: 'Malaysia offers world-class education at a fraction of Western costs. Here are the top 10 reasons international students choose Malaysia.', content: '## 1. Affordable Tuition Fees\nBachelor\'s degrees cost 60–70% less than UK/US counterparts.\n\n## 2. English-Medium Instruction\nMost programs are taught entirely in English.\n\n## 3. Globally Recognised Degrees\nMany universities partner with top UK and Australian institutions.\n\n## 4. Multicultural Environment\nLargest international student community in Southeast Asia.\n\n## 5. Post-Study Work Permit\nGraduate Employment Pass allows 12 months post-graduation work.\n\n## 6. Safe and Stable Country\nConsistent political stability and low crime rates.\n\n## 7. Excellent Halal Food Culture\nHalal food widely available across all regions.\n\n## 8. Modern Infrastructure\nWorld-class facilities, high-speed internet, excellent transport.\n\n## 9. Strategic Location\nHub connecting to all ASEAN countries easily.\n\n## 10. Friendly Visa Process\nStudent visa approval rates among the highest in Asia.', author: 'Eduwave Team', status: 'published', publishedAt: new Date(), tags: 'malaysia,study abroad,international students', coverImage: null },
    { title: 'Complete Guide: Student Visa Process for Malaysia 2025', slug: 'complete-guide-student-visa-malaysia-2025', excerpt: 'Everything you need to know about the Malaysian student visa (eVAL) — requirements, timeline, and costs.', content: '## Getting Your Malaysian Student Visa (eVAL)\n\nObtaining a Malaysian student visa is straightforward when you know the steps.\n\n### Step 1: Receive Offer Letter\nAfter university acceptance, you receive a conditional or unconditional offer letter.\n\n### Step 2: EMGS Application\nYour university submits your application to Education Malaysia Global Services (EMGS).\n\n### Step 3: Medical Examination\nComplete a medical check at an approved clinic in your home country.\n\n### Step 4: eVAL Issuance\nEMGS processes your application (4–8 weeks). Once approved, you receive your eVAL.\n\n### Required Documents\n- Valid passport (min 18 months validity)\n- University offer letter\n- Academic transcripts\n- Medical examination results\n- Bank statement (min RM 30,000 equivalent)', author: 'Md. Nayem Uddin', status: 'published', publishedAt: new Date(), tags: 'visa,malaysia,eVAL', coverImage: null },
    { title: 'Scholarships for Bangladeshi Students in Malaysia 2025', slug: 'scholarships-bangladeshi-students-malaysia-2025', excerpt: 'Discover fully-funded and partial scholarships for Bangladeshi students at Malaysian universities.', content: '## Scholarship Opportunities\n\nMany Bangladeshi students miss out on scholarships simply because they don\'t know they exist.\n\n### University Scholarships\n- University of Malaya Excellence Awards (up to 100% tuition waiver)\n- Multimedia University Merit Scholarships (20–50% reduction)\n- UCSI University International Excellence Award\n\n### Government Scholarships\n- Malaysian International Scholarship (MIS) — fully funded for postgraduates\n- Commonwealth Scholarship — for Master\'s and PhD students\n\n### How Eduwave Helps\nEduwave helps students identify, apply for, and secure scholarships at zero cost.', author: 'Eduwave Team', status: 'published', publishedAt: new Date(), tags: 'scholarship,malaysia,financial aid', coverImage: null },
  ];

  for (const b of blogData) {
    const exists = await p.blogPost.findUnique({ where: { slug: b.slug } });
    if (!exists) await p.blogPost.create({ data: { ...b, authorId: adminUser?.id } });
  }
  console.log('✅ Blog posts created');

  // ── 7. Inquiries ─────────────────────────────────────────────────
  const inquiryData = [
    { name: 'Arif Hossain',   email: 'arif.h@gmail.com',   phone: '+8801712000001', message: 'I want to study Computer Science in Malaysia. What are my options?', status: 'new',         university: 'University of Malaya', program: 'Computer Science' },
    { name: 'Shirin Akter',   email: 'shirin.a@gmail.com',  phone: '+8801812000002', message: 'I have HSC result of GPA 5.0. Can I get a scholarship?',          status: 'contacted',    university: 'Multimedia University', program: 'Engineering' },
    { name: 'Mahmud Hassan',  email: 'mahmud.h@gmail.com',  phone: '+8801912000003', message: 'What is the tuition fee for MBA at Malaysian universities?',       status: 'in-progress',  university: "Taylor's University",  program: 'MBA' },
    { name: 'Farida Yasmin',  email: 'farida.y@gmail.com',  phone: '+8801611000004', message: 'My son wants to study Medicine. Which universities offer MBBS?',   status: 'new',         university: 'IMU University',       program: 'Medicine' },
    { name: 'Rahim Uddin',    email: 'rahim.u@gmail.com',   phone: '+8801511000005', message: 'Interested in Hospitality Management. What are the requirements?', status: 'new',         university: 'Sunway University',    program: 'Hospitality Management' },
    { name: 'Taslima Begum',  email: 'taslima@gmail.com',   phone: '+8801611000006', message: 'Can I apply with O-Level results? I have 6 A grades.',             status: 'closed',      university: 'Sunway University',    program: 'Foundation' },
  ];

  for (const inq of inquiryData) {
    const exists = await p.inquiry.findFirst({ where: { email: inq.email } });
    if (!exists) await p.inquiry.create({ data: inq });
  }
  console.log('✅ Inquiries created');

  // ── 8. Media records ─────────────────────────────────────────────
  const mediaData = [
    { name: 'eduwave-banner.jpg', url: '/uploads/demo/eduwave-banner.jpg', type: 'image', folder: 'banners',      mimeType: 'image/jpeg', size: 245000 },
    { name: 'um-campus.jpg',      url: '/uploads/demo/um-campus.jpg',      type: 'image', folder: 'universities', mimeType: 'image/jpeg', size: 189000 },
    { name: 'mmu-campus.jpg',     url: '/uploads/demo/mmu-campus.jpg',     type: 'image', folder: 'universities', mimeType: 'image/jpeg', size: 156000 },
    { name: 'brochure-2025.pdf',  url: '/uploads/demo/brochure-2025.pdf',  type: 'document', folder: 'documents', mimeType: 'application/pdf', size: 1200000 },
  ];
  for (const m of mediaData) {
    const exists = await p.mediaFile.findFirst({ where: { url: m.url } });
    if (!exists) await p.mediaFile.create({ data: m });
  }
  console.log('✅ Media records created');

  // ── Final count summary ──────────────────────────────────────────
  const counts = {
    users:        await p.user.count(),
    applications: await p.application.count(),
    agents:       await p.agentApplication.count(),
    notifications:await p.notification.count(),
    blogs:        await p.blogPost.count(),
    inquiries:    await p.inquiry.count(),
    media:        await p.mediaFile.count(),
  };
  console.log('\n📊 Final counts:', counts);
  await p.$disconnect();
  console.log('\n🎉 All demo data seeded successfully!');
}

main().catch(e => { console.error(e); process.exit(1); });
