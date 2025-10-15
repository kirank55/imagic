import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* Company Section */}
          <div className={styles.footerSection}>
            <div className={styles.logo}>
              <h3>himagic.online</h3>
            </div>
            <p className={styles.description}>
              {/* The fastest, most reliable  */}
              Image optimization platform for developers and businesses.
              Optimize, transform, and deliver images at scale.
            </p>
          </div>

          {/* Platform Section */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Platform</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/tools" className={styles.footerLink}>
                  Image Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/upload" className={styles.footerLink}>
                  Upload & Optimize
                </Link>
              </li>
              <li>
                <Link href="/tools/my-images" className={styles.footerLink}>
                  My Images
                </Link>
              </li>
            </ul>
          </div>

          {/* GitHub Repository Section */}
          <div className={styles.footerSection}>
            {/* <h4 className={styles.sectionTitle}>Open Source</h4> */}
            <div className={styles.githubContainer}>
              <Link
                href="https://github.com/kirank55/imagic"
                className={styles.githubLink}
                aria-label="GitHub Repository"
                target="_blank"
                rel="noopener noreferrer"
                title="⭐ Star us on GitHub or checkout the repository"
              >
                <FontAwesomeIcon
                  icon={faGithub}
                  className={styles.githubIcon}
                />
                <div className={styles.githubText}>
                  <span className={styles.githubTitle}>Star on GitHub</span>
                  {/* <span className={styles.githubSubtitle}>
                    View source code
                  </span> */}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomContent}>
            <div className={styles.legal}>
              <span className={styles.copyright}>
                © {currentYear} himagic. All rights reserved.
              </span>
              {/* <div className={styles.legalLinks}>
                <Link href="/privacy" className={styles.legalLink}>
                  Privacy Policy
                </Link>
                <Link href="/terms" className={styles.legalLink}>
                  Terms of Service
                </Link>
                <Link href="/cookies" className={styles.legalLink}>
                  Cookie Policy
                </Link>
                <Link href="/gdpr" className={styles.legalLink}>
                  GDPR
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
