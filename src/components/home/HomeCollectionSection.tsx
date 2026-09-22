
import Link from "next/link";
import styles from "./HomeCollectionSection.module.css";

export default function HomeCollectionSection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="home-collection-title"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>
            HOME SAMPLE COLLECTION
          </span>

          <h2
            id="home-collection-title"
            className={styles.title}
          >
            Healthcare at Your{" "}
            <span>Doorstep.</span>
          </h2>

          <p className={styles.description}>
            Explore diagnostic tests and convenient home sample
            collection options with Nirnayan Healthcare.
          </p>

          <p className={styles.availability}>
            Home collection is subject to service availability
            in your area.
          </p>

          <div className={styles.actions}>
            <Link
              href="/patient/test-list"
              className={styles.primaryButton}
            >
              Book a Test
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/patient/find-center"
              className={styles.secondaryButton}
            >
              Find a Centre
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.visualCircle} aria-hidden="true" />

          <div className={styles.visualCard}>
            <div className={styles.iconBox}>
              <svg
                viewBox="0 0 80 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 38 40 14l30 24v29H10V38Z" />
                <path d="M32 67V48h16v19" />
                <path d="M40 24v15M32.5 31.5h15" />
              </svg>
            </div>

            <h3 className={styles.cardTitle}>
              Care That Comes to You
            </h3>

            <p className={styles.cardDescription}>
              Explore a convenient way to arrange your
              diagnostic testing.
            </p>

            <div className={styles.cardFooter}>
              <span className={styles.statusDot} />
              Explore home collection options
            </div>
          </div>

          <div className={styles.floatingBadge}>
            <span className={styles.floatingIcon} aria-hidden="true">
              ✓
            </span>

            <div>
              <strong>Simple Online Booking</strong>
              <span>Explore tests at your convenience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}