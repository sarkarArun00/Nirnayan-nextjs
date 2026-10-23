'use client';
import React, { useEffect, useState } from "react";
import styles from './Health.module.css';
import Slider from 'react-slick';
import { getAllSpeciality } from "@/services/master.service";

type SpecialityItem = {
  id: number;
  specialityname: string;
  description: string;
  status: string;
  delete_status: string | null;
  icon: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};


function Health() {
    const [specialities, setSpecialities] = useState<SpecialityItem[]>([]);
    const [loading, setLoading] = useState(true);

    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        focusOnSelect: true,
        centerPadding: '60px',
        variablewidth: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    useEffect(() => {
      const loadSpecialities = async () => {
        try {
          setLoading(true);

          const response = await getAllSpeciality();

          console.log("Speciality API Response:", response);

          if (response?.data && Array.isArray(response.data)) {
            setSpecialities(response.data);
          } else {
            setSpecialities([]);
          }
        } catch (error) {
          console.error("Speciality API Error:", error);

          setSpecialities([]);
        } finally {
          setLoading(false);
        }
      };

      void loadSpecialities();
    }, []);

    const getImageUrl = (path: string | null) => {
      if (!path) {
        return "/assets/images/health.jpg";
      }

      if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
      }

      const baseUrl = process.env.NEXT_PUBLIC_LIMS_API_BASE_URL || "";

      const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

      const cleanPath = path.startsWith("/") ? path : `/${path}`;

      return `${cleanBase}${cleanPath}`;
    };

    const stripHtml = (value: string) => {
      if (!value) {
        return "";
      }

      return value.replace(/<[^>]*>/g, "");
    };

    return (
      <>
        <div className="health_slider">
          <div className="container">
            <div className="top-title">
              <div className="left-pnl">
                <h2>Your Guide to Health & Medicine</h2>
                <p>
                  India’s fastest AI powered & temperature - controlled supply
                  chain to collect and test your blood in freshest state.
                </p>
              </div>
              <button className="expand-btn">
                <span className="icon">
                  <img src="/assets/images/exp-btn.svg" alt="" />
                </span>
                <span className="btn-text">View More</span>
              </button>
            </div>

            <div className="cmn-right-align">
              <Slider {...settings} className="is_slick_dot">
                {specialities.map((speciality) => (
                  <div key={speciality.id} className="item">
                    <div className={`cmn_margin ${styles.img_block}`}>
                      <img
                        src={getImageUrl(speciality.image || speciality.icon)}
                        alt={speciality.specialityname}
                      />

                      <div className={styles.text_block}>
                        <div className={styles.lt_block}>
                          <h3>{speciality.specialityname}</h3>

                          <p>
                            {stripHtml(speciality.description) ||
                              "Explore related health tests and diagnostic services."}
                          </p>
                        </div>

                        <button
                          type="button"
                          className={`arrow-btn ${styles.arrow_btn}`}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />

                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </>
    );
}

export default Health