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
- [x] `bun add drizzle-orm && bun add -d drizzle-kit`
- [x] `bun remove prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless`
- [x] Delete `prisma/` folder (keep `schema.prisma` as reference)
- [x] Delete `src/lib/db.ts`
- [x] Remove `DATABASE_URL` from `.env`

### 0.2 Install remaining dependencies
- [x] `bun add @cloudflare/next-on-pages razorpay resend zod jose nanoid`
- [x] `bun add -d wrangler`

### 0.3 Fix wrangler config
- [x] Delete `wrangler.jsonc`
- [x] Create `wrangler.toml` with D1, R2, KV bindings and correct `pages_build_output_dir`

### 0.4 Fix next.config
- [x] Add `setupDevPlatform()` for Cloudflare local dev
- [x] Add R2 remote patterns to `images.remotePatterns`

### 0.5 Fix package.json scripts
- [x] Add `pages:build`, `deploy`, `db:generate`, `db:migrate:local`, `db:migrate:remote`, `db:studio`, `db:seed`

### 0.6 Fix .env.local
- [x] Rename `.env` → `.env.local`
- [x] Add `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_R2_PUBLIC_URL`
- [x] Remove `DATABASE_URL`
- [x] Confirm `.env.local` in `.gitignore`
- [x] Create `.env.example` with all keys but empty values

### 0.7 Add Cloudflare runtime to all API routes
- [x] `export const runtime = 'edge'` in `api/auth/magic-link/route.ts`
- [x] `export const runtime = 'edge'` in `api/payment/create-order/route.ts`

### 0.8 Fix the shop page Server Component bug
- [x] Remove unused `useCart` import from `src/app/shop/page.tsx` (line 5)
- [x] Confirm no client hooks in that file

---

## PHASE 1 — Database: Drizzle + D1
> Branch: `phase-1-database`

### 1.1 Create folder structure
- [x] Create `src/db/schema.ts`
- [x] Create `src/db/index.ts`
- [x] Create `drizzle.config.ts`

### 1.2 Write schema
- [x] `users` table — id, email, name, role, createdAt, lastLoginAt
- [x] `collections` table — id, slug, name, description, createdAt
- [x] `products` table — id, slug, name, tagline, description, price (paise), stock, active, imageUrl, images (JSON), collectionId, scentFamily, scentNotes (JSON), concentration, size, isDiscoverySet, createdAt, updatedAt
- [x] `magic_tokens` table — id, email, token, expiresAt, usedAt, createdAt
- [x] `orders` table — id, userId, email, status, totalAmount, razorpayOrderId, razorpayPaymentId, shippingAddress (JSON), createdAt, paidAt
- [x] `order_items` table — id, orderId, productId, productName, quantity, unitPrice

### 1.3 DB connection helper
- [x] `src/db/index.ts` — `getDb(d1: D1Database)` using `drizzle-orm/d1`

### 1.4 Drizzle config
- [x] `drizzle.config.ts` — dialect: sqlite, driver: d1-http

### 1.5 Generate & apply migrations
- [x] `bun run db:generate`
- [x] `wrangler d1 create yun-perfume-db`
- [x] Paste `database_id` into `wrangler.toml`
- [x] `bun run db:migrate:local`
- [x] Verify tables exist

### 1.6 Seed the database
- [x] Create `scripts/seed.ts` with all 4 products + 1 collection + 1 ADMIN user
- [x] `bun run db:seed`
- [x] Verify products in D1

### 1.7 Update admin dashboard to Drizzle
- [x] Replace Prisma imports with `getDb`, `products`, `orders` from `@/db`
- [x] Add `export const runtime = 'edge'`
- [x] Rewrite queries with Drizzle syntax

---

## PHASE 2 — Cloudflare Services Setup
> Branch: `phase-2-cloudflare`

### 2.1 D1
- [x] `database_id` confirmed in `wrangler.toml`
- [x] Local migrations applied

### 2.2 R2 bucket
- [x] `wrangler r2 bucket create yun-perfume-images`
- [x] Enable public access in Cloudflare dashboard
- [x] Copy public URL → set `NEXT_PUBLIC_R2_PUBLIC_URL`

### 2.3 KV namespace
- [x] `wrangler kv namespace create SESSIONS`
- [x] `wrangler kv namespace create SESSIONS --preview`
- [x] Paste both IDs into `wrangler.toml`

### 2.4 Store production secrets
- [ ] `wrangler secret put RAZORPAY_KEY_ID`
- [ ] `wrangler secret put RAZORPAY_KEY_SECRET`
- [ ] `wrangler secret put RAZORPAY_WEBHOOK_SECRET`
- [ ] `wrangler secret put NEXT_PUBLIC_RAZORPAY_KEY_ID`
- [x] `wrangler secret put RESEND_API_KEY`
- [x] `wrangler secret put JWT_SECRET`
- [ ] `wrangler secret put NEXT_PUBLIC_APP_URL`
- [ ] `wrangler secret put NEXT_PUBLIC_R2_PUBLIC_URL`

### 2.5 Connect GitHub to Cloudflare Pages
- [x] Dashboard → Pages → Connect Git → select repo
- [x] Build command: `bun run pages:build`
- [x] Output dir: `.vercel/output/static`
- [x] Node version: `20`

### 2.6 Custom domain
- [x] Add `yunperfume.com` to Pages project
- [x] Confirm SSL active

---

## PHASE 3 — Auth: Magic Link (End-to-End)
> Branch: `phase-3-auth`

### 3.1 Create auth utilities
- [x] `src/lib/auth.ts` — `createSessionToken`, `verifySessionToken`, `generateMagicToken`, `getMagicTokenExpiry`

### 3.2 Create session helper
- [x] `src/lib/session.ts` — `getSession`, `requireSession`, `requireAdmin`

### 3.3 Rewrite magic-link API route
- [x] `POST /api/auth/magic-link/route.ts` — validate email (Zod), rate limit (KV), upsert user (D1), store token in `magic_tokens` (D1), send email (Resend)

### 3.4 Create verify route (new)
- [x] `GET /api/auth/verify/route.ts` — validate token from D1, mark used, set `yun_session` cookie (HttpOnly, Secure, SameSite:lax, 30d), redirect by role

### 3.5 Create signout route (new)
- [x] `POST /api/auth/signout/route.ts` — delete `yun_session` cookie

### 3.6 Update auth-store.tsx
- [x] `sendMagicLink()` — real `fetch('/api/auth/magic-link', ...)`
- [x] Remove `verify()` and all sessionStorage/localStorage token logic

### 3.7 Update login page
- [x] Remove OTP code input step — link in email IS verification
- [x] Handle `?error=invalid` and `?error=expired` query params

### 3.8 Route protection middleware
- [x] `src/middleware.ts` — protect `/admin/*` (ADMIN only) and `/profile/*` (any session)

---

## PHASE 4 — Products: Static → Database
> Branch: `phase-4-products`

### 4.1 Mark fragrances.ts as reference-only
- [x] Add comment: `// Reference only — live data from D1`

### 4.2 Create Products API
- [x] `GET /api/products/route.ts` — all active products from D1
- [x] `GET /api/products/[slug]/route.ts` — single product or 404

### 4.3 Update shop page
- [x] Remove `fragrances` import and `useCart` import (bug)
- [x] Fetch from `GET /api/products` server-side
- [x] Map D1 fields to existing UI props (paise → INR, JSON strings → objects)

### 4.4 Update product detail page
- [x] Fetch from `GET /api/products/${slug}`
- [x] Add `generateStaticParams()` for all 4 slugs
- [x] Parse `scentNotes` and `images` JSON
- [x] Price: `product.price / 100` for INR display

### 4.5 Fix cart price handling
- [x] When adding to cart: `price: product.price / 100` (D1 paise → INR for cart)

---

## PHASE 5 — Email Integration (Resend)
> Branch: `phase-5-email`

### 5.1 Resend client
- [x] `src/lib/resend.ts` — `resend` instance, `FROM` constant

### 5.2 Magic link email template
- [x] `src/lib/emails/magic-link.ts` — dark brand-styled HTML email, 15min expiry note

### 5.3 Order confirmation email template
- [x] `src/lib/emails/order-confirmation.ts` — items table, shipping address, total, dispatch note

### 5.4 Fix contact form
- [ ] Wire form to `POST /api/contact`
- [ ] `src/app/api/contact/route.ts` — Zod validation, Resend to `hello@yunperfume.com`

---

## PHASE 6 — Razorpay: Full Payment Integration
> Branch: `phase-6-razorpay`

### 6.1 Razorpay helper
- [x] `src/lib/razorpay.ts` — `razorpay` instance, `verifyWebhookSignature(rawBody, sig)`

### 6.2 Rewrite create-order API
- [x] Validate body with Zod: `{ items, shippingAddress, email }`
- [x] **Fetch prices from D1 — never trust client prices**
- [x] Validate stock, calculate total server-side (paise), apply GST + shipping
- [x] Create Razorpay order, save draft order to D1, return `{ orderId, razorpayOrderId, amount, keyId }`

### 6.3 Create webhook handler (new — was completely missing)
- [ ] `POST /api/payment/webhook/route.ts`
- [ ] `req.text()` for raw body (required for sig verification)
- [ ] Verify Razorpay signature — return 400 if invalid
- [ ] `payment.captured` → update order to PAID, decrement stock, send confirmation email
- [ ] `payment.failed` → update order to FAILED
- [ ] Always return 200 to Razorpay

### 6.4 Fix checkout page
- [x] Delete fake `setTimeout(1400)` block
- [x] Call `POST /api/payment/create-order`
- [x] Load Razorpay script dynamically
- [x] Open Razorpay modal, handle success/dismiss/error

### 6.5 Create order success page (new)
- [x] `src/app/order/[id]/page.tsx` — poll status every 2s, show PENDING/PAID/FAILED states

### 6.6 Create order status API (new)
- [x] `GET /api/orders/[id]/status/route.ts` — return `{ status }` for order

### 6.7 Configure Razorpay webhook in dashboard
- [ ] URL: `https://yunperfume.com/api/payment/webhook`
- [ ] Events: `payment.captured`, `payment.failed`
- [ ] `wrangler secret put RAZORPAY_WEBHOOK_SECRET`

---

## PHASE 7 — Profile Page (Real Session)
> Branch: `phase-7-profile`

### 7.1 Create orders list API
- [x] `GET /api/orders/route.ts` — session required, return user's orders from D1

### 7.2 Rewrite profile page
- [x] `requireSession()` → redirect to `/login` if null
- [x] Show real user email from session
- [x] Real order history from D1
- [x] Sign out button → `POST /api/auth/signout`

---

## PHASE 8 — Admin Panel (Complete + Protect)
> Branch: `phase-8-admin`

### 8.1 Verify middleware protection
- [x] Test: no session → `/login`
- [x] Test: USER role → `/login`
- [x] Test: ADMIN role → dashboard loads

### 8.2 Admin layout server-side guard
- [x] `requireAdmin()` in layout — redirect if null
- [x] Add sidebar: Dashboard, Products, Orders, Collections

### 8.3 Admin API auth helper
- [x] `src/lib/admin-auth.ts` — `requireAdminFromRequest(req: NextRequest)`

### 8.4 Products list page
- [x] `/admin/products/page.tsx` — table: thumbnail, name, price, stock, active, edit link

### 8.5 Product create/edit form
- [x] `/admin/products/new/page.tsx`
- [x] `/admin/products/[id]/edit/page.tsx`
- [x] `POST /api/admin/products/route.ts`
- [x] `PATCH /api/admin/products/[id]/route.ts`

### 8.6 Orders list page
- [x] `/admin/orders/page.tsx` — table with status filter

### 8.7 Order detail + status update
- [x] `/admin/orders/[id]/page.tsx`
- [x] `PATCH /api/admin/orders/[id]/route.ts`

### 8.8 Collections page
- [ ] `/admin/collections/page.tsx`
- [ ] `GET + POST /api/admin/collections/route.ts`

---

## PHASE 9 — R2 Image Storage
> Branch: `phase-9-r2`

### 9.1 Image upload API
- [x] `POST /api/upload/route.ts` — admin only, max 5MB, jpg/png/webp, store in R2

### 9.2 Upload existing product images to R2
- [x] Upload all 4 fragrance images to `yun-perfume-images` bucket
- [x] Update seed script with real R2 URLs

### 9.3 R2 URL helper
- [x] `src/lib/r2.ts` — `getR2Url(key)` using `NEXT_PUBLIC_R2_PUBLIC_URL`

---

## PHASE 10 — Polish & Edge Cases
> Branch: `phase-10-polish`

- [x] Wire "Add to bag" on discovery-set page
- [x] Ensure discovery-set product in DB seed with `isDiscoverySet: true`
- [x] `src/app/not-found.tsx` — brand-styled 404
- [x] `src/app/error.tsx` — with retry button
- [x] `src/app/shop/loading.tsx` — product grid skeleton
- [x] `src/app/admin/loading.tsx` — minimal spinner
- [x] `noindex` meta on `/order/*`, `/admin/*`, `/login`
- [x] `src/app/sitemap.ts` — all 4 product URLs
- [x] `src/app/robots.ts` — disallow `/admin`, `/api`, `/order`

---

## PHASE 11 — Security Checklist
> Branch: `phase-11-security`

- [x] Every `src/app/api/` route has `export const runtime = 'edge'`
- [x] Every admin API calls `requireAdminFromRequest()` — returns 403 if null
- [x] Webhook verifies Razorpay signature before any processing
- [x] Order amounts calculated server-side only — client prices never trusted
- [x] Stock decremented only in webhook after `payment.captured`
- [x] Webhook is idempotent — duplicate events handled gracefully
- [x] Magic tokens single-use — `usedAt` set immediately
- [x] `JWT_SECRET` ≥ 64 chars (`openssl rand -base64 64`)
- [x] `yun_session` cookie: `HttpOnly`, `Secure`, `SameSite: lax`
- [x] No secrets in `wrangler.toml` — all via `wrangler secret put`
- [x] `.env.local` in `.gitignore`
- [x] Rate limiting on magic link endpoint (KV, 3/email/10min)
- [x] File upload: validate MIME type AND file size before R2
- [x] Zod validation on ALL API inputs

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
- [x] Run `npm run build` locally to verify no type/build errors

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
- [x] `bun run db:migrate:remote` — apply migrations to production D1
- [x] Seed production D1
- [ ] Upload product images to production R2
- [x] `wrangler secret list` — verify all 8 secrets present
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
