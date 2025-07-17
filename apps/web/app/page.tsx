import { HeroSection } from '../components/layouts/HeroSection';
import { FeaturesSection } from '../components/layouts/FeaturesSection';
import { PricingSection } from '../components/layouts/PricingSection';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </>
  );
}