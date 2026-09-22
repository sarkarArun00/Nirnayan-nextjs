
import Link from "next/link";
import styles from "./BookingCTA.module.css";

export default function BookingCTA() {
  return (
    <section
      className={styles.section}
      aria-labelledby="booking-cta-title"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>
            YOUR HEALTH MATTERS
          </span>

          <h2
            id="booking-cta-title"
            className={styles.title}
          >
            Take the Next Step Towards
            <span> Better Health</span>
          </h2>

          <p className={styles.description}>
            Explore diagnostic tests and preventive health
            packages designed around your healthcare needs.
            Start your healthcare journey with Nirnayan
            Healthcare today.
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
              href="/patient/package-list"
              className={styles.secondaryButton}
            >
              Explore Packages
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className={styles.decoration} aria-hidden="true">
          <span className={styles.circleOne} />
          <span className={styles.circleTwo} />
          <span className={styles.circleThree} />

          <svg
            className={styles.heartIcon}
            viewBox="0 0 120 120"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M60 105 18 63C-6 39 30 3 60 36 90 3 126 39 102 63L60 105Z"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinejoin="round"
            />

            <path
              d="M17 65h24l10-17 15 32 12-21h25"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}