"use client";
import React from 'react'
import styles from './BookWith.module.css';
import Slider from 'react-slick';
function BookWith() {
    const slideConfig = {
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        infinite: true,
        autoplay: true,
        centerMode: true,
        centerPadding: '60px',
        responsive: [
            {
                breakpoint: 1700,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '0',

                },
            },
        ],
    };

    const slides = [
        {
            title: "Accurate Reports",
            description:
                "Clear, accurate medical insights at a glance.",
            imgSrc: "/assets/images/with-icon1.png",
            bgColor: "#ECF3FE",
        },
        {
            title: "4000+ Lab Tests & Packages",
            description:
                "Explore 4,000+ lab tests and packages for your healthcare needs.",
            imgSrc: "/assets/images/with-icon2.png",
            bgColor: "#D9F3E5",
        },
        {
            title: "Home Collection Facility",
            description:
                "Blood sample collection at your preferred time, from home.",
            imgSrc: "/assets/images/with-icon3.png",
            bgColor: "#F2F2F2",
        },
        {
            title: "NABL Accredited Pathology",
            description:
                "Trusted testing from a NABL-accredited Pathology laboratory.",
            imgSrc: "/assets/images/with-icon4.png",
            bgColor: "#EDE6F3",
        },
        {
            title: "Trained Phlebotomist",
            description: "Skilled professionals for safe and comfortable sample collection.",
            imgSrc: "/assets/images/with-icon5.png",
            bgColor: "#FFFAE6",
        },
        {
            title: "Expert Pathologists",
            description:
                "We have around 100+ trusted pathologists to deliver accurate reports with proper research",
            imgSrc: "/assets/images/with-icon6.png",
            bgColor: "#FFE6E6",
        },
    ];

    return (
        <>
            <div className={styles.with_us}>
                <div className="container">
                    <div className="top-title">
                        <div className="left-pnl">
                            <h2>Why Test Book With Us</h2>
                            <p>India’s fastest AI powered & temperature - controlled supply chain to collect and test your blood in freshest state.</p>
                        </div>
                        <button className="expand-btn">
                            <span className="icon">
                                <img src="/assets/images/exp-btn.svg" alt="" />
                            </span>
                            <span className="btn-text">View More</span>
                        </button>
                    </div>
                    <div className="cmn-right-align">
                        <Slider {...slideConfig} className='is_slick_dot'>
                            {slides.map((slide, index) => (
                                <div className={styles.slide} key={index}>
                                    <div
                                        className={`${styles.box} cmn_margin`}
                                        style={{ backgroundColor: slide.bgColor }}
                                    >
                                        <img src={slide.imgSrc} alt={slide.title} />

                                        <div className={styles["text-block"]}>
                                            <h5>{slide.title}</h5>
                                            <p>{slide.description}</p>
                                        </div>
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
        </>
    )
}

export default BookWith