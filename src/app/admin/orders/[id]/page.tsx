import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb, orders, orderItems } from "@/db";
import { eq } from "drizzle-orm";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusSelect } from "../status-select";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface OrderDetailProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailProps) {
  const { id } = await params;
  
  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .get();

  if (!order) {
    notFound();
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id))
    .all();

  const address = order.shippingAddress
    ? (() => {
        try { return JSON.parse(order.shippingAddress); }
        catch { return null; }
      })()
    : null;

  return (
    <div className="space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border/40 pb-8">
        <div>
          <div className="eyebrow text-muted-foreground mb-4">Management</div>
          <h1 className="h-display text-5xl font-light md:text-6xl">Order Details</h1>
          <p className="mt-4 text-muted-foreground font-mono text-xs">{order.id}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="eyebrow text-muted-foreground hover:text-foreground">
            ← All Orders
          </Link>
        </div>
      </header>

      <div className="grid gap-12 md:grid-cols-[1fr_360px]">
        {/* Left Col: Items & Payment info */}
        <div className="space-y-12">
          <section className="rounded-sm border border-border/60 bg-card p-6 md:p-8">
            <h2 className="eyebrow text-muted-foreground mb-6">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="border-b border-border/40 text-xs eyebrow text-muted-foreground bg-muted/10">
                  <tr>
                    <th className="px-4 py-3 font-normal">Product</th>
                    <th className="px-4 py-3 font-normal text-right">Unit Price</th>
                    <th className="px-4 py-3 font-normal text-right">Qty</th>
                    <th className="px-4 py-3 font-normal text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4">
                        <div className="text-foreground">{item.productName}</div>
                        <div className="text-xs text-muted-foreground mt-1">{item.productSize}</div>
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-xs text-muted-foreground">
                        {formatINR(item.unitPrice / 100)}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-sm">
                        {formatINR((item.unitPrice * item.quantity) / 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-6 border-t border-border/40 flex justify-end">
              <div className="w-64 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-mono text-lg">{formatINR(order.totalAmount / 100)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-sm border border-border/60 bg-card p-6 md:p-8">
            <h2 className="eyebrow text-muted-foreground mb-6">Payment Gateway Info</h2>
            <div className="grid gap-6 md:grid-cols-2 text-sm">
              <div>
                <div className="eyebrow text-[10px] text-muted-foreground mb-1">Razorpay Order ID</div>
                <div className="font-mono">{order.razorpayOrderId || "—"}</div>
              </div>
              <div>
                <div className="eyebrow text-[10px] text-muted-foreground mb-1">Razorpay Payment ID</div>
                <div className="font-mono">{order.razorpayPaymentId || "—"}</div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Col: Customer & Status */}
        <div className="space-y-6">
          <section className="rounded-sm border border-border/60 bg-card p-6">
            <h2 className="eyebrow text-muted-foreground mb-6">Order Status</h2>
            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
            <div className="mt-6 pt-6 border-t border-border/40 text-xs text-muted-foreground">
              Created: {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : '—'}
            </div>
            {order.paidAt && (
              <div className="mt-2 text-xs text-muted-foreground">
                Paid: {new Date(order.paidAt).toLocaleString('en-IN')}
              </div>
            )}
          </section>

          <section className="rounded-sm border border-border/60 bg-card p-6">
            <h2 className="eyebrow text-muted-foreground mb-6">Customer</h2>
            <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
              <div>
                <div className="eyebrow text-[10px] text-muted-foreground mb-1">Email</div>
                <div>{order.email}</div>
              </div>
              {address && (
                <>
                  <div>
                    <div className="eyebrow text-[10px] text-muted-foreground mb-1">Phone</div>
                    <div>{address.phone}</div>
                  </div>
                  <div>
                    <div className="eyebrow text-[10px] text-muted-foreground mb-1">Shipping Address</div>
                    <div>{address.name}</div>
                    <div>{address.line1}</div>
                    {address.line2 && <div>{address.line2}</div>}
                    <div>{address.city}, {address.state} {address.pin}</div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
