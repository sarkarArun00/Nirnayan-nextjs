
import styles from "./WhyChooseUs.module.css";

const benefits = [
  {
    id: "diagnostic-testing",
    title: "Diagnostic Testing",
    description:
      "Explore laboratory tests designed to support your healthcare needs.",
    icon: "test",
  },
  {
    id: "home-collection",
    title: "Home Sample Collection",
    description:
      "Convenient sample collection at your doorstep, subject to service availability.",
    icon: "home",
  },
  {
    id: "health-packages",
    title: "Health Packages",
    description:
      "Discover preventive health screening packages for your wellness needs.",
    icon: "heart",
  },
  {
    id: "online-booking",
    title: "Online Booking",
    description:
      "Browse diagnostic tests and book your appointments online.",
    icon: "calendar",
  },
] as const;

type BenefitIcon = (typeof benefits)[number]["icon"];

function BenefitIcon({ type }: { type: BenefitIcon }) {
  switch (type) {
    case "test":
      return (
        <svg viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true">
          <path d="M9 3h6M10 3v6l-6 8a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-8V3" />
          <path d="M8 15h8" />
        </svg>
      );

    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true">
          <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" />
          <path d="M12 11v7M8.5 14.5h7" />
        </svg>
      );

    case "heart":
      return (
        <svg viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
          <path d="M4 12h4l2-3 3 6 2-3h5" />
        </svg>
      );

    case "calendar":
      return (
        <svg viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4M17 3v4M3 10h18" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      );
  }
}

export default function WhyChooseUs() {
  return (
    <section
      className={styles.section}
      aria-labelledby="why-choose-heading"
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.badge}>
            WHY CHOOSE US
          </span>

          <h2
            id="why-choose-heading"
            className={styles.heading}
          >
            Your Health, <span>Our Commitment</span>
          </h2>

          <p className={styles.description}>
            Making diagnostic healthcare more convenient and
            accessible through services designed around your needs.
          </p>
        </div>

        <div className={styles.grid}>
          {benefits.map((benefit) => (
            <article
              key={benefit.id}
              className={styles.card}
            >
              <div className={styles.iconBox}>
                <BenefitIcon type={benefit.icon} />
              </div>

              <h3 className={styles.cardTitle}>
                {benefit.title}
              </h3>

              <p className={styles.cardDescription}>
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}