import styles from "app/page.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        Optimize Images at Scale
      </h1>
      <p className={styles.subtitle}>
        Transform, optimize, and deliver your images in real-time with our powerful API
      </p>
      <a href="#pricing" className={styles.cta}>Get Started Free</a>
    </section>
  );
}
