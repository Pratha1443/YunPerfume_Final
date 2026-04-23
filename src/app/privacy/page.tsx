import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 md:pt-40">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 -z-10 w-[50vw] h-[50vw] bg-accent/5 blur-[120px] rounded-full" />
      
      <div className="mx-auto max-w-[800px] px-5 md:px-10">
        <Link href="/" className="eyebrow text-foreground/40 hover:text-accent transition-colors">
          ← Back to home
        </Link>
        
        <h1 className="h-display mt-8 text-5xl md:text-6xl font-light">Privacy Policy</h1>
        <p className="mt-4 font-mono text-[10px] tracking-widest text-foreground/30 uppercase">
          Last Updated: April 23, 2024
        </p>

        <div className="mt-16 space-y-12 text-foreground/70 leading-relaxed text-lg">
          <section>
            <h2 className="eyebrow text-foreground mb-4">Introduction</h2>
            <p>
              At YUN Atelier, we value the trust you place in us when sharing your personal data. This Privacy Policy 
              explains how we collect, use, and protect your information when you visit our website or make a purchase.
            </p>
          </section>

          <section>
            <h2 className="eyebrow text-foreground mb-4">Data Collection</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, place an order, 
              or subscribe to our newsletter. This includes your name, email address, shipping address, and payment information.
            </p>
          </section>

          <section>
            <h2 className="eyebrow text-foreground mb-4">Usage of Information</h2>
            <p>
              Your data is used primarily to fulfill orders and provide you with a personalized experience. We may also 
              use your contact details to send you updates about our collections, provided you have opted in to receive them.
            </p>
          </section>

          <section>
            <h2 className="eyebrow text-foreground mb-4">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information at any time. If you wish to 
              exercise these rights, please contact us at studio@yunperfume.com.
            </p>
          </section>

          <section className="pt-12 border-t border-border/40">
            <p className="text-sm italic">
              YUN Atelier reserves the right to update this policy as our rituals and services evolve.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
