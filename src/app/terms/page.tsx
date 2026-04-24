import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-transparent pt-32 pb-24 md:pt-40 overflow-hidden noise">
      {/* Deep Atmospheric Glows */}
      <div className="absolute top-0 right-0 -z-10 w-[80vw] h-[80vw] bg-accent/20 blur-[160px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] -z-10 w-[60vw] h-[60vw] bg-accent/10 blur-[140px] rounded-full" />
      <div className="absolute top-[30%] left-[20%] -z-10 w-[40vw] h-[40vw] bg-accent/5 blur-[120px] rounded-full" />
      
      <div className="mx-auto w-full max-w-[800px] px-5 md:px-10">
        <Link href="/" className="eyebrow text-foreground/40 hover:text-accent transition-colors">
          ← Back to home
        </Link>
        
        <h1 className="h-display mt-8 text-5xl md:text-6xl font-light">Terms of Service</h1>
        <p className="mt-4 font-mono text-[10px] tracking-widest text-foreground/30 uppercase">
          Last Updated: April 23, 2026
        </p>

        <div className="mt-16 space-y-12 text-foreground/70 leading-relaxed text-lg">
          <section>
            <h2 className="eyebrow text-foreground mb-4">Acceptance of Terms</h2>
            <p>
              By accessing the YUN Atelier website, you agree to be bound by these Terms of Service. These terms 
              govern your use of our platform, including the purchase of our slow-perfumery collections.
            </p>
          </section>

          <section>
            <h2 className="eyebrow text-foreground mb-4">Intellectual Property</h2>
            <p>
              All content on this site, including imagery, text, and fragrance descriptions, is the intellectual 
              property of YUN Atelier. Reproduction or redistribution without written consent is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="eyebrow text-foreground mb-4">Product Availability</h2>
            <p>
              Our fragrances are produced in small, numbered batches. Availability is limited and we cannot 
              guarantee restocks of specific editions once they are sold out.
            </p>
          </section>

          <section>
            <h2 className="eyebrow text-foreground mb-4">Pricing and Payment</h2>
            <p>
              All prices are listed in INR. We reserve the right to adjust pricing to reflect changes in material 
              sourcing or studio operations.
            </p>
          </section>

          <section className="pt-12 border-t border-border/40">
            <p className="text-sm italic">
              Governed by the laws of Karnataka, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
