import Link from "next/link";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.announcement}>
            <span className={styles.badge}>New</span>
            <span>AI-powered background removal now available</span>
            <Link href="/docs/ai-features" className={styles.announcementLink}>
              Learn more →
            </Link>
          </div>

          <h1 className={styles.title}>
            Image and Video API plus
            <span className={styles.highlight}> AI-powered</span> optimization
          </h1>

          <p className={styles.subtitle}>
            One platform to optimize, transform, store, manage and deliver
            visuals, so developers ship faster, marketers iterate freely, and
            your users enjoy flawless visuals everywhere.
          </p>

          <div className={styles.ctaButtons}>
            <Link href="/signup" className={styles.primaryBtn}>
              Start Free
            </Link>
            <Link href="/demo" className={styles.secondaryBtn}>
              View Demo
            </Link>
          </div>

          <div className={styles.socialProof}>
            <p className={styles.proofText}>
              Trusted by 250K+ developers and 2,000+ high-growth businesses
            </p>
            <div className={styles.logoGrid}>
              <div className={styles.logoItem}>Swiggy</div>
              <div className={styles.logoItem}>BookMyShow</div>
              <div className={styles.logoItem}>Nykaa</div>
              <div className={styles.logoItem}>BigBasket</div>
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.mockup}>
            <div className={styles.mockupContent}>
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>JavaScript</span>
                </div>
                <pre className={styles.code}>
                  {`// Transform any image URL
const optimizedUrl = imagekit.url({
  path: "/sample-image.jpg",
  transformation: [{
    width: 400,
    height: 300,
    format: "webp",
    quality: 80
  }]
});`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
