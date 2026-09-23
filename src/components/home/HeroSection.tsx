"use client";
import Link from "next/link";
import styles from "./HeroSection.module.css";
import Slider from "react-slick";

export default function HeroSection() {
  var settings = {
    dots: false,
    arrows:false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <>
      <div className={styles.banner_wrap}>
        <div className={styles.bann_slide}>
          <Slider {...settings}>
            <div className={styles.item}>
              <img src="/assets/images/banner1.jpg" alt="" />
            </div>
            <div className={styles.item}>
              <img src="/assets/images/banner1.jpg" alt="" />
            </div>
          </Slider>
        </div>
        <div className={styles.banner_action}>
          <div className={styles.test_search}>
            <div className="d-flex align-items-center flex-grow-1">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <span className={styles.search_text}>
                Search for
              </span>
            </div>
            <div className={styles.shortcut}>Ctrl+K</div>
            <div className={styles.divider}></div>
            <i className={`fa-solid fa-microphone mic-icon ${styles['mk-icon']}`}></i>
          </div>
          <div className={styles.rt_side}>
            <button className={styles.upload_btn}>Upload Prescription <img src="/assets/images/uppres.svg" alt="" /></button>
            <button className={styles.report_btn}>Download Report <img src="/assets/images/download.svg" alt="" /></button>
            <a href="#" className={styles.wp_btn}><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>
      </div>
    </>
  );
}