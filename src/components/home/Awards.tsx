"use client";
import { useEffect, useRef, useState } from "react";
import styles from './Awards.module.css';
import Slider from 'react-slick';
import {
  getAllAwards,
  getAwardImageUrl,
  type AwardItem,
} from "@/services/master.service";




const text = "We provide comprehensive test lists like culture tests, routine tests, Gene sequencing analysis, TSH, Blood Sugar tests, and antibody tests with the shortest TAT for timely and better patient treatment";

function Awards() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    const [awards, setAwards] = useState<AwardItem[]>([]);
    const [loadingAwards, setLoadingAwards] = useState(true);
    const [awardsError, setAwardsError] = useState("");

    useEffect(() => {
      let cancelled = false;

      const loadAwards = async () => {
        try {
          setLoadingAwards(true);
          setAwardsError("");

          const response = await getAllAwards();

          if (cancelled) return;

          setAwards(
            response.data.filter(
              (award) => award.status === true && award.delete_status !== true,
            ),
          );
        } catch (error: unknown) {
          if (cancelled) return;

          setAwards([]);
          setAwardsError(
            error instanceof Error ? error.message : "Unable to load awards.",
          );
        } finally {
          if (!cancelled) {
            setLoadingAwards(false);
          }
        }
      };

      void loadAwards();

      return () => {
        cancelled = true;
      };
    }, []);

    const words = text.split(" ");

    const awardsConfig = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '26%',
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    centerPadding: "0",
                },
            },
        ]

    };

    return (
      <>
        <div className={`accolades ${styles.accolades}`}>
          <div className="container">
            <div className={styles.title}>
              <h2>Rewards & Recognition</h2>
              <p>
                Recognized for excellence in healthcare services and patient
                care. Honoured for maintaining high standards in quality,
                safety, and innovation.
              </p>
            </div>
            {loadingAwards ? (
              <p className="text-center py-4" role="status">
                Loading awards...
              </p>
            ) : awardsError ? (
              <p className="text-center text-danger py-4" role="alert">
                {awardsError}
              </p>
            ) : awards.length === 0 ? (
              <p className="text-center py-4">
                No awards available at the moment.
              </p>
            ) : (
              <Slider {...awardsConfig} className="carousel is_slick_dot">
                {awards.map((award) => (
                  <div className="item" key={award.id}>
                    <div className={`award_item ${styles.award_item}`}>
                      <div className={`img_block ${styles.img_block}`}>
                        <img
                          src={getAwardImageUrl(award.awardImage)}
                          alt={award.awardTitle}
                          loading="lazy"
                          onError={(event) => {
                            const image = event.currentTarget;
                            const fallback = "/assets/images/awards.png";

                            if (image.getAttribute("src") !== fallback) {
                              image.src = fallback;
                            }
                          }}
                        />
                      </div>

                      <div className={`text_block ${styles.text_block}`}>
                        <p>
                          <strong>{award.awardTitle}</strong>

                          {award.awardDesc && (
                            <>
                              <br />
                              {award.awardDesc}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>

        <section className={styles.help_box}>
          <div className="container">
            <div className={styles.help_inn}>
              <div className={styles.banner_wrap}>
                <div className={styles.text_block}>
                  <div className={styles.flex_block}>
                    <div className={styles.lt_side}>
                      <img src="/assets/images/wp.png" alt="" />
                    </div>
                    <div className={styles.rt_side}>
                      <h2>
                        We Are Here To Help, Say “<span>Hi</span>”
                      </h2>
                      <p>Start a WhatsApp Chat</p>
                    </div>
                  </div>
                  <button className="cmn_btn">Book Now</button>
                </div>
                <div className={styles.img_block}>
                  <img src="/assets/images/mobile-image.png" alt="" />
                </div>
              </div>
              <div className={styles.shape1}></div>
              <div className={styles.shape2}></div>
              <div className={styles.shape3}></div>
            </div>
          </div>
        </section>

        <div className={styles.path_lab}>
          <video width={640} height={360} autoPlay muted loop playsInline>
            <source src="/assets/images/dna.webm" type="video/webm" />
            <source src="/assets/images/dna.mp4" type="video/mp4" />
          </video>
          <div className="container">
            <div className="position-relative z-3">
              <div className="text-center">
                <h2>
                  Nirnayan is the best <br />
                  Pathology lab in <span>Kolkata</span>
                </h2>
                <section ref={sectionRef} className={styles.textSection}>
                  <div className={styles.text}>
                    {words.map((word, index) => {
                      const wordProgress = index / words.length;
                      const active = progress >= wordProgress;
                      return (
                        <span
                          key={index}
                          className={`${styles.word} ${
                            active ? styles.active : ""
                          }`}
                        >
                          {word}{" "}
                        </span>
                      );
                    })}
                  </div>
                </section>
                <a href="#" className="cmn_btn">
                  Know More
                </a>
              </div>
              <div className={styles.exp_block}>
                <div className="row">
                  <div className="col-xl-3 col-lg-6 col-sm-6 col-12">
                    <div className={styles.feature_card}>
                      <div className={styles.feature_icon}>
                        <img src="/assets/images/stethoscope.png" alt="" />
                      </div>
                      <div className={styles.feature_text}>
                        <h5>
                          Experienced Doctors <span>Pathologists</span>
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-6 col-sm-6 col-12">
                    <div className={styles.feature_card}>
                      <div className={styles.feature_icon}>
                        <img src="/assets/images/stethoscope1.png" alt="" />
                      </div>
                      <div className={styles.feature_text}>
                        <h5>
                          Fastest & Accurate <span>Report Delivery</span>
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6 col-sm-6 col-12">
                    <div className={styles.feature_card}>
                      <div className={styles.feature_icon}>
                        <img src="/assets/images/nabl.png" alt="" />
                      </div>
                      <div className={styles.feature_text}>
                        <h5>NABL- Accredited lab</h5>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-6 col-sm-6 col-12">
                    <div className={styles.feature_card}>
                      <div className={styles.feature_icon}>
                        <img src="/assets/images/shield.png" alt="" />
                      </div>
                      <div className={styles.feature_text}>
                        <h5>
                          8 Years of <span>Trusted Healthcare</span>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default Awards