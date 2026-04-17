import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATS = [
  { value: 4, suffix: "", label: "Fragrances" },
  { value: 18, suffix: " mo", label: "Avg. composition" },
  { value: 32, suffix: "", label: "Indian growers" },
  { value: 0, suffix: "", label: "Reformulations" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%" },
      onUpdate: () => {
        if (ref.current) ref.current.textContent = String(Math.round(obj.v));
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);
  return (
    <>
      <span ref={ref}>0</span>
      {suffix}
    </>
  );
}

export function NumbersSection() {
  return (
    <section className="bg-ink py-[14vh] text-ivory">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-16 flex items-center gap-4">
          <span className="block h-px w-12 bg-ivory/40" />
          <span className="eyebrow text-ivory/60">By the numbers</span>
        </div>
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4 md:gap-y-0">
          {STATS.map((s) => (
            <div key={s.label} className="border-l border-ivory/15 pl-6 md:pl-8">
              <div className="font-display text-6xl font-light leading-none md:text-7xl lg:text-[110px]">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="eyebrow mt-4 text-ivory/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
