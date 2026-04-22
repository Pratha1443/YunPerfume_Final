import type { Metadata } from "next";
import { findFragrance } from "@/lib/fragrances";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const f = findFragrance(slug);

  if (!f) {
    return {
      title: "Fragrance Not Found — YUN",
    };
  }

  return {
    title: `${f.name} — YUN`,
    description: f.tagline,
    openGraph: {
      title: `${f.name} — YUN`,
      description: f.tagline,
      images: [{ url: f.image.src }],
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
