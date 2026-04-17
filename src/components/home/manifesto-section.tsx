import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const lines = [
  "Five ingredients,",
  "one breath,",
  "an hour of patience.",
];

export function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const words = ref.current!.querySelectorAll<HTMLSpanElement>("[data-word]");
      gsap.set(words, { opacity: 0.12 });
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 70%",
        end: "bottom 40%",
        scrub: 0.6,
        animation: gsap.to(words, { opacity: 1, stagger: 0.05, ease: "none" }),
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-ivory py-[20vh] md:py-[26vh]">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-12 flex items-center gap-4">
          <span className="block h-px w-12 bg-foreground/40" />
          <span className="eyebrow text-foreground/60">A note from the atelier</span>
        </div>
        <h2 className="h-display text-[10vw] leading-[1] md:text-[7vw] lg:text-[110px]">
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line.split(" ").map((w, j) => (
                <span key={j} data-word className="inline-block pr-[0.18em]">
                  {w}
                </span>
              ))}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
