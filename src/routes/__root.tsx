import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { SmoothScrollProvider } from "@/lib/smooth-scroll";
import { CartProvider } from "@/lib/cart-store";
import { AuthProvider } from "@/lib/auth-store";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-[120px] font-light leading-none">404</div>
        <h2 className="mt-6 font-display text-2xl font-light">This page is not in our atelier</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has been moved or never existed.
        </p>
        <div className="mt-8">
          <Link to="/" className="eyebrow border-b border-foreground pb-1">
            Return home →
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "YUN — Slow perfumery from India" },
      {
        name: "description",
        content:
          "YUN is a small-batch perfume house from India. Mogra, oud, sandalwood and chai — fragrances rooted in the materials and rituals of the subcontinent.",
      },
      { name: "author", content: "YUN Atelier" },
      { property: "og:title", content: "YUN — Slow perfumery from India" },
      {
        property: "og:description",
        content: "Small-batch fragrances rooted in Indian materials and rituals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#F5F1EA" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ScrollToTop() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function RootComponent() {
  return (
    <AuthProvider>
      <CartProvider>
        <SmoothScrollProvider>
          <ScrollToTop />
          <SiteHeader />
          <main className="min-h-screen">
            <Outlet />
          </main>
          <SiteFooter />
          <CartDrawer />
        </SmoothScrollProvider>
      </CartProvider>
    </AuthProvider>
  );
}
