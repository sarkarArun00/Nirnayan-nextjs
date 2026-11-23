"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import './page.css';
function page() {
    const [activeQuality, setActiveQuality] = useState(0);
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

                    <div className="inn">
                        <div className={`box ${activeQuality === 0 ? "active" : ""}`} onMouseEnter={() => setActiveQuality(0)}>
                            <img src="/assets/images/q-c-img1.png" alt="" />
                            <div className="text-block">
                                <h4>Randomized Protocol For Checking Samples</h4>
                                <p>Our research team has a specialized accession department with dedication and reliability for checking samples that they receive. Following such protocols, our quality management</p>
                            </div>
                        </div>

                        <div className={`box ${activeQuality === 1 ? "active" : ""}`} onMouseEnter={() => setActiveQuality(1)}>
                            <img src="/assets/images/q-c-img1.png" alt="" />
                            <div className="text-block">
                                <h4>Different Level Control Checks</h4>
                                <p>Accuracy is our priority which we are always eager to follow at every testing step. Though Nirnayan does not</p>
                            </div>
                        </div>

                        <div className={`box ${activeQuality === 2 ? "active" : ""}`} onMouseEnter={() => setActiveQuality(2)}>
                            <img src="/assets/images/q-c-img1.png" alt="" />
                            <div className="text-block">
                                <h4>Advanced Inspection Process Ensuring Quality and Safety</h4>
                                <p>Advanced inspection processes at Nirnayan encompass a diverse array of methodologies and technologies aimed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="qua-team">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5 col-md-5 col-sm-12">
                            <h3>A well-Trained <span>quality team</span></h3>
                            <p>Our Quality Control System is the backbone of our laboratory operations and accurate reliable healthcare services.</p>
                        </div>
                        <div className="col-lg-7 col-md-7 col-sm-12">
                            <div className="grid-box">
                                <div className="box">
                                    <div className="icon">
                                        <img src="/assets/images/tick.svg" alt="" />
                                    </div>
                                    <h4>Double Verification Process</h4>
                                </div>
                                <div className="box">
                                    <div className="icon">
                                        <img src="/assets/images/q-c-icon1.svg" alt="" />
                                    </div>
                                    <h4>Different Levels Of Quality Check</h4>
                                </div>
                                <div className="box">
                                    <div className="icon">
                                        <img src="/assets/images/q-c-icon2.svg" alt="" />
                                    </div>
                                    <h4>Green Laboratory</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="qua-faq">
                <div className="container">
                    <div className="top-title">
                        <div className="left-pnl">
                            <h2>Quality Policy</h2>
                            <p>Key elements of Nirnayan's quality policy include patient-centered care, clinical excellence, safety protocols, compliance with regulations, staff training, and accountability measures. By prioritizing these aspects, Our healthcare strives to enhance patient outcomes, satisfaction, and trust while maintaining operational efficiency and meeting industry standards. Patient-Centric Focus:</p>
                        </div>
                    </div>
                    <div className="accordion" id="faqAccordion">
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
                </div>
            </div>


        </>
    )
}

export default page