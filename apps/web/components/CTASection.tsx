import Link from "next/link";
import styles from "./CTASection.module.css";

const CTASection = () => (
  <div className={styles.cta}>
    <h2>Ready to get started?</h2>
    <p>
      Experience the power of professional image management and optimization
    </p>
    <div className={styles.ctaButtons}>
      <Link href="/signup" className={styles.primaryBtn}>
        Get Started
      </Link>
      <Link href="/login" className={styles.secondaryBtn}>
        Login
      </Link>
    </div>
  </div>
);

export default CTASection;
