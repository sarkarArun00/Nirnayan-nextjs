import Link from "next/link";
import styles from "./Footer.module.css";
export default function Footer() {
  return (
    <>
      <div className={styles['row']}>
        <div className={styles['col-lg-4 col-md-12 col-sm-12']}>g</div>
        <div className={styles['col-lg-4 col-md-12 col-sm-12']}>g</div>
        <div className={styles['col-lg-4 col-md-12 col-sm-12']}>g</div>
      </div>
      {/* <div className={styles['up-footer']}>
        <div className={styles['newsletter']}>
          <div className={styles['container']}>
            <div className={styles['inn']}>
              <h2>Subscribe Our Newsletter</h2>
              <h5>Stay Informed. Stay Healthy</h5>
              <div className={styles['mail-wrap']}>
                <input type="email" placeholder="Enter Your Email" className={styles['form-control']} />
                <i className="fa-solid fa-envelope"></i>
                <button>Subscribe</button>
              </div>
              <div className={styles['pulse-wrap']}>
                <span className={`${styles['pulse']} ${styles['pulse-1']}`}></span>
                <span className={`${styles['pulse']} ${styles['pulse-2']}`}></span>
                <span className={`${styles['pulse']} ${styles['pulse-3']}`}></span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['top-block']}>
          <img className={styles['left-img']} src="/assets/images/f-ptrn-left.png" alt="" />
          <img className={styles['right-img']} src="/assets/images/f-ptrn-right.png" alt="" />
          <div className={styles['container']}>
            <div className={styles['row']}>
              <div className={styles['col-lg-4 col-md-12 col-sm-12']}>
                <div className={styles['logo']}>
                  <div className={styles['img']}>
                    <img src="/assets/images/logo.png" alt="" />
                  </div>
                  <div className={styles['text']}>
                    <span className={styles['notranslate']} translate="no">Nirnayan</span>
                  </div>
                </div>
                <div className={styles['corporate-info']}>
                  <h5>Corporate Office:</h5>
                  <p>145, Rajarhat Main Rd, Zarda Bagan,<span>Jyangra, Baguiati, Kolkata, West Bengal 7000136</span></p>
                </div>

                <div className={styles['app-store-btn']}>
                  <button><img src="/assets/images/play-store.png" alt="" /></button>
                  <button><img src="/assets/images/app-store.png" alt="" /></button>
                </div>
              </div>
              <div className={styles['col-lg-2 col-md-6 col-6']}>
                <h5>Company</h5>
                <ul>
                  <li><a href="#">About Us</a></li>
                  <li><a href="/about-us/our-team">Our Team</a></li>
                  <li><a href="/about-us/about/value">Journey</a></li>
                  <li>
                    <a href="/others/career">Careers With Us</a>
                    <span>Hiring</span>
                  </li>
                  <li><a href="#">Contact Us</a></li>
                </ul>
              </div>
              <div className={styles['col-lg-2 col-md-6 col-6']}>
                <h5>Laboratory</h5>
                <ul>
                  <li><a href="/laboratory/department/16">Department</a></li>
                  <li><a href="/laboratory/accreditation">Accreditation</a></li>
                  <li><a href="/laboratory/quality">Quality Control</a></li>
                </ul>
              </div>
              <div className={styles['col-lg-2 col-md-6 col-6']}>
                <h5>Quick Links</h5>
                <ul>
                  <li><a href="https://blog.nirnayanhealthcare.com/" target="_blank" rel="noreferrer">Nirnayan Blogs</a></li>
                  <li><a href="/others/association">Associations</a></li>
                  <li><a href="/others/events">Events</a></li>
                  <li><a href="/others/media">Media</a></li>
                  <li><a href="/others/faq">FAQs</a></li>
                </ul>
              </div>
              <div className={styles['col-lg-2 col-md-6 col-6']}>
                <h5>Patients</h5>
                <ul>
                  <li><a href="/patient/test-list">Browse all Test</a></li>
                  <li><a href="/patient/package-list">Browse all Packages</a></li>
                  <li><a href="/science/encyclopedia">Medical Encyclopedia</a></li>
                  <li><a href="/patient/find-center">Find A Center</a></li>
                </ul>
              </div>
            </div>

            <div className={styles['exp-block']}>
              <div className={styles['row']}>
                <div className={styles['col-xl-3 col-lg-6 col-sm-6 col-12']}>
                  <div className={styles['feature-card']}>
                    <div className={styles['feature-icon']}>
                      <img src="/assets/images/stethoscope.png" alt="" />
                    </div>
                    <div className={styles['feature-text']}>
                      <h5>Experienced Doctors <span>Pathologists</span></h5>
                    </div>
                  </div>
                </div>

                <div className={styles['col-xl-3 col-lg-6 col-sm-6 col-12']}>
                  <div className={styles['feature-card']}>
                    <div className={styles['feature-icon']}>
                      <img src="/assets/images/stethoscope1.png" alt="" />
                    </div>
                    <div className={styles['feature-text']}>
                      <h5>Fastest & Accurate <span>Report Delivery</span></h5>
                    </div>
                  </div>
                </div>
                <div className={styles['col-xl-3 col-lg-6 col-sm-6 col-12']}>
                  <div className={styles['feature-card']}>
                    <div className={styles['feature-icon']}>
                      <img src="/assets/images/nabl.png" alt="" />
                    </div>
                    <div className={styles['feature-text']}>
                      <h5>NABL- Accredited lab</h5>
                    </div>
                  </div>
                </div>

                <div className={styles['col-xl-3 col-lg-6 col-sm-6 col-12']}>
                  <div className={styles['feature-card']}>
                    <div className={styles['feature-icon']}>
                      <img src="/assets/images/shield.png" alt="" />
                    </div>
                    <div className={styles['feature-text']}>
                      <h5>8 Years of <span>Trusted Healthcare</span></h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles['accordion']} ${styles['accordion-box']}`} id="nirnayanAccordion">
              <div className={styles['accordion-item']}>
                <h2 className={styles['accordion-header']} id="headingTests">
                  <button className={styles['accordion-button']} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTests" aria-expanded="true" aria-controls="collapseTests">
                    <div className={styles['title-pnl']}>
                      <img src="/assets/images/blood-sample.png" className={styles['img-fluid']} alt="" />
                      <h5>Top Tests</h5>
                    </div>
                  </button>
                </h2>
                <div id="collapseTests" className={`${styles['accordion-collapse']} ${styles['collapse']} ${styles['show']}`} data-bs-parent="#nirnayanAccordion" aria-labelledby="headingTests">
                  <div className={styles['accordion-body']}>
                    <ul>
                      <li><a href="#">Thyroid Profile (TSH, T3, T4)</a></li>
                      <li><a href="#">PCOS/PCOD Hormone Test</a></li>
                      <li><a href="#">Estrogen Progesterone</a></li>
                      <li><a href="#">Vitamin D Vitamin B12</a></li>
                      <li><a href="#">Iron Ferritin</a></li>
                      <li><a href="#">Blood Sugar (Diabetes Screening)</a></li>
                      <li><a href="#">Lipid Profile (Cholesterol)</a></li>
                      <li><a href="#">Liver Function Test (LFT)</a></li>
                      <li><a href="#">Kidney Function Test (KFT)</a></li>
                      <li><a href="#">Obesity / Metabolism Check</a></li>
                      <li><a href="#">Stress Cortisol Test</a></li>
                      <li><a href="#">Uric Acid Test</a></li>
                      <li><a href="#">Diabetes Test (HbA1c)</a></li>
                      <li><a href="#">Allergy Test</a></li>
                      <li><a href="#">CBC Test</a></li>
                      <li><a href="#">ANA Test</a></li>
                      <li><a href="#">Amylase Test</a></li>
                      <li><a href="#">APTT</a></li>
                      <li><a href="#">Bilirubin Test</a></li>
                      <li><a href="#">CA 125</a></li>
                      <li><a href="#">BUN/Creatinine Ratio</a></li>
                      <li><a href="#">Calcium Test</a></li>
                      <li><a href="#">Cholesterol - HDL</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles['accordion-item']}>
                <h2 className={styles['accordion-header']} id="headingPackages">
                  <button className={`${styles['accordion-button']} ${styles['collapsed']}`} type="button" data-bs-toggle="collapse" data-bs-target="#collapsePackages" aria-expanded="false" aria-controls="collapsePackages">
                    <div className={`${styles['header-left']} ${styles['d-flex']} ${styles['align-items-center']} ${styles['gap-2']}`}>
                      <div className={styles['title-pnl']}>
                        <img src="/assets/images/package.png" className={styles['img-fluid']} alt="" />
                        <h5>Top Packages</h5>
                      </div>
                    </div>
                  </button>
                </h2>
                <div id="collapsePackages" className={`${styles['accordion-collapse']} ${styles['collapse']}`} data-bs-parent="#nirnayanAccordion" aria-labelledby="headingPackages">
                  <div className={styles['accordion-body']}>
                    <ul>
                      <li><a href="#">Kidney/Renal Profile Package</a></li>
                      <li><a href="#">Metabolic Freedom Package</a></li>
                      <li><a href="#">Pre-Cath Package</a></li>
                      <li><a href="#">Pregnancy Package</a></li>
                      <li><a href="#">Pre Operative Check Up Package</a></li>
                      <li><a href="#">Obesity Check Up Package - Female</a></li>
                      <li><a href="#">Obesity Check Up Package - Male</a></li>
                      <li><a href="#">Old Age Package - Female</a></li>
                      <li><a href="#">Old Age Package - Male</a></li>
                      <li><a href="#">Pre-Marital Package</a></li>
                      <li><a href="#">Thallasamia Check Ups Package</a></li>
                      <li><a href="#">Arthritis Package</a></li>
                      <li><a href="#">Dialysis Package</a></li>
                      <li><a href="#">Fitness Package - Male</a></li>
                      <li><a href="#">Fitness Package - Female</a></li>
                      <li><a href="#">Executive Health Package</a></li>
                      <li><a href="#">Healthy Heart Package</a></li>
                      <li><a href="#">Full Body Checkup Package</a></li>
                      <li><a href="#">Vitamin Package</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles['accordion-item']}>
                <h2 className={styles['accordion-header']} id="headingInfo">
                  <button className={`${styles['accordion-button']} ${styles['collapsed']}`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseInfo" aria-expanded="false" aria-controls="collapseInfo">
                    <div className={styles['title-pnl']}>
                      <img src="/assets/images/info-icon.png" className={styles['img-fluid']} alt="" />
                      <h5>Know More About Nirnayan</h5>
                    </div>
                  </button>
                </h2>
                <div id="collapseInfo" className={`${styles['accordion-collapse']} ${styles['collapse']}`} data-bs-parent="#nirnayanAccordion" aria-labelledby="headingInfo">
                  <div className={styles['accordion-body']}>
                    <div className={`${styles['content-box']} ${styles['info-blocks']}`}>
                      <h5>Who We Are</h5>
                      <p>Nirnayan Pathology is dedicated to delivering top-notch pathology services to stand as the Leading pathology lab in Kolkata. Committed to accuracy and excellence, we offer trouble-free blood collection from home. From routine to specialized tests, our state-of-the-art pathology ensures quality services near you with easy access. Discover reliable and trusted results with Nirnayan and secure your health for tomorrow.</p>
                      <h5>Mission</h5>
                      <p>Our commitment is to be the best pathology center in Kolkata by offering a meticulously structured and fully managed pathology service with diverse technology. Nirnayan is renowned for its adept management and specialized knowledge across various clinical environments. We offer the convenience to book a blood test and receive reliable results without any hassle.</p>
                      <h5>Accreditation</h5>
                      <p>Accreditation is a process by which healthcare organizations undergo rigorous evaluation to ensure they meet established standards for quality and safety. Nirnayan presents an accredited lab in Kolkata to implement policies, procedures, and practices that prioritize patient safety, quality of care, and positive outcomes. We remain dedicated to upholding the standards set and continually striving for excellence in all aspects of our services.</p>
                      <a href="#" className={styles['more-info-link']}>About More Information</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles['accordion-item']}>
                <h2 className={styles['accordion-header']} id="headingAddress">
                  <button className={`${styles['accordion-button']} ${styles['collapsed']}`} type="button" data-bs-toggle="collapse" data-bs-target="#collapseAddress" aria-expanded="false" aria-controls="collapseAddress">
                    <div className={styles['title-pnl']}>
                      <img src="/assets/images/address.png" className={styles['img-fluid']} alt="" />
                      <h5>Address Details</h5>
                    </div>
                  </button>
                </h2>
                <div id="collapseAddress" className={`${styles['accordion-collapse']} ${styles['collapse']}`} data-bs-parent="#nirnayanAccordion" aria-labelledby="headingAddress">
                  <div className={styles['accordion-body']}>
                    <div className={`${styles['row']} ${styles['g-3']}`}>
                      <div className={styles['col-xl-3 col-lg-6 col-sm-6 col-12']}>
                        <div className={styles['address-card']}>
                          <h5>Head Office:</h5>
                          <p>145, Rajarhat Main Rd, Zarda Bagan, Jyangra, Baguiati, Kolkata, West Bengal 7000136</p>
                          <a href="tel:08100726252">
                            <img src="/assets/images/address-ph.svg" alt="" />
                            <span>081007 26252</span>
                          </a>
                        </div>
                      </div>
                      <div className={styles['col-xl-3 col-lg-6 col-sm-6 col-12']}>
                        <div className={styles['address-card']}>
                          <h5>Head Office:</h5>
                          <p>145, Rajarhat Main Rd, Zarda Bagan, Jyangra, Baguiati, Kolkata, West Bengal 7000136</p>
                          <a href="tel:08100726252">
                            <img src="/assets/images/address-ph.svg" alt="" />
                            <span>081007 26252</span>
                          </a>
                        </div>
                      </div>
                      <div className={styles['col-xl-3 col-lg-6 col-sm-6 col-12']}>
                        <div className={styles['address-card']}>
                          <h5>Siliguri Lab</h5>
                          <p>145, Rajarhat Main Rd, Zarda Bagan, Jyangra, Baguiati, Kolkata, West Bengal 7000136</p>
                          <a href="tel:08100726252">
                            <img src="/assets/images/address-ph.svg" alt="" />
                            <span>081007 26252</span>
                          </a>
                        </div>
                      </div>
                      <div className={styles['col-xl-3 col-lg-6 col-sm-6 col-12']}>
                        <div className={styles['address-card']}>
                          <h5>Patna Lab</h5>
                          <p>145, Rajarhat Main Rd, Zarda Bagan, Jyangra, Baguiati, Kolkata, West Bengal 7000136</p>
                          <a href="tel:08100726252">
                            <img src="/assets/images/address-ph.svg" alt="" />
                            <span>081007 26252</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['feedback']}>
          <div className={styles['container']}>
            <div className={styles['top-sec']}>
              <div className={styles['qr-wrap']}>
                <div className={styles['icon']}>
                  <img src="/assets/images/qr.png" alt="" />
                </div>
                <div className={styles['text']}>
                  <h5>Scan to Share Your Feedback</h5>
                  <p>Scan now to share your thoughts, Your feedback inspires us to improve and provide you the best experience.</p>
                </div>
              </div>
              <div className={styles['back-top']}>
                <i className="fa-solid fa-circle-chevron-up"></i>
                <h5>Back to Top</h5>
              </div>
              <div className={styles['rt-side']}>
                <div className={styles['rating']}>
                  <img src="/assets/images/rating.png" alt="" />
                </div>
                <div className={styles['social']}>
                  <ul>
                    <li>
                      <a href="https://www.facebook.com/nirnayan.healthcare/" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/nirnayan.healthcare/" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://in.linkedin.com/company/nirnayan-health-care" target="_blank" rel="noreferrer">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa-brands fa-youtube"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={styles['btm-sec']}>
              <p>2026 © <span>Nirnayan Health Care Private Limited</span>. All Rights Reserved</p>
              <ul>
                <li><a href="/others/terms-condition">Terms and Conditions</a></li>
                <li><a href="/others/privacy-policy">Privacy Policy</a></li>
                <li><a href="/others/disclaimer-cookie">Disclaimer & Cookie Policy</a></li>
                <li><a href="/others/refund-cancellation">Refund and Cancellation</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}