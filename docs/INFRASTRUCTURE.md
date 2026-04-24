# YUN Perfume — Infrastructure & Handover Documentation

This document summarizes the finalized infrastructure for the YUN Perfume digital atelier, based on the **Setup & Handover Guide v2.0**.

## 🏗️ Core Infrastructure (Cloudflare Ecosystem)

YUN is architected to run entirely within the **Cloudflare** ecosystem for maximum performance and minimal cost.

- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/): Provides global delivery, automatic HTTPS, and under-60-second deployments via GitHub.
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/): A native SQLite-based database built into Cloudflare. **Neon (PostgreSQL) is no longer used.**
- **Media Storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/): S3-compatible object storage for high-resolution perfume imagery (`yun-perfume-assets`).
- **Session Store**: [Cloudflare KV](https://developers.cloudflare.com/kv/): Low-latency key-value store for user sessions and caching (`YUN_SESSIONS`).

## 💳 Payment Gateway

- **Provider**: [Razorpay](https://razorpay.com/)
- **Capability**: UPI (GPay, PhonePe), Cards, Net Banking.
- **Webhook URL**: `https://yunperfume.com/api/payment/webhook`

## 📧 Transactional Email

- **Provider**: [Resend](https://resend.com/)
- **Usage**: Order confirmations, login links, and shipping updates.
- **Limit**: 3,000 emails/month on the free tier.

## 🛠️ Build & Development Settings

- **Framework**: Next.js
- **Node.js Version**: 20+
- **Build Command**: `npm run pages:build` (Optimized for Cloudflare)
- **Output Directory**: `.vercel/output/static`

## 🔐 Environment Secrets

The following secrets must be configured in the Cloudflare Pages Dashboard (Settings > Variables and Secrets):

| Secret Name | Source |
|-------------|--------|
| `RAZORPAY_KEY_ID` | Razorpay Dashboard (Settings > API Keys) |
| `RAZORPAY_KEY_SECRET` | Razorpay Dashboard (Settings > API Keys) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as `RAZORPAY_KEY_ID` |
| `RESEND_API_KEY` | Resend Dashboard (API Keys) |

---
*Note: This documentation reflects the migration from Neon to Cloudflare D1 for improved performance and cost-efficiency.*
