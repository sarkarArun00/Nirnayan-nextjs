"use client";

import { useEffect, useState } from "react";

import Slider from "react-slick";

import { getBannerContent } from "@/services/auth.service";

import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const [bannerData, setBannerData] = useState<unknown>(null);

  const [bannerLoading, setBannerLoading] = useState(true);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const loadBanner = async () => {
      try {
        setBannerLoading(true);

        /*
         * Replace the value below with the same
         * banner type value used in your Angular app.
         */
        const response = await getBannerContent("website");

        console.log("Banner API Response:", response);

        setBannerData(response);
      } catch (error) {
        console.error("Banner API Error:", error);
      } finally {
        setBannerLoading(false);
      }
    };

    void loadBanner();
  }, []);

  return (
    <>
      <div className={`banner_wrap ${styles.banner}`}>
        <div className={styles.bann_slide}>
          {bannerLoading ? (
            <div className={styles.item}>
              <img src="/assets/images/banner1.jpg" alt="Nirnayan Healthcare" />
            </div>
          ) : (
            <Slider {...settings}>
              {/*
                Keep current banner temporarily.

                Once you send me the real API response,
                we'll replace this with:

                bannerData.map(...)
              */}

              <div className={styles.item}>
                <img
                  src="/assets/images/banner1.jpg"
                  alt="Nirnayan Healthcare"
                />
              </div>

              <div className={styles.item}>
                <img
                  src="/assets/images/banner1.jpg"
                  alt="Nirnayan Healthcare"
                />
              </div>
            </Slider>
          )}
        </div>

        <div className={styles.banner_action}>
          <div className={styles.test_search}>
            <div className="d-flex align-items-center flex-grow-1">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>

              <span className={styles.search_text}>Search for</span>
            </div>

            <div className={styles.shortcut}>Ctrl+K</div>

            <div className={styles.divider}></div>

            <i
              className={`fa-solid fa-microphone mic-icon ${styles["mk-icon"]}`}
            ></i>
          </div>

          <div className={styles.rt_side}>
            <button className={styles.upload_btn}>
              Upload Prescription
              <img src="/assets/images/uppres.svg" alt="" />
            </button>

            <button className={styles.report_btn}>
              Download Report
              <img src="/assets/images/download.svg" alt="" />
            </button>

            <a href="#" className={styles.wp_btn}>
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
