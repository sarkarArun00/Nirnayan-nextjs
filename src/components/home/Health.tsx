'use client';
import React from 'react';
import styles from './Health.module.css';
import Slider from 'react-slick';

const slidesData = [
    {
        id: 1,
        title: 'Lifestyle Packages',
        description:
            'Molecular Diagnostics Detects Disease-Related DNA Or RNA Using Techniques Such As PCR And Sequencing.',
        image: '/assets/images/health.jpg',
    },
    {
        id: 2,
        title: 'Allergy',
        description: 'Choose From A Wide Range Of Essential Health Tests',
        image: '/assets/images/health.jpg',
    },
    {
        id: 3,
        title: 'Diabates',
        description: 'Choose From A Wide Range Of Essential Health Tests',
        image: '/assets/images/health.jpg',
    },
    {
        id: 4,
        title: 'Thyroid Care',
        description: 'Comprehensive blood profiling and hormone tracking.',
        image: '/assets/images/health.jpg',
    },
];

function Health() {
    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        focusOnSelect: true,
        centerPadding: '60px',
        variablewidth: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <>
            <div className="health_slider">
                <div className="container">
                    <div className="top-title">
                        <div className="left-pnl">
                            <h2>Your Guide to Health & Medicine</h2>
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
                        <Slider {...settings} className="is_slick_dot">
                            {slidesData.map((slide) => (
                                <div key={slide.id} className="item">
                                    <div className={`cmn_margin ${styles.img_block}`}>
                                        <img src={slide.image} alt={slide.title} />
                                        <div className={styles.text_block}>
                                            <div className={styles.lt_block}>
                                                <h3>{slide.title}</h3>
                                                <p>{slide.description}</p>
                                            </div>
                                            <button className={`arrow-btn ${styles.arrow_btn}`}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                                    <polyline points="7 7 17 7 17 17"></polyline>
                                                </svg>
                                            </button>
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

export default Health