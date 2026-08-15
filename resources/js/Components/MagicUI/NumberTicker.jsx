import React, { useEffect, useRef, useState } from "react";

export default function NumberTicker({
    value = 0,
    direction = "up",
    delay = 0,
    duration = 2000,
    className = "",
    decimalPlaces = 0,
    prefix = "",
    suffix = "",
}) {
    const [displayValue, setDisplayValue] = useState(direction === "down" ? value : 0);
    const elementRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const targetNumber = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
        if (isNaN(targetNumber)) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    setTimeout(() => {
                        let startTime = null;
                        const startVal = direction === "down" ? targetNumber : 0;
                        const endVal = direction === "down" ? 0 : targetNumber;

                        const step = (timestamp) => {
                            if (!startTime) startTime = timestamp;
                            const progress = Math.min((timestamp - startTime) / duration, 1);
                            
                            // Easing function (easeOutExpo)
                            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                            const current = startVal + (endVal - startVal) * easeProgress;

                            setDisplayValue(current);

                            if (progress < 1) {
                                window.requestAnimationFrame(step);
                            } else {
                                setDisplayValue(endVal);
                            }
                        };

                        window.requestAnimationFrame(step);
                    }, delay * 1000);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [value, direction, delay, duration]);

    const formattedNumber = new Intl.NumberFormat("vi-VN", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    }).format(displayValue);

    return (
        <span ref={elementRef} className={`magic-number-ticker ${className}`}>
            {prefix}{formattedNumber}{suffix}
        </span>
    );
}
