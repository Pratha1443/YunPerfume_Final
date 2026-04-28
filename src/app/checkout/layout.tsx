import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — YUN",
  description: "Complete your YUN order.",
  robots: "noindex, nofollow",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
