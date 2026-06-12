# Tilaak — Indian Ethnic Wear E-Commerce Store

> **Wear the Culture, Own the Story**

A full-stack, production-ready Indian ethnic wear e-commerce store built as a freelancing portfolio showcase. Features a complete shopping flow — from product browsing with filters, to Razorpay payment integration, order confirmation emails, and a fully functional admin dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL + RLS) |
| Payments | Razorpay (test mode ready) |
| Email | Nodemailer (Gmail SMTP) |
| Animations | Framer Motion |
| State | Zustand |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Features

### Customer-Facing
- 🛍️ **Product catalog** with filters — gender, category, price range, sort
- 📄 **Product detail pages** — image gallery with zoom, size/color selection, quantity
- 🛒 **Zustand-powered cart** — persistent slide-in drawer + full cart page
- 💳 **Razorpay payments** — test mode integration with signature verification
- 📧 **Order confirmation emails** — branded HTML emails with IST timestamps
- ✅ **Order confirmation page** — animated success state, order tracking
- 📱 **Mobile-first responsive design** — optimized for 375px and above

### Admin Panel (`/admin`)
- 📊 **Dashboard** — real-time stats (orders, revenue, pending, products)
- 📦 **Product management** — add, edit, delete, toggle active/inactive, search & filter
- 📋 **Order management** — inline status updates, detail modal, CSV export, WhatsApp messaging
- 🔐 **Hardcoded password auth** — simple localStorage-based admin access

### Technical
- 🔍 **SEO optimized** — Open Graph, Twitter cards, `en-IN` locale, meta descriptions
- ♿ **Accessible** — skip-to-content link, ARIA labels, semantic HTML
- 🏗️ **API routes** — RESTful endpoints with auth guards and input validation
- 🗄️ **Supabase RLS** — public client for reads, admin client for writes
- 💰 **Indian formatting** — INR currency with `en-IN` locale, Indian states dropdown, phone/PIN validation

---

## Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Razorpay account (test mode)
- Gmail account (for sending emails)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-username/tilaak-store.git
cd tilaak-store

# 2. Install dependencies
npm install

# 3. Create .env.local (see Environment Variables below)
cp .env.example .env.local

# 4. Set up Supabase
# - Create a new project at supabase.com
# - Run the SQL schema from Step 2 in the SQL Editor
# - Run the seed data SQL

# 5. Get Razorpay test keys
# - Sign up at dashboard.razorpay.com
# - Go to Settings > API Keys > Generate Test Key

# 6. Start development server
npm run dev
# → http://localhost:3000

# 7. Access admin panel
# → http://localhost:3000/admin
# Password: tilaak@admin2025
```

---

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (Gmail SMTP)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password

# Admin
ADMIN_PASSWORD=tilaak@admin2025

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Razorpay Test Cards

Use these credentials to test payments in Razorpay test mode:

| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date |
| CVV | Any 3 digits |
| OTP | `1234` |

---

## Project Structure

```
tilaak-store/
├── app/
│   ├── layout.tsx                    # Root layout with SEO
│   ├── page.tsx                      # Homepage
│   ├── products/
│   │   ├── page.tsx                  # Product listing with filters
│   │   └── [id]/page.tsx             # Product detail page
│   ├── cart/page.tsx                 # Full cart page
│   ├── checkout/page.tsx             # Checkout form + Razorpay
│   ├── order-confirmation/page.tsx   # Success page
│   ├── admin/
│   │   ├── page.tsx                  # Admin login
│   │   └── dashboard/
│   │       ├── page.tsx              # Dashboard stats
│   │       ├── products/page.tsx     # Product CRUD
│   │       └── orders/page.tsx       # Order management
│   └── api/
│       ├── products/                 # Product API (CRUD)
│       ├── orders/                   # Order API
│       ├── payment/                  # Razorpay create + verify
│       └── admin/login/              # Admin auth
├── components/
│   ├── Navbar.tsx                    # Scroll-reactive navbar
│   ├── Footer.tsx                    # 4-column footer
│   ├── ProductCard.tsx               # Product card with badges
│   ├── ProductFilters.tsx            # Sidebar + mobile drawer filters
│   ├── CartDrawer.tsx                # Slide-in cart drawer
│   ├── CartItem.tsx                  # Cart item row
│   ├── RazorpayButton.tsx            # Payment integration
│   └── admin/
│       ├── AdminSidebar.tsx          # Dark sidebar navigation
│       ├── AdminHeader.tsx           # Header with IST clock
│       ├── DashboardStats.tsx        # 4 stat cards
│       └── ProductForm.tsx           # Add/edit product modal
├── lib/
│   ├── supabase.ts                   # Supabase clients (public + admin)
│   ├── razorpay.ts                   # Razorpay instance + order number
│   ├── mailer.ts                     # Nodemailer transporter
│   ├── store.ts                      # Zustand cart store
│   └── format.ts                     # Currency formatter
├── types/index.ts                    # TypeScript interfaces
├── vercel.json                       # Deployment config
└── .env.local                        # Environment variables (gitignored)
```

---

## Deployment

### Deploy to Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Tilaak store — production ready"
git push origin main

# 2. Import on vercel.com
# - Go to vercel.com/new
# - Import your GitHub repo
# - Framework: Next.js (auto-detected)

# 3. Add environment variables
# - Add all 9 variables from .env.local
# - Use production Supabase + Razorpay keys

# 4. Deploy
# - Click Deploy
# - Update NEXT_PUBLIC_SITE_URL to your Vercel domain
```

---

## Live Demo

[Your live URL here]

---

## Design System

| Token | Value |
|-------|-------|
| Primary (Deep Red) | `#8B1A1A` |
| Accent (Gold) | `#C9A84C` |
| Surface (Warm White) | `#FDF8F3` |
| Dark | `#1C1008` |
| Heading Font | Cormorant Garamond |
| Body Font | Plus Jakarta Sans |

---

## License

This project is built for portfolio/freelancing showcase purposes.

---

Built with ❤️ in Mumbai, India
