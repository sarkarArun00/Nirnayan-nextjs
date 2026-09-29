"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  // { code: "bn", label: "Bengali" },
];

export default function Header() {
  const [bannerTouched, setBannerTouched] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = headerRef.current;
      const banner = document.querySelector(".banner_wrap");
      if (!header || !banner) return;
      setBannerTouched(
        banner.getBoundingClientRect().bottom <=
        header.getBoundingClientRect().bottom
      );
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Google Translate 
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, 
      .skiptranslate,
      iframe.goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0px !important;
        position: static !important;
      }
      .goog-te-gadget-icon {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    const addGoogleTranslateScript = () => {
      if (document.getElementById("google-translate-script")) return;
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: LANGUAGES.map((l) => l.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    };

    addGoogleTranslateScript();
  }, []);

  const toggleLang = () => {
    setLangOpen((prev) => !prev);
  };

  const handleSelect = (langCode: string) => {
    setSelectedLang(langCode);
    setLangOpen(false);
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    const selectElem = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };
  // Google Translate 

  // Ctrl + K Search Function
  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearch((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  // Ctrl + K Search Function
  
  return (
    <>
      <div ref={headerRef} className={`${styles["main-header"]} ${bannerTouched ? styles["banner-touched"] : ""}`}>
        <div className={styles['top-wrap']}>
          <img src="/assets/images/bell.svg" alt="Notification Bell" />
          <p>
            Easy online booking for lab tests, diagnostics and complete health checkups at home
            <a href="#">
              Book Test <img src="/assets/images/right-arrow.svg" alt="Right Arrow" />
            </a>
          </p>
        </div>
        <div className={styles['btm-wrap']}>
          <div className={styles['lt-side']}>
            {/* Logo Link */}
            <Link href="/" className={styles.logo}>
              <div className={styles.img}>
                <img src="/assets/images/logo.png" alt="Nirnayan Logo" />
              </div>
              <div className={styles.text}>
                <span className={styles.notranslate} translate="no">Nirnayan</span>
              </div>
            </Link>

            {/* Location Selector */}
            <div className={styles['location']} onClick={() => setIsLocation(true)}>
              <i className="fa-solid fa-location-dot location-icon"></i>
              <h4>Kolkata</h4>
              <i className="fa-solid fa-chevron-down"></i>
            </div>

            {/* Hidden Block */}
            <div className={styles['hidden-block']}>
              <div className={styles['loc-in']} onClick={() => setIsLocation(true)}>
                <i className="fa-solid fa-location-dot location-icon"></i>
                <h4>Kolkata</h4>
                <i className="fa-solid fa-chevron-down"></i>
              </div>

              <div className={styles['test-search']}>
                <div className={styles.divider}></div>
                <div className="d-flex align-items-center flex-grow-1">
                  <span className={styles['search-text']}>
                    Search for
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <img src="/assets/images/rx.svg" alt="Rx Icon" />
                  <div className={styles.divider}></div>
                  <div className={styles.shortcut}>Ctrl+K</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['rt-side']}>
            <div className={styles.navigation}>
              <ul>
                <li>
                  <Link
                    href="#">
                    <img src="/assets/images/blood.svg" alt="Test Icon" /> Test
                  </Link>
                </li>
                <li>
                  <Link
                    href="#">
                    <img src="/assets/images/package.svg" alt="Package Icon" /> Packages
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles['more-btns']}>
              <a href="#">
                More <i className="fa-solid fa-chevron-down"></i>
              </a>
            </div>

            <div className={`${styles.lang_switcher} lang-switcher ${langOpen ? "open" : ""}`}>
              <button type="button" className={styles.lang_trigger} onClick={toggleLang}>
                <img src="/assets/images/lang-switch.svg" alt="Language Switcher" />
                <i className="fa-solid fa-chevron-down"></i>
              </button>

              {langOpen && (
                <div className={styles.lang_dropdown}>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`${styles['lang-item']} ${selectedLang === lang.code ? styles.active : ""}`}
                      onClick={() => handleSelect(lang.code)}
                    >
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles['cart-wrap']}>
              <Link href='#'>
                <i className="fa-solid fa-cart-shopping"></i>
                <span className={styles['number']}>0</span>
              </Link>
            </div>

            <div className={`user ${styles.user}`}>
              <div className={`dropdown ${styles.dropdown}`}>
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className={styles.img}>
                    <img src="/assets/images/user.png" alt="User" />
                  </span>
                </button>
                <ul className={`dropdown-menu ${styles.dropdown_menu}`}>
                  <li>
                    <a className={`dropdown-item ${styles.dropdown_item}`} href="#" onClick={() => setIsOpen(true)}>
                      <img src="/assets/images/sign-in.svg" alt="" />
                      Sign in
                    </a>
                  </li>
                  <li>
                    <a className={`dropdown-item ${styles.dropdown_item}`} href="#" onClick={() => setIsSignIn(true)}>
                      <img src="/assets/images/log-in.svg" alt="" />
                      Sign Up
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sign Up Modal Start */}
      {isSignIn && (
        <div className={`is-logged ${isSignIn ? 'active' : ''}`} onClick={() => setIsSignIn(false)}>
          <div className="inn" onClick={(e) => e.stopPropagation()}>
            <div className="row align-items-center">
              <div className="col-lg-6 col-sm-12">
                <div className="img">
                  <img src="/assets/images/log-img.png" alt="" />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="text">
                  <h3>Sign Up</h3>
                  <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div className="block">
                        <label className="lbl">First Name<span>*</span></label>
                        <input type="text" placeholder="" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div className="block">
                        <label className="lbl">Last Name<span>*</span></label>
                        <input type="text" placeholder="" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="block">
                        <label className="lbl">Mobile Number<span>*</span></label>
                        <div className="position-relative">
                          <input type="tel" placeholder="Enter your 10 digit mobile number" className="form-control" />
                          <button id="otpButton">
                            Get OTP
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 d-none">
                      <h5>Enter Your OTP</h5>
                      <div className="digit-group">
                        <input type="tel" id="digit-1" name="digit-1" required />
                        <input type="tel" id="digit-2" name="digit-2" required />
                        <input type="tel" id="digit-3" name="digit-3" required />
                        <input type="tel" id="digit-4" name="digit-4" required />
                        <input type="tel" id="digit-5" name="digit-5" required />
                        <input type="tel" id="digit-6" name="digit-6" required />
                      </div>
                      <div className="otpRequested">
                        <p>Time Remaining: <span>20 sec</span></p>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="block">
                        <label className="lbl">Email Address<span>*</span></label>
                        <input type="text" placeholder="" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <label className="check-custom">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span className="sp-lbl">
                          I agree to the <a href="#">Terms & Conditions</a>
                        </span>
                      </label>
                    </div>
                  </div>
                  <button className="cmn_btn w-100">Register</button>
                  <p className="text-center mt-3">I have already an account | <a href="#" className="sign-text">Sign In</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Sign Up Modal End */}

      {/* Sign In Modal Start */}
      {isOpen && (
        <div className={`is-logged ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
          <div className="inn" onClick={(e) => e.stopPropagation()}>
            <div className="row align-items-center">
              <div className="col-lg-6 col-sm-12">
                <div className="img">
                  <img src="/assets/images/log-img.png" alt="" />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="text">
                  <h3>Sign in to your account</h3>
                  <p>View your reports and upcominghealth checkups at one place.</p>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="block">
                        <label className="lbl">Mobile Number<span>*</span></label>
                        <input type="tel" placeholder="Enter your 10 digit mobile number" className="form-control" />
                      </div>
                    </div>
                  </div>
                  <button className="cmn_btn w-100">Get OTP</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Sign In Modal End */}

      {/* Location Modal Start */}
      {isLocation && (
        <div className={`location-modal-backdrop ${isLocation ? 'active' : ''}`} onClick={() => setIsLocation(false)}>
          <div className="inn" onClick={(e) => e.stopPropagation()}>
            <div className="search-wrap position-relative">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Search Your City" className="form-control" />
            </div>
            <h6>Select Location</h6>
            <ul>
              <li className="select-city">
                <div className="img">
                  <img src="/assets/images/kolkata.png" alt="" />
                </div>
                <h6>Kolkata</h6>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/images/siliguri.png" alt="" />
                </div>
                <h6>Siliguri</h6>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/images/patna.png" alt="" />
                </div>
                <h6>Patna</h6>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/images/asansol.png" alt="" />
                </div>
                <h6>Asansol</h6>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/images/assam.png" alt="" />
                </div>
                <h6>Assam</h6>
              </li>
              <li>
                <div className="img">
                  <img src="/assets/images/baharampur.png" alt="" />
                </div>
                <h6>Baharampur</h6>
              </li>
            </ul>
          </div>
        </div>
      )}
      {/* Location Modal End */}

      {/* Search Modal Start */}
      {isSearch && (
        <div className={`modal_backdrop ${isSearch ? 'active' : ''}`} onClick={() => setIsSearch(false)}>
          <div className="lab-search-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lab-search-field">
              <i className="fa-solid fa-magnifying-glass lab-search-symbol"></i>
              <input type="text" placeholder="Search for Tests, Health Check-ups"
                name="labSearch" className="form-control" />
              <div className="flex-dv d-flex align-items-center gap-2">
                <button type="button" className="lab-search-rx">
                  <img src="/assets/images/rx.svg" alt="" />
                </button>
                <span className="lab-search-line"></span>
                <button type="button" className="lab-search-mike">
                  <i className="fa-solid fa-microphone lab-mic-symbol"></i>
                </button>
              </div>
            </div>
            <div className="lab-search-content">
              {/* POPULAR TESTS */}
              <section className="lab-result-group">
                <h6>Popular Tests</h6>
                <div className="scroll-pnl">
                  <div className="lab-result-row">
                    <div className="lab-result-picture lab-test-picture">
                      <i className="fa-solid fa-vial"></i>
                    </div>

                    <div className="lab-result-details">
                      <div className="lab-result-name">
                        CBC
                      </div>
                      <div className="lab-result-category">
                        Tests
                      </div>
                    </div>

                    <div className="lab-result-action">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </section>

              {/* POPULAR PACKAGE */}
              <section className="lab-result-group">
                <h6>Popular Package</h6>
                <div className="scroll-pnl">
                  <div className="lab-result-row">
                    <div className="lab-result-picture lab-package-picture">
                      <i className="fa-solid fa-file-medical"></i>
                    </div>
                    <div className="lab-result-details">
                      <div className="lab-result-name">
                        Suswastham 4.2 - Diabetes Check Up Package - Prime
                      </div>
                      <div className="lab-result-category">
                        Package
                      </div>
                    </div>

                    <div className="lab-result-action">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </section>

              {/* TRENDING SEARCHES */}
              <section className="lab-result-group lab-trending-group">
                <h6>Trending Searches</h6>
                <div className="lab-result-row">
                  <div className="lab-result-picture lab-trending-picture">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                  </div>
                  <div className="lab-result-details">
                    <div className="lab-result-name">
                      Glucose-Fasting-Plasma
                    </div>
                    <div className="lab-result-category">
                      Tests
                    </div>
                  </div>
                  <div className="lab-result-action">
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>

                <div className="lab-result-row">
                  <div className="lab-result-picture lab-trending-picture">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                  </div>
                  <div className="lab-result-details">
                    <div className="lab-result-name">
                      Glucose-Fasting-Plasma
                    </div>
                    <div className="lab-result-category">
                      Tests
                    </div>
                  </div>
                  <div className="lab-result-action">
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>

                <div className="lab-result-row">
                  <div className="lab-result-picture lab-trending-picture">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                  </div>
                  <div className="lab-result-details">
                    <div className="lab-result-name">
                      Suswastham-125-Infertility-Package-Male-Prime
                    </div>
                    <div className="lab-result-category">
                      Package
                    </div>
                  </div>
                  <div className="lab-result-action">
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>
              </section>

              <div className="lab-search-assistance">
                <div className="inn">
                  <span className="lab-assistance-icon">
                    <img src="/assets/images/bot.svg" alt="" />
                  </span>
                  <span className="lab-assistance-text">
                    Not Sure which tests right?
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Search Modal End */}

    </>
  );
}