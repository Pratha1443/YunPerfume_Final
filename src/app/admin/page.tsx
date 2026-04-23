import Link from "next/link";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch high-level stats from DB
  const productCount = await db.product.count();
  const orderCount = await db.order.count();
  const totalRevenue = await db.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: "PAID" },
  });

  return (
    <div className="space-y-12">
      <header>
        <h1 className="h-display text-5xl font-light md:text-7xl">Dashboard</h1>
        <p className="mt-4 text-muted-foreground eyebrow uppercase tracking-[0.2em]">Platform Overview</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Total Products" value={productCount.toString()} href="/admin/products" />
        <StatCard label="Total Orders" value={orderCount.toString()} href="/admin/orders" />
        <StatCard 
          label="Revenue" 
          value={formatINR((totalRevenue._sum.totalAmount || 0) / 100)} 
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
          </div>
        </section>

        <section className="rounded-sm border border-border/60 bg-card p-8">
          <h2 className="font-display text-2xl font-light mb-6">System Status</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Database</span>
              <span className="text-green-600 font-mono">Connected</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">R2 Storage</span>
              <span className="text-green-600 font-mono">Operational</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link href={href} className="group block rounded-sm border border-border/60 bg-card p-8 transition-all hover:border-accent">
      <div className="eyebrow text-muted-foreground group-hover:text-accent transition-colors">{label}</div>
      <div className="mt-4 font-display text-5xl font-light">{value}</div>
    </Link>
  );
}
