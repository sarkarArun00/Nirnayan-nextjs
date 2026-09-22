import Link from "next/link";

import styles from "./Header.module.css";
import LocationSelector from "./LocationSelector";
import NavigationLinks from "./NavigationLinks";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand logo */}

        <Link
          href="/"
          className={styles.brand}
          aria-label="Nirnayan Healthcare homepage"
        >
          <span
            className={styles.logoIcon}
            aria-hidden="true"
          >
            N
          </span>

          <span className={styles.brandText}>
            <span className={styles.brandName}>
              Nirnayan
            </span>

            <span className={styles.brandSubtitle}>
              HEALTHCARE
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}

        <nav
          className={styles.desktopNav}
          aria-label="Main navigation"
        >
          <NavigationLinks />
        </nav>

        {/* Location selector */}

        <LocationSelector />

        {/* Desktop action */}

        <div className={styles.headerActions}>
          <Link
            href="/patient/test-list"
            className={styles.bookButton}
          >
            Book a Test
          </Link>
        </div>

        {/* Mobile navigation */}

        <details className={styles.mobileMenu}>
          <summary
            className={styles.menuToggle}
            aria-label="Open navigation menu"
          >
            <span
              className={styles.menuIcon}
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </span>
          </summary>

          <nav
            className={styles.mobileNav}
            aria-label="Mobile navigation"
          >
            <NavigationLinks mobile />

            <Link
              href="/patient/test-list"
              className={styles.mobileBookButton}
            >
              Book a Test
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}