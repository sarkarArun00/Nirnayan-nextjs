"use client";
import React from 'react';
import Slider from "react-slick"
import styles from './Organs.module.css';

interface OrganItem {
    id: string | number;
    image: string;
    title: string;
    description: string;
}

const organData: OrganItem[] = [
    {
        id: 1,
        title: "Heart",
        description: "Evaluates cardiovascular health and cholesterol levels.",
        image: "/assets/images/organ-img.png",
    },
    {
        id: 2,
        title: "Liver",
        description: "Monitors liver enzymes and overall metabolic function.",
        image: "/assets/images/organ-img.png",
    },
    {
        id: 3,
        title: "Kidneys",
        description: "Checks filtration rate and fluid balance.",
        image: "/assets/images/organ-img.png",
    },
    {
        id: 2,
        title: "Liver",
        description: "Monitors liver enzymes and overall metabolic function.",
        image: "/assets/images/organ-img.png",
    },
    {
        id: 3,
        title: "Kidneys",
        description: "Checks filtration rate and fluid balance.",
        image: "/assets/images/organ-img.png",
    },
];

function Organs() {
    const organConfig = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '60px',
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

    const lifesConfig = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '25%',
    };

    return (
        <>
            <div className={styles.explore_organ}>
                <div className="container">
                    <div className="top-title">
                        <div className="left-pnl">
                            <h2>Explore by Body organs</h2>
                            <p>
                                A comprehensive health screening designed to evaluate the functioning
                                of vital organs such as the heart, liver, kidneys, lungs, and pancreas.
                            </p>
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
                        <Slider {...organConfig} className="carousel is_slick_dot">
                            {organData.map((item) => (
                                <div key={item.id}>
                                    <div className={`cmn_margin ${styles.box}`}>
                                        <img src={item.image} alt={item.title} />
                                        <div className={styles.text_block}>
                                            <div className={styles.left}>
                                                <h3>{item.title}</h3>
                                                <p>{item.description}</p>
                                            </div>
                                            <div className={styles.right}>
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
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>

            <div className={styles.life_style}>
                <Slider {...lifesConfig} className="carousel is_slick_dot">
                    <div className="item">
                        <div className="cmn_margin">
                            <img src="/assets/images/lifestyle1.png" alt="" />
                        </div>
                    </div>
                    <div className="item">
                        <div className="cmn_margin">
                            <img src="/assets/images/lifestyle2.png" alt="" />
                        </div>
                    </div>
                    <div className="item">
                        <div className="cmn_margin">
                            <img src="/assets/images/lifestyle3.png" alt="" />
                        </div>
                    </div>
                </Slider>
            </div>
        </>
    )
}

export default Organs