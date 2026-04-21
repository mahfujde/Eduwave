const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const universities = [
  { name: "Asia Pacific University (APU)", shortName: "APU", slug: "asia-pacific-university", city: "Kuala Lumpur", country: "Malaysia", type: "Private", established: "1993", ranking: "QS 5 Stars", offerLetter: true, featured: true, isPublic: true, description: "Asia Pacific University of Technology & Innovation (APU) is amongst Malaysia's Premier Private Universities, and is where a unique fusion of technology, innovation and creativity works effectively towards preparing graduates for significant roles in business and society globally. APU has earned an enviable reputation as an award-winning University through its achievements in winning a host of prestigious awards at national and international levels." },
  { name: "INTI International University", shortName: "INTI", slug: "inti-international-university", city: "Nilai", country: "Malaysia", type: "Private", established: "1986", ranking: "QS Rated", offerLetter: true, featured: true, isPublic: true, description: "INTI International University is one of Malaysia's leading higher education institutions. With over 30 years of experience, INTI offers quality education through collaborations with world-class universities and industry partners, providing students with globally recognized qualifications and career-ready skills." },
  { name: "Universiti Putra Malaysia (UPM)", shortName: "UPM", slug: "universiti-putra-malaysia", city: "Serdang", country: "Malaysia", type: "Public", established: "1931", ranking: "QS Top 150", offerLetter: true, featured: true, isPublic: true, description: "Universiti Putra Malaysia (UPM) is a leading research university in Malaysia. Ranked among the top universities in Asia, UPM is renowned for its excellence in agriculture, engineering, science, and technology. It offers a wide range of undergraduate and postgraduate programs." },
  { name: "Universiti Tenaga Nasional (UNITEN)", shortName: "UNITEN", slug: "universiti-tenaga-nasional", city: "Kajang", country: "Malaysia", type: "Private", established: "1997", ranking: "QS Rated", offerLetter: true, featured: true, isPublic: true, description: "Universiti Tenaga Nasional (UNITEN) is a prominent university wholly owned by Tenaga Nasional Berhad (TNB), Malaysia's largest electricity utility company. UNITEN excels in engineering, IT, business, and energy studies with strong industry partnerships." },
  { name: "Lincoln University College", shortName: "LUC", slug: "lincoln-university-college", city: "Petaling Jaya", country: "Malaysia", type: "Private", established: "2002", ranking: "#638 World, #196 Asia", offerLetter: true, featured: true, isPublic: true, description: "Lincoln University College is a premier private institution of higher learning located in Petaling Jaya, Selangor, Malaysia. It offers a diverse range of programs from foundation to doctoral levels across multiple disciplines including medicine, pharmacy, business, engineering, and computer science." },
  { name: "City University Malaysia", shortName: "CityU", slug: "city-university-malaysia", city: "Petaling Jaya", country: "Malaysia", type: "Private", established: "1984", ranking: "SETARA 5 Stars", offerLetter: true, featured: true, isPublic: true, description: "City University Malaysia is a SETARA 5-Star rated university offering comprehensive programs in business, engineering, IT, hospitality, and healthcare. With a strong focus on employability and practical learning, City University prepares students for successful careers globally." },
  { name: "UCSI University", shortName: "UCSI", slug: "ucsi-university", city: "Kuala Lumpur", country: "Malaysia", type: "Private", established: "1986", ranking: "QS Top 300", offerLetter: true, featured: true, isPublic: true, description: "UCSI University is a leading private university in Malaysia, ranked among the top 300 universities globally by QS World University Rankings. Known for its diverse programs in music, medicine, engineering, and business, UCSI provides an internationally recognized education with strong industry connections." },
  { name: "UNIRAZAK University", shortName: "UNIRAZAK", slug: "unirazak-university", city: "Kuala Lumpur", country: "Malaysia", type: "Private", established: "1998", ranking: "SETARA Rated", offerLetter: true, featured: true, isPublic: true, description: "Universiti Tun Abdul Razak (UNIRAZAK) is a premier private university in Kuala Lumpur specializing in business, leadership, and entrepreneurship. With its strategic location in the heart of the city and strong government backing, UNIRAZAK offers affordable, quality education." },
  { name: "MAHSA University", shortName: "MAHSA", slug: "mahsa-university", city: "Jenjarom", country: "Malaysia", type: "Private", established: "2005", ranking: "SETARA 5 Stars", offerLetter: true, featured: true, isPublic: true, description: "MAHSA University is a leading healthcare and science university in Malaysia. It offers programs in medicine, dentistry, pharmacy, nursing, biomedical sciences, business, engineering, and IT. MAHSA is committed to producing competent healthcare professionals and industry-ready graduates." },
  { name: "University of Cyberjaya", shortName: "UoC", slug: "university-of-cyberjaya", city: "Cyberjaya", country: "Malaysia", type: "Private", established: "2005", ranking: "SETARA Rated", offerLetter: true, featured: true, isPublic: true, description: "University of Cyberjaya (formerly Cyberjaya University College of Medical Sciences) is located in Malaysia's premier technology hub. It offers programs in medical sciences, IT, business, and psychology, providing students with a technology-forward learning environment." },
  { name: "Universiti Kuala Lumpur (UniKL)", shortName: "UniKL", slug: "universiti-kuala-lumpur", city: "Kuala Lumpur", country: "Malaysia", type: "Private", established: "2002", ranking: "SETARA 5 Stars", offerLetter: true, featured: true, isPublic: true, description: "Universiti Kuala Lumpur (UniKL) is a leading technical university in Malaysia owned by MARA. With 12 branch campuses across the country, UniKL specializes in engineering, technology, and entrepreneurship-based programs, producing industry-ready technical graduates." },
  { name: "SEGi University", shortName: "SEGi", slug: "segi-university", city: "Petaling Jaya", country: "Malaysia", type: "Private", established: "1977", ranking: "QS Rated", offerLetter: true, featured: true, isPublic: true, description: "SEGi University is one of Malaysia's largest private higher education institutions with over 27,000 students. It offers a wide range of programs in business, engineering, IT, medicine, dentistry, pharmacy, optometry, education, and creative arts across multiple campuses." },
  { name: "Asia e University (AeU)", shortName: "AeU", slug: "asia-e-university", city: "Kuala Lumpur", country: "Malaysia", type: "Private", established: "2002", ranking: "SETARA Rated", offerLetter: true, featured: true, isPublic: true, description: "Asia e University (AeU) is a collaborative multinational university established under the Asia Cooperation Dialogue (ACD). It offers flexible learning options through open distance learning (ODL) and conventional modes, with programs in business, IT, education, and arts." },
  { name: "Universiti Teknikal Malaysia Melaka (UTeM)", shortName: "UTeM", slug: "universiti-teknikal-malaysia-melaka", city: "Melaka", country: "Malaysia", type: "Public", established: "2000", ranking: "QS Top 600", offerLetter: true, featured: true, isPublic: true, description: "Universiti Teknikal Malaysia Melaka (UTeM) is a leading Malaysian public technical university. Known for excellence in engineering and technology education, UTeM offers programs in electrical, mechanical, manufacturing, and information technology engineering." },
];

async function seed() {
  console.log("🌱 Seeding universities...");

  for (const uni of universities) {
    const existing = await prisma.university.findUnique({ where: { slug: uni.slug } });
    if (existing) {
      console.log(`  ⏭  Skipping ${uni.shortName} (already exists)`);
      continue;
    }

    await prisma.university.create({ data: uni });
    console.log(`  ✅ Created ${uni.name}`);
  }

  console.log("\n🎓 Seeding sample courses...");

  // Get university IDs for course associations
  const uniMap = {};
  const allUnis = await prisma.university.findMany({ select: { id: true, slug: true, shortName: true } });
  for (const u of allUnis) uniMap[u.slug] = u.id;

  const courses = [
    // APU
    { name: "Bachelor of Science (Hons) in Information Technology", slug: "bsc-it-apu", universityId: uniMap["asia-pacific-university"], level: "Bachelor", duration: "3 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "APU's BSc (Hons) in Information Technology covers software development, networking, database management, and cybersecurity. Accredited by MQA with strong industry partnerships." },
    { name: "Bachelor of Science (Hons) in Computer Science", slug: "bsc-cs-apu", universityId: uniMap["asia-pacific-university"], level: "Bachelor", duration: "3 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "A comprehensive program covering algorithms, AI, software engineering, and data science at one of Malaysia's premier tech universities." },
    { name: "Master of Science in Data Science and Business Analytics", slug: "msc-dsba-apu", universityId: uniMap["asia-pacific-university"], level: "Master", duration: "1.5 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "Advanced program in data analytics, machine learning, and business intelligence at APU." },
    // INTI
    { name: "Bachelor of Business Administration (Hons)", slug: "bba-inti", universityId: uniMap["inti-international-university"], level: "Bachelor", duration: "3 years", language: "English", intake: "January, May, August", mode: "Full-time", description: "INTI's BBA program develops future business leaders with strong analytical and management skills through industry-integrated learning." },
    { name: "Diploma in Information Technology", slug: "dip-it-inti", universityId: uniMap["inti-international-university"], level: "Diploma", duration: "2.5 years", language: "English", intake: "January, May, August", mode: "Full-time", description: "A foundation program in IT covering programming, networking, databases, and web development at INTI." },
    // UPM
    { name: "Bachelor of Engineering (Mechanical)", slug: "beng-mech-upm", universityId: uniMap["universiti-putra-malaysia"], level: "Bachelor", duration: "4 years", language: "English", intake: "September, February", mode: "Full-time", description: "UPM's Mechanical Engineering program covers thermodynamics, manufacturing, robotics, and materials science at a top-150 world university." },
    // UCSI
    { name: "Bachelor of Arts (Hons) in Business Administration", slug: "ba-business-ucsi", universityId: uniMap["ucsi-university"], level: "Bachelor", duration: "3 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "UCSI's BBA program prepares students for the global business environment with strong industry exposure and internship opportunities." },
    { name: "Bachelor of Pharmaceutical Sciences (Hons)", slug: "bpharm-ucsi", universityId: uniMap["ucsi-university"], level: "Bachelor", duration: "4 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "A professionally accredited pharmacy program at UCSI covering pharmaceutical chemistry, pharmacology, and clinical pharmacy." },
    // Lincoln
    { name: "Bachelor of Computer Science (Hons)", slug: "bcs-lincoln", universityId: uniMap["lincoln-university-college"], level: "Bachelor", duration: "3 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "Lincoln's Computer Science program covers software engineering, AI, and cybersecurity with practical lab experience." },
    { name: "Master of Business Administration (MBA)", slug: "mba-lincoln", universityId: uniMap["lincoln-university-college"], level: "Master", duration: "1.5 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "Lincoln's MBA program develops strategic management and leadership skills for mid-career professionals." },
    // City University
    { name: "Bachelor of Accounting (Hons)", slug: "bac-city", universityId: uniMap["city-university-malaysia"], level: "Bachelor", duration: "3.5 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "City University's accounting program is MIA-accredited and prepares students for professional certifications like ACCA and CPA." },
    // UNIRAZAK
    { name: "Diploma in Business Administration", slug: "dip-biz-unirazak", universityId: uniMap["unirazak-university"], level: "Diploma", duration: "2 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "A foundational program in business studies at UNIRAZAK covering management, marketing, and entrepreneurship." },
    // MAHSA
    { name: "Bachelor of Medicine and Surgery (MBBS)", slug: "mbbs-mahsa", universityId: uniMap["mahsa-university"], level: "Bachelor", duration: "5 years", language: "English", intake: "January, July", mode: "Full-time", description: "MAHSA's MBBS program provides comprehensive medical training with clinical rotations at top hospitals in Malaysia." },
    // SEGi
    { name: "Bachelor of Engineering (Hons) in Electrical & Electronics", slug: "beng-ee-segi", universityId: uniMap["segi-university"], level: "Bachelor", duration: "3 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "SEGi's EE program covers power systems, electronics, control systems, and telecommunications engineering." },
    // UniKL
    { name: "Bachelor of Mechanical Engineering Technology (Hons)", slug: "bmet-unikl", universityId: uniMap["universiti-kuala-lumpur"], level: "Bachelor", duration: "4 years", language: "English", intake: "February, July", mode: "Full-time", description: "UniKL's mechanical engineering program focuses on practical, industry-driven education in manufacturing and design." },
    // University of Cyberjaya
    { name: "Bachelor of Psychology (Hons)", slug: "bpsych-uoc", universityId: uniMap["university-of-cyberjaya"], level: "Bachelor", duration: "3 years", language: "English", intake: "January, May, September", mode: "Full-time", description: "A comprehensive psychology program covering clinical, developmental, and organizational psychology in a tech-forward environment." },
  ];

  for (const course of courses) {
    if (!course.universityId) {
      console.log(`  ⚠️  Skipping ${course.name} (university not found)`);
      continue;
    }
    const existing = await prisma.program.findUnique({ where: { slug: course.slug } });
    if (existing) {
      console.log(`  ⏭  Skipping ${course.slug} (already exists)`);
      continue;
    }
    await prisma.program.create({ data: course });
    console.log(`  ✅ Created ${course.name}`);
  }

  console.log("\n🎉 Seeding complete!");
  await prisma.$disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
