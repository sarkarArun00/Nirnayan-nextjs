
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import { getAllTests } from "@/lib/server/get-all-tests";

import type { DiagnosticTest } from "@/types/patient/test.types";

import styles from "./TestList.module.css";
import TestCatalogue from "@/components/tests/TestCatalogue";

export const metadata: Metadata = {
  title: "Diagnostic Tests | Nirnayan Healthcare",
  description:
    "Explore diagnostic tests and laboratory testing options at Nirnayan Healthcare.",
};

/* ========================================
   LOAD LOCATION-SPECIFIC TESTS
======================================== */

async function loadDiagnosticTests(
  locationId: string
): Promise<DiagnosticTest[]> {
  const baseUrl = process.env.LIMS_API_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "Diagnostic test API configuration is missing."
    );
  }

  return getAllTests(baseUrl, {
    state: locationId,
  });
}

/* ========================================
   TEST LIST PAGE
======================================== */

export default async function TestListPage() {
  /*
   * Read the selected location from the cookie.
   *
   * This cookie was created by LocationSelector
   * in the Header.
   */

  const cookieStore = await cookies();

  const selectedLocationId =
    cookieStore.get("nhc_location_id")?.value ?? "";

  /*
   * A state has not been selected if the cookie
   * is missing or does not contain a numeric ID.
   *
   * Never substitute an arbitrary default state.
   */

  const hasSelectedLocation =
    /^\d+$/.test(selectedLocationId);

  let tests: DiagnosticTest[] = [];

  let apiError = "";

  /*
   * Fetch actual diagnostic tests only when
   * a location has been selected.
   */

  if (hasSelectedLocation) {
    try {
      tests = await loadDiagnosticTests(
        selectedLocationId
      );
    } catch (error: unknown) {
      /*
       * Log the technical error on the server.
       * Show a generic message to the user.
       */

      console.error(
        "Unable to load diagnostic tests:",
        error instanceof Error
          ? error.message
          : "Unknown error"
      );

      apiError =
        "Unable to load diagnostic tests. Please try again.";
    }
  }

  return (
    <>
      {/* ========================================
          PAGE BANNER
      ======================================== */}

      <section className={styles.pageBanner}>
        <div className={styles.container}>
          <nav
            className={styles.breadcrumb}
            aria-label="Breadcrumb"
          >
            <Link href="/">Home</Link>

            <span aria-hidden="true">/</span>

            <span aria-current="page">
              Diagnostic Tests
            </span>
          </nav>

          <h1 className={styles.pageTitle}>
            Explore Diagnostic <span>Tests</span>
          </h1>

          <p className={styles.pageDescription}>
            Find diagnostic tests and explore options
            for your healthcare needs.
          </p>
        </div>
      </section>

      {/* ========================================
          DIAGNOSTIC TEST LISTING
      ======================================== */}

      <section
        className={styles.testSection}
        aria-labelledby="test-list-heading"
      >
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>
                DIAGNOSTIC SERVICES
              </span>

              <h2
                id="test-list-heading"
                className={styles.sectionTitle}
              >
                Available Diagnostic Tests
              </h2>

              <p className={styles.sectionDescription}>
                Browse our test catalogue and find
                the right testing options for your needs.
              </p>
            </div>
          </div>

          {/* ========================================
              LOCATION NOT SELECTED
          ======================================== */}

          {!hasSelectedLocation && (
            <div className={styles.catalogue}>
              <div className={styles.emptyState}>
                <div
                  className={styles.emptyIcon}
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
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </div>

                <h3 className={styles.emptyTitle}>
                  Select Your Location
                </h3>

                <p className={styles.emptyDescription}>
                  Please select your state from the
                  location dropdown in the Header
                  to view available diagnostic tests.
                </p>
              </div>
            </div>
          )}

          {/* ========================================
              API ERROR
          ======================================== */}

          {hasSelectedLocation && apiError && (
            <div className={styles.catalogue}>
              <div
                className={styles.emptyState}
                role="alert"
              >
                <h3 className={styles.emptyTitle}>
                  Unable to Load Tests
                </h3>

                <p className={styles.emptyDescription}>
                  {apiError}
                </p>
              </div>
            </div>
          )}

          {/* ========================================
              NO TESTS AVAILABLE
          ======================================== */}

          {hasSelectedLocation &&
            !apiError &&
            tests.length === 0 && (
              <div className={styles.catalogue}>
                <div className={styles.emptyState}>
                  <h3 className={styles.emptyTitle}>
                    No Diagnostic Tests Available
                  </h3>

                  <p className={styles.emptyDescription}>
                    No diagnostic tests were returned
                    for your selected location.
                    You can select another state
                    from the Header.
                  </p>
                </div>
              </div>
            )}

          {/* ========================================
              ACTUAL DIAGNOSTIC TESTS
          ======================================== */}

        {hasSelectedLocation &&
          !apiError &&
          tests.length > 0 && (
            <TestCatalogue tests={tests} />
          )}
        </div>
      </section>
    </>
  );
}