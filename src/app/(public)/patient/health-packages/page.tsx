import type { Metadata } from "next";
import Link from "next/link";

import styles from "./HealthPackages.module.css";

export const metadata: Metadata = {
  title: "Health Packages | Nirnayan Healthcare",
  description:
    "Explore health package information at Nirnayan Healthcare.",
};

/*
 * UI preview content only.
 *
 * These are illustrative card titles and descriptions,
 * NOT packages retrieved from the Nirnayan backend.
 */
const previewPackages = [
  {
    id: "essential",
    label: "EVERYDAY WELLNESS",
    name: "Essential Wellness",
    description:
      "A space to introduce an entry-level health package and explain its purpose once actual package details are available.",
    icon: "heart",
  },
  {
    id: "lifestyle",
    label: "PREVENTIVE CARE",
    name: "Lifestyle Screening",
    description:
      "A space to describe a preventive screening package using information provided by the existing backend.",
    icon: "activity",
  },
  {
    id: "comprehensive",
    label: "HEALTH MONITORING",
    name: "Comprehensive Wellness",
    description:
      "A space to present a broader health package, its included tests, and preparation guidance after API integration.",
    icon: "shield",
  },
] as const;

function PackageIcon({
  icon,
}: {
  icon: "heart" | "activity" | "shield";
}) {
  if (icon === "activity") {
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
        <path d="M3 12h4l3-7 4 14 3-7h4" />
      </svg>
    );
  }

  if (icon === "shield") {
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
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

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
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

export default function HealthPackagesPage() {
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
            <span aria-current="page">Health Packages</span>
          </nav>
        </div>
      </div>

      {/* PAGE BANNER */}

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              HEALTH & WELLNESS
            </span>

            <h1>
              Explore Health <span>Packages</span>
            </h1>

            <p className={styles.heroDescription}>
              Discover health screening options in one place.
              Package details and availability will appear here
              when the existing backend is connected.
            </p>

            <div className={styles.heroActions}>
              <a
                href="#packages"
                className={styles.primaryLink}
              >
                Explore packages
                <span aria-hidden="true">↓</span>
              </a>

              <Link
                href="/patient/test-list"
                className={styles.secondaryLink}
              >
                Browse individual tests
              </Link>
            </div>

            <p className={styles.previewNotice}>
              UI preview only — package data and booking are not
              connected yet.
            </p>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.visualCircle}>
              <svg
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M50 86S18 67 18 42a18 18 0 0 1 32-11 18 18 0 0 1 32 11C82 67 50 86 50 86Z" />
                <path d="M25 51h15l7-13 8 25 6-12h14" />
              </svg>
            </div>
            <span className={styles.visualDotOne} />
            <span className={styles.visualDotTwo} />
          </div>
        </div>
      </section>

      {/* PACKAGE LISTING */}

      <section
        id="packages"
        className={styles.packagesSection}
        aria-labelledby="packages-heading"
      >
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>
                EXPLORE YOUR OPTIONS
              </span>

              <h2 id="packages-heading">
                Find a package for your needs
              </h2>

              <p>
                These sample cards demonstrate the page layout.
                Actual package names, tests, and prices will come
                from your existing API.
              </p>
            </div>

            <span className={styles.sampleBadge}>
              Sample cards
            </span>
          </div>

          <div className={styles.packageGrid}>
            {previewPackages.map((item) => (
              <article
                key={item.id}
                className={styles.packageCard}
              >
                <div className={styles.cardTop}>
                  <span className={styles.cardIcon}>
                    <PackageIcon icon={item.icon} />
                  </span>

                  <span className={styles.cardLabel}>
                    {item.label}
                  </span>
                </div>

                <h3>{item.name}</h3>

                <p className={styles.cardDescription}>
                  {item.description}
                </p>

                <div className={styles.cardDetails}>
                  <div>
                    <span>Included tests</span>
                    <strong>To be updated</strong>
                  </div>

                  <div>
                    <span>Package price</span>
                    <strong>To be updated</strong>
                  </div>
                </div>

                <Link
                    href="/patient/health-packages/details"
                    className={styles.cardButton}
                    >
                    View Package Details
                    <span aria-hidden="true">→</span>
                    </Link>

                <p className={styles.cardNote}>
                  Available after API integration
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INFORMATION SECTION */}

      <section className={styles.infoSection}>
        <div className={styles.container}>
          <div className={styles.infoPanel}>
            <div>
              <span className={styles.eyebrow}>
                NEED A SPECIFIC TEST?
              </span>

              <h2>Looking for an individual diagnostic test?</h2>

              <p>
                You can browse the diagnostic test catalogue
                separately while we prepare the Health Packages
                integration.
              </p>
            </div>

            <Link
              href="/patient/test-list"
              className={styles.primaryLink}
            >
              Explore diagnostic tests
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}