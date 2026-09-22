import type { Metadata } from "next";
import Link from "next/link";

import styles from "./PackageDetails.module.css";

export const metadata: Metadata = {
  title: "Health Package Details | Nirnayan Healthcare",
  description:
    "Explore health package information at Nirnayan Healthcare.",
};

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
      <path d="M3.5 12h5l2-3 3 6 2-3h5" />
    </svg>
  );
}

export default function HealthPackageDetailsPage() {
  return (
    <div className={styles.page}>
      {/* BREADCRUMB */}

      <div className={styles.breadcrumbBar}>
        <div className={styles.container}>
          <nav
            className={styles.breadcrumb}
            aria-label="Breadcrumb"
          >
            <Link href="/">Home</Link>

            <span aria-hidden="true">/</span>

            <Link href="/patient/health-packages">
              Health Packages
            </Link>

            <span aria-hidden="true">/</span>

            <span aria-current="page">Package Details</span>
          </nav>
        </div>
      </div>

      {/* HERO */}

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>
                HEALTH & WELLNESS
              </span>

              <h1>
                Health Package <span>Details</span>
              </h1>

              <p className={styles.heroDescription}>
                Explore package information, included tests,
                preparation requirements, and sample collection
                options in one place.
              </p>

              <span className={styles.previewBadge}>
                UI preview — package data not connected yet
              </span>
            </div>

            <div
              className={styles.heroIllustration}
              aria-hidden="true"
            >
              <div className={styles.illustrationInner}>
                <HeartIcon />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS CONTENT */}

      <div className={styles.detailsSection}>
        <div className={styles.container}>
          <div className={styles.pageGrid}>
            {/* LEFT COLUMN */}

            <div className={styles.mainColumn}>
              {/* PACKAGE OVERVIEW */}

              <section className={styles.card}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionLabel}>
                    PACKAGE OVERVIEW
                  </span>

                  <h2>About this health package</h2>

                  <p>
                    The selected package&apos;s name, description,
                    and health screening information will appear
                    here after API integration.
                  </p>
                </div>

                <div className={styles.overviewGrid}>
                  <div className={styles.overviewItem}>
                    <span>Package name</span>
                    <strong>To be updated</strong>
                  </div>

                  <div className={styles.overviewItem}>
                    <span>Package code</span>
                    <strong>To be updated</strong>
                  </div>

                  <div className={styles.overviewItem}>
                    <span>Included tests</span>
                    <strong>To be updated</strong>
                  </div>

                  <div className={styles.overviewItem}>
                    <span>Report turnaround time</span>
                    <strong>To be updated</strong>
                  </div>
                </div>
              </section>

              {/* INCLUDED TESTS */}

              <section className={styles.card}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionLabel}>
                    PACKAGE CONTENTS
                  </span>

                  <h2>Tests included in this package</h2>

                  <p>
                    Once the package API is connected, this
                    section will display the actual diagnostic
                    tests included in the selected package.
                  </p>
                </div>

                <div className={styles.pendingPanel}>
                  <span className={styles.pendingIcon}>
                    <CheckIcon />
                  </span>

                  <div>
                    <h3>Included-test details coming soon</h3>

                    <p>
                      Test names, codes, and additional details
                      will be displayed using the existing
                      backend&apos;s package information.
                    </p>
                  </div>
                </div>
              </section>

              {/* PREPARATION */}

              <section className={styles.card}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionLabel}>
                    BEFORE YOUR CHECKUP
                  </span>

                  <h2>Preparation instructions</h2>

                  <p>
                    Preparation requirements depend on the
                    tests included in a package. We will
                    display the instructions provided for the
                    selected package after API integration.
                  </p>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.rowIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </span>

                  <div>
                    <h3>Before your appointment</h3>

                    <p>
                      Confirm package-specific instructions
                      before booking. Any fasting requirements
                      or other preparation details will appear
                      here when available.
                    </p>
                  </div>
                </div>
              </section>

              {/* SAMPLE COLLECTION */}

              <section className={styles.card}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionLabel}>
                    COLLECTION INFORMATION
                  </span>

                  <h2>Sample collection options</h2>

                  <p>
                    Collection options will depend on the
                    selected package and your location.
                  </p>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.rowIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 10 12 3l9 7v11H3V10Z" />
                      <path d="M9 21v-7h6v7" />
                    </svg>
                  </span>

                  <div>
                    <h3>Collection availability</h3>

                    <p>
                      Home sample collection eligibility
                      and other available collection options
                      will be shown after the package data
                      is connected.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}

            <aside
              className={styles.sidebar}
              aria-label="Package booking information"
            >
              <div className={styles.bookingCard}>
                <span className={styles.sectionLabel}>
                  PACKAGE SUMMARY
                </span>

                <h2>Your health package</h2>

                <p className={styles.bookingDescription}>
                  Select a package from the listing page to
                  view its actual details once API integration
                  is complete.
                </p>

                <div className={styles.summaryRows}>
                  <div>
                    <span>Package</span>
                    <strong>To be updated</strong>
                  </div>

                  <div>
                    <span>Included tests</span>
                    <strong>To be updated</strong>
                  </div>

                  <div>
                    <span>Availability</span>
                    <strong>To be updated</strong>
                  </div>
                </div>

                <div className={styles.priceRow}>
                  <span>Package price</span>
                  <strong>To be updated</strong>
                </div>

                <button
                  type="button"
                  className={styles.bookButton}
                  disabled
                >
                  Book Package
                </button>

                <p className={styles.bookingNote}>
                  Booking is not available in this UI preview.
                </p>
              </div>

              <div className={styles.helpCard}>
                <span className={styles.helpIcon}>
                  <HeartIcon />
                </span>

                <h3>Explore more health packages</h3>

                <p>
                  Return to the package listing to explore
                  the available health screening options.
                </p>

                <Link
                  href="/patient/health-packages"
                  className={styles.browseLink}
                >
                  Browse health packages
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}