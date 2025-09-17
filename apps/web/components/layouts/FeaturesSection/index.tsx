import Link from "next/link";
import styles from "./FeaturesSection.module.css";

export function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        {/* Main Features Grid */}
        <div className={styles.mainFeatures}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>🚀</span>
            </div>
            <h3>Simple and Powerful Image API</h3>
            <p>
              Transform and optimize images in real-time through our
              straightforward URL-based API.
            </p>
            {/* <div className={styles.featureLinks}>
              <Link href="/docs/image-api">Image API</Link>
            </div> */}
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>⚡</span>
            </div>
            <h3>Automatic performance optimization</h3>
            <p>
              Serve the lightest possible variant in modern formats like AVIF,
              WebP, MP4, or WebM.
            </p>
            {/* <div className={styles.featureLinks}>
              <Link href="/solutions/performance">Learn more</Link>
            </div> */}
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>🎨</span>
            </div>
            <h3>Real-time transformations</h3>
            <p>
              Apply 50+ transformations, from simple resizing to GenAI effects,
              directly through the asset URL.
            </p>
            {/* <div className={styles.featureLinks}>
              <Link href="/docs/transformations">View all transformations</Link>
            </div> */}
          </div>

          {/* <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>🎬</span>
            </div>
            <h3>Superfast video streaming</h3>
            <p>
              Stream optimized videos with HLS or DASH adaptive streams that
              adjust to viewer&apos;s bandwidth.
            </p>
            <div className={styles.featureLinks}>
              <Link href="/solutions/video-streaming">Video Streaming</Link>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>🤖</span>
            </div>
            <h3>AI-powered Digital Asset Management</h3>
            <p>
              Fast uploads, AI-powered visual search, auto-tagging, custom
              metadata, and collaboration workflows.
            </p>
            <div className={styles.featureLinks}>
              <Link href="/docs/dam">DAM Overview</Link>
            </div>
          </div> 

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span className={styles.iconEmoji}>🔒</span>
            </div>
            <h3>Enterprise-grade security</h3>
            <p>
              ISO 27001 and GDPR-compliant controls, encryption, backups, signed
              URLs, and granular access policies.
            </p>
            <div className={styles.featureLinks}>
              <Link href="/security">Security & Trust</Link>
            </div>
          </div> */}
        </div>

        {/* Why Choose Us Section */}
        {/* <div className={styles.whySection}>
          <div className={styles.whyHeader}>
            <h2>Why teams pick himagic</h2>
            <p>
              Zero-friction setup, lightning-fast delivery, and pricing that
              never punishes growth.
            </p>
          </div>

          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>⏱️</div>
              <h3>Go live in minutes</h3>
              <p>
                Change the base URL, keep your existing storage, and start
                delivering optimized images instantly. No heavy migrations or
                code rewrites.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>💰</div>
              <h3>No billing surprises</h3>
              <p>
                Predictable, fair pricing with fewer billing parameters,
                unlimited common transforms, and pay-as-you-go with small
                overages.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>🔓</div>
              <h3>Zero vendor lock-in</h3>
              <p>
                Keep assets in S3, GCS, Azure Blob, or any HTTPS origin. Even
                with our DAM, automatic backups mean you&apos;re never stuck.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>📈</div>
              <h3>Built for scale & security</h3>
              <p>
                We deliver billions of assets daily, manage petabytes of data,
                with ISO 27001, GDPR compliance, and reliable uptime.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
