"use client";
import React from 'react';
import Link from 'next/link';
import Blog from '@/components/home/Blog';
import Slider from 'react-slick';
import './page.css';

const sliderData = [
    { id: 1, title: "Immuno Biochemistry", paragraph: 'Explore 4,000+ lab tests and packages for your healthcare needs.', image: "/assets/images/department-img.jpg" },
    { id: 2, title: "Clinical Pathology", paragraph: 'Explore 4,000+ lab tests and packages for your healthcare needs.', image: "/assets/images/department-img.jpg" },
    { id: 3, title: "Genetics", paragraph: 'Explore 4,000+ lab tests and packages for your healthcare needs.', image: "/assets/images/department-img.jpg" },
    { id: 4, title: "Clinical Pathology", paragraph: 'Explore 4,000+ lab tests and packages for your healthcare needs.', image: "/assets/images/department-img.jpg" },
    { id: 5, title: "Genetics", paragraph: 'Explore 4,000+ lab tests and packages for your healthcare needs.', image: "/assets/images/department-img.jpg" },
];

function page() {
    const settings = {
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
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
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
                                Depertments
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="in-banner">
                <div className="container">
                    <div className="inn">
                        <img src="/assets/images/depertments.jpg" alt="" />
                        <div className="text-block">
                            <h1><span>Find the Right Lab Test </span>for Your Health</h1>
                            <p>Explore our comprehensive range of laboratory tests, from routine health checkups to specialized diagnostic investigations, with accurate results and reliable care.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dep-slider">
                <div className="container">
                    <Slider {...settings} className='is_slick_dot'>
                        {sliderData.map((item) => (
                            <div key={item.id} className="slide-item cmn_padding">
                                <div className="slide-card">
                                    <div className="img">
                                        <img src={item.image} alt={item.title} />
                                    </div>
                                    <h3>{item.title}</h3>
                                    <p>{item.paragraph}</p>
                                    <Link href="#" className='exp-btn d-inline-flex'>Explore More <img alt="" src="/assets/images/exp-btn.svg" /></Link>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            <div className="quality-asse">
                <div className="container">
                    <div className="top-title">
                        <div className="left-pnl">
                            <h2>Quality Assesment</h2>
                            <p>India’s fastest AI powered & temperature - controlled supply chain to collect and test your blood in freshest state.</p>
                        </div>
                        <button type="button" className="expand-btn">
                            <span className="icon"><img src="/assets/images/exp-btn.svg" alt="" /></span>
                            <span className="btn-text">View More</span>
                        </button>
                    </div>
                    <div className="grid_box">
                        <div className="box">
                            <div className="icon">
                                <img src="/assets/images/department-icon1.svg" alt="" />
                            </div>
                            <h4>Randomized Protocol For Checking Samples</h4>
                            <p>raesent efficitur tellus a purus blandit euismod. Nullam convallis vehicula eros, at sollicitudin ligula molestie et. Vestibulum ante ipsum primis in faucibus orci</p>
                            <Link href="#" className='exp-btn d-inline-flex bg-transparent'>Explore More <img alt="" src="/assets/images/exp-btn.svg" /></Link>
                        </div>
                        <div className="box">
                            <div className="icon">
                                <img src="/assets/images/department-icon1.svg" alt="" />
                            </div>
                            <h4>Randomized Protocol For Checking Samples</h4>
                            <p>raesent efficitur tellus a purus blandit euismod. Nullam convallis vehicula eros, at sollicitudin ligula molestie et. Vestibulum ante ipsum primis in faucibus orci</p>
                            <Link href="#" className='exp-btn d-inline-flex bg-transparent'>Explore More <img alt="" src="/assets/images/exp-btn.svg" /></Link>
                        </div>
                        <div className="box">
                            <div className="icon">
                                <img src="/assets/images/department-icon1.svg" alt="" />
                            </div>
                            <h4>Randomized Protocol For Checking Samples</h4>
                            <p>raesent efficitur tellus a purus blandit euismod. Nullam convallis vehicula eros, at sollicitudin ligula molestie et. Vestibulum ante ipsum primis in faucibus orci</p>
                            <Link href="#" className='exp-btn d-inline-flex bg-transparent'>Explore More <img alt="" src="/assets/images/exp-btn.svg" /></Link>
                        </div>
                        <div className="box">
                            <div className="icon">
                                <img src="/assets/images/department-icon1.svg" alt="" />
                            </div>
                            <h4>Randomized Protocol For Checking Samples</h4>
                            <p>raesent efficitur tellus a purus blandit euismod. Nullam convallis vehicula eros, at sollicitudin ligula molestie et. Vestibulum ante ipsum primis in faucibus orci</p>
                            <Link href="#" className='exp-btn d-inline-flex bg-transparent'>Explore More <img alt="" src="/assets/images/exp-btn.svg" /></Link>
                        </div>
                        <div className="box">
                            <div className="icon">
                                <img src="/assets/images/department-icon1.svg" alt="" />
                            </div>
                            <h4>Randomized Protocol For Checking Samples</h4>
                            <p>raesent efficitur tellus a purus blandit euismod. Nullam convallis vehicula eros, at sollicitudin ligula molestie et. Vestibulum ante ipsum primis in faucibus orci</p>
                            <Link href="#" className='exp-btn d-inline-flex bg-transparent'>Explore More <img alt="" src="/assets/images/exp-btn.svg" /></Link>
                        </div>
                    </div>
                </div>
            </div>

            <Blog />

            <div className="dep-enq-wrap">
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
                                                <label>Email ID</label>
                                                <input type="" placeholder='Your Email' className='form-control' />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-sm-12">
                                            <div className="inp-box">
                                                <label>Address</label>
                                                <input type="text" placeholder='House No, Road, Landmark, Area, Pincode' className='form-control' />
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="inp-box">
                                                <label>Enquiry</label>
                                                <textarea placeholder='House No, Road, Landmark, Area, Pincode' className='form-control'></textarea>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="text-end">
                                                <button className='cmn_btn'>Submit</button>
                                            </div>
                                        </div>
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