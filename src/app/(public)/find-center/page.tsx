"use client";
import React, { useRef, useState } from "react";
import Link from 'next/link';
import './page.css';

type PatientGender = "Male" | "Female" | "Other" | "";

interface NewPatient {
    gender: PatientGender;
}

function page() {
    const [files, setFiles] = useState<File[]>([]);
    const [newPatient, setNewPatient] = useState({
        gender: "",
    });

    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Handle File Upload
    const handleFiles = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;
        const newFiles = Array.from(selectedFiles).filter(
            (file) =>
                ["image/jpeg", "image/png", "application/pdf"].includes(
                    file.type
                ) &&
                file.size <= 10 * 1024 * 1024
        );
        setFiles((prev) => [...prev, ...newFiles]);
    };

    // Remove Uploaded File
    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };


    return (
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

            <div className="center-main">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 col-md-7 col-sm-12">
                            <div className="centre-list">
                                <div className="box">
                                    <div className="top-block">
                                        <div className="icon">
                                            <img src="/assets/images/center.svg" alt="" />
                                        </div>
                                        <div className="info">
                                            <h3>Central Lab Unit 1</h3>
                                            <p>Kolkata, West Bengal, India</p>
                                        </div>
                                    </div>
                                    <div className="mid-center">
                                        <div className="left">
                                            <div className="center-add">
                                                <i className="fa-solid fa-location-dot"></i>
                                                <p>145, Rajarhat Road Jyangra, 24 Paraganas North Kolkata - 700059, West Bengal, India</p>
                                            </div>
                                            <div className="center-bottom">
                                                <div className="cent-box">
                                                    <i className="fa-regular fa-clock"></i>
                                                    <p>Everyday 12 P.M - 12 A.M</p>
                                                </div>
                                                <div className="cent-box">
                                                    <i className="fa-solid fa-phone"></i>
                                                    <p>(033) 25700075</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="share-btn"><i className="fa-solid fa-share-nodes"></i></button>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="top-block">
                                        <div className="icon">
                                            <img src="/assets/images/center.svg" alt="" />
                                        </div>
                                        <div className="info">
                                            <h3>Central Lab Unit 1</h3>
                                            <p>Kolkata, West Bengal, India</p>
                                        </div>
                                    </div>
                                    <div className="mid-center">
                                        <div className="left">
                                            <div className="center-add">
                                                <i className="fa-solid fa-location-dot"></i>
                                                <p>145, Rajarhat Road Jyangra, 24 Paraganas North Kolkata - 700059, West Bengal, India</p>
                                            </div>
                                            <div className="center-bottom">
                                                <div className="cent-box">
                                                    <i className="fa-regular fa-clock"></i>
                                                    <p>Everyday 12 P.M - 12 A.M</p>
                                                </div>
                                                <div className="cent-box">
                                                    <i className="fa-solid fa-phone"></i>
                                                    <p>(033) 25700075</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="share-btn"><i className="fa-solid fa-share-nodes"></i></button>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="top-block">
                                        <div className="icon">
                                            <img src="/assets/images/center.svg" alt="" />
                                        </div>
                                        <div className="info">
                                            <h3>Central Lab Unit 1</h3>
                                            <p>Kolkata, West Bengal, India</p>
                                        </div>
                                    </div>
                                    <div className="mid-center">
                                        <div className="left">
                                            <div className="center-add">
                                                <i className="fa-solid fa-location-dot"></i>
                                                <p>145, Rajarhat Road Jyangra, 24 Paraganas North Kolkata - 700059, West Bengal, India</p>
                                            </div>
                                            <div className="center-bottom">
                                                <div className="cent-box">
                                                    <i className="fa-regular fa-clock"></i>
                                                    <p>Everyday 12 P.M - 12 A.M</p>
                                                </div>
                                                <div className="cent-box">
                                                    <i className="fa-solid fa-phone"></i>
                                                    <p>(033) 25700075</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="share-btn"><i className="fa-solid fa-share-nodes"></i></button>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="top-block">
                                        <div className="icon">
                                            <img src="/assets/images/center.svg" alt="" />
                                        </div>
                                        <div className="info">
                                            <h3>Central Lab Unit 1</h3>
                                            <p>Kolkata, West Bengal, India</p>
                                        </div>
                                    </div>
                                    <div className="mid-center">
                                        <div className="left">
                                            <div className="center-add">
                                                <i className="fa-solid fa-location-dot"></i>
                                                <p>145, Rajarhat Road Jyangra, 24 Paraganas North Kolkata - 700059, West Bengal, India</p>
                                            </div>
                                            <div className="center-bottom">
                                                <div className="cent-box">
                                                    <i className="fa-regular fa-clock"></i>
                                                    <p>Everyday 12 P.M - 12 A.M</p>
                                                </div>
                                                <div className="cent-box">
                                                    <i className="fa-solid fa-phone"></i>
                                                    <p>(033) 25700075</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="share-btn"><i className="fa-solid fa-share-nodes"></i></button>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="top-block">
                                        <div className="icon">
                                            <img src="/assets/images/center.svg" alt="" />
                                        </div>
                                        <div className="info">
                                            <h3>Central Lab Unit 1</h3>
                                            <p>Kolkata, West Bengal, India</p>
                                        </div>
                                    </div>
                                    <div className="mid-center">
                                        <div className="left">
                                            <div className="center-add">
                                                <i className="fa-solid fa-location-dot"></i>
                                                <p>145, Rajarhat Road Jyangra, 24 Paraganas North Kolkata - 700059, West Bengal, India</p>
                                            </div>
                                            <div className="center-bottom">
                                                <div className="cent-box">
                                                    <i className="fa-regular fa-clock"></i>
                                                    <p>Everyday 12 P.M - 12 A.M</p>
                                                </div>
                                                <div className="cent-box">
                                                    <i className="fa-solid fa-phone"></i>
                                                    <p>(033) 25700075</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="share-btn"><i className="fa-solid fa-share-nodes"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-5 col-sm-12">
                            <div className="find-loc">
                                <h4>Find Location</h4>
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29416.17436256192!2d88.63191647069898!3d22.838683126624026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8b05b5bbc32af%3A0x1c137b4a7842c5fc!2sHabra%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1793958549487!5m2!1sen!2sin" loading="lazy"></iframe>
                            </div>
                            <div className="find-collect">
                                <h4><span>Find Collection</span> Centers Near You</h4>
                                <ul>
                                    <li>Located across multiple cities</li>
                                    <li>Provide 4000+ pathological tests & packages</li>
                                    <li>Offer trusted pathology services with 250+ employees</li>
                                </ul>
                                <Link href='#' className="cmn_btn">Find Tests</Link>
                                <img src="/assets/images/find-img.png" alt="" />
                            </div>
                        </div>
                    </div>
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
                                                <input type="text" placeholder='Phone Number' className='form-control' />
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
                                                {/* Upload Area */}
                                                <div
                                                    className={`upload-area ${isDragging ? "dragging" : ""
                                                        }`}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging(true);
                                                    }}
                                                    onDragLeave={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging(false);
                                                    }}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging(false);
                                                        handleFiles(e.dataTransfer.files);
                                                    }}
                                                >
                                                    <div className="upload-file-icon">
                                                        <img src="/assets/images/pres-icon6.svg" alt="" />
                                                    </div>
                                                    <h6>Drop Prescription Here Or Click To Browse</h6>
                                                    <p>Supports JPEG, PNG, PDF (Up To 10MB Per File)</p>
                                                    <button
                                                        type="button"
                                                        className="sec_btn border-0"
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                    >
                                                        Browse File
                                                    </button>

                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        hidden
                                                        multiple
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        onChange={(e) => {
                                                            handleFiles(e.target.files);
                                                            e.target.value = "";
                                                        }}
                                                    />
                                                </div>

                                                {/* Uploaded Files */}
                                                <div className="uploaded-files">
                                                    {files.map((file, index) => (
                                                        <div
                                                            className="uploaded-file"
                                                            key={`${file.name}-${index}`}
                                                        >
                                                            <div className="left">
                                                                <div className="file-type-icon">
                                                                    <img
                                                                        src={
                                                                            file.type === "application/pdf"
                                                                                ? "/assets/images/pres-icon9.svg"
                                                                                : "/assets/images/pres-icon8.svg"
                                                                        }
                                                                        alt={file.type === "application/pdf" ? "PDF" : "Image"}
                                                                    />
                                                                </div>
                                                                <div className="file-info">
                                                                    <h6>{file.name}</h6>
                                                                    <p>
                                                                        {(
                                                                            file.size /
                                                                            (1024 * 1024)
                                                                        ).toFixed(2)}{" "}
                                                                        MB · Ready For Pathologist Review
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="remove-file"
                                                                onClick={() =>
                                                                    removeFile(index)
                                                                }
                                                                aria-label={`Remove ${file.name}`}
                                                            >
                                                                <i className="fa-solid fa-xmark"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
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
    )
}

export default page