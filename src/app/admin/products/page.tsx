import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb, products } from "@/db";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit2 } from "lucide-react";
import { desc } from "drizzle-orm";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const { env } = getRequestContext();
  const db = getDb(env.DB);

  // Fetch all products, sorted by newly created first
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt))
    .all();

  return (
    <div className="space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border/40 pb-8">
        <div>
          <div className="eyebrow text-muted-foreground mb-4">Management</div>
          <h1 className="h-display text-5xl font-light md:text-7xl">Products</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="eyebrow text-muted-foreground hover:text-foreground">
            ← Dashboard
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-foreground px-6 py-3 text-sm tracking-wider text-background hover:bg-accent transition-colors"
          >
            <Plus className="w-4 h-4" /> ADD PRODUCT
          </Link>
        </div>
      </header>

      {allProducts.length === 0 ? (
        <div className="rounded-sm border border-border/40 bg-card/50 p-12 text-center text-muted-foreground">
          No products found.
        </div>
      ) : (
        <div className="rounded-sm border border-border/60 bg-card overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-border/60 text-xs eyebrow text-muted-foreground bg-muted/20">
              <tr>
                <th className="px-6 py-4 font-normal">Product</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal text-right">Price</th>
                <th className="px-6 py-4 font-normal text-right">Stock</th>
                <th className="px-6 py-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {allProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 bg-muted shrink-0 rounded-sm overflow-hidden">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-display text-lg">{product.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {product.slug} · {product.size}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`eyebrow text-[10px] px-2.5 py-1 rounded-full ${
                      product.active 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                        : "bg-muted text-muted-foreground border border-border/60"
                    }`}>
                      {product.active ? "ACTIVE" : "DRAFT"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    {formatINR(product.price / 100)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-mono ${product.stock <= 5 ? "text-amber-500" : ""}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 eyebrow text-[10px]"
                    >
                      <Edit2 className="w-3 h-3" /> EDIT
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
