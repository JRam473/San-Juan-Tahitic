import { CultureSection } from '@/cultura/CultureSection';
import { CultureLanguageSection } from '@/cultura/CultureLanguageSection';
import { CultureGastronomySection } from '@/cultura/CultureGastronomy';
import { CultureDance } from '@/cultura/CultureDance';
export function CulturePage() {
  return (
    <>
      <CultureSection />
      <CultureLanguageSection/>
      <CultureGastronomySection/>
      <CultureDance/>
    </>
  );
} 
