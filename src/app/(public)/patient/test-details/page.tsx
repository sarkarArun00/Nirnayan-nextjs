import type { Metadata } from "next";
import Link from "next/link";

import styles from "./TestDetails.module.css";

export const metadata: Metadata = {
  title: "Test Details | Nirnayan Healthcare",
  description:
    "Explore diagnostic test information at Nirnayan Healthcare.",
};

export default function TestDetailsPage() {
  return (
    <div className={styles.page}>
      {/* BREADCRUMB */}

      <div className={styles.breadcrumbSection}>
        <div className={styles.container}>
          <nav
            className={styles.breadcrumb}
            aria-label="Breadcrumb"
          >
            <Link href="/">Home</Link>

            <span aria-hidden="true">/</span>

            <Link href="/patient/test-list">
              Diagnostic Tests
            </Link>

            <span aria-hidden="true">/</span>

            <span aria-current="page">
              Test Details
            </span>
          </nav>
        </div>
      </div>

      {/* PAGE HEADER */}

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div
              className={styles.heroIcon}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 3h6M10 3v6l-5.6 8.4A2 2 0 0 0 6.1 20h11.8a2 2 0 0 0 1.7-2.6L14 9V3" />
                <path d="M8 15h8" />
              </svg>
            </div>

            <div>
              <span className={styles.eyebrow}>
                DIAGNOSTIC SERVICES
              </span>

              <h1 className={styles.pageTitle}>
                Diagnostic Test Details
              </h1>

              <p className={styles.heroDescription}>
                View test information, preparation
                instructions, sample collection options,
                and pricing in one place.
              </p>

              <span className={styles.previewBadge}>
                UI preview — test data not connected yet
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.layout}>
            {/* LEFT COLUMN */}

            <div className={styles.content}>
              {/* TEST OVERVIEW */}

              <section className={styles.card}>
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionTag}>
                    TEST OVERVIEW
                  </span>

                  <h2>About this test</h2>
                </div>

                <p className={styles.bodyText}>
                  The test name, code, description, and
                  other information will appear here once
                  the Test Details API is connected.
                </p>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      Test code
                    </span>
                    <strong>To be updated</strong>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      Availability
                    </span>
                    <strong>To be updated</strong>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      Report turnaround time
                    </span>
                    <strong>To be updated</strong>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      Home sample collection
                    </span>
                    <strong>To be updated</strong>
                  </div>
                </div>
              </section>

              {/* PREPARATION */}

              <section className={styles.card}>
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionTag}>
                    BEFORE YOUR TEST
                  </span>

                  <h2>Test preparation</h2>
                </div>

                <div className={styles.detailRow}>
                  <div
                    className={styles.detailIcon}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 3v9l4 2" />
                    </svg>
                  </div>

                  <div>
                    <h3>Preparation instructions</h3>

                    <p>
                      Test-specific preparation information
                      will be displayed here after API
                      integration. Please confirm any
                      requirements before booking.
                    </p>
                  </div>
                </div>
              </section>

              {/* SAMPLE COLLECTION */}

              <section className={styles.card}>
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionTag}>
                    COLLECTION OPTIONS
                  </span>

                  <h2>Sample collection</h2>
                </div>

                <div className={styles.detailRow}>
                  <div
                    className={styles.detailIcon}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 10.5 12 3l9 7.5V21H3z" />
                      <path d="M9 21v-7h6v7" />
                    </svg>
                  </div>

                  <div>
                    <h3>Collection information</h3>

                    <p>
                      Available collection options and
                      sample requirements will appear here
                      for the selected test and location.
                    </p>
                  </div>
                </div>
              </section>

              {/* TEST PARAMETERS */}

              <section className={styles.card}>
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionTag}>
                    TEST INFORMATION
                  </span>

                  <h2>Parameters included</h2>
                </div>

                <p className={styles.bodyText}>
                  The list of parameters, when provided
                  by the backend, will appear here.
                </p>
              </section>
            </div>

            {/* RIGHT COLUMN */}

            <aside
              className={styles.sidebar}
              aria-label="Test booking summary"
            >
              <div className={styles.bookingCard}>
                <span className={styles.bookingLabel}>
                  TEST BOOKING
                </span>

                <h2>Book your diagnostic test</h2>

                <p className={styles.bookingDescription}>
                  Test pricing and booking options will
                  be available after API integration.
                </p>

                <div className={styles.priceBox}>
                  <span>Test price</span>
                  <strong>To be updated</strong>
                </div>

                <button
                  type="button"
                  className={styles.bookButton}
                  disabled
                >
                  Book Test
                </button>

                <p className={styles.bookingNote}>
                  Booking is not available in this UI preview.
                </p>
              </div>

              <div className={styles.helpCard}>
                <span
                  className={styles.helpIcon}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4" />
                    <path d="M12 17h.01" />
                  </svg>
                </span>

                <div>
                  <h3>Looking for another test?</h3>

                  <p>
                    Explore the available diagnostic tests
                    for your selected location.
                  </p>

                  <Link
                    href="/patient/test-list"
                    className={styles.browseLink}
                  >
                    Browse all tests{" "}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}