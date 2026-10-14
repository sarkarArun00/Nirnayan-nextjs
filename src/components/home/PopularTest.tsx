"use client";

import React, { useEffect, useState } from "react";
import styles from "./PopularTest.module.css";
import Slider from "react-slick";


import {
  getOrganConditionsDepartment,
  getPopularPackagesPost,
} from "@/services/master.service";

interface Organ {
  name: string;
  icon: string;
}

interface PopularTestProps {
  section?: 1 | 2 | 3 | "all";
}

type FilterItem = {
  id: number;
  name: string;
  icon: string;
};

type PopularTestItem = {
  id: number;
  test_name: string;
  product_type: string;
  description: string;
  department_id: number;
  test_code: string;

  tat: {
    normalTat: {
      value: string;
      isHour: boolean;
    };
    urgentTat: {
      value: string;
      isHour: boolean;
    };
  };

  homeCollection: boolean;
  tempOrder: number;
  mrpAmount: string;
};

type FilterType = "mostpopular" | "organ" | "condition" | "department";

function PopularTest({ section = "all" }: PopularTestProps) {
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

  const [organs, setOrgans] = useState<FilterItem[]>([]);
  const [conditions, setConditions] = useState<FilterItem[]>([]);
  const [departments, setDepartments] = useState<FilterItem[]>([]);

  const [selectedOrgan, setSelectedOrgan] = useState<FilterItem | null>(null);

  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const [filterType, setFilterType] = useState<
    "mostpopular" | "organ" | "condition" | "department"
  >("mostpopular");

  const [testList, setTestList] = useState<PopularTestItem[]>([]);

  const [testLoading, setTestLoading] = useState(false);

  //organs array

  // Why Choose mobile Slider Start
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '30px',
  };

  const gridData = [
    {
      icon: '/assets/images/ch-icon.svg',
      chIcon: '/assets/images/ch-icon01.png',
      number: '5000+',
      label: 'Collection',
    },
    {
      icon: '/assets/images/ch-icon1.svg',
      chIcon: '/assets/images/ch-icon02.png',
      number: '100+',
      label: 'Doctors',
    },
    {
      icon: '/assets/images/ch-icon2.svg',
      chIcon: '/assets/images/ch-icon03.png',
      number: '400+',
      label: 'Logistic Strengths',
    },
    {
      icon: '/assets/images/ch-icon3.svg',
      chIcon: '/assets/images/ch-icon04.png',
      number: '4000+',
      label: 'Lab Tests & Packages',
    },
  ];
  // Why Choose mobile Slider End
  const showSection1 = section === "all" || section === 1;
  const showSection2 = section === "all" || section === 2;
  const showSection3 = section === "all" || section === 3;


  const selectOrgan = (item: FilterItem) => {
    setSelectedOrgan(item);

    console.log("Selected Item:", item);

    loadTests(filterType, item);
  };

  const getFilterItems = (): FilterItem[] => {
    switch (filterType) {
      case "organ":
        return organs;

      case "condition":
        return conditions;

      case "department":
        return departments;

      case "mostpopular":
        return [];

      default:
        return [];
    }
  };

  const filterItems = getFilterItems();

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as FilterType;

    setFilterType(value);

    let newList: FilterItem[] = [];

    if (value === "organ") {
      newList = organs;
    }

    if (value === "condition") {
      newList = conditions;
    }

    if (value === "department") {
      newList = departments;
    }

    // Most Popular
    if (value === "mostpopular") {
      setSelectedOrgan(null);

      loadTests("mostpopular");

      return;
    }

    // Automatically select first item
    if (newList.length > 0) {
      const firstItem = newList[0];

      setSelectedOrgan(firstItem);

      loadTests(value, firstItem);
    } else {
      setSelectedOrgan(null);
      setTestList([]);
    }
  };

  const loadTests = async (type: FilterType, item?: FilterItem) => {
    try {
      setTestLoading(true);

      const savedState = localStorage.getItem("nirnayan_selected_state");

      if (!savedState) {
        console.warn("State is not selected");
        setTestList([]);
        return;
      }

      const parsedState = JSON.parse(savedState);

      const stateId = Number(parsedState?.id);

      if (!stateId) {
        console.warn("State ID not found");
        setTestList([]);
        return;
      }

      // console.log("Selected State ID:", stateId);

      const payload: any = {
        group: [] as number[],
        speciality: [] as number[],
        department: [] as number[],

        state_id: stateId,

        product_type: "test",

        popular_investigations: type === "mostpopular",

        group_by: "",

        page: 1,
        limit: 10,
      };

      // Organ Wise
      if (type === "organ" && item) {
        payload.group = [item.id];
        payload.group_by = "organ";
      }

      // Condition Wise
      if (type === "condition" && item) {
        payload.speciality = [item.id];

        payload.group_by = "speciality";
      }

      // Department Wise
      if (type === "department" && item) {
        payload.department = [item.id];

        payload.group_by = "department";
      }

      // console.log("Test API Payload:", payload);

      const response = await getPopularPackagesPost(payload);

      // console.log("Test API Response:", response);

      if (response?.data && Array.isArray(response.data)) {
        setTestList(response.data);
      } else {
        setTestList([]);
      }
    } catch (error) {
      console.error("Popular Test API Error:", error);

      setTestList([]);
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    loadTests("mostpopular");
  }, []);

  useEffect(() => {
    const loadOrganConditionDepartment = async () => {
      try {
        setIsFilterLoading(true);

        const response = await getOrganConditionsDepartment();

        // console.log("Organ Condition Department Response:", response);

        if (response?.success && response?.status === 1 && response?.data) {
          const organList: FilterItem[] = response.data.organs.map((item) => {
            // console.log(
            //     "ORGAN IMAGE:",
            //     item.group_name,
            //     item.icon,
            //     getImageUrl(item.icon),
            // );

            return {
              id: item.id,
              name: item.group_name,
              icon: item.icon || "",
            };
          });

          const conditionList: FilterItem[] = response.data.conditions.map(
            (item) => ({
              id: item.id,
              name: item.specialityname,
              icon: item.icon || "",
            }),
          );

          const departmentList: FilterItem[] = response.data.departments.map(
            (item) => ({
              id: item.id,
              name: item.dept_name,

              // department API gives "image"
              // convert it to common "icon"
              icon: item.image || "",
            }),
          );

          setOrgans(organList);
          setConditions(conditionList);
          setDepartments(departmentList);

          // Default selected organ
          if (organList.length > 0) {
            setSelectedOrgan(organList[0]);
          }

          // console.log("Organs:", organList);

          // console.log("Conditions:", conditionList);

          // console.log("Departments:", departmentList);
        }
      } catch (error) {
        console.error("Organ Condition Department API Error:", error);
      } finally {
        setIsFilterLoading(false);
      }
    };

    void loadOrganConditionDepartment();
  }, []);

  const formatTat = (tat?: { value: string; isHour: boolean }) => {
    if (!tat?.value) {
      return "-";
    }

    return `${tat.value} ${tat.isHour ? "Hours" : "Days"}`;
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

    const finalUrl = `${cleanBase}${cleanPath}`;

    // console.log("IMAGE FINAL URL:", finalUrl);

    return finalUrl;
  };

  return (
    <>
      <div className={styles.pop_main}>
        {showSection1 && (
          <div className={styles.why_us}>
            <div className="container">
              <div className="row">
                <div className="col-xl-5 col-lg-12 col-md-12 col-sm-12">
                  <div className={styles.text_block}>
                    <h2>
                      Why Choose <span>Nirnayan</span>
                    </h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Cras dapibus ullamcorper mi, non vestibulum magna
                      dapibus vitae. Nulla id efficitur neque
                    </p>
                    <ul>
                      <li>
                        <a href="#" className="cmn_btn">
                          Explore Tests
                        </a>
                      </li>
                      <li>
                        <a href="#" className="sec_btn">
                          See More Packages
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-7 col-lg-12 col-md-12 col-sm-12">
                  <div className={`d-none d-md-grid ${styles.ch_grid}`}>
                    {gridData.map((item, index) => (
                      <div key={index} className={styles.box}>
                        <div className={styles.inn}>
                          <img
                            className={styles.icon}
                            src={item.icon}
                            alt=""
                          />
                          <img
                            className={styles.ch_icon}
                            src={item.chIcon}
                            alt=""
                          />
                          <h2>{item.number}</h2>
                          <p>{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Test and Group Start */}
        {showSection2 && (
          <div className="popular-wrap">
            <div className="container">
              <div className="top-title">
                <div className="left-pnl">
                  <h2>
                    Our popular <span className="gradient-text">tests</span>
                  </h2>
                  <p>
                    Contact us for routine tests to specialized blood tests
                    and make your tomorrow healthy
                  </p>
                </div>
                <button className="expand-btn">
                  <span className="icon">
                    <img src="/assets/images/exp-btn.svg" alt="" />
                  </span>
                  <span className="btn-text">View More</span>
                </button>
              </div>
              {section !== 2 && (
                <div className="organ-tabs-wrapper">
                  <div className="org-left">
                    <div className="organ-tabs">
                      {filterType !== "mostpopular" &&
                        filterItems.map((item) => (
                          <button
                            key={`${filterType}-${item.id}`}
                            type="button"
                            className={`organ-tab ${selectedOrgan?.id === item.id ? "active" : ""
                              }`}
                            onClick={() => selectOrgan(item)}
                          >
                            <span className="icon">
                              <img
                                src={
                                  item.icon
                                    ? getImageUrl(item.icon)
                                    : "/assets/images/report.svg"
                                }
                                alt={item.name}
                                onError={(e) => {
                                  console.log(
                                    "FAILED IMAGE URL:",
                                    e.currentTarget.src,
                                  );

                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src =
                                    "/assets/images/report.svg";
                                }}
                              />
                            </span>

                            <span className="text">{item.name}</span>
                          </button>
                        ))}
                    </div>
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
                    </select>
                  </div>
                </div>
              )}

              {/* Test List Start */}
              <div className="cmn-right-align">
                {testLoading ? (
                  <div className="text-center py-5">
                    <p>Loading tests...</p>
                  </div>
                ) : testList.length > 0 ? (
                  <Slider {...popular_slider} className="is_slick_dot">
                    {testList.map((test) => (
                      <div className="item" key={test.id}>
                        <div className="test-box is-popular">
                          <div className="top-pnl">
                            <img src="/assets/images/fire.svg" alt="" />

                            <h6>
                              {filterType === "mostpopular"
                                ? "Most Popular"
                                : selectedOrgan?.name || "Test"}
                            </h6>
                          </div>

                          <div className="wh-block">
                            <div className="inn-pnl">
                              <h2>{test.test_name}</h2>

                              <p>
                                {test.description ||
                                  "No description available"}
                              </p>

                              {/* Report TAT */}
                              <div className="info">
                                <div className="left">
                                  <img
                                    src="/assets/images/report.svg"
                                    alt=""
                                  />

                                  <h6>Reports in</h6>
                                </div>

                                <div className="right">
                                  <span className="days">
                                    {formatTat(test.tat?.normalTat)}
                                  </span>
                                </div>
                              </div>

                              {/* Availability */}
                              <div className="info">
                                <div className="left">
                                  <img
                                    src="/assets/images/ava.svg"
                                    alt=""
                                  />

                                  <h6>Available in</h6>
                                </div>

                                <div className="right">
                                  {test.homeCollection && (
                                    <span className="lab">
                                      <img
                                        src="/assets/images/home.svg"
                                        alt=""
                                      />
                                      Home
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="btm-pnl">
                              <div className="d-flex align-items-center gap-2">
                                <span className="price">
                                  ₹{Number(test.mrpAmount || 0).toFixed(2)}
                                </span>
                              </div>

                              <button type="button" className="cmn_btn">
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="text-center py-5">
                    <p>No tests available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Test and Group End */}
      </div>
      {showSection3 && (
        <div className={styles.offer_banner}>
          <div className="container">
            <img src="/assets/images/offer-banner.png" alt="" />
          </div>
        </div>
      )}
    </>
  );
}

export default PopularTest