'use client';
import React from 'react';
import Slider from 'react-slick';
import styles from './LifestylePackages.module.css';
import useResponsiveSlider from '@/hooks/useResponsiveSlider';

const packages = [
  {
    id: 'pkg-1',
    title: 'Diabetes Check Up Package - Prime',
    image: '/assets/images/pkg1.png',
    isPopular: false
  },
  {
    id: 'pkg-2',
    title: 'Woman Wellness Package',
    image: '/assets/images/pkg2.png',
    isPopular: true
  },
  {
    id: 'pkg-3',
    title: 'Sexual Wellness Package',
    image: '/assets/images/pkg3.png',
    isPopular: true
  },
  {
    id: 'pkg-4',
    title: 'Thyroid Profile Test',
    image: '/assets/images/pkg4.png',
    isPopular: false
  },
  {
    id: 'pkg-5',
    title: 'Woman Wellness Package',
    image: '/assets/images/pkg2.png',
    isPopular: true
  },
];

function LifestylePackages() {
  const { slidesToShow, centerPadding } = useResponsiveSlider({ desktop: 4, mediumLaptop: 3, smallLaptop: 2, tablet: 2, mobile: 1, padding: { mobile: "0px" }, });
  const slideConfig = {
    dots: true,
    arrows: false,
    infinite: packages.length > slidesToShow,
    autoplay: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding,

  };

  return (
    <div className={styles.pkg_slider}>
      <div className="container">
        <div className="top-title">
          <div className="left-pnl">
            <h2>Explore By Lifestyle Packages</h2>
            <p>A complete health checkup designed to monitor your everyday wellness, detect early health risks, and help you maintain a healthier lifestyle.</p>
          </div>
          <button className="expand-btn">
            <span className="icon">
              <img src="/assets/images/exp-btn.svg" alt="" />
            </span>
            <span className="btn-text">View More</span>
          </button>
        </div>

        <div className="cmn-right-align">
          <Slider {...slideConfig} className={`is_slick_dot ${styles.carousel}`} key={`${slidesToShow}-${centerPadding}`}>
            {packages.map((pkg, index) => (
              <div key={pkg.id || index} className="slide">
                <div className={`cmn_margin ${styles.packageCard}`}>
                  <img
                    src={pkg.image}
                    className={styles.packageImage}
                    alt={pkg.title || 'Package image'}
                  />
                  {pkg.isPopular && (
                    <div className="popular-badge">
                      <img src="/assets/images/fire.svg" alt="Fire icon" />
                      <h6>Most Popular</h6>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="text-center is-exp-btn">
          <button className="exp-btn">
            Explore More <img src="/assets/images/exp-btn.svg" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LifestylePackages;