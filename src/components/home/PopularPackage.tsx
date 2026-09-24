"use client";

import React, { use, useState } from 'react'
import styles from "./PopularPackage.module.css";
import Slider from "react-slick";

interface Organ {
    name: string;
    icon: string;
}

function PopularPackage() {
    var popular_slider = {
        dots: true,
        arrows: false,
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
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

    //organs array
    const organs: Organ[] = [
        { name: 'Breast', icon: '/assets/images/brest.svg' },
        { name: 'Heart', icon: '/assets/images/heart.svg' },
        { name: 'Hormones', icon: '/assets/images/hormone.svg' },
    ];
    const [selectedOrgan, setSelectedOrgan] = useState<Organ>(organs[0]);
    const selectOrgan = (organ: Organ) => {
        setSelectedOrgan(organ);
    };
    //organs array

    return (
        <div className={`popular-wrap ${styles.popular_wrap}`}>
            <div className="container">
                <div className={`top-title ${styles.top_title}`}>
                    <div className="left-pnl">
                        <h2>Our popular packages</h2>
                        <p>Contact us for routine tests to specialized blood tests and make your tomorrow healthy</p>
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

                <div className="organ-tabs-wrapper">
                    <div className="org-left">
                        <div className="organ-tabs">
                            {organs.map((organ, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`organ-tab ${selectedOrgan.name === organ.name ? 'active' : ''}`}
                                    onClick={() => selectOrgan(organ)}
                                >
                                    <span className="icon">
                                        <img src={organ.icon} alt={organ.name} />
                                    </span>
                                    <span className="text">{organ.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="select-pnl">
                        <select className="form-control form-select">
                            <option>By Organ</option>
                            <option>Most Popular</option>
                        </select>
                    </div>
                </div>

                <div className="cmn-right-align">
                    <Slider {...popular_slider} className='is_slick_dot'>
                        <div className="item">
                            <div className="pack-card cmn_margin">
                                <div className="image-section">
                                    <div className="img">
                                        <img src="/assets/images/pack-img.png" alt="" />
                                        <div className="img-lbl">
                                            THYROID
                                        </div>
                                    </div>
                                    <div className="popular-badge">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="icon">
                                        <img src="/assets/images/joint.png" alt="" />
                                    </div>
                                </div>
                                <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                <div className="contains-row">
                                    <h6>Contains</h6>
                                    <div className="test-count">
                                        <img src="/assets/images/laboratory.svg" alt="" />
                                        <p>90 Tests</p>
                                    </div>
                                </div>
                                <div className="tags">
                                    <span className="tag">CBC</span>
                                    <span className="tag">Liver</span>
                                    <span className="tag">Kidney</span>
                                    <span className="tag">+6 More</span>
                                </div>
                                <div className="info-section">
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/microscope.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Available in <span>Home & Lab</span></h6>
                                        </div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/calender.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Report <span>Same Day</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="flex-wrap">
                                        <div className="pr-sec">
                                            <h3 className="price">₹450</h3>
                                            <h6 className="old-price">₹899</h6>
                                        </div>
                                        <span className="discount">
                                            Save 10%
                                        </span>
                                    </div>
                                    <button className="cmn_btn">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="pack-card cmn_margin">
                                <div className="image-section">
                                    <div className="img">
                                        <img src="/assets/images/pack-img.png" alt="" />
                                        <div className="img-lbl">
                                            THYROID
                                        </div>
                                    </div>
                                    <div className="popular-badge">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="icon">
                                        <img src="/assets/images/joint.png" alt="" />
                                    </div>
                                </div>
                                <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                <div className="contains-row">
                                    <h6>Contains</h6>
                                    <div className="test-count">
                                        <img src="/assets/images/laboratory.svg" alt="" />
                                        <p>90 Tests</p>
                                    </div>
                                </div>
                                <div className="tags">
                                    <span className="tag">CBC</span>
                                    <span className="tag">Liver</span>
                                    <span className="tag">Kidney</span>
                                    <span className="tag">+6 More</span>
                                </div>
                                <div className="info-section">
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/microscope.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Available in <span>Home & Lab</span></h6>
                                        </div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/calender.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Report <span>Same Day</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="flex-wrap">
                                        <div className="pr-sec">
                                            <h3 className="price">₹450</h3>
                                            <h6 className="old-price">₹899</h6>
                                        </div>
                                        <span className="discount">
                                            Save 10%
                                        </span>
                                    </div>
                                    <button className="cmn_btn">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="pack-card cmn_margin">
                                <div className="image-section">
                                    <div className="img">
                                        <img src="/assets/images/pack-img.png" alt="" />
                                        <div className="img-lbl">
                                            THYROID
                                        </div>
                                    </div>
                                    <div className="popular-badge">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="icon">
                                        <img src="/assets/images/joint.png" alt="" />
                                    </div>
                                </div>
                                <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                <div className="contains-row">
                                    <h6>Contains</h6>
                                    <div className="test-count">
                                        <img src="/assets/images/laboratory.svg" alt="" />
                                        <p>90 Tests</p>
                                    </div>
                                </div>
                                <div className="tags">
                                    <span className="tag">CBC</span>
                                    <span className="tag">Liver</span>
                                    <span className="tag">Kidney</span>
                                    <span className="tag">+6 More</span>
                                </div>
                                <div className="info-section">
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/microscope.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Available in <span>Home & Lab</span></h6>
                                        </div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/calender.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Report <span>Same Day</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="flex-wrap">
                                        <div className="pr-sec">
                                            <h3 className="price">₹450</h3>
                                            <h6 className="old-price">₹899</h6>
                                        </div>
                                        <span className="discount">
                                            Save 10%
                                        </span>
                                    </div>
                                    <button className="cmn_btn">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="pack-card cmn_margin">
                                <div className="image-section">
                                    <div className="img">
                                        <img src="/assets/images/pack-img.png" alt="" />
                                        <div className="img-lbl">
                                            THYROID
                                        </div>
                                    </div>
                                    <div className="popular-badge">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="icon">
                                        <img src="/assets/images/joint.png" alt="" />
                                    </div>
                                </div>
                                <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                <div className="contains-row">
                                    <h6>Contains</h6>
                                    <div className="test-count">
                                        <img src="/assets/images/laboratory.svg" alt="" />
                                        <p>90 Tests</p>
                                    </div>
                                </div>
                                <div className="tags">
                                    <span className="tag">CBC</span>
                                    <span className="tag">Liver</span>
                                    <span className="tag">Kidney</span>
                                    <span className="tag">+6 More</span>
                                </div>
                                <div className="info-section">
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/microscope.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Available in <span>Home & Lab</span></h6>
                                        </div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/calender.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Report <span>Same Day</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="flex-wrap">
                                        <div className="pr-sec">
                                            <h3 className="price">₹450</h3>
                                            <h6 className="old-price">₹899</h6>
                                        </div>
                                        <span className="discount">
                                            Save 10%
                                        </span>
                                    </div>
                                    <button className="cmn_btn">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="pack-card cmn_margin">
                                <div className="image-section">
                                    <div className="img">
                                        <img src="/assets/images/pack-img.png" alt="" />
                                        <div className="img-lbl">
                                            THYROID
                                        </div>
                                    </div>
                                    <div className="popular-badge">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="icon">
                                        <img src="/assets/images/joint.png" alt="" />
                                    </div>
                                </div>
                                <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                <div className="contains-row">
                                    <h6>Contains</h6>
                                    <div className="test-count">
                                        <img src="/assets/images/laboratory.svg" alt="" />
                                        <p>90 Tests</p>
                                    </div>
                                </div>
                                <div className="tags">
                                    <span className="tag">CBC</span>
                                    <span className="tag">Liver</span>
                                    <span className="tag">Kidney</span>
                                    <span className="tag">+6 More</span>
                                </div>
                                <div className="info-section">
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/microscope.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Available in <span>Home & Lab</span></h6>
                                        </div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/calender.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Report <span>Same Day</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="flex-wrap">
                                        <div className="pr-sec">
                                            <h3 className="price">₹450</h3>
                                            <h6 className="old-price">₹899</h6>
                                        </div>
                                        <span className="discount">
                                            Save 10%
                                        </span>
                                    </div>
                                    <button className="cmn_btn">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default PopularPackage