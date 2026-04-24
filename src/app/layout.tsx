import type { Metadata, Viewport } from "next";
import "../styles.css";
import { SmoothScrollProvider } from "@/lib/smooth-scroll";
import { CartProvider } from "@/lib/cart-store";
import { AuthProvider } from "@/lib/auth-store";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { Preloader } from "@/components/preloader";


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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F1EA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-transparent">
          <Preloader />
          <AuthProvider>
            <CartProvider>
              <SmoothScrollProvider>
                <div className="relative flex min-h-screen flex-col bg-transparent">
                  <SiteHeader />
                  <main className="flex-1 bg-transparent">
                    {children}
                  </main>
                  <SiteFooter />
                </div>
                <CartDrawer />
              </SmoothScrollProvider>
            </CartProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
