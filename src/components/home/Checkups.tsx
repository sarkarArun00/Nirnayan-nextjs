"use client";
import React from 'react'
import styles from './Checkups.module.css';
import Slider from 'react-slick';

function Checkups() {
    const slideConfig = {
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        infinite: true,
        // autoplay: true,
        centerMode: true,
        centerPadding: '60px',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <>
            <div className={`check_ups ${styles.checkup}`}>
                <div className="container">
                    <div className="top-title">
                        <div className="left-pnl">
                            <h2>Most Booked Checkups</h2>
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
                        <Slider {...slideConfig} className='is_slick_dot'>
                            <div className="item">
                                <div className={`cmn_margin ${styles.img_block}`}>
                                    <img src="/assets/images/checkup1.jpg" alt="" />
                                    <div className={styles.text_block}>
                                        <div className={styles.lt_block}>
                                            <h3>Full Body Checkup</h3>
                                            <p>Holistic screening focused on bone & hormonal health</p>
                                        </div>
                                        <button className={`arrow-btn ${styles.arrow_btn}`}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                strokeWidth="2">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className={`cmn_margin ${styles.img_block}`}>
                                    <img src="/assets/images/checkup2.jpg" alt="" />
                                    <div className={styles.text_block}>
                                        <div className={styles.lt_block}>
                                            <h3>Full Body Checkup</h3>
                                            <p>Holistic screening focused on bone & hormonal health</p>
                                        </div>
                                        <button className={`arrow-btn ${styles.arrow_btn}`}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                strokeWidth="2">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className={`cmn_margin ${styles.img_block}`}>
                                    <img src="/assets/images/checkup3.png" alt="" />
                                    <div className={styles.text_block}>
                                        <div className={styles.lt_block}>
                                            <h3>Full Body Checkup</h3>
                                            <p>Holistic screening focused on bone & hormonal health</p>
                                        </div>
                                        <button className={`arrow-btn ${styles.arrow_btn}`}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                strokeWidth="2">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className={`cmn_margin ${styles.img_block}`}>
                                    <img src="/assets/images/checkup2.jpg" alt="" />
                                    <div className={styles.text_block}>
                                        <div className={styles.lt_block}>
                                            <h3>Full Body Checkup</h3>
                                            <p>Holistic screening focused on bone & hormonal health</p>
                                        </div>
                                        <button className={`arrow-btn ${styles.arrow_btn}`}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                strokeWidth="2">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkups