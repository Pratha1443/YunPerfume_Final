"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export function Preloader() {
  const [complete, setComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show once per session
    const hasVisited = sessionStorage.getItem("yun_preloader_seen");
    if (hasVisited && process.env.NODE_ENV !== "development") {
      setComplete(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("yun_preloader_seen", "true");
          setTimeout(() => setComplete(true), 500); // Small buffer
        },
      });

      // Reset
      gsap.set(textRef.current, { opacity: 0, y: 20 });
      
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.4,
      })
      .to(textRef.current, {
        letterSpacing: "1em",
        opacity: 0,
        duration: 1.4,
        ease: "power2.inOut",
      }, "+=0.4")
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1.1,
        ease: "expo.inOut",
      }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (complete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ivory noise"
    >
      <div
        ref={textRef}
        className="font-display text-8xl md:text-[120px] font-light tracking-[0.2em] transition-all"
      >
        YUN
      </div>
    </div>
  );
}
