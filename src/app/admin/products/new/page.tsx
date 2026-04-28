import { ProductForm } from "../product-form";

export const runtime = "edge";

export default function NewProductPage() {
  return (
    <div className="space-y-12">
      <header className="border-b border-border/40 pb-8">
        <div className="eyebrow text-muted-foreground mb-4">Management</div>
        <h1 className="h-display text-5xl font-light md:text-7xl">New Product</h1>
      </header>

      <div className="rounded-sm border border-border/60 bg-card p-6 md:p-10">
        <ProductForm />
      </div>
    </div>
  );
}
