
"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./page.css";

const faqData = [
    {
        question: "How Can I Find Information On Tests And Packages?",
        answer: "You need to log in to www.nirnayanhealthcare.com and click on the option of Patient. You will get the information about tests and packages and can filter them according to your needs."
    },
    {
        question: "How Can I Book A Test Online?",
        answer: "You can visit our website, select your required test or package, and follow the booking process."
    },
    {
        question: "How Can I Find A Collection Center?",
        answer: "You can use the Find Center section on our website to locate your nearest collection center."
    },
    {
        question: "How Can I Download My Test Report?",
        answer: "Log in to your patient account and visit the reports section to download your test report."
    },
    {
        question: "How Can I Contact Customer Support?",
        answer: "You can contact our support team through the Contact Us section of our website."
    },
    {
        question: "Do You Provide Home Sample Collection?",
        answer: "Yes, you can check the availability of home sample collection while booking your test."
    }
];

function Page() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFaqs = faqData.filter((faq) =>
        `${faq.question} ${faq.answer}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
    );

    return (
        <>
            <div className="breadcrumb-wrap">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item active">
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
                            <input
                                type="text"
                                placeholder="Search for QA"
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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

                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((faq, index) => (
                                        <div className="accordion-item" key={index}>
                                            <h2 className="accordion-header" id={`heading-${index}`}>
                                                <button
                                                    className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#collapse-${index}`}
                                                    aria-expanded={index === 0}
                                                    aria-controls={`collapse-${index}`}
                                                >
                                                    {faq.question}
                                                </button>
                                            </h2>

                                            <div
                                                id={`collapse-${index}`}
                                                className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                                                aria-labelledby={`heading-${index}`}
                                                data-bs-parent="#faqAccordion"
                                            >
                                                <div className="accordion-body">
                                                    <p>{faq.answer}</p>
                                                    <Link href="/contact-us">Contact Us</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-faq-found">
                                        <p className="m-0">No matching questions found.</p>
                                    </div>
                                )}

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
    );
}

export default Page;
