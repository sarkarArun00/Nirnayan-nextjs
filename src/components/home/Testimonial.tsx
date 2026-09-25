"use client";

import React, { useState } from 'react';
import Slider from 'react-slick';
import styles from './Testimonial.module.css';

interface Testimonial {
    id: string;
    type: 'text' | 'video';
    text?: string;
    user: string;
    date: string;
    ratingImg: string;
    userImg: string;
    hasVideo?: boolean;
    videoImg?: string;
    videoUrl?: string;
}

function Testimonial() {
    const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
    const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
    const [selectedReview, setSelectedReview] = useState<{
        text: string;
        user: string;
        date: string;
        rating: string;
    }>({
        text: 'Easy, hassle free and technology friendly with quick report delivered . Highly recommend this with their app that keeps all your reports .',
        user: 'Ambar Ghosh',
        date: '7 Dec 2023',
        rating: '5.0',
    });

    const testimonials: Testimonial[] = [
        {
            id: '1',
            type: 'text',
            text: 'The service was smooth and the staff were very supportive throughout. I am satisfied with the care, attention, and overall experience provided.',
            user: 'Krish Sana',
            date: '20th June, 2026',
            ratingImg: '/assets/images/rating.svg',
            userImg: '/assets/images/user-v2.png',
            hasVideo: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
        {
            id: '2',
            type: 'video',
            user: 'Krish Sana',
            date: '20th June, 2026',
            ratingImg: '/assets/images/rating.svg',
            userImg: '/assets/images/user-v2.png',
            videoImg: '/assets/images/feed-img.jpg',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
        {
            id: '3',
            type: 'text',
            text: 'The service was smooth and the staff were very supportive throughout. I am satisfied with the care, attention, and overall experience provided.',
            user: 'Krish Sana',
            date: '20th June, 2026',
            ratingImg: '/assets/images/rating.svg',
            userImg: '/assets/images/user-v2.png',
            hasVideo: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
        {
            id: '4',
            type: 'text',
            text: 'The service was smooth and the staff were very supportive throughout. I am satisfied with the care, attention, and overall experience provided.',
            user: 'Krish Sana',
            date: '20th June, 2026',
            ratingImg: '/assets/images/rating.svg',
            userImg: '/assets/images/user-v2.png',
            hasVideo: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
        {
            id: '5',
            type: 'text',
            text: 'The service was smooth and the staff were very supportive throughout. I am satisfied with the care, attention, and overall experience provided.',
            user: 'Krish Sana',
            date: '20th June, 2026',
            ratingImg: '/assets/images/rating.svg',
            userImg: '/assets/images/user-v2.png',
            hasVideo: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
    ];

    const slideConfig = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
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

    const handleOpenReview = (item: Testimonial) => {
        if (item.type === 'text') {
            setSelectedReview({
                text: item.text || '',
                user: item.user,
                date: item.date,
                rating: '5.0',
            });
            setIsReviewOpen(true);
        }
    };

    const handleCloseReview = () => {
        setIsReviewOpen(false);
    };

    const handleOpenVideo = (url?: string) => {
        if (url) {
            setSelectedVideoUrl(url);
            setIsVideoOpen(true);
        }
    };

    const handleCloseVideo = () => {
        setIsVideoOpen(false);
        setSelectedVideoUrl('');
    };

    return (
        <>
            <div className={styles.testimonial}>
                <div className="container">
                    <div className={`top-title ${styles.top_title}`}>
                        <div className="left-pnl">
                            <h2>Patient’s Feedback</h2>
                            <p>Read genuine testimonials from patients who have trusted us with their healthcare journey.</p>
                        </div>
                        <button className="expand-btn">
                            <span className="icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2">
                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                    <polyline points="7 7 17 7 17 17"></polyline>
                                </svg>
                            </span>
                            <span className="btn-text">View More</span>
                        </button>
                    </div>

                    <div className="cmn-right-align">
                        <Slider
                            {...slideConfig}
                            className={`carousel is_slick_dot is_white is_right_space ${styles.carousel}`}>
                            {testimonials.map((item) => (
                                <div key={item.id} className="slide">
                                    <div className="cmn_margin">
                                        {item.type === 'video' ? (
                                            <div className={`${styles.feed_box} ${styles.isVideo}`}>
                                                <div className={styles.top_block}></div>
                                                <div className={styles.is_img}>
                                                    <img src={item.videoImg} alt="Video testimonial preview" />
                                                    <div
                                                        className={styles.play_btn}
                                                        onClick={() => handleOpenVideo(item.videoUrl)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <img src="/assets/images/play-icon.svg" alt="Play video" />
                                                    </div>
                                                </div>
                                                <div className={styles.btm_block}>
                                                    <div className={styles.rating}>
                                                        <img src={item.ratingImg} alt="Rating" />
                                                    </div>
                                                    <div className={styles.user_block}>
                                                        <div className={styles.left_block}>
                                                            <div className={styles.img}>
                                                                <img src={item.userImg} alt={item.user} />
                                                            </div>
                                                            <div className={styles.text}>
                                                                <h6>{item.user}</h6>
                                                                <span>{item.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={styles.feed_box}>
                                                <div className={styles.top_block}>
                                                    <p>{item.text}</p>
                                                    <span
                                                        className={styles.see_btn}
                                                        onClick={() => handleOpenReview(item)}
                                                    >
                                                        See More
                                                    </span>
                                                </div>
                                                <div className={styles.btm_block}>
                                                    <div className={styles.rating}>
                                                        <img src={item.ratingImg} alt="Rating" />
                                                    </div>
                                                    <div className={styles.user_block}>
                                                        <div className={styles.left_block}>
                                                            <div className={styles.img}>
                                                                <img src={item.userImg} alt={item.user} />
                                                            </div>
                                                            <div className={styles.text}>
                                                                <h6>{item.user}</h6>
                                                                <span>{item.date}</span>
                                                            </div>
                                                        </div>
                                                        {item.hasVideo && (
                                                            <div
                                                                className={styles.vid_block}
                                                                onClick={() => handleOpenVideo(item.videoUrl)}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <img src="/assets/images/video-icon.svg" alt="Watch video" />
                                                                <h6>Watch Video</h6>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            <div className={`cmn-backdrop ${isReviewOpen ? 'active' : ''}`} onClick={handleCloseReview}>
                <div className="inn" onClick={(e) => e.stopPropagation()}>
                    <p>{selectedReview.text}</p>
                    <div className={styles.review_bottom}>
                        <div className={styles.review_user}>
                            <h6>{selectedReview.user}</h6>
                            <span>{selectedReview.date}</span>
                        </div>
                        <div className={styles.rating}>
                            <i className="fa-solid fa-star"></i>
                            <span>{selectedReview.rating}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            <div className={`cmn-backdrop video-backdrop ${isVideoOpen ? 'active' : ''}`} onClick={handleCloseVideo}>
                <div className="inn video-inn" onClick={(e) => e.stopPropagation()}>
                    <div className="video-container">
                        {isVideoOpen && (
                            <iframe
                                className="w-100 rounded-3"
                                style={{ height: '300px' }}
                                src={selectedVideoUrl}
                                title="Video Testimonial"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Testimonial;