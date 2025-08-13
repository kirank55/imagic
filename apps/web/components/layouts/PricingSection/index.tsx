import Link from "next/link";
import styles from "./PricingSection.module.css";

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
  ctaLink: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal projects and getting started",
    features: [
      "1,000 image optimizations/month",
      "Basic compression formats",
      "API access",
      "Community support",
      "100MB storage",
      "Standard CDN delivery",
    ],
    cta: "Get Started Free",
    ctaLink: "/signup",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "Ideal for growing businesses and professional developers",
    features: [
      "50,000 image optimizations/month",
      "All compression formats",
      "Advanced API features",
      "Priority email support",
      "10GB storage",
      "Global CDN delivery",
      "Real-time optimization",
      "Custom watermarks",
      "Analytics dashboard",
    ],
    popular: true,
    cta: "Coming Soon",
    ctaLink: "/signup",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large-scale applications with custom requirements",
    features: [
      "Unlimited image optimizations",
      "Custom compression algorithms",
      "Dedicated API endpoints",
      "24/7 phone support",
      "Unlimited storage",
      "Private CDN regions",
      "Advanced security features",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
  },
];

export function PricingSection() {
  return (
    <section className={styles.pricing}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Simple, transparent pricing</h2>
          <p>
            Choose the perfect plan for your needs. Start free and scale as you
            grow. All plans include our core optimization features.
          </p>
        </div>

        <div className={styles.pricingGrid}>
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`${styles.pricingCard} ${tier.popular ? styles.popular : ""}`}
            >
              {tier.popular && (
                <div className={styles.popularBadge}>Most Popular</div>
              )}

              <div className={styles.cardHeader}>
                <h3 className={styles.tierName}>{tier.name}</h3>
                <div className={styles.priceContainer}>
                  <span className={styles.price}>{tier.price}</span>
                  <span className={styles.period}>/{tier.period}</span>
                </div>
                <p className={styles.description}>{tier.description}</p>
              </div>

              <div className={styles.features}>
                <ul className={styles.featuresList}>
                  {tier.features.map((feature, index) => (
                    <li key={index} className={styles.feature}>
                      <span className={styles.checkIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardFooter}>
                <Link
                  href={tier.ctaLink}
                  className={`${styles.ctaButton} ${tier.popular ? styles.ctaPrimary : styles.ctaSecondary}`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
