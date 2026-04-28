# YUN Perfume

![YUN Perfume](public/images/logo.png)

A high-end, brutalist-luxury eCommerce platform built for a small-batch Indian perfumery. 
The platform is completely serverless, edge-rendered, and powered entirely by the Cloudflare ecosystem.

**Live Project:** [https://yunperfume.in](https://yunperfume.in)

---

## 🏗️ Architecture & Stack

The application is engineered for maximum performance, global distribution, and zero cold-starts by running exclusively on the Edge.

- **Framework:** Next.js 15 (App Router)
- **Hosting / Compute:** Cloudflare Pages (Edge Runtime)
- **Database:** Cloudflare D1 (Serverless SQLite) via Drizzle ORM
- **Storage:** Cloudflare R2 (Product Image Assets)
- **State / Caching:** Cloudflare KV (Rate limiting for magic links)
- **Auth:** Bespoke Passwordless Magic Links (via Resend & JWT Session Cookies)
- **Payments:** Razorpay Integration (via Web Crypto API for Edge compatibility)
- **Styling:** Tailwind CSS v4 + Custom Brutalist Design Tokens
- **Animations:** GSAP 3 + ScrollTrigger + Lenis Smooth Scrolling

---

## ✨ Features

- **Cinematic Experience:** High-contrast, dark-mode luxury aesthetic with buttery-smooth scroll-triggered micro-animations.
- **Cart & Discovery Set:** Persistent Zustand-powered shopping cart featuring complex price calculation rules based on sizing and bespoke "Add to Bag" integrations.
- **Edge Auth & Magic Links:** Secure, passwordless OTP/Magic Link system built from scratch with short-lived tokens and HttpOnly session cookies.
- **Admin Dashboard:** Role-based access control protecting an entire management layer (`/admin`). Features full CRUD operations for Products, automated R2 Image uploading, and real-time Order Status tracking.
- **Razorpay Webhooks:** Completely secure, server-calculated checkout flow integrated with Razorpay. Payment verification and database updates (stock deduction, order status) are handled asynchronously via Idempotent Edge Webhooks.
- **SEO & Edge Cases:** Dynamic XML Sitemap and Robots generator reading live products from D1, complete with custom styled `error.tsx` and `not-found.tsx` boundaries.

---

## 🚀 Getting Started (Local Development)

### 1. Requirements
- Node.js v20+
- Wrangler CLI (`npm i -g wrangler`)

### 2. Install & Environment
```bash
npm install
cp .env.example .env.local
```
Fill out `.env.local` with your Razorpay Test Keys, Resend API key, and generate a secure `JWT_SECRET` (`openssl rand -base64 64`).

### 3. Local Cloudflare Setup
Run the setup script which will automatically run Drizzle migrations against your local Wrangler D1 instance and seed the initial 4 fragrances + admin user.
```bash
npm run setup
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🛠️ CLI Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local Next.js dev server |
| `npm run setup` | **One-time** — apply local DB migrations + seed products |
| `npm run db:generate` | Generate new Drizzle migrations after schema changes |
| `npm run db:migrate:local` | Apply migrations to local D1 instance |
| `npm run db:migrate:remote` | Apply migrations to production Cloudflare D1 |
| `npm run db:studio` | Open Drizzle Studio to inspect local DB |
| `npm run pages:build` | Build optimized output for Cloudflare Pages |

---

## 📝 Important Developer Notes

### Price Convention
All prices are strictly stored in **paise** in the database to avoid floating-point errors.
- `₹4,800` is stored as `480000`
- The UI uses `formatINR(price / 100)`
- Razorpay API expects the raw paise value (`480000`)
- The Cart state stores prices in INR (`price / 100`)

### Order Flow
```text
PENDING → PAID        (Triggered asynchronously by Razorpay Webhook `payment.captured`)
PENDING → FAILED      (Triggered asynchronously by Razorpay Webhook `payment.failed`)
PAID    → SHIPPED     (Manual Admin Action via Dashboard)
SHIPPED → DELIVERED   (Manual Admin Action via Dashboard)
```
