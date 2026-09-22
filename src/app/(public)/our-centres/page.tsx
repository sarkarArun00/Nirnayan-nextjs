import type { Metadata } from "next";
import Link from "next/link";

import styles from "./OurCentres.module.css";

export const metadata: Metadata = {
  title: "Our Centres | Nirnayan Healthcare",
  description:
    "Explore Nirnayan Healthcare centre information and diagnostic services.",
};

function LocationIcon() {
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
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function SearchIcon() {
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
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function ArrowIcon() {
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
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export default function OurCentresPage() {
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

            <span aria-current="page">Our Centres</span>
          </nav>
        </div>
      </div>

      {/* PAGE BANNER */}

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>
                FIND A CENTRE
              </span>

              <h1>
                Find a Nirnayan Healthcare{" "}
                <span>Centre Near You</span>
              </h1>

              <p className={styles.heroDescription}>
                Explore our centre information and find a
                convenient location for your diagnostic
                testing needs.
              </p>

              <a
                href="#centre-list"
                className={styles.heroButton}
              >
                Explore our centres
                <ArrowIcon />
              </a>
            </div>

            <div
              className={styles.heroIllustration}
              aria-hidden="true"
            >
              <div className={styles.outerCircle}>
                <div className={styles.middleCircle}>
                  <div className={styles.innerCircle}>
                    <LocationIcon />
                  </div>
                </div>
              </div>

              <span className={styles.decorativeDotOne} />
              <span className={styles.decorativeDotTwo} />
              <span className={styles.decorativeDotThree} />
            </div>
          </div>
        </div>
      </section>

      {/* CENTRE FINDER */}

      <section
        id="centre-list"
        className={styles.centresSection}
        aria-labelledby="centres-heading"
      >
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>
              OUR LOCATIONS
            </span>

            <h2 id="centres-heading">
              Explore Our Centres
            </h2>

            <p>
              Search for a centre and view its address,
              contact details, and directions once
              centre data is connected.
            </p>
          </div>

          {/* SEARCH UI PREVIEW */}

          <div className={styles.finderCard}>
            <div className={styles.finderHeader}>
              <div>
                <h3>Find your nearest centre</h3>

                <p>
                  Centre search will be available after
                  API integration.
                </p>
              </div>

              <span className={styles.previewBadge}>
                UI PREVIEW
              </span>
            </div>

            <div className={styles.searchGrid}>
              <div className={styles.field}>
                <label htmlFor="centre-location">
                  City or area
                </label>

                <div className={styles.inputWrapper}>
                  <span
                    className={styles.inputIcon}
                    aria-hidden="true"
                  >
                    <LocationIcon />
                  </span>

                  <input
                    id="centre-location"
                    type="text"
                    placeholder="Search by city or area"
                    disabled
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="centre-name">
                  Centre name
                </label>

                <div className={styles.inputWrapper}>
                  <span
                    className={styles.inputIcon}
                    aria-hidden="true"
                  >
                    <SearchIcon />
                  </span>

                  <input
                    id="centre-name"
                    type="text"
                    placeholder="Search by centre name"
                    disabled
                  />
                </div>
              </div>

              <button
                type="button"
                className={styles.searchButton}
                disabled
              >
                Search Centres
              </button>
            </div>
          </div>

          {/* CENTRE CARD TEMPLATE */}

          <div className={styles.resultsHeading}>
            <div>
              <h3>Centre Information</h3>

              <p>
                Verified centre details will appear here.
              </p>
            </div>
          </div>

          <div className={styles.centreGrid}>
            <article className={styles.centreCard}>
              <div className={styles.cardVisual}>
                <span className={styles.cardVisualIcon}>
                  <LocationIcon />
                </span>

                <span className={styles.templateBadge}>
                  CARD PREVIEW
                </span>
              </div>

              <div className={styles.cardBody}>
                <span className={styles.cardEyebrow}>
                  CENTRE DETAILS
                </span>

                <h4>Centre name will appear here</h4>

                <p className={styles.cardDescription}>
                  The centre address, locality, and contact
                  information will be displayed using your
                  existing backend data.
                </p>

                <div className={styles.cardDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailIcon}>
                      <LocationIcon />
                    </span>

                    <div>
                      <span className={styles.detailLabel}>
                        Address
                      </span>

                      <span className={styles.detailValue}>
                        To be updated
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M8 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 3a14 14 0 0 1-7-7l3-2-2-5Z" />
                      </svg>
                    </span>

                    <div>
                      <span className={styles.detailLabel}>
                        Contact
                      </span>

                      <span className={styles.detailValue}>
                        To be updated
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </span>

                    <div>
                      <span className={styles.detailLabel}>
                        Opening hours
                      </span>

                      <span className={styles.detailValue}>
                        To be updated
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.directionsButton}
                  disabled
                >
                  Get Directions
                  <ArrowIcon />
                </button>

                <p className={styles.cardNote}>
                  Directions will be enabled when a
                  verified centre address is available.
                </p>
              </div>
            </article>

            {/* EMPTY STATE — USED UNTIL REAL DATA IS CONNECTED */}

            <div className={styles.emptyState}>
              <span className={styles.emptyStateIcon}>
                <SearchIcon />
              </span>

              <h4>Centre listings are coming soon</h4>

              <p>
                Once we connect your existing centre API,
                this area will display available centres
                and allow users to search by location.
              </p>

              <span className={styles.emptyStateNote}>
                No centre records are loaded in this UI preview.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BROWSE TESTS CTA */}

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaPanel}>
            <div>
              <span className={styles.eyebrow}>
                DIAGNOSTIC SERVICES
              </span>

              <h2>Looking for a diagnostic test?</h2>

              <p>
                Browse our test catalogue to explore
                the diagnostic tests available for your
                selected location.
              </p>
            </div>

            <Link
              href="/patient/test-list"
              className={styles.ctaButton}
            >
              Explore Diagnostic Tests
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}