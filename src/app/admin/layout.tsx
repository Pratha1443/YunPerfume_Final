import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel — YUN",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent noise">
      <nav className="border-b border-border/60 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
          <div className="font-display text-xl tracking-widest">YUN ADMIN</div>
          <div className="flex items-center gap-6">
            <span className="eyebrow text-muted-foreground">Logged in as Admin</span>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-[1400px] p-5 md:p-10">
        {children}
      </main>
    </div>
  );
}
