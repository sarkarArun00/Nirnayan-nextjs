import type {Metadata} from 'next';
import styles from './privacy-policy.module.css';

/**
 * IMPORTANT BEFORE PUBLICATION:
 * 1. Verify LEGAL_ENTITY matches the organization operating the app.
 * 2. Replace PRIVACY_EMAIL and BUSINESS_ADDRESS with accurate contact details.
 * 3. Confirm each data handling/permission/retention statement matches the
 *    actual Android/iOS app, backend, hosting providers, and Data safety form.
 */
const APP_NAME = 'Nirvanic Petals';
const LEGAL_ENTITY = 'Nirnayan Health Care Private Limited';
const PRIVACY_EMAIL = 'REPLACE_WITH_OFFICIAL_PRIVACY_EMAIL';
const BUSINESS_ADDRESS = 'REPLACE_WITH_VERIFIED_BUSINESS_ADDRESS';
const LAST_UPDATED = '26 November 2026';

const sections = [
  {id: 'about', label: 'About this policy'},
  {id: 'information', label: 'Information we process'},
  {id: 'purposes', label: 'How we use information'},
  {id: 'permissions', label: 'Device permissions'},
  {id: 'sharing', label: 'Who can access information'},
  {id: 'security', label: 'Data security'},
  {id: 'retention', label: 'Retention & deletion'},
  {id: 'choices', label: 'Your choices & rights'},
  {id: 'updates', label: 'Policy updates'},
  {id: 'contact', label: 'Contact us'},
] as const;

export const metadata: Metadata = {
  title: `${APP_NAME} | Privacy Policy`,
  description:
    `Learn how ${APP_NAME} handles account, plant inventory, propagation, and media information.`,
  robots: {index: true, follow: true},
};

export default function PrivacyPolicyPage() {
  const contactConfigured = PRIVACY_EMAIL.includes('@') &&
    !PRIVACY_EMAIL.includes('REPLACE_WITH');

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <a href="#top" className={styles.brand} aria-label="Nirvanic Petals privacy policy home">
            <span className={styles.brandIcon} aria-hidden="true">✳</span>
            <span>NIRVANIC <strong>PETALS</strong></span>
          </a>
          <span className={styles.topbarTag}>Privacy &amp; Data Protection</span>
        </div>
      </div>

      <main id="top" className={styles.main}>
        <header className={styles.hero}>
          <div className={styles.heroOverline}>OUR COMMITMENT TO PRIVACY</div>
          <h1>Privacy Policy</h1>
          <p>
            We believe in protecting the information entrusted to us while helping
            authorized teams manage plant inventory, mother plants, propagation,
            and related operations.
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.heroChip}>Nirvanic Petals</span>
            <span>Last updated: {LAST_UPDATED}</span>
          </div>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav className={styles.navCard} aria-label="Privacy policy sections">
              <p className={styles.navHeading}>ON THIS PAGE</p>
              {sections.map((section, index) => (
                <a key={section.id} href={`#${section.id}`} className={styles.navLink}>
                  <span className={styles.navNumber}>{String(index + 1).padStart(2, '0')}</span>
                  {section.label}
                </a>
              ))}
            </nav>
            <div className={styles.asideNote}>
              <span aria-hidden="true" className={styles.asideIcon}>✓</span>
              <strong>Your information matters</strong>
              <p>Questions about your information? Find our privacy contact details below.</p>
              <a href="#contact">Contact our team <span aria-hidden="true">→</span></a>
            </div>
          </aside>

          <article className={styles.article}>
            <section id="about" className={styles.section}>
              <span className={styles.eyebrow}>01 / INTRODUCTION</span>
              <h2>About this policy</h2>
              <p>
                This Privacy Policy describes how <strong>{APP_NAME}</strong> (the “App”),
                operated by <strong>{LEGAL_ENTITY}</strong> (referred to as “we”, “us”, or “our”),
                handles information when you access and use the App.
              </p>
              <p>
                Nirvanic Petals is a plant inventory and propagation management application
                intended for authorized business users. It helps manage botanical records,
                mother plant designations and conditions, propagation batches, plant stock,
                pricing, reports, and supporting media. The App is not intended for general
                consumer social networking or public user-generated content sharing.
              </p>
            </section>

            <section id="information" className={styles.section}>
              <span className={styles.eyebrow}>02 / DATA COLLECTION</span>
              <h2>Information we process</h2>
              <p>Depending on the features your organization uses, this may include:</p>
              <div className={styles.detailGrid}>
                <div className={styles.detailCard}>
                  <h3>Account &amp; access information</h3>
                  <p>Account identifiers, name, work contact details, assigned user role, and authentication/session information necessary for secure access.</p>
                </div>
                <div className={styles.detailCard}>
                  <h3>Plant &amp; operational records</h3>
                  <p>Plant classification, mother plant conditions, replacement records, stock balances, propagation batches, pricing information, remarks, and operational history entered by authorized users.</p>
                </div>
                <div className={styles.detailCard}>
                  <h3>Photos &amp; videos</h3>
                  <p>Images and video clips you choose to capture or upload as plant references, mother plant condition evidence, or propagation documentation, together with relevant captions and file metadata.</p>
                </div>
                <div className={styles.detailCard}>
                  <h3>Technical information</h3>
                  <p>Diagnostic information associated with requests and application operation, such as error records, device/app compatibility information, request timestamps, or network details when recorded by the services used to operate the App.</p>
                </div>
              </div>
              <p>
                Information may be provided by you, an authorized organization administrator,
                or generated as part of normal use of the App and its connected services.
              </p>
            </section>

            <section id="purposes" className={styles.section}>
              <span className={styles.eyebrow}>03 / PURPOSES</span>
              <h2>How we use information</h2>
              <ul>
                <li>Authenticate users and apply role-based access permissions.</li>
                <li>Create, manage, retrieve, and audit plant inventory and propagation records.</li>
                <li>Store user-submitted plant photos, videos, and supporting evidence.</li>
                <li>Generate permitted dashboards, reports, and CSV/PDF exports.</li>
                <li>Maintain operational security, diagnose service failures, and investigate misuse.</li>
                <li>Respond to authorized support, privacy, or deletion requests.</li>
              </ul>
            </section>

            <section id="permissions" className={styles.section}>
              <span className={styles.eyebrow}>04 / DEVICE PERMISSIONS</span>
              <h2>Camera, photos, videos &amp; files</h2>
              <p>
                If you use media features, the App may request access to your camera,
                selected photos or videos, and microphone while recording video. These
                capabilities are used for plant photographs, condition evidence, and
                propagation documentation. You can decline optional device permissions,
                although the related feature may then be unavailable.
              </p>
              <p>
                When you download or share reports, the App may use local application
                storage and your device’s native share or save options. Files you choose
                to share are handled by the destination app or service under its own terms.
              </p>
            </section>

            <section id="sharing" className={styles.section}>
              <span className={styles.eyebrow}>05 / ACCESS &amp; SHARING</span>
              <h2>Who can access information</h2>
              <p>
                Information is intended to be accessible only to authorized users and
                administrators in accordance with their assigned roles. We may use
                technology and hosting service providers to operate the App and its backend,
                and may disclose information where required by applicable law or a valid
                legal process. We do not make your private plant records publicly available
                through the App's normal workflow.
              </p>
              <p>
                Report files or media explicitly shared by a user may be accessed by the
                recipients and third-party services the user chooses.
              </p>
            </section>

            <section id="security" className={styles.section}>
              <span className={styles.eyebrow}>06 / SECURITY</span>
              <h2>How we protect data</h2>
              <p>
                The App uses authenticated access and role-based authorization to help
                protect business data. We take reasonable technical and organizational
                steps appropriate to the information and services involved, including
                limiting access to authorized personnel and maintaining operational controls.
                No electronic transmission or storage system can be guaranteed to be
                completely secure.
              </p>
            </section>

            <section id="retention" className={styles.section}>
              <span className={styles.eyebrow}>07 / RETENTION &amp; DELETION</span>
              <h2>How long information is kept</h2>
              <p>
                Account and operational information may be retained while needed to provide
                the App, maintain plant and stock histories, meet legitimate organizational
                needs, and satisfy applicable legal, security, or audit obligations. The
                retention period can differ by record type and the organization's policies.
              </p>
              <p>
                To request access to, correction of, or deletion of personal information,
                contact the privacy team using the details below. Requests will be reviewed
                and handled subject to identity verification and applicable legal or
                operational retention obligations. Deactivating access and deleting
                underlying data are different actions.
              </p>
            </section>

            <section id="choices" className={styles.section}>
              <span className={styles.eyebrow}>08 / USER CHOICES</span>
              <h2>Your choices &amp; rights</h2>
              <p>
                Depending on applicable law and your relationship with the organization,
                you may be able to request access, correction, or deletion of personal data.
                You may also control device permissions through your operating system.
                If your account is provided by an organization, its authorized administrator
                may need to help process account-related requests.
              </p>
              <p>
                The App is designed for authorized business users and is not directed at
                children.
              </p>
            </section>

            <section id="updates" className={styles.section}>
              <span className={styles.eyebrow}>09 / CHANGES</span>
              <h2>Changes to this Privacy Policy</h2>
              <p>
                We may update this policy to reflect changes in App features, information
                practices, or legal requirements. The latest version will be available on
                this page with an updated “Last updated” date.
              </p>
            </section>

            <section id="contact" className={styles.section}>
              <span className={styles.eyebrow}>10 / GET IN TOUCH</span>
              <h2>Contact us</h2>
              <p>
                For questions about this policy or to submit a privacy-related request,
                please contact the app operator:
              </p>
              <div className={styles.contactCard}>
                <strong>{LEGAL_ENTITY}</strong>
                <p><span>App:</span> {APP_NAME}</p>
                <p>
                  <span>Email:</span>{' '}
                  {contactConfigured ? (
                    <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>
                  ) : (
                    <strong className={styles.needsConfig}>[Add verified privacy contact email before publishing]</strong>
                  )}
                </p>
                <p><span>Business address:</span> {BUSINESS_ADDRESS === 'REPLACE_WITH_VERIFIED_BUSINESS_ADDRESS' ? '[Add verified registered/contact address]' : BUSINESS_ADDRESS}</p>
              </div>
            </section>
          </article>
        </div>

        <footer className={styles.footer}>
          <span>© {new Date().getFullYear()} {APP_NAME}</span>
          <span>Operated by {LEGAL_ENTITY}</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </main>
    </div>
  );
}
