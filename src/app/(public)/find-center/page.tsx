"use client";
import React, { useRef, useState } from "react";
import Link from 'next/link';
import './page.css';

type PatientGender = "Male" | "Female" | "Other" | "";

interface NewPatient {
    gender: PatientGender;
}

function page() {
    const [newPatient, setNewPatient] = useState({
        gender: "",
    });
    return (
        <>
            <div className="find-centre">
                <div className="breadcrumb-wrap">
                    <div className="container">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link href="#">Patient</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Find A Center
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="in-banner">
                    <div className="container">
                        <div className="inn">
                            <img src="/assets/images/find-banner.jpg" alt="" />
                            <div className="text-block">
                                <h1><span>Discover Trusted Diagnostic </span>Centers Near You.</h1>
                                <p>Explore our network of trusted diagnostic centers near you. Find convenient locations for quality lab tests, health checkups, and reliable diagnostic services, all in one place.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="center-list">
                    <div className="container">

                    </div>
                </div>

                <div className="eng-wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5 col-md-5 col-sm-12">
                                <div className="text-block">
                                    <h2>Quick Booking & Doctor <br />Prescription Upload</h2>
                                    <p>Contact us for routine tests to specialized blood tests and make your tomorrow healthy</p>
                                </div>
                                <div className="cmn-rating">
                                    <div className="icon">
                                        <img src="/assets/images/trust-card-ratings.webp" alt="" />
                                    </div>
                                    <div className="text">
                                        <h3>Highest rated <span>diagnostics lab</span></h3>
                                    </div>
                                </div>
                                <div className="cmn-lb-box">
                                    <div className="icon">
                                        <img src="/assets/images/labs-icon.webp" alt="" />
                                    </div>
                                    <div className="text">
                                        <h6>OWN LABS</h6>
                                        <p>NABL, EQAS accredited</p>
                                    </div>
                                </div>
                                <div className="cmn-lb-box">
                                    <div className="icon">
                                        <img src="/assets/images/heart-customer.webp" alt="" />
                                    </div>
                                    <div className="text">
                                        <h6>LOVED BY</h6>
                                        <p>1 M+ Customers</p>
                                    </div>
                                </div>
                                <div className="cmn-lb-box">
                                    <div className="icon">
                                        <img src="/assets/images/instant-sample-collection.webp" alt="" />
                                    </div>
                                    <div className="text">
                                        <h6>COLLECTION IN MINUTES</h6>
                                        <p>Instant Sample Collection</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7 col-md-7 col-sm-12">
                                <div className="form-wrap">
                                    <div className="form-in">
                                        <h3>Booking Enquiry</h3>
                                        <p>Fill in your details below. No advance payment required.</p>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <div className="inp-box">
                                                    <label>Full Name <span>*</span></label>
                                                    <input type="text" placeholder='Your Name' className='form-control' />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <div className="inp-box">
                                                    <label>Mobile Number <span>*</span></label>
                                                    <input type="text" placeholder='Your Name' className='form-control' />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <div className="inp-box">
                                                    <label>Preferred Booking Date <span>*</span></label>
                                                    <input type="date" placeholder='' className='form-control' />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <div className="inp-box">
                                                    <label>Gender</label>
                                                    <div className="gender-row">
                                                        <label className={`gender-btn ${newPatient.gender === "Male" ? "active" : ""}`}>
                                                            <input type="radio" name="gender" value="Male" checked={newPatient.gender === "Male"} onChange={() => setNewPatient({ ...newPatient, gender: "Male" })} />
                                                            <i className="fa-solid fa-mars"></i> Male
                                                        </label>

                                                        <label className={`gender-btn ${newPatient.gender === "Female" ? "active" : ""}`}>
                                                            <input type="radio" name="gender" value="Female" checked={newPatient.gender === "Female"} onChange={() => setNewPatient({ ...newPatient, gender: "Female" })} />
                                                            <i className="fa-solid fa-venus"></i> Female
                                                        </label>

                                                        <label className={`gender-btn ${newPatient.gender === "Other" ? "active" : ""}`}>
                                                            <input type="radio" name="gender" value="Other" checked={newPatient.gender === "Other"} onChange={() => setNewPatient({ ...newPatient, gender: "Other" })} />
                                                            <i className="fa-solid fa-transgender"></i> Other
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="inp-box">
                                                    <label>Complete Address for Home Collection (Optional)</label>
                                                    <input type="text" placeholder='' className='form-control' />
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="inp-box">
                                                    <label>Upload Doctor Prescription (JPG, PNG, PDF)</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="text-end">
                                                    <button className='cmn_btn'>Submit Report</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="is-testlist-faq">
                    <div className="container">
                        <div className="top-title">
                            <div className="left-pnl">
                                <h2>Additional Info</h2>
                                <p>Have any questions? We're here to assist you</p>
                            </div>
                            {/* <button className="expand-btn">
                            <span className="icon">
                                <img src="/assets/images/exp-btn.svg" alt="" />
                            </span>
                            <span className="btn-text">View More</span>
                        </button> */}
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
                                        What is a Medical Encyclopedia?
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
                                        What is an Association?
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
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default page