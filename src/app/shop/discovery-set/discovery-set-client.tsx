"use client";

import { useCart } from "@/lib/cart-store";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    size: string | null;
    imageUrl: string | null;
  };
}

export default function DiscoverySetClient({ product }: Props) {
  const { add } = useCart();

  return (
    <button
      onClick={() =>
        add({
          id: product.id,
          name: product.name,
          price: product.price / 100,
          size: product.size ?? "4 × 2ml",
          image: product.imageUrl ?? "",
        })
      }
      className="bg-foreground px-12 py-5 text-sm tracking-wider text-background hover:bg-accent transition-all"
    >
      ADD TO BAG
    </button>
  );
}
