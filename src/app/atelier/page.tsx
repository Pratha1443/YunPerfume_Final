"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import craftImg from "@/assets/story-craft.jpg";
import botanyImg from "@/assets/story-botanicals.jpg";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function TheAtelier() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(".reveal-section", { opacity: 0, y: 30 });
      
      // Smooth entrance for editorial sections
      gsap.to(".reveal-section", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".reveal-section",
          start: "top 85%",
        },
        clearProps: "all"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-transparent noise will-change-transform">
      {/* Hero */}
      <section className="pt-[22vh] pb-[14vh] px-5 md:px-10 max-w-[1400px] mx-auto reveal-section">
        <div className="flex items-center gap-4 mb-10">
          <span className="block h-px w-12 bg-foreground/40" />
          <span className="eyebrow text-foreground/60">Behind the bottle</span>
        </div>
        <h1 className="h-display text-[16vw] leading-[0.85] md:text-[10vw] lg:text-[140px] tracking-tight">
          A House of <br />
          <em className="italic font-light text-accent">Patience.</em>
        </h1>
      </section>

      {/* Philosophy */}
      <section className="grid md:grid-cols-2 gap-0 border-y border-border/40 reveal-section will-change-transform">
        <div className="relative aspect-square md:aspect-auto">
          <Image 
            src={botanyImg} 
            alt="Botanicals at the studio" 
            fill 
            priority
            className="object-cover" 
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="p-10 md:p-20 flex flex-col justify-center bg-card">
          <div className="eyebrow text-muted-foreground mb-8">Origins</div>
          <h2 className="font-display text-4xl md:text-5xl font-light mb-8">India, through <br/> a liquid prism.</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              YUN was born in Pune as an antithesis to fast perfumery. 
              We don't follow trends or seasonal calendars. Instead, we follow the harvest.
            </p>
            <p>
              Our materials are sourced directly from families who have tended to the same patch of 
              land for generations. We pay for the labor of extraction, the soul of the soil, 
              and the time required for a scent to age into its true form.
            </p>
          </div>
        </div>
      </section>

      {/* Craft */}
      <section className="py-[20vh] px-5 md:px-10 max-w-[1400px] mx-auto reveal-section">
        <div className="max-w-2xl mx-auto text-center mb-[12vh]">
          <h2 className="h-display text-5xl md:text-7xl font-light mb-8">Batched by hand.</h2>
          <p className="text-xl font-display italic text-foreground/80">Every bottle is filled, labeled, and sealed at our Pune studio.</p>
        </div>
        
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <div className="relative aspect-[16/9] bg-muted overflow-hidden">
               <Image 
                src={craftImg} 
                alt="The crafting process" 
                fill 
                className="object-cover transition-transform duration-700 hover:scale-105" 
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          </div>
          <div className="md:col-span-5 pb-10">
            <div className="eyebrow text-muted-foreground mb-6">The Process</div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              We macerate our fragrances for a minimum of 18 months. 
              It is a slow, invisible labor. The waiting is as important as the blending. 
              When you open a bottle of YUN, you are opening a capture of a specific year, 
              a specific rain, and a specific quiet.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="py-[16vh] bg-ink text-ivory text-center px-5 reveal-section">
        <blockquote className="max-w-4xl mx-auto">
          <p className="h-display text-4xl md:text-6xl font-light leading-snug mb-10">
            "To wear YUN is to carry an entire Indian garden upon your skin, <em className="italic opacity-60">without making a sound.</em>"
          </p>
          <cite className="eyebrow text-ivory/50 not-italic tracking-[0.3em]">The Atelier Journal</cite>
        </blockquote>
      </section>
    </div>
  );
}
