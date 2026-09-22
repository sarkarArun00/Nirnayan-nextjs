import { notFound } from "next/navigation";

import TestDetailsPage from "../../page";
import styles from "./DynamicTestDetails.module.css";
import detailsStyles from "../../TestDetails.module.css";

interface PageProps {
  params: Promise<{
    id: string;
    testname: string;
  }>;
}

export default async function DynamicTestDetailsPage({
  params,
}: Readonly<PageProps>) {
  const { id, testname } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const displayName = testname.replace(/-/g, " ");

  return (
  <>
    {/* SELECTED TEST INFORMATION */}

    <section className={styles.testInfoBanner}>
      <div className={styles.container}>
        <div className={styles.testInfoCard}>
          <div className={styles.testInfo}>
            <span className={styles.label}>
              Selected Diagnostic Test
            </span>

            <h1 className={styles.testName}>
              {displayName}
            </h1>
          </div>

          <span className={styles.testId}>
            Test ID: {id}
          </span>
        </div>
      </div>
    </section>

    {/* TEST DETAILS CONTENT */}

    <section className={detailsStyles.main}>
      <div className={detailsStyles.container}>
        <div className={detailsStyles.layout}>
          <div className={detailsStyles.content}>
            <section className={detailsStyles.card}>
              <div className={detailsStyles.sectionHeading}>
                <span className={detailsStyles.sectionTag}>
                  TEST OVERVIEW
                </span>

                <h2>About this test</h2>
              </div>

              <p className={detailsStyles.bodyText}>
                The selected test&apos;s description and other
                information will appear here when the Details
                API is connected.
              </p>
            </section>

            {/* Add your preparation, sample collection,
                and parameters sections here. */}
          </div>

          <aside className={detailsStyles.sidebar}>
            <div className={detailsStyles.bookingCard}>
              <span className={detailsStyles.bookingLabel}>
                TEST BOOKING
              </span>

              <h2>Book your diagnostic test</h2>

              <div className={detailsStyles.priceBox}>
                <span>Test price</span>
                <strong>To be updated</strong>
              </div>

              <button
                type="button"
                className={detailsStyles.bookButton}
                disabled
              >
                Book Test
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </>
);
}