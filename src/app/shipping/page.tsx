import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 md:pt-40">
      {/* Background Ambience */}
      <div className="absolute bottom-0 left-0 -z-10 w-[50vw] h-[50vw] bg-accent/5 blur-[120px] rounded-full" />
      
      <div className="mx-auto max-w-[800px] px-5 md:px-10">
        <Link href="/" className="eyebrow text-foreground/40 hover:text-accent transition-colors">
          ← Back to home
        </Link>
        
        <h1 className="h-display mt-8 text-5xl md:text-6xl font-light">Shipping & Returns</h1>
        <p className="mt-4 font-mono text-[10px] tracking-widest text-foreground/30 uppercase">
          Ritual Delivery // Pan-India
        </p>

        <div className="mt-16 space-y-12 text-foreground/70 leading-relaxed text-lg">
          <section>
            <h2 className="eyebrow text-foreground mb-4">Domestic Shipping</h2>
            <p>
              We ship across India using trusted courier partners. Since each bottle is individually poured, 
              please allow 2–3 business days for processing and 3–5 days for delivery.
            </p>
          </section>

          <section>
            <h2 className="eyebrow text-foreground mb-4">Shipping Rates</h2>
            <p>
              Complimentary shipping is provided on all orders above ₹3,000. For orders below this amount, 
              a flat rate of ₹150 is applied at checkout.
            </p>
          </section>

          <section>
            <h2 className="eyebrow text-foreground mb-4">Returns Policy</h2>
            <p>
              Due to the artisanal nature of our fragrances and hygiene considerations, we do not accept 
              returns on opened products. We highly recommend starting with our Discovery Set before 
              committing to a full-sized bottle.
            </p>
          </section>

          <section>
            <h2 className="eyebrow text-foreground mb-4">Damaged Items</h2>
            <p>
              In the rare event that your bottle arrives damaged, please contact us within 24 hours of 
              delivery with photographic evidence for a replacement.
            </p>
          </section>

          <section className="pt-12 border-t border-border/40">
            <p className="text-sm italic">
              Hand-packaged and dispatched from our Bengaluru atelier.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
