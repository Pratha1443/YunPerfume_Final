import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — YUN Atelier",
  description: "Write to YUN. We answer every message ourselves, usually within two working days.",
  openGraph: {
    title: "Contact — YUN Atelier",
    description: "Write to YUN. We answer every message ourselves.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
