-- Eduwave Educational Consultancy - Database Seed
-- Run after prisma migrate: mysql -u root -p eduwave < prisma/seed.sql

-- ─── Admin User ─────────────────────────────────────────────
-- Password: change_me_123 (bcrypt hash)
INSERT INTO users (id, email, password, name, role, createdAt, updatedAt) VALUES
('admin-001', 'admin@theeduwave.com', '$2a$12$LJ3atCPs1GJvz3UIGhSo0O8fRtQaKbKzVp1XHjkHLxZqkXwKmOJDi', 'Admin', 'admin', NOW(), NOW());

-- ─── Universities ───────────────────────────────────────────
INSERT INTO universities (id, name, slug, short_name, description, country, city, website, logo, banner, ranking, established, type, offer_letter, featured, is_public, sort_order, createdAt, updatedAt) VALUES
('uni-001', 'Multimedia University Malaysia (MMU)', 'multimedia-university-malaysia', 'MMU', 'Multimedia University (MMU) is a leading private university in Malaysia, offering a wide range of programs in engineering, IT, business, and creative multimedia. Established in 1996, MMU has two campuses in Cyberjaya and Melaka, providing world-class education with state-of-the-art facilities.', 'Malaysia', 'Cyberjaya', 'https://www.mmu.edu.my', '/images/universities/mmu-logo.png', '/images/universities/mmu-banner.jpg', 'Top 200 in Asia (QS)', '1996', 'Private', 1, 1, 1, 1, NOW(), NOW()),

('uni-002', 'UCSI University Malaysia', 'ucsi-university-malaysia', 'UCSI', 'UCSI University is a leading private university in Malaysia, ranked among the top 300 universities in Asia. Known for its strong programs in medicine, engineering, music, and business. UCSI provides hands-on learning experiences with industry partnerships worldwide.', 'Malaysia', 'Kuala Lumpur', 'https://www.ucsiuniversity.edu.my', '/images/universities/ucsi-logo.png', '/images/universities/ucsi-banner.jpg', 'Top 300 in Asia (QS)', '1986', 'Private', 1, 1, 1, 2, NOW(), NOW()),

('uni-003', 'Taylor''s University Malaysia', 'taylors-university-malaysia', 'Taylor''s', 'Taylor''s University is one of Malaysia''s most prestigious private universities, consistently ranked as the top private university in Malaysia and Southeast Asia. Known for hospitality, business, and design programs with strong international partnerships.', 'Malaysia', 'Subang Jaya', 'https://www.taylors.edu.my', '/images/universities/taylors-logo.png', '/images/universities/taylors-banner.jpg', '#1 Private University in Malaysia (QS)', '1969', 'Private', 1, 1, 1, 3, NOW(), NOW()),

('uni-004', 'Asia Pacific University (APU)', 'asia-pacific-university', 'APU', 'Asia Pacific University of Technology & Innovation (APU) is Malaysia''s premier university for technology and innovation. APU is known for its award-winning campus, strong industry connections, and high graduate employability rate.', 'Malaysia', 'Kuala Lumpur', 'https://www.apu.edu.my', '/images/universities/apu-logo.png', '/images/universities/apu-banner.jpg', 'Top 250 in Asia (QS)', '1993', 'Private', 1, 1, 1, 4, NOW(), NOW()),

('uni-005', 'Universiti Teknologi Malaysia (UTM)', 'universiti-teknologi-malaysia', 'UTM', 'Universiti Teknologi Malaysia (UTM) is Malaysia''s premier engineering and technology university, consistently ranked among the top universities in Asia. As a research-intensive public university, UTM offers world-class education at affordable tuition fees.', 'Malaysia', 'Johor Bahru', 'https://www.utm.my', '/images/universities/utm-logo.png', '/images/universities/utm-banner.jpg', 'Top 200 in Asia (QS)', '1975', 'Public', 1, 1, 1, 5, NOW(), NOW());

-- ─── Programs ───────────────────────────────────────────────
INSERT INTO programs (id, name, slug, university_id, level, duration, language, intake, mode, description, fees, featured, is_public, sort_order, createdAt, updatedAt) VALUES
('prog-001', 'Bachelor of Computer Science', 'bachelor-computer-science-mmu', 'uni-001', 'Bachelor', '3 years', 'English', 'January, May, September', 'Full-time', 'A comprehensive program covering software development, AI, data science, and cybersecurity. Graduates are highly sought after by tech companies in Malaysia and internationally.', '[{"label":"Tuition Fee (per year)","amount":"RM 25,000","currency":"MYR"},{"label":"Registration Fee","amount":"RM 1,500","currency":"MYR"},{"label":"Total Estimated Cost","amount":"RM 78,000","currency":"MYR"}]', 1, 1, 1, NOW(), NOW()),

('prog-002', 'Bachelor of Business Administration', 'bachelor-business-administration-ucsi', 'uni-002', 'Bachelor', '3 years', 'English', 'January, May, September', 'Full-time', 'UCSI''s BBA program is designed to develop future business leaders with strong analytical, communication, and management skills. The program includes internship opportunities with leading companies.', '[{"label":"Tuition Fee (per year)","amount":"RM 22,000","currency":"MYR"},{"label":"Registration Fee","amount":"RM 1,200","currency":"MYR"},{"label":"Total Estimated Cost","amount":"RM 68,000","currency":"MYR"}]', 1, 1, 2, NOW(), NOW()),

('prog-003', 'Master of Business Administration (MBA)', 'mba-taylors', 'uni-003', 'Master', '1.5 years', 'English', 'March, July', 'Full-time', 'Taylor''s MBA is designed for working professionals and aspiring leaders. The program focuses on strategic management, entrepreneurship, and global business perspectives.', '[{"label":"Total Tuition Fee","amount":"RM 55,000","currency":"MYR"},{"label":"Registration Fee","amount":"RM 2,000","currency":"MYR"}]', 1, 1, 3, NOW(), NOW()),

('prog-004', 'Bachelor of Engineering (Electrical)', 'bachelor-engineering-electrical-utm', 'uni-005', 'Bachelor', '4 years', 'English', 'February, September', 'Full-time', 'UTM''s Electrical Engineering program is accredited by the Board of Engineers Malaysia and is recognized worldwide. Students gain hands-on experience through laboratory work and industrial training.', '[{"label":"Tuition Fee (per year)","amount":"RM 8,500","currency":"MYR"},{"label":"Registration Fee","amount":"RM 800","currency":"MYR"},{"label":"Total Estimated Cost","amount":"RM 35,000","currency":"MYR"}]', 1, 1, 4, NOW(), NOW()),

('prog-005', 'Diploma in Information Technology', 'diploma-it-apu', 'uni-004', 'Diploma', '2 years', 'English', 'January, May, September', 'Full-time', 'APU''s Diploma in IT provides a solid foundation in computing. The program covers programming, networking, databases, and web development, preparing students for degree-level studies.', '[{"label":"Tuition Fee (per year)","amount":"RM 18,000","currency":"MYR"},{"label":"Registration Fee","amount":"RM 1,000","currency":"MYR"},{"label":"Total Estimated Cost","amount":"RM 37,000","currency":"MYR"}]', 0, 1, 5, NOW(), NOW()),

('prog-006', 'Bachelor of Hospitality Management', 'bachelor-hospitality-taylors', 'uni-003', 'Bachelor', '3 years', 'English', 'January, March, July', 'Full-time', 'Taylor''s is ranked #1 in Malaysia and top 20 globally for hospitality. This program provides real-world experience through industry partnerships with leading hotel chains.', '[{"label":"Tuition Fee (per year)","amount":"RM 32,000","currency":"MYR"},{"label":"Registration Fee","amount":"RM 1,500","currency":"MYR"},{"label":"Total Estimated Cost","amount":"RM 98,000","currency":"MYR"}]', 1, 1, 6, NOW(), NOW()),

('prog-007', 'Master of Computer Science', 'master-computer-science-mmu', 'uni-001', 'Master', '1.5 years', 'English', 'January, July', 'Full-time', 'Advanced studies in AI, machine learning, and software engineering. This research-oriented program prepares graduates for leadership roles in the technology industry.', '[{"label":"Total Tuition Fee","amount":"RM 35,000","currency":"MYR"},{"label":"Registration Fee","amount":"RM 1,500","currency":"MYR"}]', 0, 1, 7, NOW(), NOW()),

('prog-008', 'Foundation in Science', 'foundation-science-ucsi', 'uni-002', 'Foundation', '1 year', 'English', 'January, May, September', 'Full-time', 'UCSI''s Foundation in Science prepares students for degree programs in engineering, IT, applied sciences, and health sciences. Strong emphasis on mathematics and laboratory skills.', '[{"label":"Total Tuition Fee","amount":"RM 15,000","currency":"MYR"},{"label":"Registration Fee","amount":"RM 1,000","currency":"MYR"}]', 0, 1, 8, NOW(), NOW());

-- ─── Testimonials ───────────────────────────────────────────
INSERT INTO testimonials (id, name, photo, university, program, country, quote, rating, featured, is_public, sort_order, createdAt, updatedAt) VALUES
('test-001', 'Tanvir Ahamed', '/images/testimonials/TANVIR AHAMED.webp', 'MMU', 'Computer Science', 'Bangladesh', 'Eduwave made my dream of studying in Malaysia a reality. Their guidance throughout the application and visa process was exceptional. I am now studying at MMU and loving every moment!', 5, 1, 1, 1, NOW(), NOW()),

('test-002', 'Anika Tahsin', '/images/testimonials/Anika Tahsin.webp', 'Taylor''s University', 'Business Administration', 'Bangladesh', 'I was confused about which university to choose, but the Eduwave team helped me find the perfect program. Their knowledge of Malaysian universities is unmatched.', 5, 1, 1, 2, NOW(), NOW()),

('test-003', 'Fasha Ayman Ahmed', '/images/testimonials/FASHA AYMAN AHMED.webp', 'UCSI University', 'Engineering', 'Bangladesh', 'The team at Eduwave is incredibly professional and caring. They handled everything from document preparation to airport pickup. I highly recommend their services!', 5, 1, 1, 3, NOW(), NOW()),

('test-004', 'Mashukur Rahman', '/images/testimonials/Mashukur Rahman.webp', 'APU', 'Information Technology', 'Bangladesh', 'Eduwave provided end-to-end support for my study abroad journey. Their transparent process and honest guidance gave me confidence throughout.', 5, 1, 1, 4, NOW(), NOW()),

('test-005', 'Naeem Hossain', '/images/testimonials/Naeem hossain.webp', 'UTM', 'Electrical Engineering', 'Bangladesh', 'I chose Eduwave because of their reputation and they exceeded my expectations. The counselors are knowledgeable and always available to help.', 5, 1, 1, 5, NOW(), NOW()),

('test-006', 'Sakibul Hoque Sadan', '/images/testimonials/SAKIBUL HOQUE SADAN.webp', 'MMU', 'Multimedia', 'Bangladesh', 'From the first consultation to settling in Malaysia, Eduwave was there every step of the way. Their service is truly world-class.', 5, 1, 1, 6, NOW(), NOW()),

('test-007', 'Sanjana Rashid Taiva', '/images/testimonials/SANJANA RASHID TAIVA.webp', 'Taylor''s University', 'Hospitality', 'Bangladesh', 'Eduwave helped me secure admission to my dream university within weeks. Their efficient process saved me so much time and stress.', 5, 1, 1, 7, NOW(), NOW()),

('test-008', 'Shahriar Abrar', '/images/testimonials/SHAHRIAR ABRAR.webp', 'UCSI University', 'Business', 'Bangladesh', 'The guidance I received from Eduwave was invaluable. They explained every detail about fees, scholarships, and visa requirements clearly.', 5, 1, 1, 8, NOW(), NOW()),

('test-009', 'Sabikun Nahar Tafhim', '/images/testimonials/Sabikun nahar tafhim.webp', 'APU', 'Computer Science', 'Bangladesh', 'I am grateful to Eduwave for making my study abroad experience smooth and hassle-free. Their support continues even after I arrived in Malaysia.', 5, 1, 1, 9, NOW(), NOW()),

('test-010', 'Sadia Afrin', '/images/testimonials/Sadia Afrin.webp', 'MMU', 'Business', 'Bangladesh', 'Eduwave''s team is like family. They genuinely care about students'' futures and provide personalized guidance for each person.', 5, 1, 1, 10, NOW(), NOW()),

('test-011', 'Mostafijur Rahman', '/images/testimonials/mostafijur rahman.webp', 'UTM', 'Engineering', 'Bangladesh', 'Best educational consultancy for Bangladeshi students wanting to study in Malaysia. Their network of university partnerships is impressive.', 5, 1, 1, 11, NOW(), NOW()),

('test-012', 'Saad Islam Nehal', '/images/testimonials/saad Islam nehal.webp', 'UCSI University', 'IT', 'Bangladesh', 'Eduwave provided complete transparency throughout the process. No hidden fees, no false promises — just genuine support and guidance.', 5, 1, 1, 12, NOW(), NOW());

-- ─── Site Config ─────────────────────────────────────────────
INSERT INTO site_config (id, `key`, value, `group`, label) VALUES
-- General
('cfg-001', 'site_name', 'Eduwave Educational Consultancy', 'general', 'Site Name'),
('cfg-002', 'site_tagline', 'Your Gateway to World-Class Education in Malaysia', 'general', 'Tagline'),
('cfg-003', 'site_description', 'Eduwave Educational Consultancy helps Bangladeshi students achieve their dream of studying at top Malaysian universities. Expert guidance, transparent process, and complete support.', 'general', 'Site Description'),

-- Hero Section
('cfg-004', 'hero_title', 'Study in Malaysia with Confidence', 'hero', 'Hero Title'),
('cfg-005', 'hero_subtitle', 'Expert guidance for Bangladeshi students seeking world-class education at top Malaysian universities.', 'hero', 'Hero Subtitle'),
('cfg-006', 'hero_cta_text', 'Explore Universities', 'hero', 'Hero Button Text'),
('cfg-007', 'hero_cta_link', '/universities', 'hero', 'Hero Button Link'),
('cfg-008', 'hero_image', '/images/logos/hero-bg.jpg', 'hero', 'Hero Background Image'),

-- Stats
('cfg-009', 'stat_students', '500+', 'stats', 'Students Placed'),
('cfg-010', 'stat_universities', '25+', 'stats', 'Partner Universities'),
('cfg-011', 'stat_programs', '100+', 'stats', 'Programs Available'),
('cfg-012', 'stat_success_rate', '98%', 'stats', 'Success Rate'),

-- Contact Info
('cfg-013', 'whatsapp_number', '+60112-4103692', 'contact', 'WhatsApp Number'),
('cfg-014', 'contact_email', 'info@theeduwave.com', 'contact', 'Contact Email'),
('cfg-015', 'contact_phone', '+60112-4103692', 'contact', 'Contact Phone'),
('cfg-016', 'office_address', 'Kuala Lumpur, Malaysia', 'contact', 'Office Address'),
('cfg-017', 'office_address_bd', 'Dhaka, Bangladesh', 'contact', 'Bangladesh Office'),

-- Social Media
('cfg-018', 'social_facebook', 'https://facebook.com/theeduwave', 'social', 'Facebook URL'),
('cfg-019', 'social_instagram', 'https://instagram.com/theeduwave', 'social', 'Instagram URL'),
('cfg-020', 'social_youtube', 'https://youtube.com/@theeduwave', 'social', 'YouTube URL'),
('cfg-021', 'social_linkedin', 'https://linkedin.com/company/theeduwave', 'social', 'LinkedIn URL'),
('cfg-022', 'social_tiktok', 'https://tiktok.com/@theeduwave', 'social', 'TikTok URL'),

-- SEO
('cfg-023', 'google_analytics_id', '', 'seo', 'Google Analytics ID'),
('cfg-024', 'meta_title_suffix', '| Eduwave Educational Consultancy', 'seo', 'Meta Title Suffix'),

-- About
('cfg-025', 'about_title', 'About Eduwave', 'about', 'About Title'),
('cfg-026', 'about_content', 'Eduwave Educational Consultancy is a trusted partner for Bangladeshi students seeking quality education in Malaysia. Founded with the mission to bridge the gap between talented students and world-class universities, we provide comprehensive support throughout the entire study abroad journey — from university selection and application to visa processing and arrival support.\n\nOur team of experienced counselors has in-depth knowledge of the Malaysian education system and maintains strong partnerships with top universities across the country. We believe every student deserves access to quality education, and we work tirelessly to make that happen.', 'about', 'About Content'),

-- Services
('cfg-027', 'services_json', '[{"title":"University Placement","description":"We help you choose the right university and program based on your academic background, career goals, and budget.","icon":"GraduationCap"},{"title":"Visa Assistance","description":"Complete visa application support including document preparation, submission, and follow-up with immigration.","icon":"FileCheck"},{"title":"Scholarship Guidance","description":"We identify and help you apply for available scholarships and financial aid opportunities.","icon":"Award"},{"title":"Accommodation Support","description":"Assistance in finding suitable and affordable accommodation near your university campus.","icon":"Home"},{"title":"Airport Pickup","description":"We arrange airport pickup and help you settle in when you first arrive in Malaysia.","icon":"Plane"},{"title":"Ongoing Support","description":"Our support doesn''t end after enrollment. We continue to assist you throughout your study journey.","icon":"HeartHandshake"}]', 'services', 'Services List (JSON)');
