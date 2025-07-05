import Image from "next/image";
import styles from "app/page.module.css";

export function FeaturesSection() {
  return (
    <section className={styles.section} id="features">
      <h2 className={styles.sectionTitle}>Features</h2>
      <div className={styles.grid}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Image src="/window.svg" alt="Optimization" width={24} height={24} />
          </div>
          <h3>Smart Optimization</h3>
          <p>Automatically optimize images for the best quality-to-size ratio</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Image src="/globe.svg" alt="CDN" width={24} height={24} />
          </div>
          <h3>Global CDN</h3>
          <p>Lightning-fast delivery through our global edge network</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Image src="/file-text.svg" alt="API" width={24} height={24} />
          </div>
          <h3>Simple API</h3>
          <p>Easy to integrate with your existing applications</p>
        </div>
      </div>
    </section>
  );
}
