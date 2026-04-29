"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { StaticImageData } from "next/image";

export interface CartItem {
  id: string;
  name: string;
  price: number; // in INR
  size: string;
  image: string | StaticImageData;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "yun:cart";

function mergeItems(local: CartItem[], server: CartItem[]): CartItem[] {
  if (!server.length) return local;
  if (!local.length) return server;
  // Merge: server is source of truth, add any local-only items on top
  const merged = [...server];
  for (const localItem of local) {
    const exists = merged.find((s) => s.id === localItem.id);
    if (!exists) merged.push(localItem);
  }
  return merged;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Step 1: Hydrate from localStorage ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  // ── Step 2: After hydration, check session & sync server cart ───────────────
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    async function syncWithServer() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        if (!sessionRes.ok) return;
        const session = await sessionRes.json() as any;
        if (!session?.user?.id) return;

        if (cancelled) return;
        setIsLoggedIn(true);

        // Fetch server cart
        const cartRes = await fetch("/api/cart");
        if (!cartRes.ok) return;
        const { items: serverItems } = await cartRes.json() as { items: CartItem[] };

        if (cancelled) return;
        // Merge local + server (server wins for existing items)
        setItems((local) => mergeItems(local, serverItems));
      } catch { /* network error — stay local */ }
    }

    syncWithServer();
    return () => { cancelled = true; };
  }, [hydrated]);

  // ── Step 3: Persist to localStorage always ──────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items, hydrated]);

  // ── Step 4: Debounced save to server when logged in ─────────────────────────
  useEffect(() => {
    if (!hydrated || !isLoggedIn) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }).catch(() => { /* silent fail */ });
    }, 800);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [items, hydrated, isLoggedIn]);

  const add = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + qty } : p,
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: Math.max(0, qty) } : p))
        .filter((p) => p.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      add,
      remove,
      setQty,
      clear,
      isOpen,
      setOpen,
      count: items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    [items, add, remove, setQty, clear, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
