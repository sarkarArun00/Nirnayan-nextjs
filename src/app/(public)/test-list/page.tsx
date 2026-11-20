"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";

import PopularTest from "@/components/home/PopularTest";
import BookWith from "@/components/home/BookWith";
import Faq from "@/components/home/Faq";
import Awards from "@/components/home/Awards";

import {
  getOrganConditionsDepartment,
  getPopularPackagesPost,
} from "@/services/master.service";

import { usePatientSelection } from "@/components/common/PatientSelectionModal/PatientSelectionProvider";

import "./page.css";

type FilterType = "mostpopular" | "organ" | "condition" | "department" | "age";

type FilterItem = {
  id: number;
  name: string;
  icon: string;
};

type TestItem = {
  id: number;
  test_name: string;
  product_type: string;
  description: string | null;
  department_id: number;
  test_code: string;
  offerAmount: number | null;
  mrpAmount: string | number;
  homeCollection: boolean;
  tempOrder: number;
  tat?: {
    normalTat?: {
      value: string;
      isHour: boolean;
    };
    urgentTat?: {
      value: string;
      isHour: boolean;
    };
  };
};

const PAGE_LIMIT = 10;

export default function TestListPage() {
  const { openPatientModal } = usePatientSelection();

  const [filterType, setFilterType] = useState<FilterType>("mostpopular");

  const [organs, setOrgans] = useState<FilterItem[]>([]);

  const [conditions, setConditions] = useState<FilterItem[]>([]);

  const [departments, setDepartments] = useState<FilterItem[]>([]);

  const [selectedFilter, setSelectedFilter] = useState<FilterItem | null>(null);

  const [testList, setTestList] = useState<TestItem[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [pageNo, setPageNo] = useState(1);

  const [hasMore, setHasMore] = useState(false);

  const [testLoading, setTestLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [isFilterLoading, setIsFilterLoading] = useState(false);

    const popular_slider = {
  dots: true,
  arrows: false,
  infinite: true,
  autoplay: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "60px",
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
    };
    
  const filterSliderSettings = {
    dots: true,
    arrows: false,
    infinite: false,
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

  const getImageUrl = (path?: string | null) => {
    if (!path) {
      return "";
    }

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    const baseUrl = process.env.NEXT_PUBLIC_LIMS_API_BASE_URL || "";

    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${cleanBase}${cleanPath}`;
  };

  const getFilterItems = (): FilterItem[] => {
    switch (filterType) {
      case "organ":
        return organs;

      case "condition":
        return conditions;

      case "department":
        return departments;

      default:
        return [];
    }
  };

  const filterItems = getFilterItems();

  const getSelectedStateId = () => {
    const savedState = localStorage.getItem("nirnayan_selected_state");

    if (!savedState) {
      throw new Error("Please select a location first.");
    }

    const parsedState = JSON.parse(savedState);

    const stateId = Number(parsedState?.id);

    if (!stateId) {
      throw new Error("Selected state is invalid.");
    }

    return stateId;
  };

  const loadTests = async (
    type: FilterType,
    item?: FilterItem | null,
    page = 1,
    append = false,
  ) => {
    /*
     * Age Wise is intentionally not
     * implemented until its API contract
     * is available.
     */
    if (type === "age") {
      return;
    }

    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setTestLoading(true);
      }

      const stateId = getSelectedStateId();

        
const payload: {
  group: number[];
  speciality: number[];
  department: number[];
  state_id: number;
  product_type: "test";
  popular_investigations: boolean;

  group_by: "" | "organ" | "department" | "speciality";

  page: number;
  limit: number;
} = {
  group: [],
  speciality: [],
  department: [],

  state_id: stateId,

  product_type: "test",

  popular_investigations: type === "mostpopular",

  group_by: "",

  page,
  limit: PAGE_LIMIT,
};
      if (type === "organ" && item) {
        payload.group = [item.id];

        payload.group_by = "organ";
      }

      if (type === "condition" && item) {
        payload.speciality = [item.id];

        payload.group_by = "speciality";
      }

      if (type === "department" && item) {
        payload.department = [item.id];

        payload.group_by = "department";
      }

      console.log("Test List API Payload:", payload);

      const response = await getPopularPackagesPost(payload);

      console.log("Test List API Response:", response);

      const incomingTests = Array.isArray(response?.data) ? response.data : [];

      if (append) {
        setTestList((previous) => {
          const merged = [...previous, ...incomingTests];

          /*
           * Avoid duplicate cards if the
           * backend repeats an item between
           * pages.
           */
          return Array.from(
            new Map(merged.map((test) => [test.id, test])).values(),
          );
        });
      } else {
        setTestList(incomingTests);
      }

      setPageNo(page);

      setHasMore(incomingTests.length === PAGE_LIMIT);
    } catch (error) {
      console.error("Test List API Error:", error);

      if (!append) {
        setTestList([]);
      }

      setHasMore(false);
    } finally {
      setTestLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMasterFilters = async () => {
    try {
      setIsFilterLoading(true);

      const response = await getOrganConditionsDepartment();

      if (response?.success && response?.status === 1 && response?.data) {
        const organList: FilterItem[] = (response.data.organs || []).map(
          (item: any) => ({
            id: item.id,

            name: item.group_name,

            icon: item.icon || "",
          }),
        );

        const conditionList: FilterItem[] = (
          response.data.conditions || []
        ).map((item: any) => ({
          id: item.id,

          name: item.specialityname,

          icon: item.icon || "",
        }));

        const departmentList: FilterItem[] = (
          response.data.departments || []
        ).map((item: any) => ({
          id: item.id,

          name: item.dept_name,

          icon: item.image || "",
        }));

        setOrgans(organList);

        setConditions(conditionList);

        setDepartments(departmentList);
      }
    } catch (error) {
      console.error("Filter Master API Error:", error);
    } finally {
      setIsFilterLoading(false);
    }
  };

  useEffect(() => {
    void loadMasterFilters();

    void loadTests("mostpopular", null, 1, false);
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as FilterType;

    setFilterType(value);

    setSearchTerm("");

    if (value === "mostpopular") {
      setSelectedFilter(null);

      void loadTests("mostpopular", null, 1, false);

      return;
    }

    /*
     * Future placeholder only.
     * The dropdown option is disabled,
     * so this currently won't run.
     */
    if (value === "age") {
      setSelectedFilter(null);

      setTestList([]);

      setHasMore(false);

      return;
    }

    let items: FilterItem[] = [];

    if (value === "organ") {
      items = organs;
    }

    if (value === "condition") {
      items = conditions;
    }

    if (value === "department") {
      items = departments;
    }

    if (items.length > 0) {
      const firstItem = items[0];

      setSelectedFilter(firstItem);

      void loadTests(value, firstItem, 1, false);
    } else {
      setSelectedFilter(null);

      setTestList([]);

      setHasMore(false);
    }
  };

  const handleFilterItemClick = (item: FilterItem) => {
    setSelectedFilter(item);

    setSearchTerm("");

    void loadTests(filterType, item, 1, false);
  };

  const handleClearFilters = () => {
    setFilterType("mostpopular");

    setSelectedFilter(null);

    setSearchTerm("");

    void loadTests("mostpopular", null, 1, false);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) {
      return;
    }

    void loadTests(filterType, selectedFilter, pageNo + 1, true);
  };

  const filteredTests = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return testList;
    }

    return testList.filter((test) => {
      return [test.test_name, test.test_code, test.description || ""].some(
        (value) => String(value).toLowerCase().includes(search),
      );
    });
  }, [testList, searchTerm]);

  const resultTitle =
    filterType === "mostpopular"
      ? "Most Popular Tests"
      : selectedFilter?.name || "Tests";

  const formatTat = (tat?: { value: string; isHour: boolean }) => {
    if (!tat?.value) {
      return "-";
    }

    return `${tat.value} ${tat.isHour ? "Hours" : "Days"}`;
  };

  const getDiscountPercentage = (test: TestItem) => {
    const mrp = Number(test.mrpAmount || 0);

    const offer = Number(test.offerAmount || 0);

    if (mrp <= 0 || offer <= 0 || offer >= mrp) {
      return 0;
    }

    return Math.round(((mrp - offer) / mrp) * 100);
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
                Lab Test
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="in-banner">
        <div className="container">
          <div className="inn">
            <img src="/assets/images/testlist.jpg" alt="" />

            <div className="text-block">
              <h1>
                <span>Find the Right Lab Test </span>
                for Your Health
              </h1>

              <p>
                Explore our comprehensive range of laboratory tests, from
                routine health checkups to specialized diagnostic
                investigations, with accurate results and reliable care.
              </p>
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
              <li>
                <Link href="#" className="active">
                  Tests
                </Link>
              </li>

              <li>
                <Link href="/our-package">Packages</Link>
              </li>
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
                    <h3>
                      Highest rated <span>diagnostics lab</span>
                    </h3>
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
                    <img
                      src="/assets/images/instant-sample-collection.webp"
                      alt=""
                    />
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
                    <input
                      type="text"
                      placeholder="Search Tests & Packages"
                      className="form-control"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />

                    <i className="fa-solid fa-magnifying-glass search-icon" />

                    <button type="button" aria-label="Voice search">
                      <i className="fa-solid fa-microphone" />
                    </button>
                  </div>

                  <div className="select-pnl">
                    <select
                      className="form-control form-select"
                      value={filterType}
                      onChange={handleFilterChange}
                    >
                      <option value="mostpopular">Most Popular</option>

                      <option value="organ">Organ Wise</option>

                      <option value="condition">Condition Wise</option>

                      <option value="department">Department Wise</option>

                      <option value="age" disabled>
                        Age Wise - Coming Soon
                      </option>
                    </select>
                  </div>
                </div>

                {filterType !== "mostpopular" && filterType !== "age" && (
                  <div className="organ-slider">
                    {isFilterLoading ? (
                      <div className="text-center py-4">Loading filters...</div>
                    ) : filterItems.length > 0 ? (
                      <Slider
                        {...filterSliderSettings}
                        className="is_slick_dot"
                      >
                        {filterItems.map((item) => (
                          <div
                            key={`${filterType}-${item.id}`}
                            className="organ-slide"
                          >
                            <button
                              type="button"
                              className={`organ-item ${
                                selectedFilter?.id === item.id ? "active" : ""
                              }`}
                              onClick={() => handleFilterItemClick(item)}
                              aria-pressed={selectedFilter?.id === item.id}
                            >
                              <span className="organ-icons">
                                <img
                                  src={
                                    item.icon
                                      ? getImageUrl(item.icon)
                                      : "/assets/images/report.svg"
                                  }
                                  alt={item.name}
                                  onError={(event) => {
                                    event.currentTarget.onerror = null;

                                    event.currentTarget.src =
                                      "/assets/images/report.svg";
                                  }}
                                />
                              </span>

                              <h6 className="organ-name">{item.name}</h6>
                            </button>
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div className="text-center py-4">
                        No filters available.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="search-result">
            <div className="top-wrap">
              <div className="left">
                <h4>{resultTitle}</h4>

                <h6>
                  Showing <span>{filteredTests.length} test(s)</span>
                </h6>
              </div>

              <button
                type="button"
                className="clear-filter"
                onClick={handleClearFilters}
              >
                <i className="fa-solid fa-arrow-rotate-left" /> Clear filters
              </button>
            </div>

            {testLoading ? (
              <div className="text-center py-5">
                <p>Loading tests...</p>
              </div>
            ) : filteredTests.length > 0 ? (
              <>
                <div className="btm-wrap">
                  {filteredTests.map((test) => {
                    const discount = getDiscountPercentage(test);

                    const hasOffer =
                      Number(test.offerAmount || 0) > 0 &&
                      Number(test.offerAmount || 0) <
                        Number(test.mrpAmount || 0);

                    return (
                      <div
                        className={`test-box ${
                          filterType === "mostpopular" ? "is-popular" : ""
                        }`}
                        key={test.id}
                      >
                        <div className="top-pnl">
                          {/* <img
                            src={
                              filterType === "mostpopular"
                                ? "/assets/images/fire.svg"
                                : selectedFilter?.icon
                                  ? getImageUrl(selectedFilter.icon)
                                  : "/assets/images/report.svg"
                            }
                            alt=""
                          /> */}

                          <h6>
                            {filterType === "mostpopular"
                              ? "Most Popular"
                              : selectedFilter?.name || "Test"}
                          </h6>
                        </div>

                        <div className="wh-block">
                          <div className="inn-pnl">
                            <h2>{test.test_name}</h2>

                            <p>
                              {test.description || "No description available"}
                            </p>

                            <div className="info">
                              <div className="left">
                                <img src="/assets/images/report.svg" alt="" />

                                <h6>Reports in</h6>
                              </div>

                              <div className="right">
                                <span className="days">
                                  {formatTat(test.tat?.normalTat)}
                                </span>
                              </div>
                            </div>

                            <div className="info">
                              <div className="left">
                                <img src="/assets/images/ava.svg" alt="" />

                                <h6>Available in</h6>
                              </div>

                              <div className="right">
                                {test.homeCollection && (
                                  <span className="lab">
                                    <img src="/assets/images/home.svg" alt="" />
                                    Home
                                  </span>
                                )}

                                <span className="lab">
                                  <img src="/assets/images/lab.svg" alt="" />
                                  Lab
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="btm-pnl">
                            <div className="d-flex align-items-center gap-2">
                              {hasOffer ? (
                                <>
                                  <span className="price">
                                    ₹{Number(test.offerAmount).toFixed(2)}{" "}
                                    <del>
                                      ₹{Number(test.mrpAmount || 0).toFixed(2)}
                                    </del>
                                  </span>

                                  {discount > 0 && (
                                    <span className="discount">
                                      {discount}% Off
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="price">
                                  ₹{Number(test.mrpAmount || 0).toFixed(2)}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              className="cmn_btn"
                              onClick={() =>
                                openPatientModal({
                                  id: test.id,

                                  name: test.test_name,

                                  productType: "test",

                                  price: String(test.mrpAmount || 0),
                                })
                              }
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {hasMore && !searchTerm.trim() && (
                  <div className="text-center">
                    <button
                      type="button"
                      className="sec_btn border-0"
                      disabled={loadingMore}
                      onClick={handleLoadMore}
                    >
                      {loadingMore ? "Loading..." : "Load more"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-5">
                <p>No tests available.</p>
              </div>
            )}

            <div className="is-upload">
              <div className="text-block">
                <h2>
                  Upload Prescription to <span>Book Lab Tests</span>
                </h2>

                <p>
                  Upload your doctor&apos;s prescription to book the recommended
                  tests
                </p>

                <Link href="/upload-prescription" className="cmn_btn">
                  Upload File
                </Link>
              </div>

              <div className="img-block">
                <img
                  src="/assets/images/upload-pres.png"
                  alt="Upload prescription"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Tests intentionally skipped until API is available */}

      <div className="related-test">
        <div className="container">
          <div className="top-title">
            <div className="left-pnl">
              <h2>Related tests</h2>
              <p>
                Contact us for routine tests to specialized blood tests and make
                your tomorrow healthy
              </p>
            </div>
            <button className="expand-btn is_white">
              <span className="icon">
                <img src="/assets/images/exp-btn.svg" alt="" />
              </span>
              <span className="btn-text">View More</span>
            </button>
          </div>
          <div className="cmn-right-align">
            <Slider {...popular_slider} className="is_slick_dot">
              <div className="item">
                <div className="test-box is-popular">
                  <div className="top-pnl">
                    <img src="/assets/images/fire.svg" alt="" />
                    <h6>Most Popular</h6>
                  </div>
                  <div className="wh-block">
                    <div className="inn-pnl">
                      <h2>Urea - Serum</h2>
                      <p>
                        A complete blood count (CBC) also known as a full blood
                        count (FBC)
                      </p>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/report.svg" alt="" />
                          <h6>Reports in</h6>
                        </div>
                        <div className="right">
                          <span className="days">Days</span>
                        </div>
                      </div>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/ava.svg" alt="" />
                          <h6>Available in</h6>
                        </div>
                        <div className="right">
                          <span className="lab">
                            <img src="/assets/images/home.svg" alt="" />
                            Home
                          </span>
                          <span className="lab">
                            <img src="/assets/images/lab.svg" alt="" />
                            Lab
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="btm-pnl">
                      <div className="d-flex align-items-center gap-2">
                        <span className="price">
                          ₹500.00 <del>₹1000</del>
                        </span>
                        <span className="discount">10% Off</span>
                      </div>
                      <button className="cmn_btn">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="test-box">
                  <div className="top-pnl">
                    <img src="/assets/images/lung.svg" alt="" />
                    <h6>By Lungs Organs</h6>
                  </div>
                  <div className="wh-block">
                    <div className="inn-pnl">
                      <h2>Urea - Serum</h2>
                      <p>
                        A complete blood count (CBC) also known as a full blood
                        count (FBC)
                      </p>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/report.svg" alt="" />
                          <h6>Reports in</h6>
                        </div>
                        <div className="right">
                          <span className="days">Days</span>
                        </div>
                      </div>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/ava.svg" alt="" />
                          <h6>Available in</h6>
                        </div>
                        <div className="right">
                          <span className="lab">
                            <img src="/assets/images/home.svg" alt="" />
                            Home
                          </span>
                          <span className="lab">
                            <img src="/assets/images/lab.svg" alt="" />
                            Lab
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="btm-pnl">
                      <div className="d-flex align-items-center gap-2">
                        <span className="price">
                          ₹500.00 <del>₹1000</del>
                        </span>
                        <span className="discount">10% Off</span>
                      </div>
                      <button className="cmn_btn">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="test-box is-popular">
                  <div className="top-pnl">
                    <img src="/assets/images/fire.svg" alt="" />
                    <h6>Most Popular</h6>
                  </div>
                  <div className="wh-block">
                    <div className="inn-pnl">
                      <h2>Urea - Serum</h2>
                      <p>
                        A complete blood count (CBC) also known as a full blood
                        count (FBC)
                      </p>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/report.svg" alt="" />
                          <h6>Reports in</h6>
                        </div>
                        <div className="right">
                          <span className="days">Days</span>
                        </div>
                      </div>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/ava.svg" alt="" />
                          <h6>Available in</h6>
                        </div>
                        <div className="right">
                          <span className="lab">
                            <img src="/assets/images/home.svg" alt="" />
                            Home
                          </span>
                          <span className="lab">
                            <img src="/assets/images/lab.svg" alt="" />
                            Lab
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="btm-pnl">
                      <div className="d-flex align-items-center gap-2">
                        <span className="price">
                          ₹500.00 <del>₹1000</del>
                        </span>
                        <span className="discount">10% Off</span>
                      </div>
                      <button className="cmn_btn">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="test-box">
                  <div className="top-pnl">
                    <img src="/assets/images/lung.svg" alt="" />
                    <h6>By Lungs Organs</h6>
                  </div>
                  <div className="wh-block">
                    <div className="inn-pnl">
                      <h2>Urea - Serum</h2>
                      <p>
                        A complete blood count (CBC) also known as a full blood
                        count (FBC)
                      </p>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/report.svg" alt="" />
                          <h6>Reports in</h6>
                        </div>
                        <div className="right">
                          <span className="days">Days</span>
                        </div>
                      </div>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/ava.svg" alt="" />
                          <h6>Available in</h6>
                        </div>
                        <div className="right">
                          <span className="lab">
                            <img src="/assets/images/home.svg" alt="" />
                            Home
                          </span>
                          <span className="lab">
                            <img src="/assets/images/lab.svg" alt="" />
                            Lab
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="btm-pnl">
                      <div className="d-flex align-items-center gap-2">
                        <span className="price">
                          ₹500.00 <del>₹1000</del>
                        </span>
                        <span className="discount">10% Off</span>
                      </div>
                      <button className="cmn_btn">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="test-box is-popular">
                  <div className="top-pnl">
                    <img src="/assets/images/fire.svg" alt="" />
                    <h6>Most Popular</h6>
                  </div>
                  <div className="wh-block">
                    <div className="inn-pnl">
                      <h2>Urea - Serum</h2>
                      <p>
                        A complete blood count (CBC) also known as a full blood
                        count (FBC)
                      </p>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/report.svg" alt="" />
                          <h6>Reports in</h6>
                        </div>
                        <div className="right">
                          <span className="days">Days</span>
                        </div>
                      </div>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/ava.svg" alt="" />
                          <h6>Available in</h6>
                        </div>
                        <div className="right">
                          <span className="lab">
                            <img src="/assets/images/home.svg" alt="" />
                            Home
                          </span>
                          <span className="lab">
                            <img src="/assets/images/lab.svg" alt="" />
                            Lab
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="btm-pnl">
                      <div className="d-flex align-items-center gap-2">
                        <span className="price">
                          ₹500.00 <del>₹1000</del>
                        </span>
                        <span className="discount">10% Off</span>
                      </div>
                      <button className="cmn_btn">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="test-box">
                  <div className="top-pnl">
                    <img src="/assets/images/lung.svg" alt="" />
                    <h6>By Lungs Organs</h6>
                  </div>
                  <div className="wh-block">
                    <div className="inn-pnl">
                      <h2>Urea - Serum</h2>
                      <p>
                        A complete blood count (CBC) also known as a full blood
                        count (FBC)
                      </p>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/report.svg" alt="" />
                          <h6>Reports in</h6>
                        </div>
                        <div className="right">
                          <span className="days">Days</span>
                        </div>
                      </div>
                      <div className="info">
                        <div className="left">
                          <img src="/assets/images/ava.svg" alt="" />
                          <h6>Available in</h6>
                        </div>
                        <div className="right">
                          <span className="lab">
                            <img src="/assets/images/home.svg" alt="" />
                            Home
                          </span>
                          <span className="lab">
                            <img src="/assets/images/lab.svg" alt="" />
                            Lab
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="btm-pnl">
                      <div className="d-flex align-items-center gap-2">
                        <span className="price">
                          ₹500.00 <del>₹1000</del>
                        </span>
                        <span className="discount">10% Off</span>
                      </div>
                      <button className="cmn_btn">Add to Cart</button>
                    </div>
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

              <p>Have any questions? We&apos;re here to assist you</p>
            </div>
          </div>

          <div className="accordion" id="faqAccordion">
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
                    <strong>www.nirnayanhealthcare.com</strong> and click on the
                    option of “Patient” and you will get the information about
                    that and also you can filter test and packages according to
                    you.
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
                  What is a Medical Encyclopedia?
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
                    You can find all test and package information from the
                    Patient section of our website.
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
                  What is an Association?
                </button>
              </h2>

              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  <p>You can contact our support team for more information.</p>

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
  );
}
