import { HeroSection } from "../components/layouts/HeroSection";
import { FeaturesSection } from "../components/layouts/FeaturesSection";
import { IntegrationSection } from "../components/layouts/IntegrationSection";
import TestimonialsSection from "../components/layouts/TestimonialsSection";
import { PricingSection } from "../components/layouts/PricingSection";
import CTASection from "../components/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <IntegrationSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </>
  );
}
