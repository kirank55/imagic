// import Link from "next/link";
import styles from "./IntegrationSection.module.css";

export function IntegrationSection() {
  return (
    <section className={styles.integration}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Integration in 3 steps</h2>
          <p>
            Don&apos;t spend time migrating your media files. himagic works with
            your existing storage. Alternatively, upload your assets in
            himagic&apos;s DAM.
          </p>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Set up your account</h3>
              <p>
                Link your existing cloud storage, HTTP server, or serve files
                via web proxy.
              </p>
              <p className={styles.stepOr}>Or</p>
              <p>
                Upload files directly to himagic via API, dashboard, or Rclone
                for bulk migration.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Switch delivery URLs</h3>
              <p>
                Update your base URLs to himagic or use a custom CNAME. Start
                delivering images and videos in optimized formats like AVIF,
                WebP, MP4, and WebM.
              </p>
              <p className={styles.highlight}>
                That&apos;s it! No code changes needed.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Adopt transformations</h3>
              <p>
                Resize, crop, remove backgrounds, and add overlays in real-time
                using URL-based transformations.
              </p>
              <p>
                Use our SDKs to add transformations to your existing codebase.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepContent}>
            <h3>Developer-first SDKs & plugins</h3>
            <p>
              Built with DevEx at our core—clear APIs, rock-solid SDKs,
              crystal-clean docs, and dev-to-dev support.
            </p>

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

            {/* <div className={styles.sdkGrid}>
            <Link href="/docs/react" className={styles.sdkItem}>
              React
            </Link>
            <Link href="/docs/nextjs" className={styles.sdkItem}>
              Next.js
            </Link>
            <Link href="/docs/angular" className={styles.sdkItem}>
              Angular
            </Link>
            <Link href="/docs/javascript" className={styles.sdkItem}>
              JavaScript
            </Link>
            <Link href="/docs/vuejs" className={styles.sdkItem}>
              Vue.js
            </Link>
            <Link href="/docs/nodejs" className={styles.sdkItem}>
              Node.js
            </Link>
            <Link href="/docs/python" className={styles.sdkItem}>
              Python
            </Link>
            <Link href="/docs/php" className={styles.sdkItem}>
              PHP
            </Link>
            <Link href="/docs/java" className={styles.sdkItem}>
              Java
            </Link>
            <Link href="/docs/dotnet" className={styles.sdkItem}>
              .NET
            </Link>
            <Link href="/docs/golang" className={styles.sdkItem}>
              Go
            </Link>
            <Link href="/docs/ruby" className={styles.sdkItem}>
              Ruby
            </Link>
          </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
