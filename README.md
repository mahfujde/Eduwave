# Eduwave Educational Consultancy

> Full-stack educational consultancy website built with Next.js 14, Prisma, MySQL, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **Database:** MySQL + Prisma ORM
- **Auth:** NextAuth.js v5 (Credentials)
- **Forms:** React Hook Form + Zod
- **State:** TanStack React Query + Zustand
- **Email:** Nodemailer (Gmail SMTP)

## 📁 Project Structure

```
eduwave/
├── prisma/          # Database schema and seed
├── app/
│   ├── (public)/    # Public-facing pages
│   ├── admin/       # Admin dashboard
│   └── api/         # API routes (public + admin)
├── components/      # Reusable UI components
├── lib/             # Utilities (prisma, auth, email)
├── hooks/           # Custom React hooks
├── types/           # TypeScript definitions
├── constants/       # Site constants
└── public/          # Static assets
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials and SMTP settings
```

### 3. Set up Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed the database
mysql -u root -p eduwave < prisma/seed.sql
```

### 4. Generate Auth Secret
```bash
openssl rand -base64 32
# Add the output to NEXTAUTH_SECRET in .env
```

### 5. Run Development Server
```bash
npm run dev
```

### 6. Access the Site
- **Frontend:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login
  - Email: `admin@theeduwave.com`
  - Password: `change_me_123`

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Navy) | `#1A2B5F` | Headers, navbar, footer |
| Accent (Orange) | `#E8622A` | Buttons, CTAs, highlights |

## 📱 Features

- **100% Dynamic Content** — All text, images, stats editable from admin
- **Mobile-First** — Optimized for Bangladeshi students on Android
- **WhatsApp Integration** — Floating button on every page
- **Admin Dashboard** — Full CRUD for universities, programs, inquiries, testimonials, blog, settings
- **SEO Optimized** — Meta tags, semantic HTML, proper heading hierarchy
- **Email Notifications** — Admin gets notified of new inquiries via Gmail SMTP

## 🔑 Admin Dashboard

Navigate to `/admin/login` and use:
- Email: `admin@theeduwave.com`
- Password: `change_me_123`

### Admin Sections:
- **Dashboard** — Overview stats and recent inquiries
- **Universities** — Add/edit/delete universities with logos and banners
- **Programs** — Multi-step form with dynamic fee rows
- **Inquiries** — View, manage status, add notes, WhatsApp quick link, CSV export
- **Testimonials** — Manage student reviews with photo upload
- **Blog** — Create posts with SEO fields
- **Settings** — Edit ALL site content (hero, stats, contact, social, etc.)

## 🚀 Production Deployment

```bash
npm run build
npm start
```

For Hostinger/cPanel deployment, enable standalone output in `next.config.mjs`.
