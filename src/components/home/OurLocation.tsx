'use client';
import React, { useState } from 'react';
import Slider from 'react-slick';
import styles from './OurLocation.module.css';

function OurLocation() {
    const locations = [
        {
            id: 'kolkata',
            city: 'Kolkata',
            address: '145, Rajarhat Rd, Jyangra, North 24 Parganas, Kolkata 700059, WB, India',
            map: 'https://maps.google.com/',
            color: '#F5A623',
        },
        {
            id: 'patna',
            city: 'Patna',
            address: '145, Rajarhat Rd, Jyangra, North 24 Parganas, Patna, India',
            map: 'https://maps.google.com/',
            color: '#7B61FF',
        },
        {
            id: 'bhubaneswar',
            city: 'Bhubaneswar',
            address: 'Nirnayan Diagnostic Center, Bhubaneswar, Odisha, India',
            map: 'https://maps.google.com/',
            color: '#00A651',
        },
        {
            id: 'durgapur',
            city: 'Durgapur',
            address: 'Nirnayan Diagnostic Center, Durgapur, West Bengal, India',
            map: 'https://maps.google.com/',
            color: '#FF5C5C',
        },
    ];

    const [activeLocation, setActiveLocation] = useState(locations[0]);
    const [cityAnimating, setCityAnimating] = useState(false);

    const handleAfterChange = (currentSlideIndex: any) => {
        const index = currentSlideIndex % locations.length;
        setActiveLocation(locations[index]);

        setCityAnimating(false);
        requestAnimationFrame(() => {
            setCityAnimating(true);
        });
    };

    const handleViewMap = (item: any) => {
        window.open(item.map, '_blank', 'noopener,noreferrer');
    };

    const locationSlideConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        infinite: true,
        autoplay: true,
        speed: 500,
        cssEase: 'ease',
        afterChange: handleAfterChange,
        centerMode: true,
        centerPadding: '100px',
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 640,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <>
            <div className={styles.find_us}>
                <div className="container">
                    <div className={styles.top_block}>
                        <h2>Uniting Forces for Growth</h2>
                        <ul>
                            <li><img src="/assets/images/med-logo.png" alt="" /></li>
                            <li><img src="/assets/images/exi-logo.png" alt="" /></li>
                            <li><img src="/assets/images/health-logo.png" alt="" /></li>
                        </ul>
                        <p>Nirnayan turns its vision to the larger than reality. We are committed to being a trusted partner to achieve
                            business growth and goals. Ensure the highest quality standard Nirnayan extends its sphere to worldwide with
                            continuous improvement and development.</p>
                    </div>
                    <div className={styles.btm_block}>
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className={styles.img_block}>
                                    <img src="/assets/images/route.png" alt="" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className={styles.title_text}>
                                    <h2>
                                        Find Nirnayan{' '}
                                        <span className={cityAnimating ? styles.citySlideUp : ''}>
                                            {activeLocation?.city}
                                        </span>
                                    </h2>
                                </div>
                                <div className={styles.location_stats}>
                                    <div className={styles.stat_card}>
                                        <div className={styles.icon}>
                                            <i className="fa-solid fa-location-dot"></i>
                                        </div>
                                        <div className={styles.text}>
                                            <h2>3+</h2>
                                            <p>States</p>
                                        </div>
                                    </div>
                                    <div className={styles.stat_card}>
                                        <div className={styles.icon}>
                                            <i className="fa-solid fa-building"></i>
                                        </div>
                                        <div className={styles.text}>
                                            <h2>6+</h2>
                                            <p>Diagnostic Center</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="sliderWrapper">
                                    <Slider {...locationSlideConfig} className={`is_slick_dot ${styles.carousel}`}>
                                        {locations.map((item) => (
                                            <div key={item.id} className="slide">
                                                <div className="cmn_margin">
                                                    <div
                                                        className={styles.location_card}
                                                        style={{ borderLeft: `3px solid ${item.color}` }}
                                                    >
                                                        <div className={styles.location_content}>
                                                            <h5><i className="fa-solid fa-location-dot"></i> {item.city}</h5>
                                                            <p>{item.address}</p>
                                                        </div>

                                                        <button
                                                            className="cmn_btn"
                                                            type="button"
                                                            onClick={() => handleViewMap(item)}
                                                        >
                                                            View Map
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.download_wrap}>
                <div className="container">
                    <div className={styles.inn}>
                        <div className={styles.text_block}>
                            <h3>Trusted by the</h3>
                            <h2>100 million's users</h2>
                            <h4>Top Rated Healthcare App</h4>
                            <div className={styles.app_store_btn}>
                                <button><img src="/assets/images/play-store.png" alt="" /></button>
                                <button><img src="/assets/images/app-store.png" alt="" /></button>
                            </div>
                        </div>
                        <div className={styles.img_block}>
                            <img src="/assets/images/download-img.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OurLocation