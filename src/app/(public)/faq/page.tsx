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
                            <li className="breadcrumb-item active" aria-current="page">
                                Frequently Asked Questions
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="in-banner">
                <div className="container">
                    <div className="inn">
                        <img src="/assets/images/faq-banner.jpg" alt="" />
                        <div className="text-block">
                            <h1><span>Solve Your </span>Queries Here</h1>
                            <p>Nirnayan offers various job opportunities and career advancements for people who value hard work, integrity, and learning</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="faq">
                <div className="container">
                    <div className="top-block text-center">
                        <h2>Frequently Asked Questions</h2>
                        <p>Have any questions? We're here to assist you</p>
                        <div className="form-block">
                            <input type="text" placeholder="Search for QA" className="form-control" />
                            <i className="fa-solid fa-magnifying-glass search-icon"></i>
                        </div>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-lg-5 col-md-12 col-sm-12">
                            <div className="img-block">
                                <img src="/assets/images/faq-img.png" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-12 col-sm-12">
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
                    <div className="questaions">
                        <div className="text-block">
                            <h2>Still Have Question</h2>
                            <p>Can’t find the answer you’re looking for? Please chat to our friendly team</p>
                        </div>
                        <button className="cmn_btn">Get In Touch</button>
                        <img alt="" src="/assets/images/faq-icon.png" />
                    </div>
                </div>
            </div>





        </>
    )
}

export default page