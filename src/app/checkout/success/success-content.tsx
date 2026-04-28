"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div className="bg-transparent noise min-h-screen pt-32 pb-32 md:pt-40">
      <div className="mx-auto max-w-md px-5 text-center">
        <div className="flex justify-center mb-8">
          <CheckCircle2 className="h-20 w-20 text-accent stroke-[1px]" />
        </div>
        <div className="eyebrow text-accent">Payment successful</div>
        <h1 className="h-display mt-6 text-5xl font-light md:text-6xl">
          Order confirmed.
        </h1>
        <p className="mt-8 leading-relaxed text-muted-foreground">
          Thank you for choosing YUN. Your order{" "}
          {orderId && <span className="font-mono text-foreground">#{orderId}</span>} has been
          received. A confirmation email will reach your inbox shortly.
        </p>

        <div className="mt-12 flex flex-col gap-4">
          <Link
            href="/shop"
            className="bg-foreground py-4 text-sm tracking-wider text-background hover:bg-accent transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
          <Link
            href="/profile"
            className="eyebrow text-muted-foreground hover:text-foreground transition-colors pt-2"
          >
            Track your order →
          </Link>
        </div>
      </div>
    </div>
  );
}
