"use client";
import { useState } from "react";
import Link from "next/link";
import PopularTest from "@/components/home/PopularTest";
import './page.css';
import BookWith from '@/components/home/BookWith';
import Faq from '@/components/home/Faq';
import Awards from '@/components/home/Awards';
import Slider from 'react-slick';

const organs = [
    { id: 1, name: "under 30 yrs Man", image: "/assets/images/pkg-img1.png" },
    { id: 2, name: "30 - 45 yrs Man", image: "/assets/images/pkg-img2.png" },
    { id: 3, name: "30 - 45 yrs Man", image: "/assets/images/pkg-img1.png" },
    { id: 4, name: "under 30 yrs Man", image: "/assets/images/pkg-img2.png" },
    { id: 5, name: "30 - 45 yrs Man", image: "/assets/images/pkg-img1.png" },
    { id: 6, name: "under 30 yrs Man", image: "/assets/images/pkg-img2.png" },
    { id: 7, name: "30 - 45 yrs Man", image: "/assets/images/pkg-img1.png" },
    { id: 8, name: "under 30 yrs Man", image: "/assets/images/pkg-img2.png" },
    { id: 9, name: "30 - 45 yrs Man", image: "/assets/images/pkg-img1.png" },
    { id: 10, name: "under 30 yrs Man", image: "/assets/images/pkg-img2.png" },
    { id: 11, name: "30 - 45 yrs Man", image: "/assets/images/pkg-img1.png" },
    { id: 12, name: "30 - 45 yrs Man", image: "/assets/images/pkg-img1.png" },
];

function page() {
    const [active, setActive] = useState(0);

    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 1,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 8,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                },
            },
        ],
    };

    var popular_slider = {
        dots: true,
        arrows: false,
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '60px',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="test-list">
            <div className="bred-camp">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Lab Test Packages
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="in-banner">
                <div className="container">
                    <div className="inn">
                        <img src="/assets/images/pkg-banner.jpg" alt="" />
                        <div className="text-block">
                            <h1><span>One Package for Complete </span>Health and Better Living.</h1>
                            <p>Explore our comprehensive range of laboratory tests, from routine health checkups to specialized diagnostic investigations, with accurate results and reliable care.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="is-why-section">
                <PopularTest section={1} hideButton={true} removeBg={true} />
            </div>

            <div className="ava-pkg">
                <div className="container">
                    <div className="top-block">
                        <h3>Available Lab Tests & Packages</h3>
                        <ul>
                            <li><Link href="/test-list">Tests</Link></li>
                            <li><Link href="#" className="active">Packages</Link></li>
                        </ul>
                    </div>
                    <div className="btm-block">
                        <div className="row">
                            <div className="col-lg-3 col-md-4 col-sm-12">
                                <div className="rating">
                                    <div className="icon">
                                        <img src="/assets/images/trust-card-ratings.webp" alt="" />
                                    </div>
                                    <div className="text">
                                        <h3>Highest rated <span>diagnostics lab</span></h3>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="icon">
                                        <img src="/assets/images/labs-icon.webp" alt="" />
                                    </div>
                                    <div className="text">
                                        <h6>OWN LABS</h6>
                                        <p>NABL, EQAS accredited</p>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="icon">
                                        <img src="/assets/images/heart-customer.webp" alt="" />
                                    </div>
                                    <div className="text">
                                        <h6>LOVED BY</h6>
                                        <p>1 M+ Customers</p>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="icon">
                                        <img src="/assets/images/instant-sample-collection.webp" alt="" />
                                    </div>
                                    <div className="text">
                                        <h6>COLLECTION IN MINUTES</h6>
                                        <p>Instant Sample Collection</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9 col-md-8 col-sm-12">
                                <div className="select-pnls">
                                    <div className="left-block">
                                        <input type="text" placeholder='Search Tests & Packages' className='form-control' />
                                    </div>
                                    <div className="select-pnl">
                                        <select className="form-control form-select">
                                            <option value="mostpopular" selected>Most Popular</option>
                                            <option value="organ">Organ Wise</option><option value="condition">Condition Wise</option>
                                            <option value="department">Department Wise</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="organ-slider">
                                    <Slider {...settings} className="is_slick_dot">
                                        {organs.map((organ, index) => (
                                            <div key={organ.id} className="organ-slide">
                                                <button
                                                    type="button"
                                                    className={`organ-item ${active === index ? "active" : ""
                                                        }`}
                                                    onClick={() => setActive(index)}
                                                    aria-pressed={active === index}
                                                >
                                                    <span className="organ-icon">
                                                        <img src={organ.image} alt="" />
                                                    </span>

                                                    <h6 className="organ-name">{organ.name}</h6>
                                                </button>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="search-result">
                        <div className="top-wrap">
                            <div className="left">
                                <h4>Hormones</h4>
                                <h6>Showing <span>15 test(s)</span></h6>
                            </div>
                            <button className="clear-filter"><i className="fa-solid fa-arrow-rotate-left"></i> Clear filters</button>
                        </div>

                        <div className="btm-wrap">
                            <div className="pack-card">
                                <div className="image-section">
                                    <div className="img">
                                        <img src="/assets/images/pack-img.png" alt="" />
                                        <div className="img-lbl">
                                            THYROID
                                        </div>
                                    </div>
                                    <div className="popular-badge">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="icon">
                                        <img src="/assets/images/joint.png" alt="" />
                                    </div>
                                </div>
                                <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                <div className="contains-row">
                                    <h6>Contains</h6>
                                    <div className="test-count">
                                        <img src="/assets/images/laboratory.svg" alt="" />
                                        <p>90 Tests</p>
                                    </div>
                                </div>
                                <div className="tags">
                                    <span className="tag">CBC</span>
                                    <span className="tag">Liver</span>
                                    <span className="tag">Kidney</span>
                                    <span className="tag">+6 More</span>
                                </div>
                                <div className="info-section">
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/microscope.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Available in <span>Home & Lab</span></h6>
                                        </div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/calender.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Report <span>Same Day</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="flex-wrap">
                                        <div className="pr-sec">
                                            <h3 className="price">₹450</h3>
                                            <h6 className="old-price">₹899</h6>
                                        </div>
                                        <span className="discount">
                                            Save 10%
                                        </span>
                                    </div>
                                    <button className="cmn_btn">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                            <div className="pack-card">
                                <div className="image-section">
                                    <div className="img">
                                        <img src="/assets/images/pack-img.png" alt="" />
                                        <div className="img-lbl">
                                            THYROID
                                        </div>
                                    </div>
                                    <div className="popular-badge">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="icon">
                                        <img src="/assets/images/joint.png" alt="" />
                                    </div>
                                </div>
                                <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                <div className="contains-row">
                                    <h6>Contains</h6>
                                    <div className="test-count">
                                        <img src="/assets/images/laboratory.svg" alt="" />
                                        <p>90 Tests</p>
                                    </div>
                                </div>
                                <div className="tags">
                                    <span className="tag">CBC</span>
                                    <span className="tag">Liver</span>
                                    <span className="tag">Kidney</span>
                                    <span className="tag">+6 More</span>
                                </div>
                                <div className="info-section">
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/microscope.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Available in <span>Home & Lab</span></h6>
                                        </div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/calender.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Report <span>Same Day</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="flex-wrap">
                                        <div className="pr-sec">
                                            <h3 className="price">₹450</h3>
                                            <h6 className="old-price">₹899</h6>
                                        </div>
                                        <span className="discount">
                                            Save 10%
                                        </span>
                                    </div>
                                    <button className="cmn_btn">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                            <div className="pack-card">
                                <div className="image-section">
                                    <div className="img">
                                        <img src="/assets/images/pack-img.png" alt="" />
                                        <div className="img-lbl">
                                            THYROID
                                        </div>
                                    </div>
                                    <div className="popular-badge">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="icon">
                                        <img src="/assets/images/joint.png" alt="" />
                                    </div>
                                </div>
                                <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                <div className="contains-row">
                                    <h6>Contains</h6>
                                    <div className="test-count">
                                        <img src="/assets/images/laboratory.svg" alt="" />
                                        <p>90 Tests</p>
                                    </div>
                                </div>
                                <div className="tags">
                                    <span className="tag">CBC</span>
                                    <span className="tag">Liver</span>
                                    <span className="tag">Kidney</span>
                                    <span className="tag">+6 More</span>
                                </div>
                                <div className="info-section">
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/microscope.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Available in <span>Home & Lab</span></h6>
                                        </div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/calender.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Report <span>Same Day</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="flex-wrap">
                                        <div className="pr-sec">
                                            <h3 className="price">₹450</h3>
                                            <h6 className="old-price">₹899</h6>
                                        </div>
                                        <span className="discount">
                                            Save 10%
                                        </span>
                                    </div>
                                    <button className="cmn_btn">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                            <div className="pack-card">
                                <div className="image-section">
                                    <div className="img">
                                        <img src="/assets/images/pack-img.png" alt="" />
                                        <div className="img-lbl">
                                            THYROID
                                        </div>
                                    </div>
                                    <div className="popular-badge">
                                        <img src="/assets/images/fire.svg" alt="" />
                                        <h6>Most Popular</h6>
                                    </div>
                                    <div className="icon">
                                        <img src="/assets/images/joint.png" alt="" />
                                    </div>
                                </div>
                                <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                <div className="contains-row">
                                    <h6>Contains</h6>
                                    <div className="test-count">
                                        <img src="/assets/images/laboratory.svg" alt="" />
                                        <p>90 Tests</p>
                                    </div>
                                </div>
                                <div className="tags">
                                    <span className="tag">CBC</span>
                                    <span className="tag">Liver</span>
                                    <span className="tag">Kidney</span>
                                    <span className="tag">+6 More</span>
                                </div>
                                <div className="info-section">
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/microscope.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Available in <span>Home & Lab</span></h6>
                                        </div>
                                    </div>
                                    <div className="info-box">
                                        <span className="info-icon">
                                            <img src="/assets/images/calender.svg" alt="" />
                                        </span>
                                        <div className="info-text">
                                            <h6>Report <span>Same Day</span></h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="flex-wrap">
                                        <div className="pr-sec">
                                            <h3 className="price">₹450</h3>
                                            <h6 className="old-price">₹899</h6>
                                        </div>
                                        <span className="discount">
                                            Save 10%
                                        </span>
                                    </div>
                                    <button className="cmn_btn">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button className="sec_btn border-0">Load more</button>
                        </div>

                        <div className="is-upload">
                            <div className="text-block">
                                <h2>Upload Prescription to <span>Book Lab Tests</span></h2>
                                <p>Upload your doctor’s prescription to book the recommended tests</p>
                                <Link href="#" className="cmn_btn">Upload File</Link>
                            </div>
                            <div className="img-block">
                                <img src="/assets/images/upload-pres.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="related-test">
                <div className="container">
                    <div className="top-title">
                        <div className="left-pnl">
                            <h2>Related packages</h2>
                            <p>Contact us for routine tests to specialized blood tests and make your tomorrow healthy</p>
                        </div>
                        <button className="expand-btn is_white">
                            <span className="icon">
                                <img src="/assets/images/exp-btn.svg" alt="" />
                            </span>
                            <span className="btn-text">View More</span>
                        </button>
                    </div>
                    <div className="cmn-right-align">
                        <Slider {...popular_slider} className='is_slick_dot'>
                            <div className="item">
                                <div className="pack-card cmn_margin">
                                    <div className="image-section">
                                        <div className="img">
                                            <img src="/assets/images/pack-img.png" alt="" />
                                            <div className="img-lbl">
                                                THYROID
                                            </div>
                                        </div>
                                        <div className="popular-badge">
                                            <img src="/assets/images/fire.svg" alt="" />
                                            <h6>Most Popular</h6>
                                        </div>
                                        <div className="icon">
                                            <img src="/assets/images/joint.png" alt="" />
                                        </div>
                                    </div>
                                    <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                    <div className="contains-row">
                                        <h6>Contains</h6>
                                        <div className="test-count">
                                            <img src="/assets/images/laboratory.svg" alt="" />
                                            <p>90 Tests</p>
                                        </div>
                                    </div>
                                    <div className="tags">
                                        <span className="tag">CBC</span>
                                        <span className="tag">Liver</span>
                                        <span className="tag">Kidney</span>
                                        <span className="tag">+6 More</span>
                                    </div>
                                    <div className="info-section">
                                        <div className="info-box">
                                            <span className="info-icon">
                                                <img src="/assets/images/microscope.svg" alt="" />
                                            </span>
                                            <div className="info-text">
                                                <h6>Available in <span>Home & Lab</span></h6>
                                            </div>
                                        </div>
                                        <div className="info-box">
                                            <span className="info-icon">
                                                <img src="/assets/images/calender.svg" alt="" />
                                            </span>
                                            <div className="info-text">
                                                <h6>Report <span>Same Day</span></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="price-section">
                                        <div className="flex-wrap">
                                            <div className="pr-sec">
                                                <h3 className="price">₹450</h3>
                                                <h6 className="old-price">₹899</h6>
                                            </div>
                                            <span className="discount">
                                                Save 10%
                                            </span>
                                        </div>
                                        <button className="cmn_btn">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="pack-card cmn_margin">
                                    <div className="image-section">
                                        <div className="img">
                                            <img src="/assets/images/pack-img.png" alt="" />
                                            <div className="img-lbl">
                                                THYROID
                                            </div>
                                        </div>
                                        <div className="popular-badge">
                                            <img src="/assets/images/fire.svg" alt="" />
                                            <h6>Most Popular</h6>
                                        </div>
                                        <div className="icon">
                                            <img src="/assets/images/joint.png" alt="" />
                                        </div>
                                    </div>
                                    <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                    <div className="contains-row">
                                        <h6>Contains</h6>
                                        <div className="test-count">
                                            <img src="/assets/images/laboratory.svg" alt="" />
                                            <p>90 Tests</p>
                                        </div>
                                    </div>
                                    <div className="tags">
                                        <span className="tag">CBC</span>
                                        <span className="tag">Liver</span>
                                        <span className="tag">Kidney</span>
                                        <span className="tag">+6 More</span>
                                    </div>
                                    <div className="info-section">
                                        <div className="info-box">
                                            <span className="info-icon">
                                                <img src="/assets/images/microscope.svg" alt="" />
                                            </span>
                                            <div className="info-text">
                                                <h6>Available in <span>Home & Lab</span></h6>
                                            </div>
                                        </div>
                                        <div className="info-box">
                                            <span className="info-icon">
                                                <img src="/assets/images/calender.svg" alt="" />
                                            </span>
                                            <div className="info-text">
                                                <h6>Report <span>Same Day</span></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="price-section">
                                        <div className="flex-wrap">
                                            <div className="pr-sec">
                                                <h3 className="price">₹450</h3>
                                                <h6 className="old-price">₹899</h6>
                                            </div>
                                            <span className="discount">
                                                Save 10%
                                            </span>
                                        </div>
                                        <button className="cmn_btn">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="pack-card cmn_margin">
                                    <div className="image-section">
                                        <div className="img">
                                            <img src="/assets/images/pack-img.png" alt="" />
                                            <div className="img-lbl">
                                                THYROID
                                            </div>
                                        </div>
                                        <div className="popular-badge">
                                            <img src="/assets/images/fire.svg" alt="" />
                                            <h6>Most Popular</h6>
                                        </div>
                                        <div className="icon">
                                            <img src="/assets/images/joint.png" alt="" />
                                        </div>
                                    </div>
                                    <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                    <div className="contains-row">
                                        <h6>Contains</h6>
                                        <div className="test-count">
                                            <img src="/assets/images/laboratory.svg" alt="" />
                                            <p>90 Tests</p>
                                        </div>
                                    </div>
                                    <div className="tags">
                                        <span className="tag">CBC</span>
                                        <span className="tag">Liver</span>
                                        <span className="tag">Kidney</span>
                                        <span className="tag">+6 More</span>
                                    </div>
                                    <div className="info-section">
                                        <div className="info-box">
                                            <span className="info-icon">
                                                <img src="/assets/images/microscope.svg" alt="" />
                                            </span>
                                            <div className="info-text">
                                                <h6>Available in <span>Home & Lab</span></h6>
                                            </div>
                                        </div>
                                        <div className="info-box">
                                            <span className="info-icon">
                                                <img src="/assets/images/calender.svg" alt="" />
                                            </span>
                                            <div className="info-text">
                                                <h6>Report <span>Same Day</span></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="price-section">
                                        <div className="flex-wrap">
                                            <div className="pr-sec">
                                                <h3 className="price">₹450</h3>
                                                <h6 className="old-price">₹899</h6>
                                            </div>
                                            <span className="discount">
                                                Save 10%
                                            </span>
                                        </div>
                                        <button className="cmn_btn">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="pack-card cmn_margin">
                                    <div className="image-section">
                                        <div className="img">
                                            <img src="/assets/images/pack-img.png" alt="" />
                                            <div className="img-lbl">
                                                THYROID
                                            </div>
                                        </div>
                                        <div className="popular-badge">
                                            <img src="/assets/images/fire.svg" alt="" />
                                            <h6>Most Popular</h6>
                                        </div>
                                        <div className="icon">
                                            <img src="/assets/images/joint.png" alt="" />
                                        </div>
                                    </div>
                                    <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                    <div className="contains-row">
                                        <h6>Contains</h6>
                                        <div className="test-count">
                                            <img src="/assets/images/laboratory.svg" alt="" />
                                            <p>90 Tests</p>
                                        </div>
                                    </div>
                                    <div className="tags">
                                        <span className="tag">CBC</span>
                                        <span className="tag">Liver</span>
                                        <span className="tag">Kidney</span>
                                        <span className="tag">+6 More</span>
                                    </div>
                                    <div className="info-section">
                                        <div className="info-box">
                                            <span className="info-icon">
                                                <img src="/assets/images/microscope.svg" alt="" />
                                            </span>
                                            <div className="info-text">
                                                <h6>Available in <span>Home & Lab</span></h6>
                                            </div>
                                        </div>
                                        <div className="info-box">
                                            <span className="info-icon">
                                                <img src="/assets/images/calender.svg" alt="" />
                                            </span>
                                            <div className="info-text">
                                                <h6>Report <span>Same Day</span></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="price-section">
                                        <div className="flex-wrap">
                                            <div className="pr-sec">
                                                <h3 className="price">₹450</h3>
                                                <h6 className="old-price">₹899</h6>
                                            </div>
                                            <span className="discount">
                                                Save 10%
                                            </span>
                                        </div>
                                        <button className="cmn_btn">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="pack-card cmn_margin">
                                    <div className="image-section">
                                        <div className="img">
                                            <img src="/assets/images/pack-img.png" alt="" />
                                            <div className="img-lbl">
                                                THYROID
                                            </div>
                                        </div>
                                        <div className="popular-badge">
                                            <img src="/assets/images/fire.svg" alt="" />
                                            <h6>Most Popular</h6>
                                        </div>
                                        <div className="icon">
                                            <img src="/assets/images/joint.png" alt="" />
                                        </div>
                                    </div>
                                    <h2 className="title">Thyroid - FT4 AEC - Absolute Eosinophil Count</h2>
                                    <div className="contains-row">
                                        <h6>Contains</h6>
                                        <div className="test-count">
                                            <img src="/assets/images/laboratory.svg" alt="" />
                                            <p>90 Tests</p>
                                        </div>
                                    </div>
                                    <div className="tags">
                                        <span className="tag">CBC</span>
                                        <span className="tag">Liver</span>
                                        <span className="tag">Kidney</span>
                                        <span className="tag">+6 More</span>
                                    </div>
                                    <div className="info-section">
                                        <div className="info-box">
                                            <span className="info-icon">
                                                <img src="/assets/images/microscope.svg" alt="" />
                                            </span>
                                            <div className="info-text">
                                                <h6>Available in <span>Home & Lab</span></h6>
                                            </div>
                                        </div>
                                        <div className="info-box">
                                            <span className="info-icon">
                                                <img src="/assets/images/calender.svg" alt="" />
                                            </span>
                                            <div className="info-text">
                                                <h6>Report <span>Same Day</span></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="price-section">
                                        <div className="flex-wrap">
                                            <div className="pr-sec">
                                                <h3 className="price">₹450</h3>
                                                <h6 className="old-price">₹899</h6>
                                            </div>
                                            <span className="discount">
                                                Save 10%
                                            </span>
                                        </div>
                                        <button className="cmn_btn">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>

            <BookWith />

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

            <div className="is-award container">
                <Awards section={2} pageClass="home-page-help" />
            </div>

            <Faq />
        </div>
    )
}

export default page