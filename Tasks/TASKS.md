# YUN PERFUME — Production Task List
> **Last updated:** 2026-04-28
> **Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · GSAP + Lenis · Cloudflare Pages · Cloudflare D1 · Cloudflare R2 · Cloudflare KV · Drizzle ORM · Razorpay · Resend
> **Branch strategy:** One branch per phase. Merge to `main` only after QA sign-off.

---

## CRITICAL DECISIONS
- [ ] **D1 vs Neon:** Migrate to Cloudflare D1 + Drizzle ORM (Prisma + D1 is experimental)
- [ ] **wrangler.jsonc → wrangler.toml:** Rename and fix config
- [ ] **`pages_build_output_dir`:** Must be `.vercel/output/static` after `@cloudflare/next-on-pages` build

---

## PHASE 0 — Infrastructure & Config Fixes
> Branch: `phase-0-infra`

### 0.1 Replace Prisma + Neon with Drizzle + D1
- [ ] `bun add drizzle-orm && bun add -d drizzle-kit`
- [ ] `bun remove prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless`
- [ ] Delete `prisma/` folder (keep `schema.prisma` as reference)
- [ ] Delete `src/lib/db.ts`
- [ ] Remove `DATABASE_URL` from `.env`

### 0.2 Install remaining dependencies
- [ ] `bun add @cloudflare/next-on-pages razorpay resend zod jose nanoid`
- [ ] `bun add -d wrangler`

### 0.3 Fix wrangler config
- [ ] Delete `wrangler.jsonc`
- [ ] Create `wrangler.toml` with D1, R2, KV bindings and correct `pages_build_output_dir`

### 0.4 Fix next.config
- [ ] Add `setupDevPlatform()` for Cloudflare local dev
- [ ] Add R2 remote patterns to `images.remotePatterns`

### 0.5 Fix package.json scripts
- [ ] Add `pages:build`, `deploy`, `db:generate`, `db:migrate:local`, `db:migrate:remote`, `db:studio`, `db:seed`

### 0.6 Fix .env.local
- [ ] Rename `.env` → `.env.local`
- [ ] Add `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_R2_PUBLIC_URL`
- [ ] Remove `DATABASE_URL`
- [ ] Confirm `.env.local` in `.gitignore`
- [ ] Create `.env.example` with all keys but empty values

### 0.7 Add Cloudflare runtime to all API routes
- [ ] `export const runtime = 'edge'` in `api/auth/magic-link/route.ts`
- [ ] `export const runtime = 'edge'` in `api/payment/create-order/route.ts`

### 0.8 Fix the shop page Server Component bug
- [ ] Remove unused `useCart` import from `src/app/shop/page.tsx` (line 5)
- [ ] Confirm no client hooks in that file

---

## PHASE 1 — Database: Drizzle + D1
> Branch: `phase-1-database`

### 1.1 Create folder structure
- [ ] Create `src/db/schema.ts`
- [ ] Create `src/db/index.ts`
- [ ] Create `drizzle.config.ts`

### 1.2 Write schema
- [ ] `users` table — id, email, name, role, createdAt, lastLoginAt
- [ ] `collections` table — id, slug, name, description, createdAt
- [ ] `products` table — id, slug, name, tagline, description, price (paise), stock, active, imageUrl, images (JSON), collectionId, scentFamily, scentNotes (JSON), concentration, size, isDiscoverySet, createdAt, updatedAt
- [ ] `magic_tokens` table — id, email, token, expiresAt, usedAt, createdAt
- [ ] `orders` table — id, userId, email, status, totalAmount, razorpayOrderId, razorpayPaymentId, shippingAddress (JSON), createdAt, paidAt
- [ ] `order_items` table — id, orderId, productId, productName, quantity, unitPrice

### 1.3 DB connection helper
- [ ] `src/db/index.ts` — `getDb(d1: D1Database)` using `drizzle-orm/d1`

### 1.4 Drizzle config
- [ ] `drizzle.config.ts` — dialect: sqlite, driver: d1-http

### 1.5 Generate & apply migrations
- [ ] `bun run db:generate`
- [ ] `wrangler d1 create yun-perfume-db`
- [ ] Paste `database_id` into `wrangler.toml`
- [ ] `bun run db:migrate:local`
- [ ] Verify tables exist

### 1.6 Seed the database
- [ ] Create `scripts/seed.ts` with all 4 products + 1 collection + 1 ADMIN user
- [ ] `bun run db:seed`
- [ ] Verify products in D1

### 1.7 Update admin dashboard to Drizzle
- [ ] Replace Prisma imports with `getDb`, `products`, `orders` from `@/db`
- [ ] Add `export const runtime = 'edge'`
- [ ] Rewrite queries with Drizzle syntax

---

## PHASE 2 — Cloudflare Services Setup
> Branch: `phase-2-cloudflare`

### 2.1 D1
- [ ] `database_id` confirmed in `wrangler.toml`
- [ ] Local migrations applied

### 2.2 R2 bucket
- [ ] `wrangler r2 bucket create yun-perfume-images`
- [ ] Enable public access in Cloudflare dashboard
- [ ] Copy public URL → set `NEXT_PUBLIC_R2_PUBLIC_URL`

### 2.3 KV namespace
- [ ] `wrangler kv namespace create SESSIONS`
- [ ] `wrangler kv namespace create SESSIONS --preview`
- [ ] Paste both IDs into `wrangler.toml`

### 2.4 Store production secrets
- [ ] `wrangler secret put RAZORPAY_KEY_ID`
- [ ] `wrangler secret put RAZORPAY_KEY_SECRET`
- [ ] `wrangler secret put RAZORPAY_WEBHOOK_SECRET`
- [ ] `wrangler secret put NEXT_PUBLIC_RAZORPAY_KEY_ID`
- [ ] `wrangler secret put RESEND_API_KEY`
- [ ] `wrangler secret put JWT_SECRET`
- [ ] `wrangler secret put NEXT_PUBLIC_APP_URL`
- [ ] `wrangler secret put NEXT_PUBLIC_R2_PUBLIC_URL`

### 2.5 Connect GitHub to Cloudflare Pages
- [ ] Dashboard → Pages → Connect Git → select repo
- [ ] Build command: `bun run pages:build`
- [ ] Output dir: `.vercel/output/static`
- [ ] Node version: `20`

### 2.6 Custom domain
- [ ] Add `yunperfume.com` to Pages project
- [ ] Confirm SSL active

---

## PHASE 3 — Auth: Magic Link (End-to-End)
> Branch: `phase-3-auth`

### 3.1 Create auth utilities
- [ ] `src/lib/auth.ts` — `createSessionToken`, `verifySessionToken`, `generateMagicToken`, `getMagicTokenExpiry`

### 3.2 Create session helper
- [ ] `src/lib/session.ts` — `getSession`, `requireSession`, `requireAdmin`

### 3.3 Rewrite magic-link API route
- [ ] `POST /api/auth/magic-link/route.ts` — validate email (Zod), rate limit (KV), upsert user (D1), store token in `magic_tokens` (D1), send email (Resend)

### 3.4 Create verify route (new)
- [ ] `GET /api/auth/verify/route.ts` — validate token from D1, mark used, set `yun_session` cookie (HttpOnly, Secure, SameSite:lax, 30d), redirect by role

### 3.5 Create signout route (new)
- [ ] `POST /api/auth/signout/route.ts` — delete `yun_session` cookie

### 3.6 Update auth-store.tsx
- [ ] `sendMagicLink()` — real `fetch('/api/auth/magic-link', ...)`
- [ ] Remove `verify()` and all sessionStorage/localStorage token logic

### 3.7 Update login page
- [ ] Remove OTP code input step — link in email IS verification
- [ ] Handle `?error=invalid` and `?error=expired` query params

### 3.8 Route protection middleware
- [ ] `src/middleware.ts` — protect `/admin/*` (ADMIN only) and `/profile/*` (any session)

---

## PHASE 4 — Products: Static → Database
> Branch: `phase-4-products`

### 4.1 Mark fragrances.ts as reference-only
- [ ] Add comment: `// Reference only — live data from D1`

### 4.2 Create Products API
- [ ] `GET /api/products/route.ts` — all active products from D1
- [ ] `GET /api/products/[slug]/route.ts` — single product or 404

### 4.3 Update shop page
- [ ] Remove `fragrances` import and `useCart` import (bug)
- [ ] Fetch from `GET /api/products` server-side
- [ ] Map D1 fields to existing UI props (paise → INR, JSON strings → objects)

### 4.4 Update product detail page
- [ ] Fetch from `GET /api/products/${slug}`
- [ ] Add `generateStaticParams()` for all 4 slugs
- [ ] Parse `scentNotes` and `images` JSON
- [ ] Price: `product.price / 100` for INR display

### 4.5 Fix cart price handling
- [ ] When adding to cart: `price: product.price / 100` (D1 paise → INR for cart)

---

## PHASE 5 — Email Integration (Resend)
> Branch: `phase-5-email`

### 5.1 Resend client
- [ ] `src/lib/resend.ts` — `resend` instance, `FROM` constant

### 5.2 Magic link email template
- [ ] `src/lib/emails/magic-link.ts` — dark brand-styled HTML email, 15min expiry note

### 5.3 Order confirmation email template
- [ ] `src/lib/emails/order-confirmation.ts` — items table, shipping address, total, dispatch note

### 5.4 Fix contact form
- [ ] Wire form to `POST /api/contact`
- [ ] `src/app/api/contact/route.ts` — Zod validation, Resend to `hello@yunperfume.com`

---

## PHASE 6 — Razorpay: Full Payment Integration
> Branch: `phase-6-razorpay`

### 6.1 Razorpay helper
- [ ] `src/lib/razorpay.ts` — `razorpay` instance, `verifyWebhookSignature(rawBody, sig)`

### 6.2 Rewrite create-order API
- [ ] Validate body with Zod: `{ items, shippingAddress, email }`
- [ ] **Fetch prices from D1 — never trust client prices**
- [ ] Validate stock, calculate total server-side (paise), apply GST + shipping
- [ ] Create Razorpay order, save draft order to D1, return `{ orderId, razorpayOrderId, amount, keyId }`

### 6.3 Create webhook handler (new — was completely missing)
- [ ] `POST /api/payment/webhook/route.ts`
- [ ] `req.text()` for raw body (required for sig verification)
- [ ] Verify Razorpay signature — return 400 if invalid
- [ ] `payment.captured` → update order to PAID, decrement stock, send confirmation email
- [ ] `payment.failed` → update order to FAILED
- [ ] Always return 200 to Razorpay

### 6.4 Fix checkout page
- [ ] Delete fake `setTimeout(1400)` block
- [ ] Call `POST /api/payment/create-order`
- [ ] Load Razorpay script dynamically
- [ ] Open Razorpay modal, handle success/dismiss/error

### 6.5 Create order success page (new)
- [ ] `src/app/order/[id]/page.tsx` — poll status every 2s, show PENDING/PAID/FAILED states

### 6.6 Create order status API (new)
- [ ] `GET /api/orders/[id]/status/route.ts` — return `{ status }` for order

### 6.7 Configure Razorpay webhook in dashboard
- [ ] URL: `https://yunperfume.com/api/payment/webhook`
- [ ] Events: `payment.captured`, `payment.failed`
- [ ] `wrangler secret put RAZORPAY_WEBHOOK_SECRET`

---

## PHASE 7 — Profile Page (Real Session)
> Branch: `phase-7-profile`

### 7.1 Create orders list API
- [ ] `GET /api/orders/route.ts` — session required, return user's orders from D1

### 7.2 Rewrite profile page
- [ ] `requireSession()` → redirect to `/login` if null
- [ ] Show real user email from session
- [ ] Real order history from D1
- [ ] Sign out button → `POST /api/auth/signout`

---

## PHASE 8 — Admin Panel (Complete + Protect)
> Branch: `phase-8-admin`

### 8.1 Verify middleware protection
- [ ] Test: no session → `/login`
- [ ] Test: USER role → `/login`
- [ ] Test: ADMIN role → dashboard loads

### 8.2 Admin layout server-side guard
- [ ] `requireAdmin()` in layout — redirect if null
- [ ] Add sidebar: Dashboard, Products, Orders, Collections

### 8.3 Admin API auth helper
- [ ] `src/lib/admin-auth.ts` — `requireAdminFromRequest(req: NextRequest)`

### 8.4 Products list page
- [ ] `/admin/products/page.tsx` — table: thumbnail, name, price, stock, active, edit link

### 8.5 Product create/edit form
- [ ] `/admin/products/new/page.tsx`
- [ ] `/admin/products/[id]/edit/page.tsx`
- [ ] `POST /api/admin/products/route.ts`
- [ ] `PATCH /api/admin/products/[id]/route.ts`

### 8.6 Orders list page
- [ ] `/admin/orders/page.tsx` — table with status filter

### 8.7 Order detail + status update
- [ ] `/admin/orders/[id]/page.tsx`
- [ ] `PATCH /api/admin/orders/[id]/route.ts`

### 8.8 Collections page
- [ ] `/admin/collections/page.tsx`
- [ ] `GET + POST /api/admin/collections/route.ts`

---

## PHASE 9 — R2 Image Storage
> Branch: `phase-9-r2`

### 9.1 Image upload API
- [ ] `POST /api/upload/route.ts` — admin only, max 5MB, jpg/png/webp, store in R2

### 9.2 Upload existing product images to R2
- [ ] Upload all 4 fragrance images to `yun-perfume-images` bucket
- [ ] Update seed script with real R2 URLs

### 9.3 R2 URL helper
- [ ] `src/lib/r2.ts` — `getR2Url(key)` using `NEXT_PUBLIC_R2_PUBLIC_URL`

---

## PHASE 10 — Polish & Edge Cases
> Branch: `phase-10-polish`

- [ ] Wire "Add to bag" on discovery-set page
- [ ] Ensure discovery-set product in DB seed with `isDiscoverySet: true`
- [ ] `src/app/not-found.tsx` — brand-styled 404
- [ ] `src/app/error.tsx` — with retry button
- [ ] `src/app/shop/loading.tsx` — product grid skeleton
- [ ] `src/app/admin/loading.tsx` — minimal spinner
- [ ] `noindex` meta on `/order/*`, `/admin/*`, `/login`
- [ ] `src/app/sitemap.ts` — all 4 product URLs
- [ ] `src/app/robots.ts` — disallow `/admin`, `/api`, `/order`

---

## PHASE 11 — Security Checklist
> Branch: `phase-11-security`

- [ ] Every `src/app/api/` route has `export const runtime = 'edge'`
- [ ] Every admin API calls `requireAdminFromRequest()` — returns 403 if null
- [ ] Webhook verifies Razorpay signature before any processing
- [ ] Order amounts calculated server-side only — client prices never trusted
- [ ] Stock decremented only in webhook after `payment.captured`
- [ ] Webhook is idempotent — duplicate events handled gracefully
- [ ] Magic tokens single-use — `usedAt` set immediately
- [ ] `JWT_SECRET` ≥ 64 chars (`openssl rand -base64 64`)
- [ ] `yun_session` cookie: `HttpOnly`, `Secure`, `SameSite: lax`
- [ ] No secrets in `wrangler.toml` — all via `wrangler secret put`
- [ ] `.env.local` in `.gitignore`
- [ ] Rate limiting on magic link endpoint (KV, 3/email/10min)
- [ ] File upload: validate MIME type AND file size before R2
- [ ] Zod validation on ALL API inputs

---

## PHASE 12 — Testing & QA
> Branch: `phase-12-testing`

### 12.1 Auth
- [ ] Email → real magic link arrives in inbox within 60s
- [ ] Click link → USER goes to `/profile`, ADMIN to `/admin`
- [ ] Use link twice → error shown
- [ ] Expired link → error shown
- [ ] `/admin` without session → `/login`
- [ ] `/admin` as USER → `/login`
- [ ] `/profile` without session → `/login`

### 12.2 Shop & cart
- [ ] All 4 products load from D1 (not `fragrances.ts`)
- [ ] Add to cart → drawer opens, header count updates
- [ ] Cart persists on refresh
- [ ] Prices display in INR (not paise)

### 12.3 Payment (test mode)
- [ ] PAY button calls real API — no setTimeout
- [ ] Razorpay modal opens with correct amount
- [ ] Success card `4111 1111 1111 1111` → webhook fires → order PAID
- [ ] Order success page shows confirmation
- [ ] Order confirmation email received
- [ ] Stock decremented in D1

### 12.4 Payment failure
- [ ] Failure card `4000 0000 0000 0002` → no stock decrement, no email
- [ ] Order failure state shown

### 12.5 Admin
- [ ] Dashboard stats accurate
- [ ] Create product → appears on `/shop`
- [ ] Edit price → updates on storefront
- [ ] Orders list shows test orders
- [ ] Update order to SHIPPED

### 12.6 Contact form
- [ ] Submit → email arrives at `hello@yunperfume.com`

### 12.7 Mobile (375px + 390px)
- [ ] All pages render correctly
- [ ] Cart drawer usable
- [ ] Checkout form usable
- [ ] Razorpay modal works on iOS Safari + Android Chrome

---

## PHASE 13 — Production Deployment
> Branch: `phase-13-deploy`

### 13.1 Pre-deploy
- [ ] `bun run db:migrate:remote` — apply migrations to production D1
- [ ] Seed production D1
- [ ] Upload product images to production R2
- [ ] `wrangler secret list` — verify all 8 secrets present
- [ ] Switch to live Razorpay keys

### 13.2 Deploy
- [ ] Push to `main` → auto-deploy via GitHub integration
- [ ] Build completes with 0 errors

### 13.3 Configure live Razorpay webhook
- [ ] URL: `https://yunperfume.com/api/payment/webhook`
- [ ] `wrangler secret put RAZORPAY_WEBHOOK_SECRET` (live secret)

### 13.4 Post-deploy smoke test
- [ ] Site loads with GSAP animations intact
- [ ] All 4 products on `/shop`
- [ ] Complete a real ₹1 live transaction
- [ ] Order confirmation email received
- [ ] Admin panel shows live order

### 13.5 Monitoring
- [ ] Cloudflare Analytics enabled
- [ ] D1 query metrics visible
- [ ] Razorpay webhook alert email configured
- [ ] Pages build failure notifications enabled

---

## APPENDIX — Quick Reference

### Price rule (critical)
```
D1 stores paise:      ₹4,800 = 480000
UI displays INR:      480000 / 100 → formatINR()
Razorpay takes paise: send 480000 directly from DB
Cart stores INR:      product.price / 100 before adding to cart
```

### Order status flow
```
PENDING → PAID        webhook: payment.captured
PENDING → FAILED      webhook: payment.failed
PAID    → SHIPPED     admin action
SHIPPED → DELIVERED   admin action
ANY     → CANCELLED   admin action
```

### Razorpay test cards
| Card | Result |
|------|--------|
| `4111 1111 1111 1111` | Success |
| `4000 0000 0000 0002` | Failure |
| `success@razorpay` (UPI) | Success |
| `failure@razorpay` (UPI) | Failure |

### Branch → Phase map
| Branch | Phase |
|--------|-------|
| `phase-0-infra` | Infrastructure & Config |
| `phase-1-database` | Drizzle + D1 Schema |
| `phase-2-cloudflare` | Cloudflare Services |
| `phase-3-auth` | Magic Link Auth |
| `phase-4-products` | Products: DB integration |
| `phase-5-email` | Resend Email |
| `phase-6-razorpay` | Payment Integration |
| `phase-7-profile` | Profile Page |
| `phase-8-admin` | Admin Panel |
| `phase-9-r2` | R2 Image Storage |
| `phase-10-polish` | Polish & Edge Cases |
| `phase-11-security` | Security Hardening |
| `phase-12-testing` | Testing & QA |
| `phase-13-deploy` | Production Deploy |
