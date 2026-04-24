# YUN Atelier — Slow Perfumery from India

YUN is a high-end, editorial perfume house based in Pune, India. This digital atelier is designed to reflect the brand's core philosophy: **Patience, Materiality, and Ritual.**

The website provides a cinematic, scroll-driven experience that introduces users to the inaugural collection of four signature fragrances—Mogra Noir, Oud Vārā, Sandal Velvet, and Chai Atelier.

![YUN Banner](public/og-image.jpg)

## 🌿 The Vision

YUN was born in 2026 as an antithesis to fast perfumery. Every fragrance in the collection takes between four and eighteen months to compose, using materials sourced directly from growers across the Indian subcontinent. The digital experience aims to translate this tactile, slow-paced luxury into a fluid, immersive interface.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **Runtime**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Theming, OKLCH colors)
- **Animations**: [GSAP](https://gsap.com/) (ScrollTrigger, Timelines)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Database**: [Prisma](https://www.prisma.io/) + [Neon](https://neon.tech/) (PostgreSQL)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Optimized for [Cloudflare Pages](https://pages.cloudflare.com/)

## ✨ Key Features

### 1. "Deep Night" Cinematic Experience
Utilizes **GSAP ScrollTrigger** and **Lenis** to create a butter-smooth, parallax-heavy landing page. The site features a custom atmospheric background system with cobalt glows and grain textures that maintain a premium editorial feel across all pages, including shop details and policy documents.

### 2. Optimized Navigation & Lifecycle
Fully compatible with React 19's strict rendering. Includes a custom scroll-to-top reset on page transitions and stabilized GSAP contexts to ensure entrance animations never stick or "darken" during client-side navigation.

### 3. Fragrance Catalog & Discovery
A robust shop system featuring:
- **Discovery Set**: A dedicated path for newcomers to experience the full house.
- **Dynamic Product Pages**: Editorial layouts for each scent, detailing the top, heart, and base notes.
- **Cart & Checkout**: A streamlined slide-out cart and a secure checkout flow.

### 4. Performance Optimized
- **Next.js Image Optimization**: All images use the `sizes` prop to ensure the smallest possible resolution is delivered to mobile devices.
- **Hardware Acceleration**: GPU-accelerated layers for noise textures and horizontal tracks.
- **Client-Side State**: Centralized cart and auth management using custom hooks.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Bun (optional, but recommended)
- A Neon Database or PostgreSQL instance

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Pratha1443/YunPerfume_Final.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Setup environment variables:
   Create a `.env` file and add your database URL:
   ```env
   DATABASE_URL="your-postgresql-url"
   ```

4. Initialize the database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `/src/app`: Next.js 15 App Router (Pages, Layouts, API)
- `/src/components`: UI components, organized by domain (Home, Shop, Layout)
- `/src/lib`: Logic, stores (Cart/Auth), and database client
- `/src/styles.css`: Global styles and Tailwind v4 configuration
- `/prisma`: Database schema and migrations

---

© 2026 YUN Atelier · Pune, India
