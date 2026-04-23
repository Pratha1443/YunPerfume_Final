"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import logo from "../../../Images/YunLogo.png";

export function Preloader() {
  const [complete, setComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show once per session in production
    const hasVisited = sessionStorage.getItem("yun_preloader_seen");
    if (hasVisited && process.env.NODE_ENV !== "development") {
      setComplete(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("yun_preloader_seen", "true");
          // Add a small delay after animation before removing component
          gsap.delayedCall(0.1, () => setComplete(true));
        },
      });

      // Initial States
      gsap.set(logoRef.current, { 
        opacity: 0, 
        scale: 1.8, 
        filter: "blur(40px) brightness(2)",
      });
      gsap.set(".preloader-text", { opacity: 0, y: 20 });
      gsap.set(progressRef.current, { scaleX: 0 });

      // Animation Sequence
      tl.to(progressRef.current, {
        scaleX: 1,
        duration: 3,
        ease: "power2.inOut",
      })
      .to(logoRef.current, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px) brightness(1)",
        duration: 2.5,
        ease: "expo.out",
      }, "-=2.2")
      .to(".preloader-text", {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1.5,
        ease: "power3.out",
      }, "-=1.5")
      .to(".preloader-bg-glow", {
        opacity: 0.6,
        scale: 1.5,
        duration: 4,
        ease: "power1.inOut",
      }, 0)
      
      // Exit Sequence
      .to(contentRef.current, {
        opacity: 0,
        scale: 1.05,
        filter: "blur(10px)",
        duration: 1.2,
        ease: "power4.inOut",
        delay: 0.5
      })
      .to(containerRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.4,
        ease: "expo.inOut",
      }, "-=0.8");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (complete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050609] overflow-hidden"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      {/* Deep Atmospheric Glows */}
      <div className="preloader-bg-glow absolute inset-0 bg-radial-[at_50%_50%] from-accent/15 via-transparent to-transparent blur-[120px]" />
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent/5 blur-[150px] rounded-full animate-pulse" />
      
      <div ref={contentRef} className="relative flex flex-col items-center">
        {/* The "Lens Focus" Logo */}
        <div 
          ref={logoRef}
          className="relative w-[75vw] h-[25vh] md:w-[500px] md:h-[300px] mb-12"
        >
          <Image
            src={logo}
            alt="YUN Atelier"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Minimalist Narrative */}
        <div className="flex flex-col items-center text-center space-y-4">
           <p className="preloader-text eyebrow text-[10px] tracking-[0.8em] text-foreground/60 uppercase">
             Atmospheric Alchemy
           </p>
           <p className="preloader-text font-mono text-[8px] tracking-[0.4em] text-foreground/30 uppercase">
             Mumbai — Grasse // Edition 2024
           </p>
        </div>
      </div>

      {/* Elegant Hairline Progress */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-foreground/5">
        <div 
          ref={progressRef}
          className="h-full w-full bg-accent origin-left"
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050609] via-transparent to-[#050609] opacity-60 pointer-events-none" />
    </div>
  );
}
