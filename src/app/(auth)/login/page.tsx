import type { Metadata } from "next";
import Link from "next/link";

import styles from "./Login.module.css";

export const metadata: Metadata = {
  title: "Login | Nirnayan Healthcare",
  description: "Login page for Nirnayan Healthcare.",
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

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* LEFT BRAND PANEL */}

        <aside className={styles.brandPanel}>
          <div className={styles.brandPanelContent}>
            <Link href="/" className={styles.brandLink}>
              <span className={styles.brandMark}>
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
                Your health journey,{" "}
                <span>all in one place.</span>
              </h1>

              <p>
                Access your healthcare account through a
                simple, convenient experience.
              </p>
            </div>

            <div className={styles.brandIllustration}>
              <span className={styles.illustrationRing}>
                <HealthIcon />
              </span>

              <span className={styles.illustrationDotOne} />
              <span className={styles.illustrationDotTwo} />
            </div>

            <p className={styles.brandFooter}>
              © Nirnayan Healthcare
            </p>
          </div>
        </aside>

        {/* RIGHT LOGIN PANEL */}

        <main className={styles.formPanel}>
          <div className={styles.mobileBrand}>
            <Link href="/" className={styles.mobileBrandLink}>
              <span className={styles.mobileBrandIcon}>
                <HealthIcon />
              </span>

              <span>Nirnayan Healthcare</span>
            </Link>
          </div>

          <div className={styles.formContainer}>
            <Link href="/" className={styles.backLink}>
              <span aria-hidden="true">←</span>
              Back to home
            </Link>

            <div className={styles.heading}>
              <span className={styles.welcomeBadge}>
                WELCOME BACK
              </span>

              <h2>Login to your account</h2>

              <p>
                Enter your details to continue to your
                healthcare account.
              </p>
            </div>

            {/* UI PREVIEW: NO AUTHENTICATION SUBMISSION */}

            <div className={styles.loginForm}>
              <div className={styles.field}>
                <label htmlFor="login-identifier">
                  Email or mobile number
                </label>

                <input
                  id="login-identifier"
                  type="text"
                  name="identifier"
                  placeholder="Enter your email or mobile number"
                  autoComplete="username"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="login-password">
                  Password
                </label>

                <input
                  id="login-password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>

              <p className={styles.formNote}>
                Login fields and authentication method will
                be confirmed against your existing Angular
                application before API integration.
              </p>

              <button
                type="button"
                className={styles.loginButton}
                disabled
              >
                Login
                <span aria-hidden="true">→</span>
              </button>

              <p className={styles.disabledNote}>
                Login will be enabled after authentication
                integration.
              </p>
            </div>

            <div className={styles.signupSection}>
              <p>
                New to Nirnayan Healthcare?{" "}
                <Link href="/signup">
                  Create an account
                </Link>
              </p>
            </div>

            <div className={styles.formFooter}>
              <p>
                By continuing, you will be subject to the
                applicable account terms and privacy policy.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}