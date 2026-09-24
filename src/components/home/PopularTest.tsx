"use client";

import React, { use, useState } from 'react'
import styles from "./PopularTest.module.css";
import Slider from "react-slick";

interface Organ {
    name: string;
    icon: string;
}

function PopularTest() {
    var popular_slider = {
        dots: true,
        arrows: false,
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '50px',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '0px 15% 0px 0px', // Adjust peek for smaller screens
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
        <div className={styles.pop_main}>
            <div className={styles.why_us}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 col-md-12 col-sm-12">
                            <div className={styles.text_block}>
                                <h2>Why Choose <span>Nirnayan</span></h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dapibus ullamcorper mi, non
                                    vestibulum magna dapibus vitae. Nulla id efficitur neque</p>
                                <ul>
                                    <li><a href="#" className="cmn_btn">Explore Tests</a></li>
                                    <li><a href="#" className="sec_btn">See More Packages</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-12 col-sm-12">
                            <div className={styles.ch_grid}>
                                <div className={styles.box}>
                                    <div className={styles.inn}>
                                        <img className={styles.icon} src="/assets/images/ch-icon.svg" alt="" />
                                        <img className={styles.ch_icon} src="/assets/images/ch-icon01.png" alt="" />
                                        <h2>5000+</h2>
                                        <p>Collection</p>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <div className={styles.inn}>
                                        <img className={styles.icon} src="/assets/images/ch-icon1.svg" alt="" />
                                        <img className={styles.ch_icon} src="/assets/images/ch-icon02.png" alt="" />
                                        <h2>100+</h2>
                                        <p>Doctors</p>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <div className={styles.inn}>
                                        <img className={styles.icon} src="/assets/images/ch-icon2.svg" alt="" />
                                        <img className={styles.ch_icon} src="/assets/images/ch-icon03.png" alt="" />
                                        <h2>400+</h2>
                                        <p>Logistic Strengths</p>
                                    </div>
                                </div>
                                <div className={styles.box}>
                                    <div className={styles.inn}>
                                        <img className={styles.icon} src="/assets/images/ch-icon3.svg" alt="" />
                                        <img className={styles.ch_icon} src="/assets/images/ch-icon04.png" alt="" />
                                        <h2>4000+</h2>
                                        <p>Lab Tests & Packages</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="popular-wrap">
                <div className="container">
                    <div className="top-title">
                        <div className="left-pnl">
                            <h2>Our popular <span className="gradient-text">tests</span></h2>
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
                                <div className="test-box is-popular">
                                    <div className="top-pnl">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="wh-block">
                                        <div className="inn-pnl">
                                            <h2>Urea - Serum</h2>
                                            <p>A complete blood count (CBC) also known as a full blood count (FBC)</p>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/report.svg" alt="" />
                                                    <h6>Reports in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="days">Days</span>
                                                </div>
                                            </div>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/ava.svg" alt="" />
                                                    <h6>Available in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="lab"><img src="/assets/images/home.svg" alt="" />
                                                        Home</span>
                                                    <span className="lab"><img src="/assets/images/lab.svg" alt="" />
                                                        Lab</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btm-pnl">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="price">₹500.00 <del>₹1000</del></span>
                                                <span className="discount">10% Off</span>
                                            </div>
                                            <button className="cmn_btn">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="test-box">
                                    <div className="top-pnl">
                                        <img src="/assets/images/lung.svg" alt="" />
                                        <h6>By Lungs Organs</h6>
                                    </div>
                                    <div className="wh-block">
                                        <div className="inn-pnl">
                                            <h2>Urea - Serum</h2>
                                            <p>A complete blood count (CBC) also known as a full blood count (FBC)</p>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/report.svg" alt="" />
                                                    <h6>Reports in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="days">Days</span>
                                                </div>
                                            </div>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/ava.svg" alt="" />
                                                    <h6>Available in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="lab"><img src="/assets/images/home.svg" alt="" />
                                                        Home</span>
                                                    <span className="lab"><img src="/assets/images/lab.svg" alt="" />
                                                        Lab</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btm-pnl">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="price">₹500.00 <del>₹1000</del></span>
                                                <span className="discount">10% Off</span>
                                            </div>
                                            <button className="cmn_btn">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="test-box is-popular">
                                    <div className="top-pnl">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="wh-block">
                                        <div className="inn-pnl">
                                            <h2>Urea - Serum</h2>
                                            <p>A complete blood count (CBC) also known as a full blood count (FBC)</p>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/report.svg" alt="" />
                                                    <h6>Reports in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="days">Days</span>
                                                </div>
                                            </div>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/ava.svg" alt="" />
                                                    <h6>Available in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="lab"><img src="/assets/images/home.svg" alt="" />
                                                        Home</span>
                                                    <span className="lab"><img src="/assets/images/lab.svg" alt="" />
                                                        Lab</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btm-pnl">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="price">₹500.00 <del>₹1000</del></span>
                                                <span className="discount">10% Off</span>
                                            </div>
                                            <button className="cmn_btn">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="test-box">
                                    <div className="top-pnl">
                                        <img src="/assets/images/lung.svg" alt="" />
                                        <h6>By Lungs Organs</h6>
                                    </div>
                                    <div className="wh-block">
                                        <div className="inn-pnl">
                                            <h2>Urea - Serum</h2>
                                            <p>A complete blood count (CBC) also known as a full blood count (FBC)</p>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/report.svg" alt="" />
                                                    <h6>Reports in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="days">Days</span>
                                                </div>
                                            </div>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/ava.svg" alt="" />
                                                    <h6>Available in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="lab"><img src="/assets/images/home.svg" alt="" />
                                                        Home</span>
                                                    <span className="lab"><img src="/assets/images/lab.svg" alt="" />
                                                        Lab</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btm-pnl">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="price">₹500.00 <del>₹1000</del></span>
                                                <span className="discount">10% Off</span>
                                            </div>
                                            <button className="cmn_btn">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="test-box is-popular">
                                    <div className="top-pnl">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="wh-block">
                                        <div className="inn-pnl">
                                            <h2>Urea - Serum</h2>
                                            <p>A complete blood count (CBC) also known as a full blood count (FBC)</p>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/report.svg" alt="" />
                                                    <h6>Reports in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="days">Days</span>
                                                </div>
                                            </div>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/ava.svg" alt="" />
                                                    <h6>Available in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="lab"><img src="/assets/images/home.svg" alt="" />
                                                        Home</span>
                                                    <span className="lab"><img src="/assets/images/lab.svg" alt="" />
                                                        Lab</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btm-pnl">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="price">₹500.00 <del>₹1000</del></span>
                                                <span className="discount">10% Off</span>
                                            </div>
                                            <button className="cmn_btn">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="test-box">
                                    <div className="top-pnl">
                                        <img src="/assets/images/lung.svg" alt="" />
                                        <h6>By Lungs Organs</h6>
                                    </div>
                                    <div className="wh-block">
                                        <div className="inn-pnl">
                                            <h2>Urea - Serum</h2>
                                            <p>A complete blood count (CBC) also known as a full blood count (FBC)</p>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/report.svg" alt="" />
                                                    <h6>Reports in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="days">Days</span>
                                                </div>
                                            </div>
                                            <div className="info">
                                                <div className="left">
                                                    <img src="/assets/images/ava.svg" alt="" />
                                                    <h6>Available in</h6>
                                                </div>
                                                <div className="right">
                                                    <span className="lab"><img src="/assets/images/home.svg" alt="" />
                                                        Home</span>
                                                    <span className="lab"><img src="/assets/images/lab.svg" alt="" />
                                                        Lab</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btm-pnl">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="price">₹500.00 <del>₹1000</del></span>
                                                <span className="discount">10% Off</span>
                                            </div>
                                            <button className="cmn_btn">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopularTest