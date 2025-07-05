import { Button } from "@repo/ui/button";
import styles from "app/page.module.css";

export function PricingSection() {
  return (
    <section className={styles.section} id="pricing">
      <h2 className={styles.sectionTitle}>Pricing</h2>
      <div className={styles.grid}>
        <div className={styles.pricingCard}>
          <h3>Free</h3>
          <div className={styles.price}>$0</div>
          <div className={styles.period}>per month</div>
          <ul className={styles.features}>
            <li>1,000 transformations/month</li>
            <li>Basic optimization</li>
            <li>Community support</li>
          </ul>
          <Button appName="web" className={styles.cta}>
            Get Started
          </Button>
        </div>
        <div className={styles.pricingCard}>
          <h3>Pro</h3>
          <div className={styles.price}>$29</div>
          <div className={styles.period}>per month</div>
          <ul className={styles.features}>
            <li>100,000 transformations/month</li>
            <li>Advanced optimization</li>
            <li>Priority support</li>
            <li>Custom domain</li>
          </ul>
          <Button appName="web" className={styles.cta}>
            Start Free Trial
          </Button>
        </div>
        <div className={styles.pricingCard}>
          <h3>Enterprise</h3>
          <div className={styles.price}>Custom</div>
          <div className={styles.period}>contact sales</div>
          <ul className={styles.features}>
            <li>Unlimited transformations</li>
            <li>Advanced optimization</li>
            <li>24/7 support</li>
            <li>Custom solutions</li>
            <li>SLA guarantee</li>
          </ul>
          <Button appName="web" className={styles.cta}>
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
