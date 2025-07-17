"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

interface DropdownItem {
  label: string;
  href: string;
  description: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
}

const NavDropdown = ({ label, items }: NavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={styles.dropdown}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={styles.dropdownTrigger}>
        {label}
        <svg
          className={`${styles.dropdownIcon} ${isOpen ? styles.rotated : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={styles.dropdownItem}
              onClick={() => setIsOpen(false)}
            >
              <div className={styles.dropdownItemContent}>
                <span className={styles.dropdownItemLabel}>{item.label}</span>
                <span className={styles.dropdownItemDescription}>
                  {item.description}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
