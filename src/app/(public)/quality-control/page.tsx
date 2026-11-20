import React from 'react';
import Link from 'next/link';
import './page.css';
function page() {
    return (
        <>
            <div className="breadcrumb-wrap">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href="#">Laboratoty</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Quality Control
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="in-banner">
                <div className="container">
                    <div className="inn">
                        <img src="/assets/images/quality-banner.jpg" alt="" />
                        <div className="text-block">
                            <h1>Quality Control</h1>
                            <p>Our stringent Quality Control System ensures accurate, reliable healthcare services and maintains the highest laboratory standards.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="qua-commit">
                <div className="container">
                    <h2>Our Commitment to Quality</h2>
                </div>
            </div>






        </>
    )
}

export default page