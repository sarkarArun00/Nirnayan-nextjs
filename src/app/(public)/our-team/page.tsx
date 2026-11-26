"use client";
import { useState, useEffect } from "react";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Slider from "react-slick";
import Link from "next/link";
import useResponsiveSlider from "@/hooks/useResponsiveSlider";
import "./page.css";

const teamData = [
    {
        name: "Dr. Ashis Kumar Saha",
        designation: "Director",
        qualification: "MD (Cal), DTM & H (Cal), FRCP (Edin & Gas), FRCP (USA), FICP, MNAMS, PhD (Hon Causa), DSc. (Hon & Casual)",
        image: "/assets/images/img1.png",
    },
    {
        name: "Mr. Abhra Kanti Saha",
        designation: "Director",
        qualification: "",
        image: "/assets/images/img2.png",
    },
    {
        name: "Mr. Subhra Kanti Saha",
        designation: "Director",
        qualification: "",
        image: "/assets/images/img3.png",
    },
];

const doctorData = [
    {
        name: "Dr. Jaya Das",
        designation: "Consultant Microbiologist",
        category: "Microbiologist",
        image: "/assets/images/img1.png",
        qualifications: ["MBBS", "DPH", "MD", "DNB"],
    },
    {
        name: "Dr. Debajyoti Singha Roy",
        designation: "Consultant Pathologist",
        category: "Pathologist",
        image: "/assets/images/img2.png",
        qualifications: ["MBBS", "MD"],
    },
    {
        name: "Dr. Sanghamitra Mukherjee",
        designation: "Consultant Pathologist",
        category: "Pathologist",
        image: "/assets/images/img3.png",
        qualifications: ["MBBS", "MD"],
    },
    {
        name: "Dr. Atreyee Dutta",
        designation: "HOD Geneticist",
        category: "Geneticist",
        image: "/assets/images/img2.png",
        qualifications: ["Ph.D", "Biotechnology"],
    },
    {
        name: "Dr. Example Biochemist",
        designation: "Consultant Biochemist",
        category: "Biochemist",
        image: "/assets/images/img1.png",
        qualifications: ["MBBS", "MD"],
    },
    {
        name: "Dr. Example Molecular",
        designation: "Molecular Biologist",
        category: "Molecular Biologist",
        image: "/assets/images/img2.png",
        qualifications: ["Ph.D", "Molecular Biology"],
    },
];

const categories = [
    "All",
    "Microbiologist",
    "Pathologist",
    "Biochemist",
    "Geneticist",
    "Molecular Biologist",
];

function Page() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState("All");
    const { slidesToShow } = useResponsiveSlider({
        desktop: 4,
        laptop: 3,
        tablet: 2,
        mobile: 1,
    });

    const filteredTeam =
        activeCategory === "All"
            ? doctorData
            : doctorData.filter(
                (item) => item.category === activeCategory
            );

    const sliderSettings = {
        dots: true,
        arrows: false,
        infinite: filteredTeam.length > slidesToShow,
        speed: 600,
        slidesToShow,
        slidesToScroll: 1,
        autoplay: true,
        swipeToSlide: true,
    };

    return (
        <>
            {/* Breadcrumb Start */}
            <div className="breadcrumb-wrap">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Our Team
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            {/* Breadcrumb End */}

            {/* Banner Start */}
            <div className="in-banner">
                <div className="container">
                    <div className="inn">
                        <img src="/assets/images/team-banner.jpg" alt="" />
                        <div className="text-block">
                            <h1>Our Team</h1>
                            <p>
                                Nirnayan offers various job opportunities and career advancements for people who value hard work, integrity, and learning
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Banner End */}

            {/* Board Members */}
            <section className="team-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="text-block">
                                <h2>Our Board Members</h2>
                                <p>Our Board Members bring together a wealth of experience, knowledge, and leadership to guide our organization towards its vision and goals. Their collective expertise, strategic insights, and commitment ensure transparency, accountability, and sustainable growth while driving our mission forward.</p>
                                <p>Our Board Members provide visionary leadership, valuable expertise, and strategic guidance to drive our organization towards its mission and goals.</p>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12">
                            <div className="team-wrapper">
                                {teamData.map((item, index) => (
                                    <div
                                        className={`team-card ${activeIndex === index ? "active" : ""
                                            }`}
                                        key={index}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="team-img"
                                        />

                                        <div className="team-overlay">
                                            <div className="team-content">
                                                <h4>{item.name}</h4>
                                                <span>{item.designation}</span>
                                                <p>{item.qualification}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Board Members */}

            <section className="core-team">
                <div className="container">
                    <h2 className="core-team-title">
                        Core Technical Team
                    </h2>
                    <div className="team-filter">
                        {categories.map((category) => (
                            <button
                                type="button"
                                key={category}
                                className={
                                    activeCategory === category ? "active" : ""
                                }
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="core-team-slider">
                        <div className="cmn-right-align">
                            {filteredTeam.length > 0 ? (
                                <Slider
                                    key={`${activeCategory}-${slidesToShow}`}
                                    {...sliderSettings}
                                    className="is_slick_dot"
                                >
                                    {filteredTeam.map((item, index) => (
                                        <div className="team-slide cmn_padding" key={item.name}>
                                            <div className={`team-cards ${index === 0 ? "highlight" : ""}`}>
                                                <div className="team-cards-inn">
                                                    <div className="team-profile">
                                                        <img src={item.image} alt={item.name} />
                                                    </div>
                                                    <h4>{item.name}</h4>
                                                    <p>{item.designation}</p>
                                                    <div className="team-qua">
                                                        {item.qualifications.map((qualification) => (
                                                            <span key={qualification}>{qualification}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            ) : (
                                <p className="empty-state m-0">No team members found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Page;
