# YUN Perfume

Small-batch Indian luxury perfumery — Next.js 15 · Cloudflare Pages · D1 · R2 · Drizzle ORM · Razorpay · Resend

---

## Getting started (first time only)

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your keys
cp .env.example .env.local

# 3. One-time local DB setup (migrate + seed)
npm run setup
```

After that, just:

```bash
npm run dev
```

> `npm run setup` only needs to be run **once per machine** (or after deleting `.wrangler/`).
> The local D1 database persists between dev server restarts automatically.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run setup` | **One-time** — apply local DB migrations + seed products |
| `npm run build` | Production build |
| `npm run pages:build` | Build for Cloudflare Pages |
| `npm run deploy` | Build + deploy to Cloudflare Pages |
| `npm run db:generate` | Generate new Drizzle migrations after schema changes |
| `npm run db:migrate:local` | Apply migrations to local D1 |
| `npm run db:migrate:remote` | Apply migrations to production D1 |
| `npm run db:studio` | Open Drizzle Studio (local DB browser) |
| `npm run db:seed` | Seed local D1 with products + admin user |

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + custom design tokens |
| Animations | GSAP 3 + ScrollTrigger + Lenis |
| Database | Cloudflare D1 (SQLite) via Drizzle ORM |
| Auth | Magic link (email OTP) — cookie session + JWT |
| Payments | Razorpay (INR, UPI, Cards, Net Banking) |
| Email | Resend |
| Storage | Cloudflare R2 (product images) |
| Hosting | Cloudflare Pages |

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RESEND_API_KEY=re_...
JWT_SECRET=                    # openssl rand -base64 64
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-XXXX.r2.dev
```

> D1/KV/R2 bindings are not connection strings — they're injected by Cloudflare/Wrangler automatically. No `DATABASE_URL` needed.

---

## Price convention

All prices are stored in **paise** in D1 (integer, no decimals):

```
₹4,800 → 480000 stored in DB
480000 / 100 → formatINR() → "₹4,800" displayed in UI
480000 sent directly to Razorpay (expects paise)
product.price / 100 → stored in cart (INR)
```
