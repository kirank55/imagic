import Link from "next/link";
import styles from "./AnnouncementBar.module.css";

const AnnouncementBar = () => {
  return (
    <div className={styles.announcementBar}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>New</span>
          <span className={styles.text}>
            AI-powered background removal now 90% cheaper!
          </span>
          <Link href="/docs/ai-transformations" className={styles.link}>
            View Docs →
          </Link>
        </div>
        <button className={styles.closeBtn} aria-label="Close announcement">
          ×
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
