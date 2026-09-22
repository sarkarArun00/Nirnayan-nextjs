import Link from "next/link";
import styles from "./ServicesSection.module.css";

const services = [
  {
    id: "lab-tests",
    title: "Book a Lab Test",
    description:
      "Explore our range of diagnostic tests and book your appointment online with ease.",
    href: "/patient/test-list",
    linkText: "Explore Tests",
    icon: "test",
  },
  {
    id: "health-packages",
    title: "Health Packages",
    description:
      "Discover preventive health packages designed to support your everyday wellness.",
    href: "/patient/package-list",
    linkText: "View Packages",
    icon: "heart",
  },
  {
    id: "diagnostic-centres",
    title: "Find a Diagnostic Centre",
    description:
      "Find a convenient Nirnayan Healthcare diagnostic centre for your testing needs.",
    href: "/patient/find-center",
    linkText: "Find Centres",
    icon: "location",
  },
] as const;

function ServiceIcon({
  icon,
}: {
  icon: (typeof services)[number]["icon"];
}) {
  switch (icon) {
    case "test":
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

    case "heart":
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
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
          <path d="M4 12h4l2-3 3 6 2-3h5" />
        </svg>
      );

    case "location":
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
}

export default function ServicesSection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="services-heading"
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.badge}>OUR SERVICES</span>

          <h2
            id="services-heading"
            className={styles.heading}
          >
            Healthcare Made <span>Simple</span>
          </h2>

          <p className={styles.description}>
            Explore our diagnostic services and take the next
            step towards better health.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <article
              key={service.id}
              className={styles.serviceCard}
            >
              <div className={styles.iconBox}>
                <ServiceIcon icon={service.icon} />
              </div>

              <h3 className={styles.cardTitle}>
                {service.title}
              </h3>

              <p className={styles.cardDescription}>
                {service.description}
              </p>

              <Link
                href={service.href}
                className={styles.cardLink}
              >
                {service.linkText}

                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}