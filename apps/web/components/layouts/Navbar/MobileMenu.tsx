"use client";

import { useState } from "react";
import Link from "next/link";
import { logOut } from "auth/util/actions";
import styles from "./Navbar.module.css";

import { UserDetailsForCookieType } from "../../../types/userTypes";

interface MenuItem {
  label: string;
  href: string;
  description: string;
}

interface MobileMenuProps {
  fullUser: UserDetailsForCookieType | null;
  platformItems: MenuItem[];
  solutionsItems: MenuItem[];
  toolsItems: MenuItem[];
  resourcesItems: MenuItem[];
}

const MobileMenu = ({
  fullUser,
  platformItems,
  solutionsItems,
  toolsItems,
  resourcesItems,
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.mobileMenuContainer}>
      <button
        className={styles.mobileMenuToggle}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        aria-label="Toggle menu"
      >
        <span
          className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
        ></span>
        <span
          className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
        ></span>
        <span
          className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
        ></span>
      </button>

      {isOpen && (
        <div
          className={styles.mobileMenuOverlay}
          onClick={() => setIsOpen(false)}
        >
          <div
            className={styles.mobileMenuContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Platform Section */}
            <div className={styles.mobileMenuSection}>
              <button
                className={styles.mobileMenuSectionHeader}
                onClick={() => toggleSection("platform")}
              >
                Platform
                <svg
                  className={`${styles.mobileMenuIcon} ${openSection === "platform" ? styles.rotated : ""}`}
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
              {openSection === "platform" && (
                <div className={styles.mobileMenuItems}>
                  {platformItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={styles.mobileMenuItem}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={styles.mobileMenuItemLabel}>
                        {item.label}
                      </span>
                      <span className={styles.mobileMenuItemDescription}>
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Solutions Section */}
            <div className={styles.mobileMenuSection}>
              <button
                className={styles.mobileMenuSectionHeader}
                onClick={() => toggleSection("solutions")}
              >
                Solutions
                <svg
                  className={`${styles.mobileMenuIcon} ${openSection === "solutions" ? styles.rotated : ""}`}
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
              {openSection === "solutions" && (
                <div className={styles.mobileMenuItems}>
                  {solutionsItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={styles.mobileMenuItem}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={styles.mobileMenuItemLabel}>
                        {item.label}
                      </span>
                      <span className={styles.mobileMenuItemDescription}>
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tools Section - Only if user is logged in */}
            {fullUser && (
              <div className={styles.mobileMenuSection}>
                <button
                  className={styles.mobileMenuSectionHeader}
                  onClick={() => toggleSection("tools")}
                >
                  Tools
                  <svg
                    className={`${styles.mobileMenuIcon} ${openSection === "tools" ? styles.rotated : ""}`}
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
                {openSection === "tools" && (
                  <div className={styles.mobileMenuItems}>
                    {toolsItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className={styles.mobileMenuItem}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className={styles.mobileMenuItemLabel}>
                          {item.label}
                        </span>
                        <span className={styles.mobileMenuItemDescription}>
                          {item.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Resources Section */}
            <div className={styles.mobileMenuSection}>
              <button
                className={styles.mobileMenuSectionHeader}
                onClick={() => toggleSection("resources")}
              >
                Resources
                <svg
                  className={`${styles.mobileMenuIcon} ${openSection === "resources" ? styles.rotated : ""}`}
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
              {openSection === "resources" && (
                <div className={styles.mobileMenuItems}>
                  {resourcesItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={styles.mobileMenuItem}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={styles.mobileMenuItemLabel}>
                        {item.label}
                      </span>
                      <span className={styles.mobileMenuItemDescription}>
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Section */}
            <div className={styles.mobileMenuAuth}>
              {fullUser ? (
                <>
                  <Link
                    href="/profile"
                    className={styles.mobileMenuAuthLink}
                    onClick={() => setIsOpen(false)}
                  >
                    Profile ({fullUser.username})
                  </Link>
                  <Link
                    href="/tools/my-images"
                    className={styles.mobileMenuAuthLink}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    className={styles.mobileMenuLogoutBtn}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={styles.mobileMenuAuthLink}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className={styles.mobileMenuAuthBtn}
                    onClick={() => setIsOpen(false)}
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
