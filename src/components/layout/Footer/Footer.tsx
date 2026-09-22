import Link from "next/link";
import styles from "./Footer.module.css";

const quickLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/about-us/our-team",
  },
  {
    label: "Our Centres",
    href: "/patient/find-center",
  },
  {
    label: "Careers",
    href: "/others/career",
  },
];

const serviceLinks = [
  {
    label: "Book a Test",
    href: "/patient/test-list",
  },
  {
    label: "Health Packages",
    href: "/patient/package-list",
  },
  {
    label: "Find a Centre",
    href: "/patient/find-center",
  },
  {
    label: "FAQs",
    href: "/others/faq",
  },
];

const policyLinks = [
  {
    label: "Privacy Policy",
    href: "/others/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/others/terms-condition",
  },
  {
    label: "Refund & Cancellation",
    href: "/others/refund-cancellation",
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Brand information */}

          <div className={styles.brandColumn}>
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

            <p className={styles.description}>
              Your trusted healthcare partner for diagnostic
              tests, preventive health packages and
              personalized care.
            </p>

            <p className={styles.brandMessage}>
              Your health, our priority.
            </p>
          </div>

          {/* Quick links */}

          <nav
            className={styles.linkColumn}
            aria-label="Footer quick links"
          >
            <h2 className={styles.columnTitle}>
              Quick Links
            </h2>

            <ul className={styles.linkList}>
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.footerLink}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Healthcare services */}

          <nav
            className={styles.linkColumn}
            aria-label="Footer healthcare services"
          >
            <h2 className={styles.columnTitle}>
              Our Services
            </h2>

            <ul className={styles.linkList}>
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={styles.footerLink}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Policies */}

          <nav
            className={styles.linkColumn}
            aria-label="Footer policies"
          >
            <h2 className={styles.columnTitle}>
              Information
            </h2>

            <ul className={styles.linkList}>
              {policyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.footerLink}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom footer */}

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © Nirnayan Healthcare. All rights reserved.
          </p>

          <p className={styles.bottomMessage}>
            Caring for your health, every step of the way.
          </p>
        </div>
      </div>
    </footer>
  );
}