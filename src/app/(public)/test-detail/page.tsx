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
                                    <p>A routine test that measures the components of your blood, including red
                                        blood cells, wh... <button>Read More</button></p>
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
                                <h2>overview</h2>
                            </div>
                            <div id="city-pricing" className="city-pricing">
                                <h2>city-pricing</h2>
                            </div>
                        </div>
                        <div className="col-lg-4">
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