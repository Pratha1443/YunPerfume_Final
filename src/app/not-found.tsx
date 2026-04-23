import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-[120px] font-light leading-none">404</div>
        <h2 className="mt-6 font-display text-2xl font-light">This page is not in our atelier</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has been moved or never existed.
        </p>
        <div className="mt-8">
          <Link href="/" className="eyebrow border-b border-foreground pb-1">
            Return home →
          </Link>
        </div>
      </div>
    </div>
  );
}
