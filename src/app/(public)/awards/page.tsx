
"use client";

import { useState } from "react";
import Link from "next/link";
import "./page.css";

const awardData = [
    {
        year: "2025",
        awards: [
            {
                title: "Diagnostics Innovations & Excellence Award 1",
                description: "Nirnayan received the Diagnostics Innovations & Excellence Award 2025, organized by Voice of Healthcare (VOH).",
                image: "/assets/images/awa-img1.png",
            },
            {
                title: "Diagnostics Award 2",
                description: "Nirnayan received the Diagnostics Innovations & Excellence Award 2025, organized by Voice of Healthcare (VOH).",
                image: "/assets/images/awa-img2.png",
            },
        ],
    },
    {
        year: "2024",
        awards: [
            {
                title: "Diagnostics Innovations & Excellence Award 3",
                description: "Nirnayan received the Diagnostics Innovations & Excellence Award 2024.",
                image: "/assets/images/awa-img1.png",
            },
        ],
    },
    {
        year: "2023",
        awards: [
            {
                title: "Diagnostics Innovations & Excellence Award 4",
                description: "Nirnayan received the Diagnostics Innovations & Excellence Award 2023.",
                image: "/assets/images/awa-img2.png",
            },
            {
                title: "Diagnostics Award 5",
                description: "Nirnayan received another Diagnostics Innovations & Excellence Award 2023.",
                image: "/assets/images/awa-img1.png",
            },
        ],
    },
    {
        year: "2022",
        awards: [
            {
                title: "Excellence Award 4",
                description: "Nirnayan received the Diagnostics Innovations & Excellence Award 2023.",
                image: "/assets/images/awa-img2.png",
            },
        ],
    },
];

function Page() {
    const [activeYear, setActiveYear] = useState("All");
    const [activeAwardId, setActiveAwardId] = useState("2025-0");

    const years = ["All", ...awardData.map((item) => item.year)];

    const filteredAwards = activeYear === "All"
        ? awardData
        : awardData.filter((item) => item.year === activeYear);

    // Get the currently active award
    const activeAward = awardData
        .flatMap((yearItem) =>
            yearItem.awards.map((award, index) => ({
                ...award,
                id: `${yearItem.year}-${index}`,
            }))
        )
        .find((award) => award.id === activeAwardId);

    // Year filter handler
    const handleYearFilter = (year: string) => {
        setActiveYear(year);

        const selectedYearData = year === "All"
            ? awardData
            : awardData.filter((item) => item.year === year);

        if (selectedYearData.length > 0 && selectedYearData[0].awards.length > 0) {
            setActiveAwardId(`${selectedYearData[0].year}-0`);
        }
    };

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
                                Awards & Accolades
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="in-banner">
                <div className="container">
                    <div className="inn">
                        <img src="/assets/images/awards-banner.jpg" alt="" />
                        <div className="text-block">
                            <h1>Awards & Accolades</h1>
                            <p>Nirnayan offers various job opportunities and career advancements for people who value hard work, integrity, and learning</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="aw-beyond">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="img-block">
                                <img src="/assets/images/aw-img1.png" alt="" />
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="text-block">
                                <h2>Beyond Awards and Accolades</h2>
                                <p>Awards and recognition are a reflection of dedication, hard work, and the continuous pursuit of excellence. Every achievement represents a meaningful milestone, highlighting the efforts, commitment, and determination behind success. These honours celebrate progress, acknowledge valuable contributions, and inspire us to explore new opportunities. Each recognition serves as motivation to overcome challenges, develop new skills, and continue moving forward with confidence.</p>

                                <div className="awa-grid">
                                    <div className="aw-box">
                                        <div className="icon">
                                            <img src="/assets/images/tick.svg" alt="" />
                                        </div>
                                        <div className="text">
                                            <h6>Patient Care and Trust</h6>
                                            <p>Celebrating the confidence patients and healthcare professionals place in our laboratory</p>
                                        </div>
                                    </div>

                                    <div className="aw-box">
                                        <div className="icon">
                                            <img src="/assets/images/tick.svg" alt="" />
                                        </div>
                                        <div className="text">
                                            <h6>Innovation and Laboratory Excellence</h6>
                                            <p>Highlighting our continuous efforts to adopt modern diagnostic technologies, improve testing capabilities</p>
                                        </div>
                                    </div>

                                    <div className="aw-box">
                                        <div className="icon">
                                            <img src="/assets/images/tick.svg" alt="" />
                                        </div>
                                        <div className="text">
                                            <h6>Excellence in Diagnostic Services</h6>
                                            <p>Recognising our commitment to delivering accurate, reliable, and timely diagnostic services.</p>
                                        </div>
                                    </div>

                                    <div className="aw-box">
                                        <div className="icon">
                                            <img src="/assets/images/tick.svg" alt="" />
                                        </div>
                                        <div className="text">
                                            <h6>Quality Assurance and Accreditation</h6>
                                            <p>Acknowledging our dedication to maintaining high-quality standards, strict quality control procedures.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="aw-year">
                <div className="container">
                    <div className="aw-filter">
                        {years.map((year) => (
                            <button
                                type="button"
                                key={year}
                                className={activeYear === year ? "active" : ""}
                                onClick={() => handleYearFilter(year)}
                            >
                                <img src="/assets/images/aw-icon.png" alt="" />
                                {year}
                            </button>
                        ))}
                    </div>

                    <div className="row">
                        <div className="col-lg-8 col-md-8 col-sm-12">
                            <div className="timeline">
                                {filteredAwards.map((yearItem) => (
                                    <div className="aw-box" key={yearItem.year}>
                                        <h1>{yearItem.year}</h1>

                                        {yearItem.awards.map((award, index) => {
                                            const awardId = `${yearItem.year}-${index}`;

                                            return (
                                                <div
                                                    className={`aw-recived ${activeAwardId === awardId ? "active" : ""}`}
                                                    key={awardId}
                                                    onMouseEnter={() => setActiveAwardId(awardId)}
                                                >
                                                    <h3>{award.title}</h3>
                                                    <p>{award.description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="aw-img">
                                <img
                                    src={activeAward?.image || awardData[0].awards[0].image}
                                    alt={activeAward?.title || "Award"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;
