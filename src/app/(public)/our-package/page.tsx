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

type PackageFilterType =
  | "mostpopular"
  | "organ"
  | "condition"
  | "department"
  | "age";

type FilterItem = {
  id: number;
  name: string;
  icon: string;
};

type PackageItem = {
  id: number;
  test_name: string;
  product_type: string;
  description: string | null;
  department_id: number | null;
  test_code: string;

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

  homeCollection: boolean;
  tempOrder: number;

  mrpAmount: string | number;

  offerAmount: string | number | null;

  // optional because API may not return it
  finalAmount?: string | number | null;

  testCount?: number;
  testNames?: string[];
  groupNames?: string[];
};

type PackagePayload = {
  group: number[];
  speciality: number[];
  department: number[];

  state_id: number;

  product_type: "package";

  popular_investigations: boolean;

  group_by: "" | "organ" | "department" | "speciality";

  page: number;
  limit: number;
};

const PAGE_LIMIT = 10;

export default function PackageListPage() {
  const { openPatientModal } = usePatientSelection();

  const [filterType, setFilterType] =
    useState<PackageFilterType>("organ");

  const [organs, setOrgans] = useState<FilterItem[]>([]);

  const [conditions, setConditions] = useState<FilterItem[]>([]);

  const [departments, setDepartments] = useState<FilterItem[]>([]);

  const [selectedFilter, setSelectedFilter] = useState<FilterItem | null>(null);

  const [packageList, setPackageList] = useState<PackageItem[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [pageNo, setPageNo] = useState(1);

  const [hasMore, setHasMore] = useState(false);

  const [packageLoading, setPackageLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [filterLoading, setFilterLoading] = useState(false);

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

  /*
   * This slider is intentionally kept for the
   * existing static Related packages section below.
   */
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

  const loadPackages = async (
    type: PackageFilterType,
    item?: FilterItem | null,
    page = 1,
    append = false,
  ) => {
    /*
     * Age Wise is future-ready only.
     * No API payload is invented until its contract is supplied.
     */
    if (type === "age") {
      return;
    }

    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setPackageLoading(true);
      }

      const stateId = getSelectedStateId();

      const payload: PackagePayload = {
        group: [],
        speciality: [],
        department: [],

        state_id: stateId,

        product_type: "package",

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

      console.log("Package List API Payload:", payload);

      const response = await getPopularPackagesPost(payload);

      console.log("Package List API Response:", response);

      const incomingPackages: PackageItem[] = Array.isArray(response?.data)
        ? response.data
        : [];

      if (append) {
        setPackageList((previous) => {
          const merged = [...previous, ...incomingPackages];

          return Array.from(
            new Map(merged.map((item) => [item.id, item])).values(),
          );
        });
      } else {
        setPackageList(incomingPackages);
      }

      setPageNo(page);

      setHasMore(incomingPackages.length === PAGE_LIMIT);
    } catch (error) {
      console.error("Package List API Error:", error);

      if (!append) {
        setPackageList([]);
      }

      setHasMore(false);
    } finally {
      setPackageLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMasterFilters = async () => {
    try {
      setFilterLoading(true);

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
      console.error("Package Filter API Error:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    void loadMasterFilters();

    void loadPackages("mostpopular", null, 1, false);
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as PackageFilterType;

    setFilterType(value);

    setSearchTerm("");

    if (value === "mostpopular") {
      setSelectedFilter(null);

      void loadPackages("mostpopular", null, 1, false);

      return;
    }

    /*
     * Age Wise remains visible as a future option,
     * but the select option is disabled for now.
     */
    if (value === "age") {
      setSelectedFilter(null);

      setPackageList([]);

      setHasMore(false);

      return;
    }

    let items: FilterItem[] = [];

    if (value === "organ") {
      items = organs;
    } else if (value === "condition") {
      items = conditions;
    } else if (value === "department") {
      items = departments;
    }

    if (items.length > 0) {
      const firstItem = items[0];

      setSelectedFilter(firstItem);

      void loadPackages(value, firstItem, 1, false);
    } else {
      setSelectedFilter(null);

      setPackageList([]);

      setHasMore(false);
    }
  };

  const handleFilterItemClick = (item: FilterItem) => {
    setSelectedFilter(item);

    setSearchTerm("");

    void loadPackages(filterType, item, 1, false);
  };

  const handleClearFilters = () => {
    setFilterType("mostpopular");

    setSelectedFilter(null);

    setSearchTerm("");

    void loadPackages("mostpopular", null, 1, false);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) {
      return;
    }

    void loadPackages(filterType, selectedFilter, pageNo + 1, true);
  };

  const filteredPackages = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return packageList;
    }

    return packageList.filter((item) => {
      const groups = item.groupNames?.join(" ") || "";

      return [
        item.test_name,
        item.test_code,
        item.description || "",
        groups,
      ].some((value) => String(value).toLowerCase().includes(search));
    });
  }, [packageList, searchTerm]);

  const resultTitle =
    filterType === "mostpopular"
      ? "Most Popular Packages"
      : selectedFilter?.name || "Packages";

  const formatPackageTat = (tat?: { value: string; isHour: boolean }) => {
    if (!tat?.value) {
      return "-";
    }

    return `${tat.value} ${tat.isHour ? "Hours" : "Days"}`;
  };

  const getFinalPrice = (item: PackageItem) => {
    const finalAmount = Number(item.finalAmount || 0);

    if (finalAmount > 0) {
      return finalAmount;
    }

    const offerAmount = Number(item.offerAmount || 0);

    if (offerAmount > 0) {
      return offerAmount;
    }

    return Number(item.mrpAmount || 0);
  };

  const getDiscountPercentage = (item: PackageItem) => {
    const mrp = Number(item.mrpAmount || 0);

    const finalPrice = getFinalPrice(item);

    if (mrp <= 0 || finalPrice <= 0 || finalPrice >= mrp) {
      return 0;
    }

    return Math.round(((mrp - finalPrice) / mrp) * 100);
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
              <h1>
                <span>One Package for Complete </span>
                Health and Better Living.
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
                <Link href="/test-list">Tests</Link>
              </li>

              <li>
                <Link href="#" className="active">
                  Packages
                </Link>
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
                    {filterLoading ? (
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
                              <span className="organ-icon">
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
                  Showing <span>{filteredPackages.length} package(s)</span>
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

            {packageLoading ? (
              <div className="text-center py-5">
                <p>Loading packages...</p>
              </div>
            ) : filteredPackages.length > 0 ? (
              <>
                <div className="btm-wrap">
                  {filteredPackages.map((item) => {
                    const finalPrice = getFinalPrice(item);

                    const mrp = Number(item.mrpAmount || 0);

                    const discount = getDiscountPercentage(item);

                    const hasDiscount = mrp > 0 && finalPrice < mrp;

                    return (
                      <div className="pack-card" key={item.id}>
                        <div className="image-section">
                          <div className="img">
                            <img
                              src="/assets/images/pack-img.png"
                              alt={item.test_name}
                            />

                            <div className="img-lbl">{item.test_code}</div>
                          </div>

                          {filterType === "mostpopular" && (
                            <div className="popular-badge">
                              <img src="/assets/images/fire.svg" alt="" />

                              <h6>Most Popular</h6>
                            </div>
                          )}

                          {filterType !== "mostpopular" &&
                            selectedFilter?.icon && (
                              <div className="icon">
                                <img
                                  src={getImageUrl(selectedFilter.icon)}
                                  alt={selectedFilter.name}
                                  onError={(event) => {
                                    event.currentTarget.onerror = null;

                                    event.currentTarget.src =
                                      "/assets/images/joint.png";
                                  }}
                                />
                              </div>
                            )}
                        </div>

                        <h2 className="title">{item.test_name}</h2>

                        <div className="contains-row">
                          <h6>Contains</h6>

                          <div className="test-count">
                            <img src="/assets/images/laboratory.svg" alt="" />

                            <p>
                              {item.testCount || 0}{" "}
                              {item.testCount === 1 ? "Test" : "Tests"}
                            </p>
                          </div>
                        </div>

                        {item.groupNames && item.groupNames.length > 0 && (
                          <div className="tags">
                            {item.groupNames
                              .slice(0, 3)
                              .map((groupName, index) => (
                                <span
                                  className="tag"
                                  key={`${groupName}-${index}`}
                                >
                                  {groupName}
                                </span>
                              ))}

                            {item.groupNames.length > 3 && (
                              <span className="tag">
                                +{item.groupNames.length - 3} More
                              </span>
                            )}
                          </div>
                        )}

                        <div className="info-section">
                          <div className="info-box">
                            <span className="info-icon">
                              <img src="/assets/images/microscope.svg" alt="" />
                            </span>

                            <div className="info-text">
                              <h6>
                                Available in{" "}
                                <span>
                                  {item.homeCollection ? "Home & Lab" : "Lab"}
                                </span>
                              </h6>
                            </div>
                          </div>

                          <div className="info-box">
                            <span className="info-icon">
                              <img src="/assets/images/calender.svg" alt="" />
                            </span>

                            <div className="info-text">
                              <h6>
                                Report{" "}
                                <span>
                                  {formatPackageTat(item.tat?.normalTat)}
                                </span>
                              </h6>
                            </div>
                          </div>
                        </div>

                        <div className="price-section">
                          <div className="flex-wrap">
                            <div className="pr-sec">
                              <h3 className="price">
                                ₹{finalPrice.toFixed(2)}
                              </h3>

                              {hasDiscount && (
                                <h6 className="old-price">₹{mrp.toFixed(2)}</h6>
                              )}
                            </div>

                            {discount > 0 && (
                              <span className="discount">Save {discount}%</span>
                            )}
                          </div>

                          <button
                            type="button"
                            className="cmn_btn"
                            onClick={() =>
                              openPatientModal({
                                id: item.id,

                                name: item.test_name,

                                productType: "package",

                                price: String(finalPrice),
                              })
                            }
                          >
                            Add To Cart
                          </button>
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
                <p>No packages available.</p>
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

      <div className="related-test">
        <div className="container">
          <div className="top-title">
            <div className="left-pnl">
              <h2>Related packages</h2>
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
                <div className="pack-card cmn_margin">
                  <div className="image-section">
                    <div className="img">
                      <img src="/assets/images/pack-img.png" alt="" />
                      <div className="img-lbl">THYROID</div>
                    </div>
                    <div className="popular-badge">
                      <img src="/assets/images/fire.svg" alt="" />
                      <h6>Most Popular</h6>
                    </div>
                    <div className="icon">
                      <img src="/assets/images/joint.png" alt="" />
                    </div>
                  </div>
                  <h2 className="title">
                    Thyroid - FT4 AEC - Absolute Eosinophil Count
                  </h2>
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
                        <h6>
                          Available in <span>Home & Lab</span>
                        </h6>
                      </div>
                    </div>
                    <div className="info-box">
                      <span className="info-icon">
                        <img src="/assets/images/calender.svg" alt="" />
                      </span>
                      <div className="info-text">
                        <h6>
                          Report <span>Same Day</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="price-section">
                    <div className="flex-wrap">
                      <div className="pr-sec">
                        <h3 className="price">₹450</h3>
                        <h6 className="old-price">₹899</h6>
                      </div>
                      <span className="discount">Save 10%</span>
                    </div>
                    <button className="cmn_btn">Add To Cart</button>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="pack-card cmn_margin">
                  <div className="image-section">
                    <div className="img">
                      <img src="/assets/images/pack-img.png" alt="" />
                      <div className="img-lbl">THYROID</div>
                    </div>
                    <div className="popular-badge">
                      <img src="/assets/images/fire.svg" alt="" />
                      <h6>Most Popular</h6>
                    </div>
                    <div className="icon">
                      <img src="/assets/images/joint.png" alt="" />
                    </div>
                  </div>
                  <h2 className="title">
                    Thyroid - FT4 AEC - Absolute Eosinophil Count
                  </h2>
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
                        <h6>
                          Available in <span>Home & Lab</span>
                        </h6>
                      </div>
                    </div>
                    <div className="info-box">
                      <span className="info-icon">
                        <img src="/assets/images/calender.svg" alt="" />
                      </span>
                      <div className="info-text">
                        <h6>
                          Report <span>Same Day</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="price-section">
                    <div className="flex-wrap">
                      <div className="pr-sec">
                        <h3 className="price">₹450</h3>
                        <h6 className="old-price">₹899</h6>
                      </div>
                      <span className="discount">Save 10%</span>
                    </div>
                    <button className="cmn_btn">Add To Cart</button>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="pack-card cmn_margin">
                  <div className="image-section">
                    <div className="img">
                      <img src="/assets/images/pack-img.png" alt="" />
                      <div className="img-lbl">THYROID</div>
                    </div>
                    <div className="popular-badge">
                      <img src="/assets/images/fire.svg" alt="" />
                      <h6>Most Popular</h6>
                    </div>
                    <div className="icon">
                      <img src="/assets/images/joint.png" alt="" />
                    </div>
                  </div>
                  <h2 className="title">
                    Thyroid - FT4 AEC - Absolute Eosinophil Count
                  </h2>
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
                        <h6>
                          Available in <span>Home & Lab</span>
                        </h6>
                      </div>
                    </div>
                    <div className="info-box">
                      <span className="info-icon">
                        <img src="/assets/images/calender.svg" alt="" />
                      </span>
                      <div className="info-text">
                        <h6>
                          Report <span>Same Day</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="price-section">
                    <div className="flex-wrap">
                      <div className="pr-sec">
                        <h3 className="price">₹450</h3>
                        <h6 className="old-price">₹899</h6>
                      </div>
                      <span className="discount">Save 10%</span>
                    </div>
                    <button className="cmn_btn">Add To Cart</button>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="pack-card cmn_margin">
                  <div className="image-section">
                    <div className="img">
                      <img src="/assets/images/pack-img.png" alt="" />
                      <div className="img-lbl">THYROID</div>
                    </div>
                    <div className="popular-badge">
                      <img src="/assets/images/fire.svg" alt="" />
                      <h6>Most Popular</h6>
                    </div>
                    <div className="icon">
                      <img src="/assets/images/joint.png" alt="" />
                    </div>
                  </div>
                  <h2 className="title">
                    Thyroid - FT4 AEC - Absolute Eosinophil Count
                  </h2>
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
                        <h6>
                          Available in <span>Home & Lab</span>
                        </h6>
                      </div>
                    </div>
                    <div className="info-box">
                      <span className="info-icon">
                        <img src="/assets/images/calender.svg" alt="" />
                      </span>
                      <div className="info-text">
                        <h6>
                          Report <span>Same Day</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="price-section">
                    <div className="flex-wrap">
                      <div className="pr-sec">
                        <h3 className="price">₹450</h3>
                        <h6 className="old-price">₹899</h6>
                      </div>
                      <span className="discount">Save 10%</span>
                    </div>
                    <button className="cmn_btn">Add To Cart</button>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="pack-card cmn_margin">
                  <div className="image-section">
                    <div className="img">
                      <img src="/assets/images/pack-img.png" alt="" />
                      <div className="img-lbl">THYROID</div>
                    </div>
                    <div className="popular-badge">
                      <img src="/assets/images/fire.svg" alt="" />
                      <h6>Most Popular</h6>
                    </div>
                    <div className="icon">
                      <img src="/assets/images/joint.png" alt="" />
                    </div>
                  </div>
                  <h2 className="title">
                    Thyroid - FT4 AEC - Absolute Eosinophil Count
                  </h2>
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
                        <h6>
                          Available in <span>Home & Lab</span>
                        </h6>
                      </div>
                    </div>
                    <div className="info-box">
                      <span className="info-icon">
                        <img src="/assets/images/calender.svg" alt="" />
                      </span>
                      <div className="info-text">
                        <h6>
                          Report <span>Same Day</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="price-section">
                    <div className="flex-wrap">
                      <div className="pr-sec">
                        <h3 className="price">₹450</h3>
                        <h6 className="old-price">₹899</h6>
                      </div>
                      <span className="discount">Save 10%</span>
                    </div>
                    <button className="cmn_btn">Add To Cart</button>
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
