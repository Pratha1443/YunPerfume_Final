import Link from "next/link";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb, products, orders } from "@/db";
import { count, sum, eq } from "drizzle-orm";
import { formatINR } from "@/lib/utils";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { env } = getRequestContext();
  const db = getDb(env.DB);

  // Fetch high-level stats from D1
  const [productCountResult] = await db
    .select({ value: count() })
    .from(products)
    .where(eq(products.active, true));

  const [orderCountResult] = await db
    .select({ value: count() })
    .from(orders);

  const [revenueResult] = await db
    .select({ value: sum(orders.totalAmount) })
    .from(orders)
    .where(eq(orders.status, "PAID"));

  const productCount = productCountResult?.value ?? 0;
  const orderCount = orderCountResult?.value ?? 0;
  const totalRevenuePaise = Number(revenueResult?.value ?? 0);

  return (
    <div className="space-y-12">
      <header>
        <h1 className="h-display text-5xl font-light md:text-7xl">Dashboard</h1>
        <p className="mt-4 text-muted-foreground eyebrow uppercase tracking-[0.2em]">
          Platform Overview
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          label="Active Products"
          value={String(productCount)}
          href="/admin/products"
        />
        <StatCard
          label="Total Orders"
          value={String(orderCount)}
          href="/admin/orders"
        />
        <StatCard
          label="Revenue (Paid)"
          value={formatINR(totalRevenuePaise / 100)}
          href="/admin/orders"
        />
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <section className="rounded-sm border border-border/60 bg-card p-8">
          <h2 className="font-display text-2xl font-light mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/products/new"
              className="bg-foreground px-6 py-3 text-sm tracking-wider text-background hover:bg-accent transition-colors"
            >
              ADD PRODUCT
            </Link>
            <Link
              href="/admin/collections/new"
              className="border border-border px-6 py-3 text-sm tracking-wider hover:bg-muted transition-colors text-center"
            >
              CREATE COLLECTION
            </Link>
            <Link
              href="/admin/orders"
              className="border border-border px-6 py-3 text-sm tracking-wider hover:bg-muted transition-colors text-center"
            >
              VIEW ORDERS
            </Link>
          </div>
        </section>

        <section className="rounded-sm border border-border/60 bg-card p-8">
          <h2 className="font-display text-2xl font-light mb-6">System Status</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground">Database (D1)</span>
              <span className="text-green-500 font-mono">Connected</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground">R2 Storage</span>
              <span className="text-amber-500 font-mono">Pending setup</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground">Auth (Magic Link)</span>
              <span className="text-green-500 font-mono">Completed</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-muted-foreground">Payments (Razorpay)</span>
              <span className="text-green-500 font-mono">Active</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-sm border border-border/60 bg-card p-8 transition-all hover:border-accent"
    >
      <div className="eyebrow text-muted-foreground group-hover:text-accent transition-colors">
        {label}
      </div>
      <div className="mt-4 font-display text-5xl font-light">{value}</div>
    </Link>
  );
}
