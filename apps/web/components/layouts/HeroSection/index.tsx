import Link from "next/link";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Intelligent Image{" "}
            <span className={styles.highlight}>Optimization</span> API
          </h1>

          <p className={styles.subtitle}>
            Transform and optimize images in real-time with our simple and
            powerful API. Built for developers who care about performance.
          </p>

          <div className={styles.ctaButtons}>
            <Link href="/signup" className={styles.primaryBtn}>
              Start Building
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
//                 <div className={styles.imageLabel}>Before</div>
//                 <div className={styles.imageContainer}>
//                   <Image
//                     src="/demo-image-before.svg"
//                     alt="Unoptimized image"
//                     className={styles.demoImage}
//                     width={400}
//                     height={300}
//                   />
//                   <div className={styles.imageStats}>
//                     <span className={styles.fileSize}>2.3 MB</span>
//                     <span className={styles.format}>JPEG</span>
//                     <span className={styles.loadTime}>3.2s load time</span>
//                   </div>
//                 </div>
//               </div>

//               <div className={styles.optimizationArrow}>
//                 <div className={styles.arrowIcon}>→</div>
//                 <div className={styles.processingText}>AI Optimizing...</div>
//               </div>

//               <div className={styles.afterImage}>
//                 <div className={styles.imageLabel}>After</div>
//                 <div className={styles.imageContainer}>
//                   <Image
//                     src="/demo-image-after.svg"
//                     alt="Optimized image"
//                     className={styles.demoImage}
//                     width={400}
//                     height={300}
//                   />
//                   <div className={styles.imageStats}>
//                     <span className={styles.fileSize}>89 KB</span>
//                     <span className={styles.format}>WebP</span>
//                     <span className={styles.loadTime}>0.4s load time</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className={styles.optimizationResults}>
//               <div className={styles.resultItem}>
//                 <span className={styles.resultLabel}>Size Reduction:</span>
//                 <span className={styles.resultValue}>96% smaller</span>
//               </div>
//               <div className={styles.resultItem}>
//                 <span className={styles.resultLabel}>Speed Improvement:</span>
//                 <span className={styles.resultValue}>8x faster</span>
//               </div>
//               <div className={styles.resultItem}>
//                 <span className={styles.resultLabel}>Quality:</span>
//                 <span className={styles.resultValue}>Maintained</span>
//               </div>
//             </div>
//           </div>
//         </div> */}
//       </div>
//     </section>
//   );
// }
