import Link from "next/link";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.container}>
        {/* Left: Hero content */}

        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            Your Health, Our Priority
          </span>

          <h1 id="hero-title" className={styles.title}>
            Your Health Deserves
            <span> the Best Care.</span>
          </h1>

          <p className={styles.description}>
            Book diagnostic tests, explore preventive health
            packages, and take the next step towards better
            health with Nirnayan Healthcare.
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
            </Link>
          </div>

          <div className={styles.feature}>
            <span
              className={styles.featureIcon}
              aria-hidden="true"
            >
              ✓
            </span>

            <span>
              Convenient home sample collection
            </span>
          </div>
        </div>

        {/* Right: Healthcare visual */}

        <div className={styles.heroVisual}>
          <div className={styles.visualBackground}>
            <div
              className={styles.decorativeCircle}
              aria-hidden="true"
            />

            <div className={styles.healthcareCard}>
              <div className={styles.healthcareIcon}>
                <svg
                  width="78"
                  height="78"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="10"
                    y="10"
                    width="60"
                    height="60"
                    rx="18"
                    fill="#EAF7EE"
                  />

                  <path
                    d="M40 23V57M23 40H57"
                    stroke="#16803C"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span className={styles.visualBadge}>
                Nirnayan Healthcare
              </span>

              <h2 className={styles.visualTitle}>
                Healthcare Made Simple
              </h2>

              <p className={styles.visualDescription}>
                Your diagnostic testing journey starts here.
              </p>

              <div className={styles.visualDivider} />

              <div className={styles.visualFeature}>
                <span className={styles.checkIcon}>
                  ✓
                </span>

                <span>Diagnostic Tests</span>
              </div>

              <div className={styles.visualFeature}>
                <span className={styles.checkIcon}>
                  ✓
                </span>

                <span>Health Packages</span>
              </div>

              <div className={styles.visualFeature}>
                <span className={styles.checkIcon}>
                  ✓
                </span>

                <span>Home Sample Collection</span>
              </div>
            </div>

            <div className={styles.floatingCard}>
              <span className={styles.floatingIcon}>
                ♡
              </span>

              <div>
                <strong>Care at Every Step</strong>
                <span>Your health comes first</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}