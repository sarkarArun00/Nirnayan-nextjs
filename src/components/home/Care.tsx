"use client";

import React, { useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import styles from './Care.module.css';

const slideData = [
    {
        id: "1",
        cardTitle: "CBC",
        cardDesc: "A Complete Blood Count (CBC) Also Known As A Full Blood Count (FBC)....",
        reportsIn: "Days",
        price: "₹ 2,599",
        originalPrice: "₹ 9,111",
        discount: "10% Off",
        mainHeading: "Pregnancy Care",
        mainDesc: "Pregnancy Care, Often Referred To As Prenatal Or Antenatal Care, Encompasses The Medical, Nutritional, And Lifestyle Support Provided To Expectant Mothers.",
        mainImage: "/assets/images/preg1.png",
    },
    {
        id: "2",
        cardTitle: "Thyroid Profile",
        cardDesc: "Evaluates thyroid gland function to check for hypothyroidism or hyperthyroidism.",
        reportsIn: "24 Hours",
        price: "₹ 1,199",
        originalPrice: "₹ 2,500",
        discount: "50% Off",
        mainHeading: "Full Body Health Check",
        mainDesc: "Comprehensive health screenings tailored to detect early warnings and maintain overall wellness across all age groups.",
        mainImage: "/assets/images/preg2.png",
    },
];

export default function Care() {
    const [activeSlide, setActiveSlide] = useState(0);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        beforeChange: (current: number, next: number) => setActiveSlide(next),
    };

    const currentContent = slideData[activeSlide];

    return (
        <div className={styles.preg_care}>
            <div className="container">
                <div className={styles.inn}>
                    <div className="row align-items-center">
                        <div className="col-lg-4 col-md-5 col-sm-12">
                            <Slider {...sliderSettings} className="is_slick_dot">
                                {slideData.map((item) => (
                                    <div className="item" key={item.id}>
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
                                ))}
                            </Slider>
                        </div>
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className={styles.care_details}>
                                <div className={styles.details_content}>
                                    <div className={styles.text_block}>
                                        <h2>{currentContent.mainHeading}</h2>
                                        <p>{currentContent.mainDesc}</p>
                                        <Link href="#" className="sec_btn">
                                            See More Packages
                                        </Link>
                                    </div>
                                </div>
                                <div className={styles.care_image}>
                                    <img
                                        src={currentContent.mainImage}
                                        alt={currentContent.mainHeading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}