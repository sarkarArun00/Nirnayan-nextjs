import React from "react";
import Link from "next/link";
import "./TestDetail.css";

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
                                <h2>Complete Blood Count (CBC)</h2>
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
                        <li className="active"><Link href="#">Overview</Link></li>
                        <li><Link href="#">City Wise Pricing</Link></li>
                        <li><Link href="#">Related Test</Link></li>
                        <li><Link href="#">Related Package</Link></li>
                        <li><Link href="#">Blog</Link></li>
                        <li><Link href="#">Feedback</Link></li>
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
            <div className="overview" style={{ height: "200px" }}>
                <h2>a</h2>
            </div>
            <div className="city-pricing" style={{ height: "200px" }}>
                <h2>b</h2>
            </div>
            <div className="related-test" style={{ height: "200px" }}>
                <h2>c</h2>
            </div>
            <div className="related-pkg" style={{ height: "200px" }}>
                <h2>d</h2>
            </div>
            <div className="blog" style={{ height: "200px" }}>
                <h2>e</h2>
            </div>
            <div className="feedback" style={{ height: "200px" }}>
                <h2>end</h2>
            </div>
        </div>
    );
}