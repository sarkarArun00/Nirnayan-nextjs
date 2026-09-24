'use client';
import React from 'react';
import Slider from 'react-slick';
import styles from './LifestylePackages.module.css';

function LifestylePackages() {
  // Added const declaration
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

  const slideConfig = {
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true
        }
      }
    ]
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </span>
            <span className="btn-text">View More</span>
          </button>
        </div>

        <div className="cmn-right-align">
          <Slider {...slideConfig} className={`is_slick_dot ${styles.carousel}`}>
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
      </div>
    </div>
  );
}

export default LifestylePackages;