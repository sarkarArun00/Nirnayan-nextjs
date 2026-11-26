"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePatientSelection } from "@/components/common/PatientSelectionModal/PatientSelectionProvider";

import Link from "next/link";
import Slider from "react-slick";
import "./TestDetail.css";
import Faq from "@/components/home/Faq";
import BookWith from "@/components/home/BookWith";
import Testimonial from "@/components/home/Testimonial";
import Blog from "@/components/home/Blog";
import PopularPackage from "@/components/home/PopularPackage";
import PopularTest from "@/components/home/PopularTest";
import { InvestigationDetail, getInvestigationById } from "@/services/investigation.service";

type DetailLoadState = {
  requestKey: string;
  detail: InvestigationDetail | null;
  locationName: string;
  error: string;
};

function formatTat(
  tat: { value: string; isHour: boolean } | undefined,
): string {
  if (!tat?.value?.trim()) return "Not specified";
  const unit = tat.isHour ? "Hour" : "Day";
  return `${tat.value} ${unit}${Number(tat.value) === 1 ? "" : "s"}`;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function TestDetail() {
  const searchParams = useSearchParams();
  const itemId = Number(
    searchParams?.get("item_id") ?? searchParams?.get("id"),
  );
  const [retryKey, setRetryKey] = useState(0);
  const requestKey = `${itemId}:${retryKey}`;
  const [loadState, setLoadState] = useState<DetailLoadState | null>(null);
  const current = loadState?.requestKey === requestKey ? loadState : null;
  const details = current?.detail ?? null;
  const { openPatientModal } = usePatientSelection();

  useEffect(() => {
    const controller = new AbortController();
    const loadDetails = async () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("nirnayan_selected_state") || "null",
        );
        const stateId = Number(saved?.id);
        if (!Number.isSafeInteger(stateId) || stateId <= 0) {
          throw new Error(
            "Please select a location from the header to view details.",
          );
        }
        const detail = await getInvestigationById(
          { id: itemId, state_id: stateId },
          controller.signal,
        );
        if (controller.signal.aborted) return;
        setLoadState({
          requestKey,
          detail,
          error: "",
          locationName:
            typeof saved?.name === "string" ? saved.name : "Selected location",
        });
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        setLoadState({
          requestKey,
          detail: null,
          locationName: "",
          error:
            error instanceof SyntaxError
              ? "Please select your location again from the header."
              : error instanceof Error
                ? error.message
                : "Unable to load investigation details.",
        });
      }
    };
    void loadDetails();
    return () => controller.abort();
  }, [itemId, requestKey]);

  // Sticky
  useEffect(() => {
    const section = document.querySelector(".our-section");
    if (!section) return;
    const checkPosition = () => {
      const sectionTop = section.getBoundingClientRect().top;
      const header = document.querySelector("header");
      const headerBottom = header ? header.getBoundingClientRect().bottom : 80;
      const isActive = sectionTop <= headerBottom;
      document.body.classList.toggle("active", isActive);
      const stickyBar = document.querySelector(".sticky-bar");
      if (stickyBar) {
        const stickyBottom = stickyBar.getBoundingClientRect().bottom;
        const activationPoint = stickyBottom + 10;

        const sectionIds = [
          "overview",
          "city-pricing",
          "related-test",
          "related-pkg",
          "blog",
          "feedback",
        ];
        let activeSection = "";
        for (const id of sectionIds) {
          const currentSection = document.getElementById(id);
          if (
            currentSection &&
            currentSection.getBoundingClientRect().top <= activationPoint
          ) {
            activeSection = id;
          } else if (currentSection) {
            break;
          }
        }
        document.querySelectorAll(".sticky-bar ul li").forEach((li) => {
          li.classList.toggle(
            "active",
            li.getAttribute("data-section") === activeSection,
          );
        });
      }
    };
    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("resize", checkPosition);
    checkPosition();
    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
      document.body.classList.remove("active");
    };
  }, [details]);
  // Sticky

  const wpSlider = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const fullText =
    details?.description?.trim() || "Description is not available.";
  const characterLimit = 90;

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  const [activeTab, setActiveTab] = useState(0);
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (!current) {
    return (
      <div className="container py-5" role="status" aria-live="polite">
        Loading investigation details…
      </div>
    );
  }
  if (!details) {
    return (
      <div className="container py-5">
        <p role="alert">
          {current.error || "Investigation details were not found."}
        </p>
        <button
          type="button"
          className="cmn_btn"
          onClick={() => setRetryKey((key) => key + 1)}
        >
          Try Again
        </button>
      </div>
    );
  }

  const isPackage = details.product_type === "package";
  const productLabel = isPackage ? "Health Package" : "Test";
  const mrp = Number(details.mrpAmount);
  const price = Number(
    details.finalAmount ?? details.offerAmount ?? details.mrpAmount,
  );
  const hasDiscount = Number.isFinite(mrp) && mrp > price;
  const discountPercent = hasDiscount
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;
  const aliases = Array.isArray(details.alias_names)
    ? details.alias_names.filter(
        (name): name is string =>
          typeof name === "string" && name.trim().length > 0,
      )
    : [];
  const sampleNames = (details.sampleTypes ?? [])
    .map((sample) => sample.sampleName)
    .filter(Boolean);
  const genderLabel =
    ({ 1: "Male", 2: "Female", 3: "Male & Female" } as Record<number, string>)[
      Number(details.gender)
    ] || "Not specified";
  const collectionLabel = details.homeCollection
    ? "Home sample collection available"
    : "Home sample collection unavailable";
  const testNames = Array.isArray(details.testNames)
    ? details.testNames.filter((name) => typeof name === "string")
    : [];
  const groupNames = Array.isArray(details.groupNames)
    ? details.groupNames.filter((name) => typeof name === "string")
    : [];
  const testCount = details.testCount ?? testNames.length;
  const handleAddToCart = () => {
    openPatientModal({
      id: details.id,
      name: details.test_name,
      productType: details.product_type,
      price: String(price),
    });
  };

  return (
    <div className="main-block">
      <div className="sticky-bar">
        <div className="container">
          <div className="top-wrap">
            <div className="lt-side">
              <div className="icon">
                <img src="/assets/images/tube.png" alt="" />
              </div>
              <div className="text">
                <div className="most-block d-flex align-items-center">
                  <div className="popular-badge position-relative top-0 end-0 d-inline-flex">
                    <h6>{productLabel}</h6>
                  </div>
                </div>
                <h3>{details.test_name}</h3>
              </div>
            </div>

            <div className="rt-side">
              <div className="price-wrap">
                <span className="price">
                  {formatPrice(price)}{" "}
                  {hasDiscount && <del>{formatPrice(mrp)}</del>}
                </span>
                {hasDiscount && (
                  <span className="is-discount">{discountPercent}% off</span>
                )}
              </div>
              <button
                type="button"
                className="cmn_btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
          <ul>
            <li data-section="overview">
              <Link href="#overview">Overview</Link>
            </li>
            <li data-section="city-pricing">
              <Link href="#city-pricing">City Wise Pricing</Link>
            </li>
            <li data-section="related-test">
              <Link href="#related-test">Related Test</Link>
            </li>
            <li data-section="related-pkg">
              <Link href="#related-pkg">Related Package</Link>
            </li>
            <li data-section="blog">
              <Link href="#blog">Blog</Link>
            </li>
            <li data-section="feedback">
              <Link href="#feedback">Feedback</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="test-dtl">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href={isPackage ? "/packages" : "/tests"}>
                  {isPackage ? "Packages" : "Tests"}
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {details.test_name}
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-8">
              <div className="tst-bann">
                <img
                  className="hexa-bg"
                  src="/assets/images/hexa-bg.png"
                  alt=""
                />
                <img
                  className="yellow-bg"
                  src="/assets/images/yeallow-bg.png"
                  alt=""
                />

                <div className="text-block">
                  <div className="popular-badge position-relative top-0 end-0 d-inline-flex">
                    <h6>{productLabel}</h6>
                  </div>
                  <h2>{details.test_name}</h2>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {isExpanded || fullText.length <= characterLimit
                      ? fullText
                      : `${fullText.substring(0, characterLimit)}… `}
                    {fullText.length > characterLimit && (
                      <button
                        type="button"
                        onClick={toggleReadMore}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </p>
                  {aliases.length > 0 && (
                    <ul>
                      <li>Also referred as</li>
                      {aliases.map((name, index) => (
                        <li key={`${name}-${index}`}>{name}</li>
                      ))}
                    </ul>
                  )}
                  <div className="deliver">
                    <div className="box">
                      <div className="icon">
                        <img src="/assets/images/test-dtl1.svg" alt="" />
                      </div>
                      <div className="text">
                        <h6>
                          Sample Type{" "}
                          <span>
                            {sampleNames.join(", ") || "Not specified"}
                          </span>
                        </h6>
                      </div>
                    </div>
                    <div className="box">
                      <div className="icon">
                        <img src="/assets/images/test-dtl2.svg" alt="" />
                      </div>
                      <div className="text">
                        <h6>
                          Report within{" "}
                          <span>{formatTat(details.tat?.normalTat)}</span>
                        </h6>
                      </div>
                    </div>
                    <div className="box">
                      <div className="icon">
                        <img src="/assets/images/test-dtl3.svg" alt="" />
                      </div>
                      <div className="text">
                        <h6>
                          Gender <span>{genderLabel}</span>
                        </h6>
                      </div>
                    </div>
                    <div className="box">
                      <div className="icon">
                        <img src="/assets/images/test-dtl2.svg" alt="" />
                      </div>
                      <div className="text">
                        <h6>
                          Preparation{" "}
                          <span>
                            {details.prerequisites?.trim() || "Not specified"}
                          </span>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <h6 className="is-ava">
                    <img src="/assets/images/verify.svg" alt="" />{" "}
                    {collectionLabel}
                  </h6>
                </div>
                <div className="img-block">
                  <img src="/assets/images/blood-samp.svg" alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="product-view">
                {hasDiscount && (
                  <span className="discount-badge">
                    {discountPercent}% <br />
                    OFF
                  </span>
                )}
                <h4>{details.test_name}</h4>
                <p>{collectionLabel}</p>
                <div className="inn">
                  <div className="price">
                    <span>
                      {formatPrice(price)}{" "}
                      {hasDiscount && <del>{formatPrice(mrp)}</del>}
                    </span>
                    <h6>Quick Summary</h6>
                  </div>
                  <button
                    type="button"
                    className="cmn_btn"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              <Slider
                {...wpSlider}
                className="wp-slider is_slick_dot is-dtl-page"
              >
                <div className="item">
                  <div className="text-block">
                    <div className="lt">
                      <img src="/assets/images/dtl-icon2.svg" alt="" />
                    </div>
                    <div className="rt">
                      <div className="inn">
                        <h4>WhatsApp to Book Tests</h4>
                        <p>
                          explore Lab Tests, and schedule home <br />
                          sample collection through WhatsApp.
                        </p>
                      </div>
                      <button className="arrow-btn">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="text-block">
                    <div className="lt">
                      <img src="/assets/images/dtl-icon3.svg" alt="" />
                    </div>
                    <div className="rt">
                      <div className="inn">
                        <h4>Call Us</h4>
                        <p>
                          Speak directly with our customer care <br />
                          team.
                        </p>
                      </div>
                      <button className="arrow-btn">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="text-block">
                    <div className="lt">
                      <img src="/assets/images/dtl-icon1.svg" alt="" />
                    </div>
                    <div className="rt">
                      <div className="inn">
                        <h4>Request a Callback</h4>
                        <p>
                          Share your number and we'll call you back <br />
                          shortly.
                        </p>
                      </div>
                      <button className="arrow-btn">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>

      <section id="our-section" className="our-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div id="overview" className="overview">
                <div className="test-tabs">
                  <div className="tab-list">
                    <button
                      className={activeTab === 0 ? "active" : ""}
                      onClick={() => setActiveTab(0)}
                    >
                      {isPackage ? "Package Overview" : "Test Overview"}
                    </button>

                    <button
                      className={activeTab === 1 ? "active" : ""}
                      onClick={() => setActiveTab(1)}
                    >
                      {isPackage ? "About this package" : "About this test"}
                    </button>

                    <button
                      className={activeTab === 2 ? "active" : ""}
                      onClick={() => setActiveTab(2)}
                    >
                      What’s Include
                    </button>

                    <button
                      className={activeTab === 3 ? "active" : ""}
                      onClick={() => setActiveTab(3)}
                    >
                      How does home sample collection work?
                    </button>

                    <button
                      className={activeTab === 4 ? "active" : ""}
                      onClick={() => setActiveTab(4)}
                    >
                      FAQ
                    </button>
                  </div>

                  <div className="tab-content">
                    {activeTab === 0 && (
                      <div>
                        <h3>
                          {isPackage ? "Package Overview" : "Test Overview"}
                        </h3>
                        <p style={{ whiteSpace: "pre-line" }}>{fullText}</p>
                        <p>
                          <strong>Code:</strong>{" "}
                          {details.test_code || "Not specified"}
                        </p>
                        <p>
                          <strong>Sample quantity:</strong>{" "}
                          {details.sample_quantity &&
                          details.sample_quantity !== "0"
                            ? details.sample_quantity
                            : "Not specified"}
                        </p>
                        {details.tat?.urgentTat?.value && (
                          <p>
                            <strong>Urgent report:</strong>{" "}
                            {formatTat(details.tat.urgentTat)}
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === 1 && (
                      <div>
                        <h3>
                          {isPackage ? "About this package" : "About this test"}
                        </h3>
                        <p style={{ whiteSpace: "pre-line" }}>{fullText}</p>
                      </div>
                    )}

                    {activeTab === 2 && (
                      <div className="include">
                        <h3>
                          {isPackage
                            ? `${testCount} Included ${testCount === 1 ? "Test" : "Tests"}`
                            : "Test Details"}
                        </h3>
                        {isPackage ? (
                          <>
                            {testNames.length > 0 ? (
                              <div className="accordion p-0">
                                {testNames.map((name, index) => (
                                  <div
                                    className="accordion-item"
                                    key={`${name}-${index}`}
                                  >
                                    <div className="accordion-body">{name}</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>Individual test names are not available.</p>
                            )}
                            {groupNames.length > 0 && (
                              <>
                                <h4 className="mt-3">Groups</h4>
                                <ul>
                                  {groupNames.map((name, index) => (
                                    <li key={`${name}-${index}`}>{name}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <p>{details.test_name}</p>
                            <p>
                              <strong>Code:</strong>{" "}
                              {details.test_code || "Not specified"}
                            </p>
                            <p>
                              <strong>Sample:</strong>{" "}
                              {sampleNames.join(", ") || "Not specified"}
                            </p>
                            <p>
                              <strong>Preparation:</strong>{" "}
                              {details.prerequisites?.trim() || "Not specified"}
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {activeTab === 3 && (
                      <div>
                        <h3>How Home Sample Collection Works</h3>
                        <p>
                          {collectionLabel}. Select an available address and
                          collection slot during checkout.
                        </p>
                        <Slider {...settings} className="is_slick_dot is-step">
                          <div className="item">
                            <div className="box cmn_margin">
                              <div className="img-block">
                                <div className="num">
                                  <span>01</span>
                                </div>
                                <img
                                  src="/assets/images/step-img1.png"
                                  alt=""
                                />
                                <div className="text-block">
                                  <h3>Choose Date & Time</h3>
                                  <p>
                                    Choose your preferred collection date and
                                    time at checkout.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="item">
                            <div className="box cmn_margin">
                              <div className="img-block">
                                <div className="num">
                                  <span>02</span>
                                </div>
                                <img
                                  src="/assets/images/step-img2.png"
                                  alt=""
                                />
                                <div className="text-block">
                                  <h3>Our Phlebotomy Visit</h3>
                                  <p>
                                    Our phlebotomist visits your selected
                                    collection address.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="item">
                            <div className="box cmn_margin">
                              <div className="img-block">
                                <div className="num">
                                  <span>03</span>
                                </div>
                                <img
                                  src="/assets/images/step-img3.png"
                                  alt=""
                                />
                                <div className="text-block">
                                  <h3>Sample Collection</h3>
                                  <p>
                                    Your sample is collected for the booked
                                    investigations.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="item">
                            <div className="box cmn_margin">
                              <div className="img-block">
                                <div className="num">
                                  <span>04</span>
                                </div>
                                <img
                                  src="/assets/images/step-img4.png"
                                  alt=""
                                />
                                <div className="text-block">
                                  <h3>Lab Testing</h3>
                                  <p>
                                    Your sample is processed at the laboratory.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="item">
                            <div className="box cmn_margin">
                              <div className="img-block">
                                <div className="num">
                                  <span>05</span>
                                </div>
                                <img
                                  src="/assets/images/step-img5.png"
                                  alt=""
                                />
                                <div className="text-block">
                                  <h3>Get Your Report</h3>
                                  <p>View your report when it is ready.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Slider>
                      </div>
                    )}

                    {activeTab === 4 && (
                      <div className="accordion p-0" id="faqAccordion">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingOne">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              How Can I Find Information On Tests And Packages?
                            </button>
                          </h2>
                          <div
                            id="collapseOne"
                            className="accordion-collapse collapse show"
                            aria-labelledby="headingOne"
                            data-bs-parent="#faqAccordion"
                          >
                            <div className="accordion-body">
                              <p>
                                You need to log in to{" "}
                                <strong>www.nirnayanhealthcare.com</strong> and
                                click on the option of “Patient” and you will
                                get the information about that and also you can
                                filter test and packages according to you.
                              </p>
                              <a href="#">Contact Us</a>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingTwo">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseTwo"
                              aria-expanded="false"
                              aria-controls="collapseTwo"
                            >
                              How Can I Find Information On Tests And Packages?
                            </button>
                          </h2>

                          <div
                            id="collapseTwo"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#faqAccordion"
                          >
                            <div className="accordion-body">
                              <p>
                                You can find all test and package information
                                from the Patient section of our website.
                              </p>
                              <a href="#">Contact Us</a>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingThree">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseThree"
                              aria-expanded="false"
                              aria-controls="collapseThree"
                            >
                              How Can I Find Information On Tests And Packages?
                            </button>
                          </h2>

                          <div
                            id="collapseThree"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingThree"
                            data-bs-parent="#faqAccordion"
                          >
                            <div className="accordion-body">
                              <p>
                                You can contact our support team for more
                                information.
                              </p>
                              <a href="#">Contact Us</a>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingFour">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseFour"
                              aria-expanded="false"
                              aria-controls="collapseFour"
                            >
                              How Can I Find Information On Tests And Packages?
                            </button>
                          </h2>

                          <div
                            id="collapseFour"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingFour"
                            data-bs-parent="#faqAccordion"
                          >
                            <div className="accordion-body">
                              <p>
                                Please contact us for additional information.
                              </p>
                              <a href="#">Contact Us</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div id="city-pricing" className="city-pricing">
                <h3>{details.test_name} Pricing</h3>
                <div className="city-box">
                  <div className="city-box-inn">
                    <h5>Price In</h5>
                  </div>
                  <div className="city-box-inn">
                    <h5>{current.locationName}</h5>
                  </div>
                  <div className="city-box-inn">
                    <h5>{formatPrice(price)}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="most-book">
                <h3>Quick Summary</h3>
                <div className="test-list">
                  <div className="test-card active">
                    <span className="test-name">{details.test_name}</span>
                    <div className="test-action">
                      <div className="price-group">
                        <span className="current-price">
                          {formatPrice(price)}{" "}
                          {hasDiscount && <del>{formatPrice(mrp)}</del>}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="cart-btn"
                        aria-label={`Add ${details.test_name} to cart`}
                        onClick={handleAddToCart}
                      >
                        <i
                          className="fa-solid fa-cart-shopping"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="side-img">
                <img src="/assets/images/sidebar-img.png" alt="" />
              </div>
              <div className="privacy">
                <h3>Privacy Policy</h3>
                <ul>
                  <li>We do not accept cash payments</li>
                  <li>All modes of online payment are accepted</li>
                  <li>
                    Refunds will be credited back to the source of payment
                    within 5-7 working days of order cancellation.
                  </li>
                  <li>All modes of online payment are accepted</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div id="related-test" className="related-test">
          <PopularTest section={2} />
        </div>
        <div id="related-pkg" className="related-pkg">
          <PopularPackage />
        </div>
        <div id="blog" className="blog">
          <Blog />
        </div>
        <div id="feedback" className="feedback">
          <Testimonial />
        </div>
        <div className="test-book">
          <BookWith />
        </div>
        <Faq />
      </section>
    </div>
  );
}

export default function InvestigationDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-5" role="status">
          Loading investigation details…
        </div>
      }
    >
      <TestDetail />
    </Suspense>
  );
}
