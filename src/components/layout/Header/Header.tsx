"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";
// import LocationSelector from "./LocationSelector";
// import NavigationLinks from "./NavigationLinks";
export default function Header() {
  const [bannerTouched, setBannerTouched] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <div
        ref={headerRef}
        className={`${styles["main-header"]} ${bannerTouched ? styles["banner-touched"] : ""
          }`}
      >
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
                <span className="notranslate" translate="no">Nirnayan</span>
              </div>
            </Link>

            {/* Location Selector */}
            <div className={styles['location']}>
              <i className="fa-solid fa-location-dot location-icon"></i>
              <h4>Kolkata</h4>
              <i className="fa-solid fa-chevron-down"></i>
            </div>

            {/* Hidden Block */}
            <div className={styles['hidden-block']}>
              <div className={styles['loc-in']}>
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
          </div>
        </div>
      </div>
    </>
  );
}