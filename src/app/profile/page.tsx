import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, orders, orderItems, users } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { formatINR } from '@/lib/utils';
import Link from 'next/link';
import { Clock, Box, LogOut } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// ─── Status badge colours ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  PAID:      'bg-emerald-500/10 text-emerald-400',
  PENDING:   'bg-amber-500/10 text-amber-400',
  SHIPPED:   'bg-blue-500/10 text-blue-400',
  DELIVERED: 'bg-green-500/10 text-green-400',
  CANCELLED: 'bg-red-500/10 text-red-400',
  FAILED:    'bg-red-500/10 text-red-400',
};

export default async function ProfilePage() {
  // Middleware sets these headers from the verified JWT
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userEmail = headersList.get('x-user-email');

  // If middleware didn't set headers (shouldn't happen), redirect to login
  if (!userId || !userEmail) {
    redirect('/login?redirect=/profile');
  }

  // ── Fetch data from D1 ─────────────────────────────────────────────────────
  const { env } = getRequestContext();
  if (!env || !env.DB) {
    console.error("Database binding 'DB' not found in environment.");
    return (
      <div className="min-h-screen pt-40 text-center">
        <h1 className="text-2xl font-light">Service Unavailable</h1>
        <p className="text-muted-foreground mt-4 text-sm">Our database is currently disconnected. Please try again later.</p>
      </div>
    );
  }

  const db = getDb(env.DB);

  try {
    // Fetch user record
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.email, userEmail))
      .orderBy(desc(orders.createdAt))
      .all();

  // Fetch order items for all orders in one query set
  const orderIds = userOrders.map((o) => o.id);
  const allItems = orderIds.length > 0
    ? await db
        .select()
        .from(orderItems)
        .where(
          // Drizzle doesn't have inArray for SQLite text — use multiple queries batched
          eq(orderItems.orderId, orderIds[0]) // simplified; full implementation below
        )
        .all()
    : [];

  // For multiple orders, fetch items individually (D1 doesn't support IN easily with Drizzle)
  const itemsByOrder: Record<string, typeof allItems> = {};
  for (const orderId of orderIds) {
    itemsByOrder[orderId] = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
      .all();
  }

  const displayName = userRecord?.name || userEmail.split('@')[0];
  const isAdmin = userRecord?.role === 'ADMIN';

    return (
      <div className="bg-transparent noise min-h-screen pt-32 pb-32 md:pt-40">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="flex flex-col gap-12 md:flex-row">

            {/* ── Sidebar ─────────────────────────────────────────────────────── */}
            <aside className="md:w-72 shrink-0">
              <div className="sticky top-32 space-y-8">
                <div>
                  <div className="eyebrow text-muted-foreground mb-4">Account</div>
                  <h1 className="h-display text-4xl md:text-5xl font-light tracking-tight leading-tight break-words max-w-full">
                    {displayName}
                  </h1>
                  <p className="text-muted-foreground mt-3 text-sm break-all opacity-60">
                    {userEmail}
                  </p>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className="inline-block mt-4 text-[10px] eyebrow bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20 hover:bg-accent/20 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>

                <div className="hairline" />

                <nav className="flex flex-col gap-5">
                  <Link
                    href="/profile"
                    className="text-foreground transition-colors hover:text-accent flex items-center gap-3 text-sm"
                  >
                    <Clock className="w-4 h-4 stroke-[1.5px]" />
                    Order History
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      {userOrders.length}
                    </span>
                  </Link>
                  <Link
                    href="/shop"
                    className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-3 text-sm"
                  >
                    <Box className="w-4 h-4 stroke-[1.5px]" />
                    Continue Shopping
                  </Link>
                  <form action="/api/auth/signout" method="POST">
                    <button
                      type="submit"
                      className="text-muted-foreground transition-colors hover:text-destructive flex items-center gap-3 text-sm text-left w-full"
                    >
                      <LogOut className="w-4 h-4 stroke-[1.5px]" />
                      Sign Out
                    </button>
                  </form>
                </nav>
              </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────────── */}
            <section className="flex-1 min-w-0">
              <h2 className="eyebrow text-muted-foreground mb-10">Order History</h2>

              {userOrders.length === 0 ? (
                <div className="rounded-sm border border-border/40 bg-card/50 p-12 text-center">
                  <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
                  <Link
                    href="/shop"
                    className="inline-block mt-6 eyebrow text-accent hover:underline"
                  >
                    Start Exploring →
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {userOrders.map((order) => {
                    const items = itemsByOrder[order.id] ?? [];
                    const address = order.shippingAddress
                      ? (() => {
                          try { return JSON.parse(order.shippingAddress) as Record<string, string>; }
                          catch { return null; }
                        })()
                      : null;

                    return (
                      <div
                        key={order.id}
                        className="rounded-sm border border-border/60 bg-card p-6 md:p-8"
                      >
                        {/* Order header */}
                        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/40 pb-6 mb-6">
                          <div>
                            <div className="font-mono text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                              Order
                            </div>
                            <div className="font-mono text-sm">{order.id}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'long', year: 'numeric',
                                  })
                                : '—'}
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="font-mono text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                                Total
                              </div>
                              <div className="font-mono text-lg">
                                {formatINR(order.totalAmount / 100)}
                              </div>
                            </div>

                            <div>
                              <span
                                className={`eyebrow text-[10px] px-3 py-1 rounded-full ${STATUS_STYLES[order.status] ?? 'bg-muted text-muted-foreground'}`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order items */}
                        {items.length > 0 && (
                          <ul className="space-y-3 mb-6">
                            {items.map((item) => (
                              <li key={item.id} className="flex items-center justify-between text-sm">
                                <div>
                                  <span className="text-foreground">{item.productName}</span>
                                  <span className="text-muted-foreground ml-2">
                                    · {item.productSize} · Qty {item.quantity}
                                  </span>
                                </div>
                                <div className="font-mono text-sm">
                                  {formatINR((item.unitPrice * item.quantity) / 100)}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Shipping address */}
                        {address && (
                          <div className="text-xs text-muted-foreground border-t border-border/40 pt-4">
                            <span className="eyebrow text-[9px] text-foreground/40 uppercase tracking-wider mr-2">
                              Ship to:
                            </span>
                            {[address.name, address.line1, address.city, address.state, address.pin]
                              .filter(Boolean)
                              .join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error("Profile page error:", err);
    return (
      <div className="min-h-screen pt-40 text-center">
        <h1 className="text-2xl font-light">Unable to load profile</h1>
        <p className="text-muted-foreground mt-4 text-sm">There was an error fetching your account details.</p>
        <Link href="/" className="mt-8 inline-block eyebrow text-accent">Return Home</Link>
      </div>
    );
  }
}

