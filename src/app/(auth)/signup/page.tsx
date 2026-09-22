import type { Metadata } from "next";
import Link from "next/link";

import styles from "./Signup.module.css";

export const metadata: Metadata = {
  title: "Create Account | Nirnayan Healthcare",
  description:
    "Create your Nirnayan Healthcare account.",
};

function HealthIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M32 55S8 40 8 22a13 13 0 0 1 24-7 13 13 0 0 1 24 7C56 40 32 55 32 55Z" />
      <path d="M14 30h11l5-9 7 18 5-9h8" />
    </svg>
  );
}

export default function SignupPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* LEFT BRAND PANEL */}

        <aside className={styles.brandPanel}>
          <div className={styles.brandContent}>
            <Link href="/" className={styles.brandLink}>
              <span className={styles.brandIcon}>
                <HealthIcon />
              </span>

              <span className={styles.brandName}>
                Nirnayan
                <span>Healthcare</span>
              </span>
            </Link>

            <div className={styles.brandMessage}>
              <span className={styles.eyebrow}>
                YOUR HEALTHCARE EXPERIENCE
              </span>

              <h1>
                Your health journey{" "}
                <span>starts here.</span>
              </h1>

              <p>
                Create an account to get started with
                your Nirnayan Healthcare experience.
              </p>
            </div>

            <div
              className={styles.brandIllustration}
              aria-hidden="true"
            >
              <div className={styles.illustrationInner}>
                <HealthIcon />
              </div>
            </div>

            <p className={styles.brandFooter}>
              © Nirnayan Healthcare
            </p>
          </div>
        </aside>

        {/* RIGHT SIGN UP PANEL */}

        <main className={styles.formPanel}>
          <div className={styles.formContainer}>
            <Link href="/" className={styles.backLink}>
              <span aria-hidden="true">←</span>
              Back to home
            </Link>

            <div className={styles.mobileBrand}>
              <span className={styles.mobileBrandIcon}>
                <HealthIcon />
              </span>

              <span>Nirnayan Healthcare</span>
            </div>

            <div className={styles.heading}>
              <span className={styles.welcomeBadge}>
                GET STARTED
              </span>

              <h2>Create your account</h2>

              <p>
                Enter your details to begin your
                healthcare journey.
              </p>
            </div>

            {/* UI PREVIEW — NO REGISTRATION REQUEST YET */}

            <div className={styles.signupForm}>
              <div className={styles.nameGrid}>
                <div className={styles.field}>
                  <label htmlFor="signup-first-name">
                    First name
                  </label>

                  <input
                    id="signup-first-name"
                    name="first_name"
                    type="text"
                    placeholder="First name"
                    autoComplete="given-name"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="signup-last-name">
                    Last name
                  </label>

                  <input
                    id="signup-last-name"
                    name="last_name"
                    type="text"
                    placeholder="Last name"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="signup-email">
                  Email address
                </label>

                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="signup-mobile">
                  Mobile number
                </label>

                <input
                  id="signup-mobile"
                  name="mobileNumber"
                  type="tel"
                  placeholder="Enter your mobile number"
                  autoComplete="tel"
                />
              </div>

              <p className={styles.formNote}>
                Registration submission and verification
                will be enabled after we connect your
                existing B2C authentication API.
              </p>

              <button
                type="button"
                className={styles.submitButton}
                disabled
              >
                Create Account
                <span aria-hidden="true">→</span>
              </button>

              <p className={styles.disabledNote}>
                Registration is not available in this UI preview.
              </p>
            </div>

            <div className={styles.loginSection}>
              <p>
                Already have an account?{" "}
                <Link href="/login">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}