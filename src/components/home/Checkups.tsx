"use client";
import React from 'react'
import styles from './Checkups.module.css';
import Slider from 'react-slick';
import useResponsiveSlider from '@/hooks/useResponsiveSlider';
import Link from 'next/link';

const checkupData = [
    {
        id: 1,
        image: "/assets/images/checkup1.jpg",
        title: "Full Body Checkup",
        description: "Holistic screening focused on bone & hormonal health",
        link: "/our-package/full-body-checkup",
    },
    {
        id: 2,
        image: "/assets/images/checkup2.jpg",
        title: "Women's Wellness Package",
        description: "Comprehensive hormone, thyroid, and vitamin profile",
        link: "/our-package/womens-wellness",
    },
    {
        id: 3,
        image: "/assets/images/checkup3.png",
        title: "Cardiac & Diabetes Care",
        description: "Complete heart health, lipid profile, and HbA1c screening",
        link: "/our-package/cardiac-diabetes",
    },
    {
        id: 4,
        image: "/assets/images/checkup2.jpg",
        title: "Senior Citizen Package",
        description: "Preventive vital organ, liver, kidney, and bone checkup",
        link: "/our-package/senior-citizen",
    },
];

function Checkups() {
    const { slidesToShow, centerPadding } = useResponsiveSlider({ desktop: 3, mediumLaptop: 3, smallLaptop: 2, tablet: 2, smallTablet: 1, mobile: 1, padding: { mobile: "0px"}, });
    const slideConfig = {
        dots: true,
        arrows: false,
        infinite: checkupData.length > slidesToShow,
        autoplay: true,
        speed: 500,
        slidesToShow,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding,
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
                                <img src="/assets/images/exp-btn.svg" alt="" />
                            </span>
                            <span className="btn-text">View More</span>
                        </button>
                    </div>
                    <div className="cmn-right-align">
                        <Slider
                            {...slideConfig}
                            className="is_slick_dot"
                            key={`${slidesToShow}-${centerPadding}`}
                        >
                            {checkupData.map((item) => (
                                <div className="item" key={item.id}>
                                    <div className={`cmn_margin ${styles.img_block}`}>
                                        <img src={item.image} alt={item.title} />
                                        <div className={styles.text_block}>
                                            <div className={styles.lt_block}>
                                                <h3>{item.title}</h3>
                                                <p>{item.description}</p>
                                            </div>
                                            <Link href={item.link} className={`arrow-btn ${styles.arrow_btn}`}>
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                                    <polyline points="7 7 17 7 17 17"></polyline>
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkups