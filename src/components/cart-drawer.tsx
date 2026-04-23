"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-store";
import { formatINR, cn } from "@/lib/utils";
import { useEffect } from "react";

export function CartDrawer() {
  const { items, isOpen, setOpen, setQty, remove, subtotal } = useCart();

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[60] bg-black/70 backdrop-blur-[4px] transition-opacity duration-500",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex w-full max-w-[440px] flex-col bg-card shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div className="eyebrow">Your bag · {items.length}</div>
          <button onClick={() => setOpen(false)} aria-label="Close" className="-mr-2 p-2">
            <X className="h-4 w-4" strokeWidth={1.4} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <div className="font-display text-3xl font-light">Your bag is empty</div>
              <p className="mt-3 text-sm text-muted-foreground">
                Begin with a single fragrance, or our discovery set.
              </p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="eyebrow mt-8 border-b border-foreground pb-1"
              >
                Browse fragrances →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 px-6 py-5">
                  <div className="relative h-24 w-20 flex-none overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-display text-xl font-light">{item.name}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{item.size}</div>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => setQty(item.id, item.quantity - 1)}
                          className="grid h-8 w-8 place-items-center hover:bg-foreground/5"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <div className="grid h-8 w-8 place-items-center text-sm">{item.quantity}</div>
                        <button
                          onClick={() => setQty(item.id, item.quantity + 1)}
                          className="grid h-8 w-8 place-items-center hover:bg-foreground/5"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="font-mono text-sm">{formatINR(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono">{formatINR(subtotal)}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Shipping & taxes calculated at checkout · Free shipping over ₹3,000
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="mt-5 flex w-full items-center justify-center bg-foreground py-4 text-sm tracking-wider text-background transition-colors hover:bg-accent"
            >
              CHECKOUT
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

