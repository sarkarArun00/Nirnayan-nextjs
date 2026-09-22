import type { Metadata } from "next";
import Link from "next/link";

import styles from "./AboutUs.module.css";

export const metadata: Metadata = {
  title: "About Us | Nirnayan Healthcare",
  description:
    "Learn more about Nirnayan Healthcare and explore our diagnostic services, health packages, and centres.",
};

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

function HeartIcon() {
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
      <path d="M4 12h5l2-3 3 6 2-3h4" />
    </svg>
  );
}

function FlaskIcon() {
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
      <path d="M9 3h6M10 3v6l-5.6 8.4A2 2 0 0 0 6.1 20h11.8a2 2 0 0 0 1.7-2.6L14 9V3" />
      <path d="M8 15h8" />
    </svg>
  );
}

function LocationIcon() {
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
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

const exploreLinks = [
  {
    title: "Diagnostic Tests",
    description:
      "Explore individual diagnostic tests available for your selected location.",
    href: "/patient/test-list",
    icon: <FlaskIcon />,
  },
  {
    title: "Health Packages",
    description:
      "Browse health package information and available screening options.",
    href: "/patient/health-packages",
    icon: <HeartIcon />,
  },
  {
    title: "Our Centres",
    description:
      "Visit our centres page to explore location information.",
    href: "/our-centres",
    icon: <LocationIcon />,
  },
];

export default function AboutUsPage() {
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

            <span aria-current="page">About Us</span>
          </nav>
        </div>
      </div>

      {/* HERO */}

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>
                ABOUT NIRNAYAN HEALTHCARE
              </span>

              <h1>
                Healthcare information,
                <span> thoughtfully presented.</span>
              </h1>

              <p className={styles.heroDescription}>
                Welcome to Nirnayan Healthcare. Explore
                our diagnostic services, health packages,
                and centre information through one
                convenient website.
              </p>

              <div className={styles.heroActions}>
                <Link
                  href="/patient/test-list"
                  className={styles.primaryButton}
                >
                  Explore Diagnostic Tests
                  <ArrowIcon />
                </Link>

                <Link
                  href="/our-centres"
                  className={styles.secondaryButton}
                >
                  View Our Centres
                </Link>
              </div>
            </div>

            {/* Decorative illustration; no company photograph or
                unverified facility imagery is implied. */}

            <div
              className={styles.heroVisual}
              aria-hidden="true"
            >
              <div className={styles.visualOuter}>
                <div className={styles.visualInner}>
                  <HeartIcon />
                </div>
              </div>

              <span className={styles.visualDotOne} />
              <span className={styles.visualDotTwo} />

              <div className={styles.visualCaption}>
                <span className={styles.visualCaptionIcon}>
                  <FlaskIcon />
                </span>

                <span>
                  <strong>Nirnayan Healthcare</strong>
                  <small>Diagnostic services</small>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT INTRODUCTION */}

      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div className={styles.introHeading}>
              <span className={styles.eyebrow}>
                GET TO KNOW US
              </span>

              <h2>
                Learn more about
                <span> Nirnayan Healthcare</span>
              </h2>
            </div>

            <div className={styles.introText}>
              <p>
                This section will introduce Nirnayan
                Healthcare, its background, and the people
                it serves.
              </p>

              <p>
                We will replace this introductory placeholder
                with your approved company description before
                publishing the About Us page.
              </p>

              <span className={styles.contentNotice}>
                Company profile content pending approval
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH SECTION */}

      <section className={styles.approachSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>
              OUR WEBSITE EXPERIENCE
            </span>

            <h2>
              Explore healthcare services
              <span> with ease</span>
            </h2>

            <p>
              Find the information you need through
              the different sections of our website.
            </p>
          </div>

          <div className={styles.approachGrid}>
            <article className={styles.approachCard}>
              <span className={styles.approachIcon}>
                <FlaskIcon />
              </span>

              <h3>Explore diagnostic tests</h3>

              <p>
                Browse test names, descriptions,
                and available information for
                your selected location.
              </p>
            </article>

            <article className={styles.approachCard}>
              <span className={styles.approachIcon}>
                <HeartIcon />
              </span>

              <h3>Discover health packages</h3>

              <p>
                Visit our package catalogue to explore
                health screening options and their
                details as they become available.
              </p>
            </article>

            <article className={styles.approachCard}>
              <span className={styles.approachIcon}>
                <LocationIcon />
              </span>

              <h3>Find centre information</h3>

              <p>
                Use our centres page to find location
                information once the centre directory
                is connected.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* COMPANY PROFILE PLACEHOLDER */}

      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyPanel}>
            <div className={styles.storyIllustration} aria-hidden="true">
              <div className={styles.storyIcon}>
                <HeartIcon />
              </div>
            </div>

            <div className={styles.storyContent}>
              <span className={styles.eyebrow}>
                OUR STORY
              </span>

              <h2>
                The story behind
                <span> Nirnayan Healthcare</span>
              </h2>

              <p>
                Your approved company history, mission,
                and vision will appear here.
              </p>

              <p>
                We have intentionally left out founding
                dates, milestones, accreditations, and
                service statistics until those details
                are supplied and verified.
              </p>

              <span className={styles.contentNotice}>
                Approved company content to be added
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE LINKS */}

      <section className={styles.exploreSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>
              EXPLORE OUR WEBSITE
            </span>

            <h2>
              Where would you
              <span> like to go next?</span>
            </h2>

            <p>
              Continue to the section that matches
              what you are looking for.
            </p>
          </div>

          <div className={styles.exploreGrid}>
            {exploreLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.exploreCard}
              >
                <span className={styles.exploreIcon}>
                  {item.icon}
                </span>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <span className={styles.exploreArrow}>
                  Explore
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaPanel}>
            <div>
              <span className={styles.eyebrow}>
                DIAGNOSTIC SERVICES
              </span>

              <h2>Explore our diagnostic test catalogue</h2>

              <p>
                Select your location and browse the diagnostic
                tests currently available through the website.
              </p>
            </div>

            <Link
              href="/patient/test-list"
              className={styles.primaryButton}
            >
              Browse Tests
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}