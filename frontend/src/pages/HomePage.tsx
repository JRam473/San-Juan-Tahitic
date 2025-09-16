import { HeroSection } from '@/home/HeroSection';
import { HeroHighlightsSection } from '@/home/HeroHighlightsSection'; // lo crearemos después
import { VisualCardsSection } from '@/home/VisualCardsSection'; // lo crearemos después

export function HomePage() {
  return (
    <>
      <HeroSection />
      <HeroHighlightsSection /> {/* Sección independiente y elegante */}
      <VisualCardsSection />
    </>
  );
}
