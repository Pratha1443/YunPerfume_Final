"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import heroBottle from "@/assets/yun-bottle-hero.jpg";

export function HeroPinned() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Initial reveal setup
      gsap.set(".hero-line", { yPercent: 110 });
      gsap.set(".headline-line", { yPercent: 110 });
      gsap.set(subRef.current, { opacity: 0, y: 30 });
      gsap.set(imageRef.current, { scale: 1.1, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      
      tl.to(imageRef.current, { 
        opacity: 1, 
        scale: 1, 
        duration: 2,
        ease: "expo.out"
      })
      .to(".headline-line", { 
        yPercent: 0, 
        duration: 1.5, 
        stagger: 0.12,
        ease: "power4.out" 
      }, "-=1.6")
      .to(".hero-line", { 
        yPercent: 0, 
        duration: 1.2, 
        stagger: 0.08 
      }, "-=0.8")
      .to(subRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 1 
      }, "-=0.6");

      // Pinned scroll animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=40%",
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        animation: gsap
          .timeline()
          .to(imageRef.current, { scale: 1.3, xPercent: 10, yPercent: -3, rotate: 1 }, 0)
          .to(headlineRef.current, { yPercent: -30, opacity: 0, scale: 0.97, filter: "blur(6px)" }, 0)
          .to(titleRef.current, { yPercent: -20, opacity: 0.2, scale: 0.95 }, 0)
          .to(subRef.current, { opacity: 0, y: -15 }, 0),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-transparent noise"
    >
      {/* Background Ambience — Subtle Gradient */}
      <div className="absolute inset-0 z-0 opacity-40">
         <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[50vw] h-[50vw] bg-accent/20 blur-[120px] rounded-full" />
      </div>

      {/* Bottle image — Large, cinematic placement */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-0 flex items-center justify-end pr-[5%] md:pr-[8%]"
        style={{ willChange: "transform" }}
      >
        <Image
          src={heroBottle}
          alt="YUN signature perfume bottle"
          className="h-[85%] w-auto object-contain md:h-[95%]"
          priority
        />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-between px-5 py-[10vh] md:px-10 md:py-[12vh]">
        
        {/* Upper Branding / Headline */}
        <div ref={headlineRef} className="mt-[5vh] max-w-4xl">
          <div className="mb-8 flex items-center gap-4 overflow-hidden">
             <span className="block h-px w-8 bg-foreground/40 headline-line" />
             <span className="eyebrow text-foreground/60 headline-line">Est. 2024 / India</span>
          </div>
          <h2 className="h-display text-[10vw] leading-[1.1] tracking-tight md:text-[7vw] lg:text-[110px]">
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="block headline-line italic font-light">The Poetry of</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="block headline-line">Sacred</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="block headline-line text-accent">Fragrance.</span>
            </span>
          </h2>
        </div>

        {/* Footer Section: Brand Title & Description */}
        <div className="flex flex-col gap-10">
          <div ref={titleRef}>
            <h1 className="h-display text-[14vw] leading-[0.8] tracking-[-0.05em] opacity-40 md:text-[10vw] lg:text-[140px]">
              <span className="reveal-mask"><span className="reveal-line hero-line">YUN</span></span>
            </h1>
          </div>
          
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div ref={subRef} className="max-w-md">
              <p className="font-display text-2xl font-light italic leading-snug text-foreground/90 md:text-3xl">
                Slow perfumery, <br />
                rooted in the soul of India.
              </p>
              <div className="mt-6 flex items-center gap-6">
                <button className="eyebrow group relative flex items-center gap-2 text-[10px] tracking-[0.3em] transition-colors hover:text-accent">
                  Explore Atelier
                  <span className="block h-px w-0 bg-accent transition-all duration-500 group-hover:w-12" />
                </button>
              </div>
            </div>

            <div className="hidden flex-col items-end gap-2 md:flex">
              <div className="eyebrow flex items-center gap-3 text-foreground/40">
                <span>Scroll to Reveal</span>
                <span className="block h-px w-16 bg-foreground/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Marker */}
      <div className="absolute right-5 top-1/2 z-10 -translate-y-1/2 hidden md:block md:right-10">
        <div className="eyebrow [writing-mode:vertical-lr] flex items-center gap-6 text-foreground/30">
          <span className="tracking-[0.4em]">COLLECTION N°01</span>
          <span className="block h-24 w-px bg-foreground/10" />
          <span className="rotate-180">2024</span>
        </div>
      </div>
    </section>
  );
}

