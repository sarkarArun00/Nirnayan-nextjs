import type { DiagnosticTest } from "@/types/patient/test.types";

import styles from "./TestCard.module.css";
import Link from "next/link";


function createTestSlug(name: string): string {
  return (
    name
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "test"
  );
}

export interface TestCardProps {
  test: DiagnosticTest;
}

function formatMrp(
  amount: string | null | undefined
): string | null {
  if (amount == null || amount.trim() === "") {
    return null;
  }

  const numericAmount = Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount < 0
  ) {
    return null;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export default function TestCard({
  test,
}: Readonly<TestCardProps>) {
  const mrp = formatMrp(test.mrpAmount);

  const description = test.description?.trim();

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div
          className={styles.iconBox}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 3h6M10 3v6l-5.6 8.4A2 2 0 0 0 6.1 20h11.8a2 2 0 0 0 1.7-2.6L14 9V3" />
            <path d="M8 15h8" />
          </svg>
        </div>

        <span className={styles.category}>
          {typeof test.category_id === "number"
            ? `Category ID ${test.category_id}`
            : "Diagnostic Test"}
        </span>
      </div>

      <Link
        href={`/patient/test-details/${test.id}/${createTestSlug(
          test.test_name
        )}`}
        className={styles.testNameLink}
      >
        <h3 className={styles.testName}>
          {test.test_name}
        </h3>
      </Link>

      {description && (
        <p className={styles.description}>
          {description}
        </p>
      )}

      <div className={styles.cardFooter}>
        <div className={styles.priceInfo}>
          <span className={styles.priceLabel}>
            MRP
          </span>

          <span className={styles.priceValue}>
            {mrp ?? "Not available"}
          </span>
        </div>

        <span className={styles.demoBadge}>
          {test.test_code}
        </span>
      </div>
    </article>
  );
}