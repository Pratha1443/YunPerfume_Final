import type { Metadata, Viewport } from "next";
import "../styles.css";
import { SmoothScrollProvider } from "@/lib/smooth-scroll";
import { CartProvider } from "@/lib/cart-store";
import { AuthProvider } from "@/lib/auth-store";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";

export const metadata: Metadata = {
  title: "YUN — Slow perfumery from India",
  description: "YUN is a small-batch perfume house from India. Mogra, oud, sandalwood and chai — fragrances rooted in the materials and rituals of the subcontinent.",
  authors: [{ name: "YUN Atelier" }],
  openGraph: {
    title: "YUN — Slow perfumery from India",
    description: "Small-batch fragrances rooted in Indian materials and rituals.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YUN — Slow perfumery from India",
    description: "Small-batch fragrances rooted in Indian materials and rituals.",
  },
  themeColor: "#F5F1EA",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <SmoothScrollProvider>
              <SiteHeader />
              <main className="min-h-screen">
                {children}
              </main>
              <SiteFooter />
              <CartDrawer />
            </SmoothScrollProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
