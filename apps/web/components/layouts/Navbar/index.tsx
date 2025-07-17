import Link from "next/link";
import { getCurrentUser } from "auth/currentUser";
import styles from "./Navbar.module.css";
import NavDropdown from "./NavDropdown";
import MobileMenu from "./MobileMenu";
import LogoutButton from "./LogoutButton";
import AnnouncementBar from "./AnnouncementBar";

const Navbar = async () => {
  const fullUser = await getCurrentUser({
    withFullUser: true,
    redirectIfNotFound: false,
  });

  const platformItems = [
    {
      label: "Image API",
      href: "/api/docs",
      description: "Real-time image transformations",
    },
    { label: "SDK", href: "/sdk", description: "Programmatic bulk operations" },
    {
      label: "Documentation",
      href: "/docs",
      description: "Complete API reference",
    },
  ];

  const solutionsItems = [
    {
      label: "Performance Optimization",
      href: "/solutions/performance",
      description: "Automatic image optimization",
    },
    {
      label: "Image Management",
      href: "/solutions/management",
      description: "Centralized asset management",
    },
    {
      label: "Developer Tools",
      href: "/solutions/developers",
      description: "SDKs and integrations",
    },
  ];

  const toolsItems = [
    {
      label: "Upload Images",
      href: "/tools/upload",
      description: "Upload and optimize images",
    },
    {
      label: "My Images",
      href: "/tools/my-images",
      description: "Manage your images",
    },
    {
      label: "Bulk Operations",
      href: "/tools/bulk",
      description: "Process multiple images",
    },
  ];

  const resourcesItems = [
    {
      label: "Pricing",
      href: "/pricing",
      description: "Transparent pricing plans",
    },
    { label: "Blog", href: "/blog", description: "Latest updates and guides" },
    { label: "Support", href: "/support", description: "Get help and support" },
  ];

  return (
    <>
      <AnnouncementBar />
      <nav className={styles.navbar}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>himagic</span>
            <span className={styles.logoTld}>.online</span>
          </Link>

          {/* Main Navigation */}
          <div className={styles.mainNav}>
            <NavDropdown label="Platform" items={platformItems} />
            <NavDropdown label="Solutions" items={solutionsItems} />
            {fullUser && <NavDropdown label="Tools" items={toolsItems} />}
            <NavDropdown label="Resources" items={resourcesItems} />
          </div>

          {/* Auth Section */}
          <div className={styles.authSection}>
            {fullUser ? (
              <div className={styles.userMenu}>
                <Link href="/profile" className={styles.profileLink}>
                  <div className={styles.avatar}>
                    {fullUser.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span>{fullUser.username}</span>
                </Link>
                <Link href="/tools/my-images" className={styles.dashboardBtn}>
                  Dashboard
                </Link>
                <LogoutButton className={styles.logoutBtn} />
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link href="/login" className={styles.loginBtn}>
                  Login
                </Link>
                <Link href="/signup" className={styles.signupBtn}>
                  Start Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <MobileMenu
            fullUser={fullUser}
            platformItems={platformItems}
            solutionsItems={solutionsItems}
            toolsItems={toolsItems}
            resourcesItems={resourcesItems}
          />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
