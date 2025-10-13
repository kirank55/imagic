"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "../components/layouts/HeroSection";
import { FeaturesSection } from "../components/layouts/FeaturesSection";
import { IntegrationSection } from "../components/layouts/IntegrationSection";
// import { PricingSection } from "../components/layouts/PricingSection";
import CTASection from "../components/CTASection";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          setIsAuthenticated(true);
          router.push("/profile");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);
  // Show nothing while loading or if authenticated
  if (isLoading || isAuthenticated) {
    return null;
  }

  // Only show home content if definitely not authenticated
  return (
    <>
      <HeroSection />
      <IntegrationSection />
      <FeaturesSection />
      {/* <PricingSection /> */}
      <CTASection />
    </>
  );
}
