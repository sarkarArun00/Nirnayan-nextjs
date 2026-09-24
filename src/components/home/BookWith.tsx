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
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const slides = [
        {
            title: "Accurate Reports",
            description:
                "Nirnayan delivers accurate test reports within the best TAT for the fastest treatment",
            imgSrc: "/assets/images/with-icon1.png",
            bgColor: "#ECF3FE",
        },
        {
            title: "4000+ Lab Tests & Packages",
            description:
                "Nirnayan has a vast range of blood tests menu with around 4000+ tests and test packages",
            imgSrc: "/assets/images/with-icon2.png",
            bgColor: "#D9F3E5",
        },
        {
            title: "Home Collection Facility",
            description:
                "To avoid trouble with blood samples, Nirnayan provides a home blood collection facility with your preferred date and time",
            imgSrc: "/assets/images/with-icon3.png",
            bgColor: "#F2F2F2",
        },
        {
            title: "NABL Accredited Pathology",
            description:
                "Nirnayan is an NABL-accredited pathology lab in Kolkata for its highest quality standards of pathology services",
            imgSrc: "/assets/images/with-icon4.png",
            bgColor: "#EDE6F3",
        },
        {
            title: "Trained Phlebotomist",
            description:
                "Nirnayan has appointed trained phlebotomists for blood collection with excellent care",
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
            <div className={styles.offer_banner}>
                <div className="container">
                    <img src="/assets/images/offer-banner.png" alt="" />
                </div>
            </div>

            <div className={styles.with_us}>
                <div className="container">
                    <div className="top-title">
                        <div className="left-pnl">
                            <h2>Why Test Book With Us</h2>
                            <p>India’s fastest AI powered & temperature - controlled supply chain to collect and test your blood in freshest state.</p>
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
                </div>
            </div>
        </>
    )
}

export default BookWith