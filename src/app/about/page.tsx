import type { Metadata } from "next";
import Image from "next/image";
import botanicals from "@/assets/story-botanicals.jpg";
import craft from "@/assets/story-craft.jpg";
import hero from "@/assets/yun-bottle-hero.jpg";

export const metadata: Metadata = {
  title: "The Atelier — YUN",
  description: "YUN is a small perfume house in Pune. We make four fragrances, slowly, with materials from across India.",
  openGraph: {
    title: "The Atelier — YUN",
    description: "A small perfume house in Pune, working slowly with Indian materials.",
    images: ["/og-about.jpg"], // Fallback to a string path for OG
  },
};

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
      "Bottles are filled, capped and labelled by hand in Pune. Each one carries the initials of the person who made it.",
  },
];

const NUMBERS = [
  { value: "32", label: "Indian growers" },
  { value: "4", label: "Fragrances" },
  { value: "18mo", label: "Avg. composition" },
  { value: "0", label: "Reformulations" },
];

export default function About() {
  return (
    <div className="bg-transparent pt-32 pb-32 md:pt-40">
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
            <p className="mt-8 leading-relaxed text-muted-foreground">
              YUN was founded in Pune in 2026 by a small team of perfumers, growers and
              designers who shared a single conviction: that luxury is a function of time.
            </p>
          </div>
        </div>

        <div className="mt-24 aspect-[16/9] relative overflow-hidden md:mt-32">
          <Image
            src={craft}
            alt="Atelier"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
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
          <div className="md:col-span-5 relative aspect-[3/4]">
            <Image
              src={botanicals}
              alt="Botanicals"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
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
        <div className="mt-32 relative h-[60vh] md:h-[80vh]">
          <Image
            src={hero}
            alt="YUN bottle"
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
}
