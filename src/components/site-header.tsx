"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, User2, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import logo from "../../Images/YunLogo.png";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/atelier", label: "Atelier" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/60"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 md:h-24 md:px-10">
        <Link href="/" className="relative h-12 w-36 md:h-16 md:w-48 transition-opacity hover:opacity-80">
          <Image
            src={logo}
            alt="YUN Atelier"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "eyebrow transition-colors hover:text-foreground",
                pathname === item.href ? "text-foreground" : "text-foreground/70"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
                    <Link
            href="/login"
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
          >
            <User2 className="h-[18px] w-[18px]" strokeWidth={1.4} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Open cart, ${count} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-medium text-accent-foreground">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.4} /> : <Menu className="h-5 w-5" strokeWidth={1.4} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col gap-1 border-t border-border/60 bg-background/95 px-5 py-6 backdrop-blur-md">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-display py-3 text-3xl font-light"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
