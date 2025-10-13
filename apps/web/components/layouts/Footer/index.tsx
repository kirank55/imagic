import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
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
            {/* <div className={styles.socialLinks}>
              <Link
                href="https://twitter.com/"
                className={styles.socialLink}
                aria-label="Twitter"
              >
                <FontAwesomeIcon
                  icon={faTwitter}
                  className={styles.socialIcon}
                />
              </Link>
              <Link
                href="https://github.com/himagic"
                className={styles.socialLink}
                aria-label="GitHub"
              >
                <FontAwesomeIcon
                  icon={faGithub}
                  className={styles.socialIcon}
                />
              </Link>
              <Link
                href="https://linkedin.com/"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className={styles.socialIcon}
                />
              </Link>
            </div> */}
          </div>

          {/* Platform Section */}
          {/* <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Platform</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/api/docs" className={styles.footerLink}>
                  Image API
                </Link>
              </li>
              <li>
                <Link href="/sdk" className={styles.footerLink}>
                  SDK
                </Link>
              </li>
              <li>
                <Link href="/docs" className={styles.footerLink}>
                  Documentation
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Solutions Section */}
          {/* <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Solutions</h4>
            <ul className={styles.linkList}>
              <li>
                <Link
                  href="/solutions/performance"
                  className={styles.footerLink}
                >
                  Performance Optimization
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/management"
                  className={styles.footerLink}
                >
                  Image Management
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/developers"
                  className={styles.footerLink}
                >
                  Developer Tools
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Resources Section */}
          {/* <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Resources</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/pricing" className={styles.footerLink}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className={styles.footerLink}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className={styles.footerLink}>
                  Support
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Company Section */}
          {/* <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Company</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/about" className={styles.footerLink}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className={styles.footerLink}>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.footerLink}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/partners" className={styles.footerLink}>
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/press" className={styles.footerLink}>
                  Press
                </Link>
              </li>
              <li>
                <Link href="/security" className={styles.footerLink}>
                  Security
                </Link>
              </li>
            </ul>
          </div> */}
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

            {/* <div className={styles.trustBadges}>
              <div className={styles.trustBadge}>
                <span className={styles.badgeIcon}>⚡</span>
                <span>99.9% Uptime SLA</span>
              </div>
              <div className={styles.trustBadge}>
                <span className={styles.badgeIcon}>🌐</span>
                <span>Global CDN</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
