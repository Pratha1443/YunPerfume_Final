import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb, orders, orderItems } from "@/db";
import { desc, eq } from "drizzle-orm";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { OrderStatusSelect } from "./status-select";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const { env } = getRequestContext();
  const db = getDb(env.DB);

  // Fetch all orders, latest first
  const allOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .all();

  // Fetch all items for these orders
  // (In a real app, pagination is better, but since it's a demo, fetching all is fine)
  const orderIds = allOrders.map(o => o.id);
  const itemsByOrder: Record<string, typeof orderItems.$inferSelect[]> = {};

  if (orderIds.length > 0) {
    // D1 doesn't fully support 'inArray' cleanly with some setups without binding limits,
    // so we'll fetch all items and group them.
    const allItems = await db.select().from(orderItems).all();
    for (const item of allItems) {
      if (!itemsByOrder[item.orderId]) {
        itemsByOrder[item.orderId] = [];
      }
      itemsByOrder[item.orderId].push(item);
    }
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-muted-foreground mb-4">Management</div>
          <h1 className="h-display text-5xl font-light md:text-7xl">Orders</h1>
        </div>
        <Link href="/admin" className="eyebrow text-muted-foreground hover:text-foreground">
          ← Back to Dashboard
        </Link>
      </header>

      {allOrders.length === 0 ? (
        <div className="rounded-sm border border-border/40 bg-card/50 p-12 text-center text-muted-foreground">
          No orders found.
        </div>
      ) : (
        <div className="grid gap-6">
          {allOrders.map((order) => {
            const items = itemsByOrder[order.id] || [];
            const address = order.shippingAddress
              ? (() => {
                  try { return JSON.parse(order.shippingAddress); }
                  catch { return null; }
                })()
              : null;

            return (
              <div key={order.id} className="rounded-sm border border-border/60 bg-card p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border/40 pb-6 mb-6">
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                      Order ID
                    </div>
                    <div className="font-mono text-sm">{order.id}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : '—'}
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                      Customer
                    </div>
                    <div className="text-sm">{order.email}</div>
                    {address && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {address.phone}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                      Total
                    </div>
                    <div className="font-mono text-lg">{formatINR(order.totalAmount / 100)}</div>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                      Status
                    </div>
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="eyebrow text-muted-foreground mb-4">Items</div>
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-foreground">{item.productName}</span>
                            <span className="text-muted-foreground ml-2">
                              · {item.productSize} · Qty {item.quantity}
                            </span>
                          </div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {formatINR((item.unitPrice * item.quantity) / 100)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="eyebrow text-muted-foreground mb-4">Shipping Details</div>
                    {address ? (
                      <div className="text-sm text-foreground/80 leading-relaxed">
                        <div>{address.name}</div>
                        <div>{address.line1}</div>
                        {address.line2 && <div>{address.line2}</div>}
                        <div>{address.city}, {address.state} {address.pin}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No address provided.</div>
                    )}
                    
                    {order.razorpayOrderId && (
                      <div className="mt-4 pt-4 border-t border-border/40">
                        <div className="font-mono text-[10px] text-muted-foreground mb-1">RAZORPAY ORDER ID</div>
                        <div className="font-mono text-xs break-all">{order.razorpayOrderId}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
