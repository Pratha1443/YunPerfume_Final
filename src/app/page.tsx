import { HeroPinned } from "@/components/home/hero-pinned";
import { ManifestoSection } from "@/components/home/manifesto-section";
import { HorizontalGalleryWrapper } from "@/components/home/horizontal-gallery-wrapper";
import { StoryParallax } from "@/components/home/story-parallax";
import { NumbersSection } from "@/components/home/numbers-section";
import { ClosingCta } from "@/components/home/closing-cta";

export const runtime = 'edge';

export default function Home() {
  return (
    <div className="bg-transparent">
      <HeroPinned />
      <ManifestoSection />
      <HorizontalGalleryWrapper />
      <StoryParallax />
      <NumbersSection />
      <ClosingCta />
    </div>
  );
}
