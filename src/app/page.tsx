import { HeroPinned } from "@/components/home/hero-pinned";
import { ManifestoSection } from "@/components/home/manifesto-section";
import { HorizontalGallery } from "@/components/home/horizontal-gallery";
import { StoryParallax } from "@/components/home/story-parallax";
import { NumbersSection } from "@/components/home/numbers-section";
import { ClosingCta } from "@/components/home/closing-cta";

export default function Home() {
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
