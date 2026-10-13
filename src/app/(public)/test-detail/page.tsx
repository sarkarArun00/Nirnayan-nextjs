"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Slider from "react-slick";
import "./TestDetail.css";
import Faq from "@/components/home/Faq";
import BookWith from "@/components/home/BookWith";
import Testimonial from "@/components/home/Testimonial";
import Blog from "@/components/home/Blog";
import PopularPackage from "@/components/home/PopularPackage";
import PopularTest from "@/components/home/PopularTest";

type RatingProps = {
    rating?: number | string | null;
};

function Star({ fill }: { fill: number }) {
    const gradientId = React.useId();
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{
                display: "block",
                width: "20px",
                height: "20px",
                flexShrink: 0,
            }}
        >
            <defs>
                <linearGradient
                    id={gradientId}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop offset={`${fill}%`} stopColor="#FAC801" />
                    <stop offset={`${fill}%`} stopColor="#D9D9D9" />
                </linearGradient>
            </defs>

            <path
                fill={`url(#${gradientId})`}
                d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"
            />
        </svg>
    );
}

export default function TestDetail({ rating = 4.5 }: RatingProps) {
    const parsed = Number(rating);
    const value = Number.isFinite(parsed)
        ? Math.min(5, Math.max(0, parsed))
        : 0;
    // Sticky 
    useEffect(() => {
        const section = document.querySelector(".our-section");
        if (!section) return;
        const checkPosition = () => {
            const sectionTop = section.getBoundingClientRect().top;
            const header = document.querySelector("header");
            const headerBottom = header
                ? header.getBoundingClientRect().bottom
                : 80;
            const isActive = sectionTop <= headerBottom;
            document.body.classList.toggle("active", isActive);
            const stickyBar = document.querySelector(".sticky-bar");
            if (stickyBar) {
                const stickyBottom = stickyBar.getBoundingClientRect().bottom;
                const activationPoint = stickyBottom + 10;

                const sectionIds = [
                    "overview",
                    "city-pricing",
                    "related-test",
                    "related-pkg",
                    "blog",
                    "feedback",
                ];
                let activeSection = "";
                for (const id of sectionIds) {
                    const currentSection = document.getElementById(id);
                    if (
                        currentSection &&
                        currentSection.getBoundingClientRect().top <= activationPoint
                    ) {
                        activeSection = id;
                    } else if (currentSection) {
                        break;
                    }
                }
                document
                    .querySelectorAll(".sticky-bar ul li")
                    .forEach((li) => {
                        li.classList.toggle(
                            "active",
                            li.getAttribute("data-section") === activeSection
                        );
                    });
            }
        };
        window.addEventListener("scroll", checkPosition, { passive: true });
        window.addEventListener("resize", checkPosition);
        checkPosition();
        return () => {
            window.removeEventListener("scroll", checkPosition);
            window.removeEventListener("resize", checkPosition);
            document.body.classList.remove("active");
        };
    }, []);
    // Sticky 

    const wpSlider = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    const [isExpanded, setIsExpanded] = useState(false);
    const fullText = `A routine test that measures the components of your blood, including red blood cells, white blood cells, and platelets. It is often used to check your overall health and detect a wide range`;
    const characterLimit = 90;

    const toggleReadMore = () => {
        setIsExpanded((prev) => !prev);
    };

    const [activeTab, setActiveTab] = useState(0);
    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="main-block">
            <div className="sticky-bar">
                <div className="container">
                    <div className="top-wrap">
                        <div className="lt-side">
                            <div className="icon">
                                <img src="/assets/images/tube.png" alt="" />
                            </div>
                            <div className="text">
                                <div className="most-block d-flex align-items-center">
                                    <div className="popular-badge position-relative top-0 end-0 d-inline-flex">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="test-rating">
                                        <span className="test-rating-value">
                                            ({value.toFixed(1)})
                                        </span>
                                        <div className="test-rating-stars" role="img" aria-label={`${value} out of 5 stars`}>
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star key={i} fill={Math.min(1, Math.max(0, value - i)) * 100} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <h3>Complete Blood Count (CBC)</h3>
                            </div>
                        </div>

                        <div className="rt-side">
                            <div className="price-wrap">
                                <span className="price">₹299 <del>₹446</del> </span>
                                <span className="is-discount">25% off</span>
                            </div>
                            <button type="button" className="cmn_btn">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    <ul>
                        <li data-section="overview"><Link href="#overview">Overview</Link></li>
                        <li data-section="city-pricing"><Link href="#city-pricing">City Wise Pricing</Link></li>
                        <li data-section="related-test"><Link href="#related-test">Related Test</Link></li>
                        <li data-section="related-pkg"><Link href="#related-pkg">Related Package</Link></li>
                        <li data-section="blog"><Link href="#blog">Blog</Link></li>
                        <li data-section="feedback"><Link href="#feedback">Feedback</Link></li>
                    </ul>
                </div>
            </div>

            <div className="test-dtl">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href="/tests">Tests</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Diabetes Screening (HbA1C & Fasting Sugar)
                            </li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="tst-bann">
                                <img className="hexa-bg" src="/assets/images/hexa-bg.png" alt="" />
                                <img className="yellow-bg" src="/assets/images/yeallow-bg.png" alt="" />

                                <div className="text-block">
                                    <div className="popular-badge position-relative top-0 end-0 d-inline-flex">
                                        <img src="/assets/images/fire.svg" alt="" /><h6>Most Popular</h6>
                                    </div>
                                    <h2>Complete Blood Count (CBC)</h2>
                                    <p>
                                        {isExpanded ? fullText : `${fullText.substring(0, characterLimit)}... `}
                                        <button
                                            onClick={toggleReadMore}
                                            aria-expanded={isExpanded}
                                        >
                                            {isExpanded ? 'Read Less' : 'Read More'}
                                        </button>
                                    </p>
                                    <ul>
                                        <li>Also referred as</li>
                                        <li>kft</li>
                                        <li>kidney function test</li>
                                        <li>renal profile</li>
                                        <li>kidney test</li>
                                        <li>6+ more</li>
                                    </ul>
                                    <div className="deliver">
                                        <div className="box">
                                            <div className="icon">
                                                <img src="/assets/images/test-dtl1.svg" alt="" />
                                            </div>
                                            <div className="text">
                                                <h6>Sample Type <span>Blood</span></h6>
                                            </div>
                                        </div>
                                        <div className="box">
                                            <div className="icon">
                                                <img src="/assets/images/test-dtl2.svg" alt="" />
                                            </div>
                                            <div className="text">
                                                <h6>Report within <span>Same Day</span></h6>
                                            </div>
                                        </div>
                                        <div className="box">
                                            <div className="icon">
                                                <img src="/assets/images/test-dtl3.svg" alt="" />
                                            </div>
                                            <div className="text">
                                                <h6>Gender <span>Man & Woman</span></h6>
                                            </div>
                                        </div>
                                        <div className="box">
                                            <div className="icon">
                                                <img src="/assets/images/test-dtl2.svg" alt="" />
                                            </div>
                                            <div className="text">
                                                <h6>Fasting <span>8-10 hrs.</span></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <h6 className="is-ava"><img src="/assets/images/verify.svg" alt="" /> Available in Home & Lab</h6>
                                </div>
                                <div className="img-block">
                                    <img src="/assets/images/blood-samp.svg" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="product-view">
                                <div className="test-rating-stars" role="img" aria-label={`${value} out of 5 stars`}>
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <Star key={i} fill={Math.min(1, Math.max(0, value - i)) * 100} />
                                    ))}
                                </div>
                                <span className="discount-badge">25% <br />OFF</span>
                                <h4>Complete Blood Count (CBC)</h4>
                                <p>Available in Home & Lab</p>
                                <div className="inn">
                                    <div className="price">
                                        <span>₹299 <del>₹446</del></span>
                                        <h6>Quick Summary</h6>
                                    </div>
                                    <button className="cmn_btn">Add to Cart</button>
                                </div>
                            </div>

                            <Slider {...wpSlider} className="wp-slider is_slick_dot is-dtl-page">
                                <div className="item">
                                    <div className="text-block">
                                        <div className="lt">
                                            <img src="/assets/images/dtl-icon2.svg" alt="" />
                                        </div>
                                        <div className="rt">
                                            <div className="inn">
                                                <h4>WhatsApp to Book Tests</h4>
                                                <p>explore Lab Tests, and schedule home <br />sample collection through WhatsApp.</p>
                                            </div>
                                            <button className="arrow-btn">
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
                                    <div className="text-block">
                                        <div className="lt">
                                            <img src="/assets/images/dtl-icon3.svg" alt="" />
                                        </div>
                                        <div className="rt">
                                            <div className="inn">
                                                <h4>Call Us</h4>
                                                <p>Speak directly with our customer care <br />team.</p>
                                            </div>
                                            <button className="arrow-btn">
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
                                    <div className="text-block">
                                        <div className="lt">
                                            <img src="/assets/images/dtl-icon1.svg" alt="" />
                                        </div>
                                        <div className="rt">
                                            <div className="inn">
                                                <h4>Request a Callback</h4>
                                                <p>Share your number and we'll call you back <br />shortly.</p>
                                            </div>
                                            <button className="arrow-btn">
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
            </div>

            <section id="our-section" className="our-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div id="overview" className="overview">
                                <div className="test-tabs">
                                    <div className="tab-list">
                                        <button className={activeTab === 0 ? "active" : ""} onClick={() => setActiveTab(0)}>
                                            Tests Overview
                                        </button>

                                        <button className={activeTab === 1 ? "active" : ""} onClick={() => setActiveTab(1)}>
                                            Why this test
                                        </button>

                                        <button className={activeTab === 2 ? "active" : ""} onClick={() => setActiveTab(2)}>
                                            What’s Include
                                        </button>

                                        <button className={activeTab === 3 ? "active" : ""} onClick={() => setActiveTab(3)}>
                                            How does home sample collection work?
                                        </button>

                                        <button className={activeTab === 4 ? "active" : ""} onClick={() => setActiveTab(4)}>
                                            FAQ
                                        </button>
                                    </div>

                                    <div className="tab-content">
                                        {activeTab === 0 && (
                                            <div>
                                                <h3>Tests Overview</h3>
                                                <p>Add your test overview details here.</p>
                                            </div>
                                        )}

                                        {activeTab === 1 && (
                                            <div>
                                                <h3>Why this test</h3>
                                                <p>Add the reasons and benefits of this test here.</p>
                                            </div>
                                        )}

                                        {activeTab === 2 && (
                                            <div className="include">
                                                <h3>26 Test Parameters</h3>
                                                <p>CBC (Complete Blood Count) includes 26 parameters</p>

                                                <div className="accordion p-0" id="faqAccordion">
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="headingOne">
                                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                                                                aria-expanded="true" aria-controls="collapseOne">
                                                                <div className="ac-flex">
                                                                    <div className="icon">
                                                                        <img src="/assets/images/heart.png" alt="" />
                                                                    </div>
                                                                    <span>RBC Count</span>
                                                                </div>
                                                            </button>
                                                        </h2>
                                                        <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne"
                                                            data-bs-parent="#faqAccordion">
                                                            <div className="accordion-body">
                                                                <p>
                                                                    You need to log in to <strong>www.nirnayanhealthcare.com</strong> and click on the option of “Patient” and you will get the information about that and also you can filter test and packages according to you.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="headingTwo">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                                data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                                <div className="ac-flex">
                                                                    <div className="icon">
                                                                        <img src="/assets/images/heart.png" alt="" />
                                                                    </div>
                                                                    <span>Absolute Basophils Count, Blood</span>
                                                                </div>
                                                            </button>

                                                        </h2>

                                                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
                                                            data-bs-parent="#faqAccordion">
                                                            <div className="accordion-body">
                                                                <p>
                                                                    You can find all test and package information from the
                                                                    Patient section of our website.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="headingThree">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                                data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                                <div className="ac-flex">
                                                                    <div className="icon">
                                                                        <img src="/assets/images/heart.png" alt="" />
                                                                    </div>
                                                                    <span>Eosinophils</span>
                                                                </div>
                                                            </button>
                                                        </h2>

                                                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree"
                                                            data-bs-parent="#faqAccordion">
                                                            <div className="accordion-body">
                                                                <p>
                                                                    You can contact our support team for more information.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="headingFour">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                                data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                                <div className="ac-flex">
                                                                    <div className="icon">
                                                                        <img src="/assets/images/heart.png" alt="" />
                                                                    </div>
                                                                    <span>MPV Mean Platelet Volume</span>
                                                                </div>
                                                            </button>
                                                        </h2>

                                                        <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour"
                                                            data-bs-parent="#faqAccordion">
                                                            <div className="accordion-body">
                                                                <p>
                                                                    Please contact us for additional information.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-center pt-3">
                                                    <button className="cmn_btn">View All 26 Parameters</button>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 3 && (
                                            <div>
                                                <h3>How Home Sample Collection Work: Step 2 Step Guide</h3>
                                                <p>A CBC (Complete Blood Count) is a simple blood test that evaluates your overall health by measuring the levels.</p>
                                                <Slider {...settings} className="is_slick_dot is-step">
                                                    <div className="item">
                                                        <div className="box cmn_margin">
                                                            <div className="img-block">
                                                                <div className="num"><span>01</span></div>
                                                                <img src="/assets/images/step-img1.png" alt="" />
                                                                <div className="text-block">
                                                                    <h3>Choose Date & Time</h3>
                                                                    <p>CBC (Complete Blood Count) includes 26 parameters</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="box cmn_margin">
                                                            <div className="img-block">
                                                                <div className="num"><span>02</span></div>
                                                                <img src="/assets/images/step-img2.png" alt="" />
                                                                <div className="text-block">
                                                                    <h3>Our Phlebotomy Visit</h3>
                                                                    <p>CBC (Complete Blood Count) includes 26 parameters</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="box cmn_margin">
                                                            <div className="img-block">
                                                                <div className="num"><span>03</span></div>
                                                                <img src="/assets/images/step-img3.png" alt="" />
                                                                <div className="text-block">
                                                                    <h3>Sample Collection</h3>
                                                                    <p>CBC (Complete Blood Count) includes 26 parameters</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="box cmn_margin">
                                                            <div className="img-block">
                                                                <div className="num"><span>04</span></div>
                                                                <img src="/assets/images/step-img4.png" alt="" />
                                                                <div className="text-block">
                                                                    <h3>Lab Testing</h3>
                                                                    <p>CBC (Complete Blood Count) includes 26 parameters</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="box cmn_margin">
                                                            <div className="img-block">
                                                                <div className="num"><span>05</span></div>
                                                                <img src="/assets/images/step-img5.png" alt="" />
                                                                <div className="text-block">
                                                                    <h3>Get Your Report</h3>
                                                                    <p>CBC (Complete Blood Count) includes 26 parameters</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Slider>
                                            </div>
                                        )}

                                        {activeTab === 4 && (
                                            <div className="accordion p-0" id="faqAccordion">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingOne">
                                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                                                            aria-expanded="true" aria-controls="collapseOne">
                                                            How Can I Find Information On Tests And Packages?
                                                        </button>
                                                    </h2>
                                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne"
                                                        data-bs-parent="#faqAccordion">
                                                        <div className="accordion-body">
                                                            <p>
                                                                You need to log in to <strong>www.nirnayanhealthcare.com</strong> and click on the option of “Patient” and you will get the information about that and also you can filter test and packages according to you.
                                                            </p>
                                                            <a href="#">Contact Us</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingTwo">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                            data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                            How Can I Find Information On Tests And Packages?
                                                        </button>

                                                    </h2>

                                                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
                                                        data-bs-parent="#faqAccordion">
                                                        <div className="accordion-body">
                                                            <p>
                                                                You can find all test and package information from the
                                                                Patient section of our website.
                                                            </p>
                                                            <a href="#">Contact Us</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingThree">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                            data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                            How Can I Find Information On Tests And Packages?
                                                        </button>
                                                    </h2>

                                                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree"
                                                        data-bs-parent="#faqAccordion">
                                                        <div className="accordion-body">
                                                            <p>
                                                                You can contact our support team for more information.
                                                            </p>
                                                            <a href="#">Contact Us</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFour">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                            data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                            How Can I Find Information On Tests And Packages?
                                                        </button>
                                                    </h2>

                                                    <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour"
                                                        data-bs-parent="#faqAccordion">
                                                        <div className="accordion-body">
                                                            <p>
                                                                Please contact us for additional information.
                                                            </p>
                                                            <a href="#">Contact Us</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div id="city-pricing" className="city-pricing">
                                <h3>Complete Blood Count (CBC) Test Available In Other Cities</h3>
                                <div className="city-box">
                                    <div className="city-box-inn">
                                        <h5>Price In</h5>
                                    </div>
                                    <div className="city-box-inn">
                                        <h5>Siliguri</h5>
                                    </div>
                                    <div className="city-box-inn">
                                        <h5>₹ 500.00</h5>
                                        <button>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                strokeWidth="2">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="city-box">
                                    <div className="city-box-inn">
                                        <h5>Price In</h5>
                                    </div>
                                    <div className="city-box-inn">
                                        <h5>Bardhaman</h5>
                                    </div>
                                    <div className="city-box-inn">
                                        <h5>₹ 500.00</h5>
                                        <button>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                strokeWidth="2">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="city-box">
                                    <div className="city-box-inn">
                                        <h5>Price In</h5>
                                    </div>
                                    <div className="city-box-inn">
                                        <h5>Birbhum</h5>
                                    </div>
                                    <div className="city-box-inn">
                                        <h5>₹ 500.00</h5>
                                        <button>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                strokeWidth="2">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="city-box">
                                    <div className="city-box-inn">
                                        <h5>Price In</h5>
                                    </div>
                                    <div className="city-box-inn">
                                        <h5>Kolkata</h5>
                                    </div>
                                    <div className="city-box-inn">
                                        <h5>₹ 500.00</h5>
                                        <button>
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
                        <div className="col-lg-4">
                            <div className="most-book">
                                <h3>Most Frequently Book Test</h3>
                                <div className="test-list">
                                    <div className="test-card active">
                                        <span className="test-name">Complete Blood Count (CBC)</span>
                                        <div className="test-action">
                                            <div className="price-group">
                                                <span className="current-price">₹299 <del>₹446</del></span>
                                            </div>
                                            <button className="cart-btn">
                                                <i className="fa-solid fa-cart-shopping"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="test-card">
                                        <span className="test-name">Complete Blood Count (CBC)</span>
                                        <div className="test-action">
                                            <div className="price-group">
                                                <span className="current-price">₹299 <del>₹446</del></span>
                                            </div>
                                            <button className="cart-btn">
                                                <i className="fa-solid fa-cart-shopping"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="test-card">
                                        <span className="test-name">Complete Blood Count (CBC)</span>
                                        <div className="test-action">
                                            <div className="price-group">
                                                <span className="current-price">₹299 <del>₹446</del></span>
                                            </div>
                                            <button className="cart-btn">
                                                <i className="fa-solid fa-cart-shopping"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="side-img">
                                <img src="/assets/images/sidebar-img.png" alt="" />
                            </div>
                            <div className="privacy">
                                <h3>Privacy Policy</h3>
                                <ul>
                                    <li>We do not accept cash payments</li>
                                    <li>All modes of online payment are accepted</li>
                                    <li>Refunds will be credited back to the source of payment within 5-7 working days of order cancellation.</li>
                                    <li>All modes of online payment are accepted</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="related-test" className="related-test">
                    <PopularTest section={2} />
                </div>
                <div id="related-pkg" className="related-pkg">
                    <PopularPackage />
                </div>
                <div id="blog" className="blog">
                    <Blog />
                </div>
                <div id="feedback" className="feedback">
                    <Testimonial />
                </div>
                <div className="test-book">
                    <BookWith />
                </div>
                <Faq />
            </section>

        </div>
    );
}