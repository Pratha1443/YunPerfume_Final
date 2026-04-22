import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ClosingCta() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".closing-line",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-ivory noise py-[14vh]"
    >
      <div className="mx-auto max-w-[1400px] px-5 text-center md:px-10">
        <h2 className="h-display text-[16vw] leading-[0.9] md:text-[12vw] lg:text-[200px]">
          <span className="reveal-mask block"><span className="reveal-line closing-line">Wear</span></span>
          <span className="reveal-mask block"><span className="reveal-line closing-line italic font-light text-accent">slowly.</span></span>
        </h2>
        <p className="mx-auto mt-10 max-w-md text-base leading-relaxed text-muted-foreground">
          Each bottle is dispatched within India in 2–4 working days, wrapped in handmade paper
          with a personal note from the atelier.
        </p>
        <Link
          href="/shop"
          className="mt-12 inline-flex items-center justify-center bg-foreground px-12 py-5 text-sm tracking-wider text-background transition-colors hover:bg-accent"
        >
          SHOP THE COLLECTION
        </Link>
      </div>
    </section>
  );
}

