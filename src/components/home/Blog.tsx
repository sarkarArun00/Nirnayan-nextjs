"use client";

import React, { useEffect, useState } from "react";

import styles from "./Blog.module.css";
import Slider from "react-slick";

import { getAllWordPressBlogs, WordPressBlog } from "@/services/master.service";

function Blog() {
  const [blogs, setBlogs] = useState<WordPressBlog[]>([]);

  const [loading, setLoading] = useState(true);

  const slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    centerMode: true,
    centerPadding: "60px",

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);

        const response = await getAllWordPressBlogs(5);

        setBlogs(response);
      } catch (error) {
        console.error("WordPress Blog Error:", error);

        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    void loadBlogs();
  }, []);

  const decodeHtml = (value: string) => {
    if (!value) {
      return "";
    }

    if (typeof document === "undefined") {
      return value;
    }

    const textarea = document.createElement("textarea");

    textarea.innerHTML = value;

    return textarea.value;
  };

  const stripHtml = (value: string) => {
    if (!value) {
      return "";
    }

    const text = value.replace(/<[^>]*>/g, " ");

    return decodeHtml(text).replace(/\s+/g, " ").trim();
  };

  const truncateText = (value: string, maxLength = 120) => {
    if (value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, maxLength)}...`;
  };

  const openBlog = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`check_ups ${styles.checkup}`}>
      <div className="container">
        <div className="top-title">
          <div className="left-pnl">
            <h2 className="m-0">Nirnayan Health Blogs</h2>
          </div>

          <button
            type="button"
            className="expand-btn"
            onClick={() =>
              window.open(
                "https://blog.nirnayanhealthcare.com/",
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <span className="icon">
              <img src="/assets/images/exp-btn.svg" alt="" />
            </span>

            <span className="btn-text">View More</span>
          </button>
        </div>

        <div className="cmn-right-align">
          {loading ? (
            <div>Loading blogs...</div>
          ) : blogs.length > 0 ? (
            <Slider {...slideConfig} className="is_slick_dot">
              {blogs.map((blog) => (
                <div key={blog.id} className="item">
                  <div className={`cmn_margin ${styles.img_block}`}>
                    <img
                      src={blog.featuredImage || "/assets/images/blog1.png"}
                      alt={decodeHtml(blog.title.rendered)}
                    />

                    <div className={styles.text_block}>
                      <div className={styles.lt_block}>
                        <h3>{decodeHtml(blog.title.rendered)}</h3>

                        <p>{truncateText(stripHtml(blog.excerpt.rendered))}</p>
                      </div>

                      <button
                        type="button"
                        className={`arrow-btn ${styles.arrow_btn}`}
                        onClick={() => openBlog(blog.link)}
                        aria-label={`Read ${decodeHtml(blog.title.rendered)}`}
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
          ) : (
            <div>No blogs available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blog;
