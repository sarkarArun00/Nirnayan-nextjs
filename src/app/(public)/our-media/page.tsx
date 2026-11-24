
"use client";

import { useState, useEffect } from "react";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Slider from "react-slick";
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
    {
        year: "2021",
        awards: [
            {
                title: "Excellence 4",
                description: "Nirnayan received the Diagnostics Innovations & Excellence Award 2023.",
                image: "/assets/images/awa-img2.png",
            },
        ],
    },
];


function Page() {
    const [activeYear, setActiveYear] = useState("All");
    const [hoverYear, setHoverYear] = useState("2025");
    const [activeAwardId, setActiveAwardId] = useState("2025-0");
    const years = ["All", ...awardData.map((item) => item.year)];
    const filteredAwards =
        activeYear === "All"
            ? awardData
            : awardData.filter((item) => item.year === activeYear);
    // Get currently active award
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

        const selectedYearData =
            year === "All"
                ? awardData
                : awardData.filter((item) => item.year === year);
        if (selectedYearData.length > 0 && selectedYearData[0].awards.length > 0) {
            const firstYear = selectedYearData[0];
            setHoverYear(firstYear.year);
            setActiveAwardId(`${firstYear.year}-0`);
        }
    };

    useEffect(() => {
        let unbindFancybox: (() => void) | undefined;
        let isMounted = true;
        const initFancybox = async () => {
            const { Fancybox } = await import("@fancyapps/ui");
            if (!isMounted) return;
            const selector = '[data-fancybox="gallery"]';
            Fancybox.bind(selector, {
                Carousel: { infinite: true, },
            });
            unbindFancybox = () => Fancybox.unbind(selector);
        };
        initFancybox();
        return () => {
            isMounted = false;
            unbindFancybox?.();
        };
    }, []);

    const gallerySettings = {
        dots: true,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        centerMode: true,
        centerPadding: "60px",
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                },
            },
        ],
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
                                News & Media
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
                        <img src="/assets/images/awards-banner.jpg" alt="" />
                        <div className="text-block">
                            <h1>News & Media</h1>
                            <p>
                                Discover the latest updates, events, health awareness
                                campaigns, and memorable moments from our diagnostic
                                laboratory. Through our media gallery, we showcase our
                                commitment to quality diagnostics, patient care, and
                                community health.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Banner End */}

            {/* About Section Start */}
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
                                <h2>
                                    Explore Our Journey, Activities &{" "}
                                    <span>Healthcare Initiatives</span>
                                </h2>
                                <p>
                                    Welcome to our media segment, where we showcase our
                                    growth journey, latest advancements, achievements,
                                    news, and how we are shaping the future of healthcare
                                    in India. Explore our efforts to stay at the top of
                                    the latest research and innovation as we strive to
                                    set a new benchmark of providing quality healthcare
                                    services with advanced technologies and excellence.
                                    Transform your ideas of healthcare services to the
                                    next level with our commitment to accuracy,
                                    reliability, and brilliance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* About Section End */}

            {/* Awards Section Start */}
            <div className="aw-year">
                <div className="container">
                    <h2 className="aw-title">Awards & Accolades</h2>
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
                                <div className="timeline">
                                    {filteredAwards.map((yearItem) => (
                                        <div
                                            className={`aw-box ${hoverYear === yearItem.year ? "active" : ""
                                                }`}
                                            key={yearItem.year}
                                            onMouseEnter={() => setHoverYear(yearItem.year)}
                                        >
                                            <h1>{yearItem.year}</h1>

                                            {yearItem.awards.map((award, index) => (
                                                <div
                                                    className={`aw-recived ${activeAwardId === `${yearItem.year}-${index}`
                                                        ? "active"
                                                        : ""
                                                        }`}
                                                    key={`${yearItem.year}-${index}`}
                                                    onMouseEnter={() =>
                                                        setActiveAwardId(`${yearItem.year}-${index}`)
                                                    }
                                                >
                                                    <h3>{award.title}</h3>
                                                    <p>{award.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="aw-img">
                                <img
                                    src={
                                        activeAward?.image ||
                                        awardData[0].awards[0].image
                                    }
                                    alt={activeAward?.title || "Award"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Awards Section End */}

            {/* Gallery Start */}
            <div className="our-gallery">
                <div className="container">
                    <h2>Our Gallery</h2>
                    <div className="cmn-right-align">
                        <Slider {...gallerySettings} className="is_slick_dot">
                            <div className="gallery-item cmn_padding">
                                <a href="/assets/images/aw-img1.jpg" data-fancybox="gallery" data-caption="Award 1">
                                    <img src="/assets/images/aw-img1.jpg" alt="Award 1" />
                                </a>
                            </div>
                            <div className="gallery-item cmn_padding">
                                <a href="/assets/images/aw-img1.jpg" data-fancybox="gallery" data-caption="Award 2">
                                    <img src="/assets/images/aw-img1.jpg" alt="Award 2" />
                                </a>
                            </div>
                            <div className="gallery-item cmn_padding">
                                <a href="/assets/images/aw-img1.jpg" data-fancybox="gallery" data-caption="Award 3">
                                    <img src="/assets/images/aw-img1.jpg" alt="Award 3" />
                                </a>
                            </div>
                            <div className="gallery-item cmn_padding">
                                <a href="/assets/images/aw-img1.jpg" data-fancybox="gallery" data-caption="Award 3">
                                    <img src="/assets/images/aw-img1.jpg" alt="Award 3" />
                                </a>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
            {/* Gallery End */}
        </>
    );
}

export default Page;
