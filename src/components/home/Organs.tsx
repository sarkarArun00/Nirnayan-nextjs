"use client";
import React, { useEffect, useState } from 'react';
import Slider from "react-slick"
import styles from './Organs.module.css';
import { getAllGroups } from "@/services/master.service";

interface OrganItem {
    id: string | number;
    image: string;
    title: string;
    description: string;
}

type GroupItem = {
  id: number;
  group_name: string;
  description: string;
  status: string;
  delete_status: string | null;
  icon: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};


function Organs() {

    const [getGroups, setGroups] = useState<GroupItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    const organConfig = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '60px',
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 640,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    const lifesConfig = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '25%',
    };

        useEffect(() => {
          const loadSpecialities = async () => {
            try {
              setLoading(true);
    
              const response = await getAllGroups();
    
              console.log("Speciality API Response:", response);
    
              if (response?.data && Array.isArray(response.data)) {
                setGroups(response.data);
              } else {
                setGroups([]);
              }
            } catch (error) {
              console.error("Speciality API Error:", error);
    
              setGroups([]);
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
        <div className={styles.explore_organ}>
          <div className="container">
            <div className="top-title">
              <div className="left-pnl">
                <h2>Explore by Body organs</h2>
                <p>
                  A comprehensive health screening designed to evaluate the
                  functioning of vital organs such as the heart, liver, kidneys,
                  lungs, and pancreas.
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
              <Slider {...organConfig} className="carousel is_slick_dot">
                {getGroups.map((organ) => (
                  <div key={organ.id}>
                    <div className={`cmn_margin ${styles.box}`}>
                      <img
                        src={getImageUrl(organ.image)}
                        alt={organ.group_name}
                      />

                      <div className={styles.text_block}>
                        <div className={styles.left}>
                          <h3>{organ.group_name}</h3>
                          <p>
                            {stripHtml(organ.description) ||
                              "Explore related organ tests and diagnostic services."}
                          </p>
                        </div>
                        <div className={styles.right}>
                          <button className={`arrow-btn ${styles.arrow_btn}`}>
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
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>

        <div className={styles.life_style}>
          <Slider {...lifesConfig} className="carousel is_slick_dot">
            <div className="item">
              <div className="cmn_margin">
                <img src="/assets/images/lifestyle1.png" alt="" />
              </div>
            </div>
            <div className="item">
              <div className="cmn_margin">
                <img src="/assets/images/lifestyle2.png" alt="" />
              </div>
            </div>
            <div className="item">
              <div className="cmn_margin">
                <img src="/assets/images/lifestyle3.png" alt="" />
              </div>
            </div>
          </Slider>
        </div>
      </>
    );
}

export default Organs