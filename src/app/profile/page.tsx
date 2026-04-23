import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Box, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // Mocking user for now - in production this would come from auth session
  const userEmail = "collector@example.com"; 
  
  const user = await db.user.findUnique({
    where: { email: userEmail },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } }
      }
    }
  });

  return (
    <div className="bg-transparent noise min-h-screen pt-32 pb-32 md:pt-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-12 md:flex-row">
          {/* Sidebar */}
          <aside className="md:w-1/3">
             <div className="sticky top-32 space-y-8">
               <div>
                  <div className="eyebrow text-muted-foreground mb-4">Account</div>
                  <h1 className="h-display text-5xl font-light">{userEmail.split('@')[0]}</h1>
                  <p className="text-muted-foreground mt-2 text-sm">{userEmail}</p>
               </div>
               <nav className="flex flex-col gap-4 pt-8">
                 <Link href="/profile" className="text-foreground transition-colors hover:text-accent flex items-center gap-3">
                   <Clock className="w-4 h-4 stroke-[1.5px]" />
                   Order History
                 </Link>
                 <Link href="/profile/settings" className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-3">
                   <Box className="w-4 h-4 stroke-[1.5px]" />
                   Shipping Addresses
                 </Link>
                 <button className="text-muted-foreground transition-colors hover:text-destructive flex items-center gap-3 text-left">
                   <ShoppingBag className="w-4 h-4 stroke-[1.5px]" />
                   Sign Out
                 </button>
               </nav>
             </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
             <h2 className="eyebrow text-muted-foreground mb-10">Order History</h2>
             
             {!user?.orders || user.orders.length === 0 ? (
               <div className="rounded-sm border border-border/40 bg-card/50 p-12 text-center">
                 <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                 <Link href="/shop" className="inline-block mt-6 eyebrow text-accent hover:underline">Start Exploring →</Link>
               </div>
             ) : (
               <div className="space-y-6">
                 {user.orders.map((order) => (
                   <div key={order.id} className="rounded-sm border border-border/60 bg-card p-6 md:p-10">
                     <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/40 pb-6 mb-6">
                        <div>
                          <div className="font-mono text-xs text-muted-foreground mb-1 uppercase">Order ID</div>
                          <div className="font-mono">{order.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-xs text-muted-foreground mb-1 uppercase">Total</div>
                          <div className="font-mono text-lg">{formatINR(order.totalAmount / 100)}</div>
                        </div>
                        <div>
                          <div className="font-mono text-xs text-muted-foreground mb-1 uppercase">Status</div>
                          <div className={`eyebrow text-[10px] px-2 py-0.5 rounded-full ${
                             order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-muted rounded-sm flex-shrink-0 relative">
                               {item.product.imageUrl && <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover"/>}
                            </div>
                            <div className="flex-1">
                               <div className="font-display">{item.product.name}</div>
                               <div className="text-xs text-muted-foreground">{item.quantity} × {formatINR(item.unitPrice / 100)}</div>
                            </div>
                          </div>
                        ))}
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </section>
        </div>
      </div>
    </div>
  );
}
