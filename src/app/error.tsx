"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-transparent noise min-h-[90vh] flex flex-col items-center justify-center px-5 text-center">
      <div className="max-w-md">
        <h1 className="h-display text-6xl font-light text-destructive">Error</h1>
        <div className="mt-8 mb-4 h-px w-16 bg-destructive/40 mx-auto" />
        <h2 className="eyebrow text-muted-foreground uppercase tracking-widest mb-6">
          Something went wrong
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed mb-10">
          We encountered an unexpected issue while loading this page. Our team has been notified.
        </p>
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={() => reset()}
            className="inline-block border-b border-foreground pb-1 text-sm tracking-wider hover:text-accent transition-colors"
          >
            TRY AGAIN
          </button>
          <Link 
            href="/" 
            className="inline-block border-b border-muted-foreground text-muted-foreground pb-1 text-sm tracking-wider hover:text-foreground transition-colors"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
