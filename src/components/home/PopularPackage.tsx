"use client";

import React, { use, useState, useEffect } from "react";
import styles from "./PopularPackage.module.css";
import Slider from "react-slick";
import {
  getOrganConditionsDepartment,
  getPopularPackagesPost,
} from "@/services/master.service";

type FilterItem = {
  id: number;
  name: string;
  icon: string;
};

type PackageFilterType = "mostpopular" | "organ" | "condition" | "department";

interface Organ {
  name: string;
  icon: string;
}

function PopularPackage() {
  var popular_slider = {
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

  type PackageItem = {
    id: number;
    test_name: string;
    product_type: string;
    description: string;
    department_id: number | null;
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
    offerAmount: string | null;
    finalAmount: string;
  };

  const [packageList, setPackageList] = useState<any[]>([]);

  const [packageLoading, setPackageLoading] = useState(false);

  const [organs, setOrgans] = useState<FilterItem[]>([]);
  const [conditions, setConditions] = useState<FilterItem[]>([]);
  const [departments, setDepartments] = useState<FilterItem[]>([]);

  const [selectedOrgan, setSelectedOrgan] = useState<FilterItem | null>(null);

  const [filterType, setFilterType] =
    useState<PackageFilterType>("mostpopular");

  const selectOrgan = (item: FilterItem) => {
    setSelectedOrgan(item);

    loadPackages(filterType, item);
  };
  //organs array

  const loadPackages = async (type: PackageFilterType, item?: FilterItem) => {
    try {
      setPackageLoading(true);

      const savedState = localStorage.getItem("nirnayan_selected_state");

      if (!savedState) {
        console.warn("State is not selected");
        setPackageList([]);
        return;
      }

      const parsedState = JSON.parse(savedState);

      const stateId = Number(parsedState?.id);

      if (!stateId) {
        console.warn("State ID not found");
        setPackageList([]);
        return;
      }

      const payload: any = {
        group: [],
        speciality: [],
        department: [],

        state_id: stateId,

        product_type: "package",

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

      console.log("PACKAGE PAYLOAD:", payload);

      const response = await getPopularPackagesPost(payload);

      console.log("PACKAGE RESPONSE:", response);

      if (response?.data && Array.isArray(response.data)) {
        setPackageList(response.data);
      } else {
        setPackageList([]);
      }
    } catch (error) {
      console.error("Package API Error:", error);

      setPackageList([]);
    } finally {
      setPackageLoading(false);
    }
  };

  const handlePackageFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value as PackageFilterType;

    console.log("Selected Package Filter:", value);

    setFilterType(value);

    if (value === "mostpopular") {
      setSelectedOrgan(null);

      loadPackages("mostpopular");

      return;
    }

    let newList: FilterItem[] = [];

    if (value === "organ") {
      newList = organs;
    } else if (value === "condition") {
      newList = conditions;
    } else if (value === "department") {
      newList = departments;
    }

    console.log("Selected Filter List:", newList);

    if (newList.length > 0) {
      const firstItem = newList[0];

      setSelectedOrgan(firstItem);

      loadPackages(value, firstItem);
    } else {
      console.warn(`No data found for ${value}`);

      setSelectedOrgan(null);
      setPackageList([]);
    }
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

  useEffect(() => {
    loadPackages("mostpopular");
  }, []);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const response = await getOrganConditionsDepartment();

        if (response?.success && response?.status === 1 && response?.data) {
          const organList: FilterItem[] = response.data.organs.map((item) => ({
            id: item.id,
            name: item.group_name,
            icon: item.icon || "",
          }));

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
              icon: item.image || "",
            }),
          );

          setOrgans(organList);
          setConditions(conditionList);
          setDepartments(departmentList);

          console.log("Package Organs:", organList);
          console.log("Package Conditions:", conditionList);
          console.log("Package Departments:", departmentList);
        }
      } catch (error) {
        console.error("Package Filter API Error:", error);
      }
    };

    void loadFilters();
  }, []);

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

  const formatPackageTat = (tat?: { value: string; isHour: boolean }) => {
    if (!tat?.value) {
      return "-";
    }

    return `${tat.value} ${tat.isHour ? "Hours" : "Days"}`;
  };

  return (
    <>
      <div className={`popular-wrap ${styles.popular_wrap}`}>
        <div className="container">
          <div className={`top-title ${styles.top_title}`}>
            <div className="left-pnl">
              <h2>Our popular packages</h2>
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

          <div className="organ-tabs-wrapper">
            <div className="org-left">
              <div className="organ-tabs">
                {filterType !== "mostpopular" &&
                  filterItems.map((item) => (
                    <button
                      key={`${filterType}-${item.id}`}
                      type="button"
                      className={`organ-tab ${
                        selectedOrgan?.id === item.id ? "active" : ""
                      }`}
                      onClick={() => selectOrgan(item)}
                    >
                      <span className="icon">
                        {item.icon && (
                          <img src={getImageUrl(item.icon)} alt={item.name} />
                        )}
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
                onChange={handlePackageFilterChange}
              >
                <option value="mostpopular">Most Popular</option>

                <option value="organ">Organ Wise</option>

                <option value="condition">Condition Wise</option>

                <option value="department">Department Wise</option>
              </select>
            </div>
          </div>

          <div className="cmn-right-align">
            {packageLoading ? (
              <div className="text-center py-5">
                <p>Loading packages...</p>
              </div>
            ) : packageList.length > 0 ? (
              <Slider {...popular_slider} className="is_slick_dot">
                {packageList.map((item) => (
                  <div className="item" key={item.id}>
                    <div className="pack-card cmn_margin">
                      {/* Image */}
                      <div className="image-section">
                        <div className="img">
                          <img
                            src="/assets/images/pack-img.png"
                            alt={item.test_name}
                          />

                          <div className="img-lbl">{item.test_code}</div>
                        </div>

                        {/* Popular badge */}
                        {filterType === "mostpopular" && (
                          <div className="popular-badge">
                            <img src="/assets/images/fire.svg" alt="" />

                            <h6>Most Popular</h6>
                          </div>
                        )}

                        {/* Selected organ icon */}
                        {filterType === "organ" && selectedOrgan?.icon && (
                          <div className="icon">
                            <img
                              src={getImageUrl(selectedOrgan.icon)}
                              alt={selectedOrgan.name}
                            />
                          </div>
                        )}
                      </div>

                      {/* Package name */}
                      <h2 className="title">{item.test_name}</h2>

                      {/* Description */}
                      {item.description && (
                        <p className="package-description">
                          {item.description}
                        </p>
                      )}

                      {/* Information */}
                      <div className="info-section">
                        {/* Home Collection */}
                        <div className="info-box">
                          <span className="info-icon">
                            <img src="/assets/images/microscope.svg" alt="" />
                          </span>

                          <div className="info-text">
                            <h6>
                              Home Collection{" "}
                              <span>
                                {item.homeCollection
                                  ? "Available"
                                  : "Not Available"}
                              </span>
                            </h6>
                          </div>
                        </div>

                        {/* Report TAT */}
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

                      {/* Price */}
                      <div className="price-section">
                        <div className="flex-wrap">
                          <div className="pr-sec">
                            <h3 className="price">
                              ₹
                              {Number(
                                item.finalAmount || item.mrpAmount || 0,
                              ).toFixed(2)}
                            </h3>

                            {item.offerAmount &&
                              Number(item.finalAmount) <
                                Number(item.mrpAmount) && (
                                <h6 className="old-price">
                                  ₹{Number(item.mrpAmount).toFixed(2)}
                                </h6>
                              )}
                          </div>
                        </div>

                        <button type="button" className="cmn_btn">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center py-5">
                <p>No packages available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PopularPackage;
