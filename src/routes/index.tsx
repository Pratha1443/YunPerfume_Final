import { createFileRoute } from "@tanstack/react-router";
import { HeroPinned } from "@/components/home/hero-pinned";
import { ManifestoSection } from "@/components/home/manifesto-section";
import { HorizontalGallery } from "@/components/home/horizontal-gallery";
import { StoryParallax } from "@/components/home/story-parallax";
import { NumbersSection } from "@/components/home/numbers-section";
import { ClosingCta } from "@/components/home/closing-cta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YUN — Slow perfumery from India" },
      {
        name: "description",
        content:
          "A small-batch perfume house from India. Mogra, oud, sandalwood and chai — fragrances rooted in the materials and rituals of the subcontinent.",
      },
      { property: "og:title", content: "YUN — Slow perfumery from India" },
      {
        property: "og:description",
        content: "Small-batch fragrances rooted in Indian materials and rituals.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background">
      <HeroPinned />
      <ManifestoSection />
      <HorizontalGallery />
      <StoryParallax />
      <NumbersSection />
      <ClosingCta />
    </div>
  );
}
