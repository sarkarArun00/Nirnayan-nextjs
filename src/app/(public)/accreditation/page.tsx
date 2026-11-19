"use client";
import { useState } from "react";
import Link from 'next/link';
import Slider from "react-slick";
import './page.css';

const certificates = [
    {
        id: 1,
        image: "/assets/images/icmr-logo1.png",
        certificate: "/assets/images/icmr-logo1.png",
        title:
            "NABL - National Accreditation Board for Testing and Calibration Laboratories",
        description:
            "Nirnayan is The Fastest NABL (National Accreditation Board for Testing And Calibration Laboratories)",
    },
    {
        id: 2,
        image: "/assets/images/icmr-logo1.png",
        certificate: "/assets/images/icmr-logo1.png",
        title:
            "NABL - National Accreditation Board for Testing and Calibration Laboratories",
        description:
            "Nirnayan Is The Fastest NABL (National Accreditation Board For Testing And Calibration Laboratories)",
    },
    {
        id: 3,
        image: "/assets/images/icmr-logo1.png",
        certificate: "/assets/images/icmr-logo1.png",
        title: "ICMR - Indian Council of Medical Research",
        description:
            "Nirnayan Is ICMR Accredited Pathology Lab From 2020",
    },
    {
        id: 4,
        image: "/assets/images/icmr-logo1.png",
        certificate: "/assets/images/icmr-logo1.png",
        title: "ICMR - Indian Council of Medical Research",
        description:
            "Nirnayan Is ICMR Accredited Pathology Lab From 2020",
    },
];

function page() {
    const [activeIndex, setActiveIndex] = useState(1);
    const certificateSliderConfig = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
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
                        <img src="/assets/images/accreditation-banner.jpg" alt="" />
                        <div className="text-block">
                            <h1>Accreditation</h1>
                            <p>Our stringent Quality Control System ensures accurate, reliable healthcare services and maintains the highest laboratory standards.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ac-milestone">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5 col-md-5 col-sm-12">
                            <div className="img-block">
                                <img src="/assets/images/accreditation-img.png" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-7 col-sm-12">
                            <div className="text-block">
                                <h2>Milestone of Our Competence</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tempor imperdiet risus vel commodo. Nunc nec iaculis libero, ac varius urna. Maecenas in dolor dictum, mattis dolor sed, euismod purus. Proin vulputate non nibh nec placerat. Donec vitae nibh luctus, rhoncus quam ac, varius elit. Curabitur nibh ante, scelerisque ut maximus eu, tempus id turpis. Proin molestie scelerisque risus, sed fermentum nibh molestie non.</p>
                                <h2>About NABL</h2>
                                <p>Nirnayan is the fastest <span>NABL (National Accreditation Board for Testing and Calibration Laboratories)</span> accredited pathology lab in the Eastern India. NABL is responsible for checking the Clinical Labs and assessing their quality.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="certificate-section">
                <div className="container">
                    <h2>Our Certificates</h2>
                    <Slider {...certificateSliderConfig} className="is_slick_dot">
                        {certificates.map((item) => (
                            <div className="certificate-slide cmn_padding" key={item.id}>
                                <div className="certificate-card">
                                    <div className="certificate-card-inner">
                                        <div className="cer-logo">
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                        <button
                                            type="button"
                                            className="certificate-arrow"
                                            aria-label="View certificate"
                                            onClick={() =>
                                                window.open(
                                                    item.certificate,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                )
                                            }
                                        >
                                            <img src="/assets/images/exp-btn.svg" alt="" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </>
    )
}

export default page