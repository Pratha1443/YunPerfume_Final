import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-5xl font-light tracking-[0.18em] md:text-7xl">YUN</div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Slow perfumery from India. Made in small batches with materials sourced from the
              gardens, forests and ateliers of the subcontinent.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow mb-5 text-muted-foreground">Shop</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="hover:text-accent">All fragrances</Link></li>
              <li><Link to="/shop" className="hover:text-accent">Discovery set</Link></li>
              <li><Link to="/shop" className="hover:text-accent">Gift cards</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow mb-5 text-muted-foreground">House</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-accent">Our story</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
              <li><Link to="/login" className="hover:text-accent">Account</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow mb-5 text-muted-foreground">Letters</div>
            <p className="mb-4 text-sm text-muted-foreground">
              Quiet notes, twice a season. No campaigns.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex border-b border-foreground/30 focus-within:border-foreground"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" className="eyebrow text-foreground/70 hover:text-accent">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} YUN Atelier · Made in India</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
