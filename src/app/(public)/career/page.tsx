"use client";
import { useState } from "react";
import Link from 'next/link';
import './page.css';

const benefitsData = [
    {
        title: "Employee Benefits",
        description:
            "Started As A Flourishing Start-Up, Redcliffe Labs Has Become A Team Of 3000+ Talented Professionals With A Mission To Present A Market Space That Enables You To Help People Get The Right Advice For Their Health.",
        items: [
            {
                title: "Comprehensive Healthcare Coverage",
                description: "Comprehensive Health Coverage Is Provided To Employees",
            },
            {
                title: "Employee Assistance Programs",
                description: "Comprehensive Health Coverage Is Provided To Employees",
            },
            {
                title: "Recognition And Rewards",
                description:
                    "Nirnayan Arranges Recognition Programs, Rewards, Achievements, And Contributions To Foster A Positive Work Culture",
            },
            {
                title: "Professional Development Opportunities",
                description:
                    "We Are Giving Opportunities For Continuing Education, Training Programs, And Career Advancement Support To Employees",
            },
        ],
    },
    {
        title: "Work Environment",
        description:
            "Started As A Flourishing Start-Up, Redcliffe Labs Has Become A Team Of 3000+ Talented Professionals With A Mission To Present A Market Space That Enables You To Help People Get The Right Advice For Their Health.",
        items: [
            {
                title: "Positive Workplace Culture",
                description: "We Encourage Collaboration, Respect And Teamwork.",
            },
            {
                title: "Work-Life Balance",
                description: "We Support A Healthy Balance Between Work And Personal Life.",
            },
        ],
    },
];

const jobs = [
    {
        title: "Microbiologist",
        date: "Mar 1, 2024",
        type: "Full Time",
        experience: "3 Years",
        location: "Kolkata",
        description:
            "Our Organization Is Seeking A Microbiologist With Exceptional Research And Analytical Skills. Essential Qualifications Include An MD In Microbiology With 3 To 5 Years Of Experience.",
    },
    {
        title: "Microbiologist",
        date: "Mar 1, 2024",
        type: "Full Time",
        experience: "3 Years",
        location: "Kolkata",
        description:
            "Our Organization Is Seeking A Microbiologist With Exceptional Research And Analytical Skills. Essential Qualifications Include An MD In Microbiology With 3 To 5 Years Of Experience.",
    },
    {
        title: "Microbiologist",
        date: "Mar 1, 2024",
        type: "Full Time",
        experience: "3 Years",
        location: "Kolkata",
        description:
            "Our Organization Is Seeking A Microbiologist With Exceptional Research And Analytical Skills. Essential Qualifications Include An MD In Microbiology With 3 To 5 Years Of Experience.",
    },
    {
        title: "Microbiologist",
        date: "Mar 1, 2024",
        type: "Full Time",
        experience: "3 Years",
        location: "Kolkata",
        description:
            "Our Organization Is Seeking A Microbiologist With Exceptional Research And Analytical Skills. Essential Qualifications Include An MD In Microbiology With 3 To 5 Years Of Experience.",
    },
];

function page() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const handleAccordionClick = (index: number) => {
        setActiveIndex((prevIndex) =>
            prevIndex === index ? null : index
        );
    };

    const [fileName, setFileName] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileName(file ? file.name : "");
    };

    const [isJobDescModalOpen, setIsJobDescModalOpen] = useState(false);

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
                                Career
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="in-banner">
                <div className="container">
                    <div className="inn">
                        <img src="/assets/images/career-banner.jpg" alt="" />
                        <div className="text-block">
                            <h1><span>Career at </span>Nirnayan Health Care</h1>
                            <p>Nirnayan offers various job opportunities and career advancements for people who value hard work, integrity, and learning. We provide world class campus, work friendly environment and state of the art laboratory for a commitment to patient care. Join today with Nirnayan and explore your skill</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="carrer-wrap">
                <div className="container">
                    <div className="top-pnl text-center">
                        <h2>Nirnayan Health Care is among the fastest-growing <span>diagnostic-tech companies in India.</span></h2>
                        <p>Our vision is to make healthcare seamless for consumers in their homes by enabling doctors to treat their patients in real-time.</p>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="img-block">
                                <img src="/assets/images/career-img.png" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="employee-accordion">
                                {benefitsData.map((section, index) => (
                                    <div
                                        className="employee-accordion-item"
                                        key={section.title}
                                    >
                                        <button
                                            type="button"
                                            className="employee-accordion-header"
                                            aria-expanded={activeIndex === index}
                                            onClick={() =>
                                                handleAccordionClick(index)
                                            }
                                        >
                                            <div className="employee-accordion-heading">
                                                <h3>{section.title}</h3>
                                                <p>{section.description}</p>
                                            </div>

                                            <span className="employee-accordion-arrow">
                                                <i
                                                    className="fa-solid fa-arrow-down"
                                                    aria-hidden="true"
                                                ></i>
                                            </span>
                                        </button>

                                        {activeIndex === index && (
                                            <div className="employee-accordion-content">
                                                {section.items.map((item) => (
                                                    <div
                                                        className="employee-benefit"
                                                        key={item.title}
                                                    >
                                                        <span className="employee-benefit-icon">
                                                            <img
                                                                src="/assets/images/tick.svg"
                                                                alt=""
                                                            />
                                                        </span>

                                                        <div className="employee-benefit-text">
                                                            <h6>{item.title}</h6>
                                                            <p>{item.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="jobs-wrap">
                <div className="container">
                    <h3 className="title-text">All Jobs</h3>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="job-listing">
                                {jobs.map((job, index) => (
                                    <div className="job-card" key={index}>
                                        <div className="job-card-top">
                                            <div className="job-card-heading">
                                                <h4>{job.title}</h4>
                                                <p>Posted - {job.date}</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="job-card-arrow"
                                                aria-label="View job details"
                                                onClick={() => setIsJobDescModalOpen(true)}
                                            >
                                                <img src="/assets/images/exp-btn.svg" alt="" />
                                            </button>
                                        </div>
                                        <div className="job-card-info">
                                            <div className="job-info-item">
                                                <i className="fa-regular fa-clock" aria-hidden="true"></i>
                                                <span>{job.type}</span>
                                            </div>
                                            <div className="job-info-item">
                                                <i className="fa-solid fa-briefcase" aria-hidden="true"></i>
                                                <span>Exp. {job.experience}</span>
                                            </div>
                                            <div className="job-info-item">
                                                <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                                                <span>{job.location}</span>
                                            </div>
                                        </div>
                                        <div className="job-card-description">
                                            <h6>Job Description</h6>
                                            <p>{job.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="career-form">
                                <form>
                                    <h4>Give Us Your Details</h4>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="firstName">First Name<span>*</span></label>
                                                <input type="text" id="firstName" placeholder="Ex. John" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="lastName">Last Name<span>*</span></label>
                                                <input type="text" id="lastName" placeholder="Ex. John" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="email">Email<span>*</span></label>
                                                <input type="email" id="email" placeholder="your@email.com" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="mobile">Mobile<span>*</span></label>
                                                <div className="mobile-input">
                                                    <input type="tel" id="mobile" placeholder="Enter Your 10 Digit Mobile Number" maxLength={10} pattern="[0-9]{10}" className="form-control" required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="city">City<span>*</span></label>
                                                <input type="text" id="city" placeholder="Enter City" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="experience">Experience<span>*</span></label>
                                                <input type="text" id="experience" placeholder="Ex. 8 Years" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="role">Current Role<span>*</span></label>
                                                <input type="text" id="role" placeholder="Your Role" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="employer">Current Employer<span>*</span></label>
                                                <input type="text" id="employer" placeholder="Ex. Company Name" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="salary">Current Salary<span>*</span></label>
                                                <input type="text" id="salary" placeholder="Enter Current Salary" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="expectedSalary">Expected Salary<span>*</span></label>
                                                <input type="text" id="expectedSalary" placeholder="Ex. 8 Lakhs" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="message">Message<span>*</span></label>
                                                <input type="text" id="message" placeholder="Your message" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="cv">Upload CV<span>*</span></label>
                                                <div className="file-input">
                                                    <input
                                                        type="text"
                                                        placeholder="File.pdf"
                                                        value={fileName}
                                                        readOnly className="form-control"
                                                    />

                                                    <label htmlFor="cv" className="file-upload-icon">
                                                        <i className="fa-solid fa-paperclip" aria-hidden="true"></i>
                                                    </label>

                                                    <input
                                                        type="file"
                                                        id="cv"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={handleFileChange}
                                                        required className="d-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="career-form-submit text-end">
                                        <button type="submit" className="cmn_btn">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ca-with-us">
                <div className="container">
                    <div className="inn">
                        <div className="img-block">
                            <img src="/assets/images/career-img2.png" alt="" />
                        </div>
                        <div className="text-block">
                            <div className="left">
                                <h3>Join today with</h3>
                                <h2>Nirnayan <span>and</span> Explore <span>your Skill</span></h2>
                            </div>
                            <button className="cmn_btn">Explore Now</button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`cmn-backdrop ${isJobDescModalOpen ? "active" : ""}`}
                onClick={() => setIsJobDescModalOpen(false)}>
                <div className="inn" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        className="closeBtn"
                        onClick={() => setIsJobDescModalOpen(false)}
                        aria-label="Close modal"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className="header">
                        <h4 className="m-0">Job Description</h4>
                    </div>
                    <div className="jobs-mdl-cont">
                        <p>Our organization is seeking a Microbiologist with exceptional research and analytical skills. Essential qualifications include an MD in Microbiology with 3 to 5 years of experience. Proficiency in Microbiology (Specifically Bacteriology, Virology, and Parasitology), Serology, Mycology, and ImmunoFluro Assay (IFA) is also required. Candidates lacking experience in these domains will receive training, contingent upon signing the company's bond. Additionally, active state licensure as a registered Microbiologist is mandatory.</p>
                        <ul>
                            <li>Responsibilities include preparing departmental reports, providing interpretative summaries, and ensuring all patient reports include necessary recommendations.</li>
                            <li>Responsibilities include preparing departmental reports, providing interpretative summaries, and ensuring all patient reports include necessary recommendations.</li>
                        </ul>
                        <ol>
                            <li>Responsibilities include preparing departmental reports, providing interpretative summaries, and ensuring all patient reports include necessary recommendations.</li>
                            <li>Responsibilities include preparing departmental reports, providing interpretative summaries, and ensuring all patient reports include necessary recommendations.</li>
                        </ol>
                        <div className="jobs-mdl-footer">
                            <p>For further details, don't hesitate to get in touch with us:<strong> 9147183742</strong>. Interested candidate can mail their resume to <Link href="mailto:devjeet.das@nirnayan.com">devjeet.das@nirnayan.com</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page