"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";

import { getBannerContent } from "@/services/auth.service";

import styles from "./HeroSection.module.css";

interface BannerItem {
  id: number;
  advertisementTitle: string;
  pageLink: string;

  attachment: {
    mobile: string;
    website: string;
  };

  visible: number;
  status: number;
  delete_status: number | null;
  is_banner: boolean;
}

export default function HeroSection() {
  const [bannerData, setBannerData] = useState<BannerItem[]>([]);

  const [bannerLoading, setBannerLoading] = useState(true);

  /* ================================
     IMAGE BASE URL
  ================================= */

  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_LIMS_API_BASE_URL || "";

  const getImageUrl = (path: string) => {
    if (!path) return "";

    // Already complete URL
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    const baseUrl = IMAGE_BASE_URL.endsWith("/")
      ? IMAGE_BASE_URL
      : `${IMAGE_BASE_URL}/`;

    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    return `${baseUrl}${cleanPath}`;
  };

  /* ================================
     SLIDER SETTINGS
  ================================= */

  const settings = {
    dots: false,
    arrows: false,

    infinite: bannerData.length > 1,

    autoplay: bannerData.length > 1,

    autoplaySpeed: 4000,

    speed: 500,

    slidesToShow: 1,
    slidesToScroll: 1,

    pauseOnHover: true,
  };

  /* ================================
     GET BANNERS
  ================================= */

  useEffect(() => {
    const loadBanner = async () => {
      try {
        setBannerLoading(true);

        const response = await getBannerContent("website");

        console.log("Banner API Response:", response);

        let banners: BannerItem[] = [];

        if (Array.isArray(response)) {
          banners = response as BannerItem[];
        } else if (
          typeof response === "object" &&
          response !== null &&
          "data" in response &&
          Array.isArray(
            (
              response as {
                data?: unknown;
              }
            ).data,
          )
        ) {
          banners = (
            response as {
              data: BannerItem[];
            }
          ).data;
        }

        /*
         * Hero banner only
         */

        const visibleBanners = banners.filter(
          (banner) =>
            banner.status == 1 &&
            banner.is_banner == true &&
            banner.attachment?.website,
        );

        setBannerData(visibleBanners);

        console.log('ressss', bannerData)
      } catch (error) {
        console.error("Banner API Error:", error);

        setBannerData([]);
      } finally {
        setBannerLoading(false);
      }
    };

    void loadBanner();
  }, []);

  return (
    <>
      <div className={`banner_wrap ${styles.banner}`}>
        {/* ===========================
            BANNER SLIDER
        ============================ */}

        <div className={styles.bann_slide}>
          {bannerLoading ? (
            /* LOADING FALLBACK */

            <div className={styles.item}>
              <img src="/assets/images/banner1.jpg" alt="Nirnayan Healthcare" />
            </div>
          ) : bannerData.length > 0 ? (
            /* API BANNERS */

            <Slider {...settings}>
              {bannerData.map((banner) => (
                <div key={banner.id} className={styles.item}>
                  <a
                    href={banner.pageLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <picture>
                      {/* MOBILE BANNER */}

                      {banner.attachment.mobile && (
                        <source
                          media="(max-width: 767px)"
                          srcSet={getImageUrl(banner.attachment.mobile)}
                        />
                      )}

                      {/* DESKTOP BANNER */}

                      <img
                        src={getImageUrl(banner.attachment.website)}
                        alt={banner.advertisementTitle || "Nirnayan Healthcare"}
                      />
                    </picture>
                  </a>
                </div>
              ))}
            </Slider>
          ) : (
            /* API EMPTY FALLBACK */

            <div className={styles.item}>
              <img src="/assets/images/banner1.jpg" alt="Nirnayan Healthcare" />
            </div>
          )}
        </div>

        {/* ===========================
            BANNER ACTION
        ============================ */}

        <div className={styles.banner_action}>
          <div className={styles.test_search}>
            <div className="d-flex align-items-center flex-grow-1">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>

              <span className={styles.search_text}>Search for</span>
            </div>

            <div className={styles.shortcut}>Ctrl+K</div>

            <div className={styles.divider}></div>

            <i
              className={`fa-solid fa-microphone mic-icon ${styles["mk-icon"]}`}
            ></i>
          </div>

          <div className={styles.rt_side}>
            <button type="button" className={styles.upload_btn}>
              Upload Prescription
              <img src="/assets/images/uppres.svg" alt="" />
            </button>

            <button type="button" className={styles.report_btn}>
              Download Report
              <img src="/assets/images/download.svg" alt="" />
            </button>

            <a href="#" className={styles.wp_btn}>
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
