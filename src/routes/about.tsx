import { createFileRoute } from "@tanstack/react-router";
import botanicals from "@/assets/story-botanicals.jpg";
import craft from "@/assets/story-craft.jpg";
import hero from "@/assets/yun-bottle-hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — YUN Atelier" },
      { name: "description", content: "YUN is a small perfume house in Bengaluru. We make four fragrances, slowly, with materials from across India." },
      { property: "og:title", content: "About — YUN Atelier" },
      { property: "og:description", content: "A small perfume house in Bengaluru, working slowly with Indian materials." },
      { property: "og:image", content: botanicals },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="bg-background pt-32 pb-32 md:pt-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Intro */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <div className="flex items-center gap-4">
              <span className="block h-px w-12 bg-foreground/40" />
              <span className="eyebrow text-foreground/60">The atelier</span>
            </div>
            <h1 className="h-display mt-6 text-[12vw] leading-[0.9] md:text-[7vw] lg:text-[110px]">
              Four fragrances, <em className="italic font-light text-accent">no hurry.</em>
            </h1>
          </div>
          <div className="md:col-span-5 md:pt-12">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              YUN was founded in Bengaluru in 2023 by a small team of perfumers, growers and
              writers. We share a quiet conviction: that fragrance, like food and music and
              language, belongs to the place it comes from.
            </p>
          </div>
        </div>

        <div className="mt-24 aspect-[16/9] overflow-hidden md:mt-32">
          <img src={craft} alt="Atelier" className="h-full w-full object-cover" loading="lazy" />
        </div>

        {/* Pillars */}
        <div className="mt-24 grid gap-y-16 md:mt-32 md:grid-cols-3 md:gap-12">
          {PILLARS.map((p, i) => (
            <div key={p.title}>
              <div className="font-mono text-sm text-muted-foreground">0{i + 1}</div>
              <h3 className="h-display mt-3 text-3xl font-light md:text-4xl">{p.title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-32 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img src={botanicals} alt="Botanicals" className="aspect-[3/4] w-full object-cover" loading="lazy" />
          </div>
          <div className="flex flex-col justify-center md:col-span-7">
            <div className="font-display text-4xl font-light italic leading-tight md:text-6xl">
              "We are not in the business of inventing scents. We are in the business of
              listening to materials, and getting out of their way."
            </div>
            <div className="eyebrow mt-8 text-muted-foreground">— Aanya Khurana, Founder</div>
          </div>
        </div>

        {/* Stats / numbers */}
        <div className="mt-32 grid grid-cols-2 gap-y-12 border-t border-border/60 pt-16 md:grid-cols-4">
          {NUMBERS.map((n) => (
            <div key={n.label} className="border-l border-border pl-6">
              <div className="h-display text-5xl font-light leading-none md:text-6xl">{n.value}</div>
              <div className="eyebrow mt-3 text-muted-foreground">{n.label}</div>
            </div>
          ))}
        </div>

        {/* Final image */}
        <div className="mt-32">
          <img src={hero} alt="YUN bottle" className="mx-auto max-h-[80vh] w-auto" loading="lazy" />
        </div>
      </div>
    </div>
  );
}

const PILLARS = [
  {
    title: "Sourced honestly",
    body:
      "Every key material is traced to a single grower or distiller. We pay above market and put their name on the box.",
  },
  {
    title: "Composed slowly",
    body:
      "A YUN fragrance takes between four and eighteen months to compose. We make four. We do not plan to make more.",
  },
  {
    title: "Made by hand",
    body:
      "Bottles are filled, capped and labelled by hand in Bengaluru. Each one carries the initials of the person who made it.",
  },
];

const NUMBERS = [
  { value: "32", label: "Indian growers" },
  { value: "4", label: "Fragrances" },
  { value: "18mo", label: "Avg. composition" },
  { value: "0", label: "Reformulations" },
];
