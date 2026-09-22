import Link from "next/link";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    number: "01",
    title: "Find Your Test",
    description:
      "Explore diagnostic tests and preventive health packages to find what you need.",
    icon: "search",
  },
  {
    number: "02",
    title: "Book Your Test",
    description:
      "Select your preferred tests and proceed through the online booking process.",
    icon: "calendar",
  },
  {
    number: "03",
    title: "Manage Your Booking",
    description:
      "Access your booking information and manage your healthcare from your account.",
    icon: "report",
  },
] as const;

type StepIconType = (typeof steps)[number]["icon"];

function StepIcon({ type }: { type: StepIconType }) {
  switch (type) {
    case "search":
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

    case "calendar":
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
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
          />
          <path d="M7 3v4M17 3v4M3 10h18" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      );

    case "report":
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
          <rect
            x="5"
            y="3"
            width="14"
            height="18"
            rx="2"
          />
          <path d="M9 8h6M9 12h6M9 16h3" />
          <path d="m14 16 2 2 3-4" />
        </svg>
      );
  }
}

export default function HowItWorks() {
  return (
    <section
      className={styles.section}
      aria-labelledby="how-it-works-heading"
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.badge}>
            HOW IT WORKS
          </span>

          <h2
            id="how-it-works-heading"
            className={styles.heading}
          >
            Healthcare Booking{" "}
            <span>Made Easy</span>
          </h2>

          <p className={styles.description}>
            Discover tests, complete your booking and manage
            your healthcare in a few simple steps.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <article
              key={step.number}
              className={styles.stepCard}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>
                  <StepIcon type={step.icon} />
                </div>

                <span className={styles.stepNumber}>
                  {step.number}
                </span>
              </div>

              <span className={styles.stepLabel}>
                STEP {step.number}
              </span>

              <h3 className={styles.cardTitle}>
                {step.title}
              </h3>

              <p className={styles.cardDescription}>
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className={styles.bottomAction}>
          <Link
            href="/patient/test-list"
            className={styles.bookButton}
          >
            Explore Diagnostic Tests

            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}