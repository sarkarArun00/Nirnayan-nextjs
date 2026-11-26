
"use client";

import { useEffect, useState } from "react";

type ResponsiveSliderOptions = {
    desktop?: number;
    laptop?: number;
    tablet?: number;
    mobile?: number;
};

const RESPONSIVE_PADDING = {
    desktop: "60px",
    laptop: "40px",
    tablet: "30px",
    mobile: "15px",
};

export default function useResponsiveSlider({
    desktop = 4,
    laptop = 3,
    tablet = 2,
    mobile = 1,
}: ResponsiveSliderOptions = {}) {
    const [settings, setSettings] = useState({
        slidesToShow: desktop,
        centerPadding: RESPONSIVE_PADDING.desktop,
    });

    useEffect(() => {
        const updateSlider = () => {
            const width = window.innerWidth;

            if (width <= 575) {
                setSettings({
                    slidesToShow: mobile,
                    centerPadding: RESPONSIVE_PADDING.mobile,
                });
            } else if (width <= 992) {
                setSettings({
                    slidesToShow: tablet,
                    centerPadding: RESPONSIVE_PADDING.tablet,
                });
            } else if (width <= 1199) {
                setSettings({
                    slidesToShow: laptop,
                    centerPadding: RESPONSIVE_PADDING.laptop,
                });
            } else {
                setSettings({
                    slidesToShow: desktop,
                    centerPadding: RESPONSIVE_PADDING.desktop,
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
    }, [desktop, laptop, tablet, mobile]);

    return settings;
}
