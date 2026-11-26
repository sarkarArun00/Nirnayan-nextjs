"use client";

import { useEffect, useState } from "react";

type ResponsiveSliderOptions = {
    desktop?: number;
    mediumLaptop?: number;
    smallLaptop?: number;
    tablet?: number;
    smallTablet?: number;
    mobile?: number;
    padding?: {
        desktop?: string;
        mediumLaptop?: string;
        smallLaptop?: string;
        tablet?: string;
        smallTablet?: string;
        mobile?: string;
    };
};

const RESPONSIVE_PADDING = {
    desktop: "60px",
    mediumLaptop: "40px",
    smallLaptop: "30px",
    tablet: "25px",
    smallTablet: "20px",
    mobile: "20px",
};

export default function useResponsiveSlider({
    desktop = 4,
    mediumLaptop = 3,
    smallLaptop = 2,
    tablet = 2,
    smallTablet = 1,
    mobile = 1,
    padding,
}: ResponsiveSliderOptions = {}) {
    const [settings, setSettings] = useState({
        slidesToShow: desktop,
        centerPadding: padding?.desktop ?? RESPONSIVE_PADDING.desktop,
    });

    useEffect(() => {
        const updateSlider = () => {
            const width = window.innerWidth;

            if (width <= 575) {
                setSettings({
                    slidesToShow: mobile,
                    centerPadding: padding?.mobile ?? RESPONSIVE_PADDING.mobile,
                });
            } else if (width <= 767) {
                setSettings({
                    slidesToShow: smallTablet,
                    centerPadding: padding?.smallTablet ?? RESPONSIVE_PADDING.smallTablet,
                });
            } else if (width <= 991) {
                setSettings({
                    slidesToShow: tablet,
                    centerPadding: padding?.tablet ?? RESPONSIVE_PADDING.tablet,
                });
            } else if (width <= 1199) {
                setSettings({
                    slidesToShow: smallLaptop,
                    centerPadding: padding?.smallLaptop ?? RESPONSIVE_PADDING.smallLaptop,
                });
            } else if (width <= 1600) {
                setSettings({
                    slidesToShow: mediumLaptop,
                    centerPadding: padding?.mediumLaptop ?? RESPONSIVE_PADDING.mediumLaptop,
                });
            } else {
                setSettings({
                    slidesToShow: desktop,
                    centerPadding: padding?.desktop ?? RESPONSIVE_PADDING.desktop,
                });
            }
        };

        updateSlider();

        window.addEventListener("resize", updateSlider);
        window.addEventListener("orientationchange", updateSlider);

        return () => {
            window.removeEventListener("resize", updateSlider);
            window.removeEventListener("orientationchange", updateSlider);
        };
    }, [
        desktop,
        mediumLaptop,
        smallLaptop,
        tablet,
        smallTablet,
        mobile,
        padding?.desktop,
        padding?.mediumLaptop,
        padding?.smallLaptop,
        padding?.tablet,
        padding?.smallTablet,
        padding?.mobile,
    ]);

    return settings;
}