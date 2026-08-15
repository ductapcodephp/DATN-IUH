import React from "react";

export default function Marquee({
    className = "",
    reverse = false,
    pauseOnHover = true,
    children,
    vertical = false,
    repeat = 4,
    speed = 40,
    ...props
}) {
    return (
        <div
            {...props}
            className={`magic-marquee-container ${vertical ? "magic-marquee-vertical" : "magic-marquee-horizontal"} ${
                pauseOnHover ? "pause-on-hover" : ""
            } ${className}`}
            style={{ "--duration": `${speed}s` }}
        >
            {Array.from({ length: repeat }).map((_, i) => (
                <div
                    key={i}
                    className={`magic-marquee-content ${
                        reverse ? "magic-marquee-reverse" : ""
                    } ${vertical ? "magic-marquee-vertical-content" : ""}`}
                >
                    {children}
                </div>
            ))}
        </div>
    );
}
