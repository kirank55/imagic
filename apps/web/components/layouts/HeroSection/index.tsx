import Link from "next/link";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Image API plus
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
          </div>
        </div>

        {/* <div className={styles.visual}>
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
        </div> */}
      </div>
    </section>
  );
}
