"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const top = formData.get("notesTop") as string;
    const heart = formData.get("notesHeart") as string;
    const base = formData.get("notesBase") as string;

    const scentNotes = JSON.stringify({
      top: top.split(",").map((s) => s.trim()).filter(Boolean),
      heart: heart.split(",").map((s) => s.trim()).filter(Boolean),
      base: base.split(",").map((s) => s.trim()).filter(Boolean),
    });

    const data = {
      name: formData.get("name"),
      tagline: formData.get("tagline"),
      description: formData.get("description"),
      price: Number(formData.get("price")), // UI is INR, API converts to paise
      stock: Number(formData.get("stock")),
      active: formData.get("active") === "true",
      imageUrl: formData.get("imageUrl"),
      scentFamily: formData.get("scentFamily"),
      concentration: formData.get("concentration"),
      size: formData.get("size"),
      hue: formData.get("hue"),
      index: formData.get("index"),
      story: formData.get("story"),
      scentNotes,
    };

    try {
      const url = isEdit ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json() as any;

      if (!res.ok) throw new Error(result.error || "Failed to save product");

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  // Parse notes for initial values
  let initialNotes = { top: "", heart: "", base: "" };
  if (initialData?.scentNotes) {
    try {
      const parsed = JSON.parse(initialData.scentNotes);
      initialNotes = {
        top: (parsed.top || []).join(", "),
        heart: (parsed.heart || []).join(", "),
        base: (parsed.base || []).join(", "),
      };
    } catch (e) {}
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="rounded-sm border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="eyebrow text-muted-foreground">Basic Info</h2>
          <Field label="Name" name="name" required defaultValue={initialData?.name} />
          <Field label="Tagline" name="tagline" defaultValue={initialData?.tagline} />
          <div>
            <label className="eyebrow mb-2 block text-muted-foreground">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={initialData?.description}
              className="w-full border border-border/40 bg-card p-3 text-sm outline-none transition-colors focus:border-foreground"
            />
          </div>
          <div>
            <label className="eyebrow mb-2 block text-muted-foreground">Story</label>
            <textarea
              name="story"
              rows={6}
              defaultValue={initialData?.story}
              className="w-full border border-border/40 bg-card p-3 text-sm outline-none transition-colors focus:border-foreground"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="eyebrow text-muted-foreground">Pricing & Inventory</h2>
          <div className="grid gap-6 grid-cols-2">
            <Field label="Price (INR)" name="price" type="number" required defaultValue={initialData ? initialData.price / 100 : ""} />
            <Field label="Stock" name="stock" type="number" required defaultValue={initialData?.stock ?? 0} />
          </div>
          <div className="grid gap-6 grid-cols-2">
            <Field label="Index (e.g. 01)" name="index" defaultValue={initialData?.index} />
            <div>
              <label className="eyebrow mb-2 block text-muted-foreground">Status</label>
              <select name="active" defaultValue={initialData?.active === false ? "false" : "true"} className="w-full border-b border-foreground/30 bg-transparent py-3 text-base outline-none transition-colors focus:border-foreground">
                <option value="true">Active</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>
          
          <h2 className="eyebrow text-muted-foreground pt-6">Media</h2>
          <Field label="Image URL (R2)" name="imageUrl" defaultValue={initialData?.imageUrl} />
          <Field label="Brand Hue (Hex)" name="hue" defaultValue={initialData?.hue} />
        </div>
      </div>

      <div className="border-t border-border/40 pt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="eyebrow text-muted-foreground">Scent Profile</h2>
          <Field label="Scent Family" name="scentFamily" defaultValue={initialData?.scentFamily} />
          <div className="grid gap-6 grid-cols-2">
            <Field label="Concentration" name="concentration" defaultValue={initialData?.concentration || "EDP"} />
            <Field label="Size" name="size" defaultValue={initialData?.size || "50ml"} />
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="eyebrow text-muted-foreground">Scent Notes (comma separated)</h2>
          <Field label="Top Notes" name="notesTop" defaultValue={initialNotes.top} />
          <Field label="Heart Notes" name="notesHeart" defaultValue={initialNotes.heart} />
          <Field label="Base Notes" name="notesBase" defaultValue={initialNotes.base} />
        </div>
      </div>

      <div className="border-t border-border/40 pt-8 flex items-center justify-end gap-4">
        <Link href="/admin/products" className="text-sm tracking-wider text-muted-foreground hover:text-foreground">
          CANCEL
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="bg-foreground px-8 py-3 text-sm tracking-wider text-background hover:bg-accent transition-colors disabled:opacity-60"
        >
          {saving ? "SAVING..." : "SAVE PRODUCT"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", required, defaultValue }: any) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow mb-2 block text-muted-foreground">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full border-b border-foreground/30 bg-transparent py-3 text-base outline-none transition-colors focus:border-foreground"
      />
    </div>
  );
}
