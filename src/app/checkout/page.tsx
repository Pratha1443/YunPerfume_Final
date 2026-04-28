"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";

// Razorpay types
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open(): void;
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const metadata = {
  title: "Checkout — YUN",
  robots: "noindex, nofollow",
};

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useSession();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const shipping = subtotal >= 3000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="bg-transparent pt-32 pb-32 md:pt-40">
        <div className="mx-auto max-w-md px-5 text-center">
          <h1 className="h-display text-4xl font-light md:text-5xl">Your bag is empty</h1>
          <Link href="/shop" className="eyebrow mt-8 inline-block border-b border-foreground pb-1">
            Browse fragrances →
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setProcessing(true);

    const form = new FormData(e.currentTarget);
    const name = `${form.get("firstName")} ${form.get("lastName")}`.trim();
    const email = (form.get("email") as string) || user?.email || "";
    const phone = form.get("phone") as string;
    const address = {
      line1: form.get("address1") as string,
      line2: (form.get("address2") as string) || undefined,
      city: form.get("city") as string,
      state: form.get("state") as string,
      pin: form.get("pin") as string,
    };

    try {
      // 1. Create Razorpay order in backend
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total * 100, // convert to paise
          email,
          phone,
          name,
          address,
          items: items.map((i) => ({
            productId: i.id.split("-")[0], // strip size suffix
            name: i.name,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      const data = await res.json() as {
        razorpayOrderId?: string;
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        error?: string;
      };

      if (!res.ok || !data.razorpayOrderId) {
        throw new Error(data.error ?? "Failed to create order");
      }

      // 2. Load Razorpay script and open modal
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Could not load Razorpay. Check your connection.");

      const rzp = new window.Razorpay({
        key: data.keyId!,
        amount: data.amount!,
        currency: data.currency ?? "INR",
        name: "YUN Atelier",
        description: "Signature Fragrance Order",
        order_id: data.razorpayOrderId,
        prefill: { name, email, contact: phone },
        theme: { color: "#4a6fa5" },
        handler: (response) => {
          // Payment successful — redirect to success page
          clear();
          const params = new URLSearchParams({
            order_id: data.orderId ?? "",
            payment_id: response.razorpay_payment_id,
          });
          window.location.href = `/checkout/success?${params}`;
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      });

      rzp.open();

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setProcessing(false);
    }
  }

  return (
    <div className="bg-transparent pt-32 pb-32 md:pt-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <span className="block h-px w-12 bg-foreground/40" />
            <span className="eyebrow text-foreground/60">Checkout</span>
          </div>
          <h1 className="h-display mt-6 text-5xl font-light md:text-7xl">
            Almost <em className="italic font-light text-accent">yours.</em>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-16 md:grid-cols-[1fr_440px]">
          {/* Left: details */}
          <div className="space-y-12">
            <Section title="Contact">
              {!user && (
                <p className="mb-4 text-sm text-muted-foreground">
                  Have an account?{" "}
                  <Link href="/login" className="text-foreground underline">Sign in</Link>
                </p>
              )}
              <Field label="Email" name="email" type="email" defaultValue={user?.email} required />
              <Field label="Phone" name="phone" type="tel" required />
            </Section>

            <Section title="Shipping address">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="First name" name="firstName" required />
                <Field label="Last name" name="lastName" required />
              </div>
              <Field label="Address line 1" name="address1" required />
              <Field label="Address line 2 (optional)" name="address2" />
              <div className="grid gap-6 md:grid-cols-3">
                <Field label="City" name="city" required />
                <Field label="State" name="state" required />
                <Field label="PIN code" name="pin" required />
              </div>
            </Section>

            <Section title="Payment">
              <div className="rounded-sm border border-border/60 bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="leading-relaxed">Secure checkout via Razorpay</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      UPI · Cards · Net Banking · Wallets
                    </div>
                  </div>
                  <div className="rounded-sm bg-accent/10 px-3 py-1 text-xs text-accent">
                    Secure
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  You&apos;ll be prompted to pay ₹{total.toLocaleString("en-IN")} via Razorpay&apos;s secure checkout.
                </p>
              </div>
            </Section>

            {error && (
              <div className="rounded-sm border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          {/* Right: order summary */}
          <aside className="md:sticky md:top-28 md:self-start">
            <div className="border border-border/60 bg-card p-6">
              <div className="eyebrow text-muted-foreground">Order summary</div>
              <ul className="mt-6 divide-y divide-border/60">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4">
                    <div className="relative h-20 w-16 flex-none overflow-hidden bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="font-display text-lg font-light">{item.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.size} · Qty {item.quantity}
                      </div>
                      <div className="mt-auto font-mono text-sm">
                        {formatINR(item.price * item.quantity)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-2 border-t border-border/60 pt-6 text-sm">
                <Row label="Subtotal" value={formatINR(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? "Free" : formatINR(shipping)} />
                {shipping === 0 && subtotal > 0 && (
                  <div className="text-xs text-accent">✓ Free shipping on orders above ₹3,000</div>
                )}
                <div className="mt-3 border-t border-border/60 pt-3">
                  <Row label="Total" value={formatINR(total)} bold />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="mt-6 w-full bg-foreground py-4 text-sm tracking-wider text-background transition-colors hover:bg-accent disabled:opacity-60"
              >
                {processing ? "OPENING PAYMENT…" : `PAY ${formatINR(total)}`}
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                By placing this order you agree to our{" "}
                <Link href="/terms" className="underline">terms</Link>.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="eyebrow mb-6 text-muted-foreground">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Field({
  label, name, type = "text", required, defaultValue,
}: {
  label: string; name: string; type?: string; required?: boolean; defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow mb-2 block text-muted-foreground">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full border-b border-foreground/30 bg-transparent py-3 text-base outline-none transition-colors focus:border-foreground"
      />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-medium" : "text-muted-foreground"}>{label}</span>
      <span className={`font-mono ${bold ? "text-base" : "text-sm"}`}>{value}</span>
    </div>
  );
}
