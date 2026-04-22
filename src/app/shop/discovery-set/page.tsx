import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import discoveryImage from "@/assets/story-botanicals.jpg"; // Placeholder for actual discovery set image

export default function DiscoverySet() {
  return (
    <div className="bg-background">
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-sand/30">
        <Image 
          src={discoveryImage} 
          alt="YUN Discovery Set" 
          fill 
          className="object-cover opacity-60"
          priority
        />
        <div className="relative z-10 text-center px-5 max-w-3xl">
          <div className="eyebrow text-foreground/70 mb-6">Begin here</div>
          <h1 className="h-display text-[14vw] leading-[0.9] md:text-[8vw] lg:text-[120px]">
            The Discovery <em className="italic font-light">Set.</em>
          </h1>
          <p className="mt-8 text-xl font-display italic text-foreground/80 md:text-2xl">
            Four scents. Four narratives. One introduction to the house of YUN.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-[18vh] md:px-10">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <div className="space-y-8">
            <div className="eyebrow text-muted-foreground">The Experience</div>
            <h2 className="h-display text-5xl md:text-6xl font-light">
              Patience in <br/> <em className="italic text-accent">small vials.</em>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Choosing a fragrance is a conversation that shouldn't be rushed. 
                Our discovery set includes 2ml vials of our entire inaugural collection: 
                Mogra Noir, Oud Vārā, Sandal Velvet, and Chai Atelier.
              </p>
              <p>
                Each kit comes with an editorial booklet detailing the material origins and 
                rituals that inspired each scent, and a credit for your first full-sized bottle.
              </p>
            </div>
            
            <div className="pt-8 flex items-baseline gap-6">
              <span className="font-mono text-3xl">{formatINR(1200)}</span>
              <button className="bg-foreground px-12 py-5 text-sm tracking-wider text-background hover:bg-accent transition-all">
                ADD TO BAG
              </button>
            </div>
          </div>

          <div className="relative aspect-[4/5] bg-muted overflow-hidden rounded-sm">
             <Image 
                src={discoveryImage} 
                alt="Vials nested in silk" 
                fill 
                className="object-cover"
             />
          </div>
        </div>
      </section>

      <section className="bg-ivory py-24 border-t border-border/60">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
          <div className="eyebrow mb-12">Inside the kit</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["01 Mogra Noir", "02 Oud Vārā", "03 Sandal Velvet", "04 Chai Atelier"].map(name => (
              <div key={name} className="py-8 border border-border/40 bg-white/50">
                <div className="font-mono text-xs text-accent mb-2">2ML SPRAY</div>
                <div className="font-display text-xl">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
