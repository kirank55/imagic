import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Left: Large Logo */}
      <div className={styles.footerLogo}>
        <Link href="/">
          <Image
            src="/turborepo-dark.svg"
            alt="Imagic Logo"
            width={180}
            height={38}
            priority
            style={{ maxWidth: 200 }}
          />
        </Link>
      </div>
      {/* Center: Legal Links (vertical) */}
      <div className={styles.footerCenter}>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/legal">Legal</Link>
        <Link href="/terms">Terms & Conditions</Link>
        <Link href="/cookies">Cookies</Link>
        <Link href="/about">About</Link>
      </div>
      {/* Right: Action Links (vertical) */}
      <div className={styles.footerRight}>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/docs">Docs</Link>
        <Link href="/support">Support</Link>
      </div>
    </footer>
  );
}
