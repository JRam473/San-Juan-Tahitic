import { HeroSection } from '@/home/HeroSection';
import { HeroHighlightsSection } from '@/home/HeroHighlightsSection'; // lo crearemos después
import { HeroStatsSection } from '@/home/HeroStatsSection'; // lo crearemos después

export function HomePage() {
  return (
    <>
      <HeroSection />
      <HeroHighlightsSection /> {/* Sección independiente y elegante */}
      <HeroStatsSection />
    </>
  );
}
