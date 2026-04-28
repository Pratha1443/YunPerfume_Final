import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb, products } from "@/db";
import { eq } from "drizzle-orm";
import { ProductForm } from "../../product-form";
import { notFound } from "next/navigation";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditPageProps) {
  const { id } = await params;
  
  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .get();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <header className="border-b border-border/40 pb-8">
        <div className="eyebrow text-muted-foreground mb-4">Management</div>
        <h1 className="h-display text-5xl font-light md:text-7xl">Edit Product</h1>
        <p className="mt-4 text-muted-foreground font-mono text-xs">{product.id}</p>
      </header>

      <div className="rounded-sm border border-border/60 bg-card p-6 md:p-10">
        <ProductForm initialData={product} isEdit />
      </div>
    </div>
  );
}
