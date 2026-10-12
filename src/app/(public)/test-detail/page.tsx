"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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

            <div className="amb">
                <div className="container">
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                </div>
            </div>

            <section id="our-section" className="our-section">
                <div id="overview" className="overview">
                    <h2>overview</h2>
                </div>
                <div id="city-pricing" className="city-pricing">
                    <h2>city-pricing</h2>
                </div>
                <div id="related-test" className="related-test">
                    <PopularTest />
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