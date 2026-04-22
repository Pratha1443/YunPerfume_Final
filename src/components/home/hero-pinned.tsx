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

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Initial reveal
      gsap.set(".hero-line", { yPercent: 110 });
      gsap.set(subRef.current, { opacity: 0, y: 20 });
      gsap.set(imageRef.current, { scale: 1.15, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(imageRef.current, { opacity: 1, scale: 1, duration: 1.6 })
        .to(".hero-line", { yPercent: 0, duration: 1.1, stagger: 0.08 }, "-=1.2")
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4");

      // Pinned scroll: image scales out, title shrinks & fades
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        animation: gsap
          .timeline()
          .to(imageRef.current, { scale: 1.35, yPercent: -8 }, 0)
          .to(titleRef.current, { yPercent: -40, opacity: 0.15, scale: 0.92 }, 0)
          .to(subRef.current, { opacity: 0, y: -20 }, 0),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-ivory noise"
    >
      {/* Bottle image — large, off-center, asymmetric */}
      <div
        ref={imageRef}
        className="absolute inset-0 flex items-center justify-end pr-[6%] md:pr-[10%]"
        style={{ willChange: "transform" }}
      >
        <Image
          src={heroBottle}
          alt="YUN signature perfume bottle"
          className="h-[78%] w-auto object-contain md:h-[88%]"
          priority
        />
      </div>

      {/* Title block */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-[8vh] md:px-10 md:pb-[12vh]">
        <div ref={titleRef}>
          <h1 className="h-display text-[18vw] leading-[0.85] tracking-[-0.04em] md:text-[14vw] lg:text-[180px]">
            <span className="reveal-mask"><span className="reveal-line hero-line">YUN</span></span>
          </h1>
        </div>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div ref={subRef} className="max-w-md">
            <p className="font-display text-2xl font-light italic leading-snug text-foreground/80 md:text-3xl">
              Slow perfumery, rooted in the gardens & ateliers of India.
            </p>
          </div>
          <div className="eyebrow flex items-center gap-3 text-foreground/60">
            <span>Scroll</span>
            <span className="block h-px w-12 bg-foreground/40" />
          </div>
        </div>
      </div>

      {/* Index marker */}
      <div className="absolute right-5 top-24 z-10 hidden md:block md:right-10 md:top-28">
        <div className="eyebrow text-right text-foreground/50">
          <div>Édition</div>
          <div className="font-mono mt-1 text-foreground">N°01 / 2024</div>
        </div>
      </div>
    </section>
  );
}
