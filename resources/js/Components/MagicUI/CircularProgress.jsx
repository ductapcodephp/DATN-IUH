import React from "react";

export default function CircularProgress({
    value = 0,
    size = 54,
    strokeWidth = 5,
    className = "",
    color = "#EA580C",
    trackColor = "#E5E7EB",
    showValue = true,
    fontSize = "11px",
}) {
    const clampedValue = Math.min(Math.max(value, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

    return (
        <div
            className={`magic-circular-progress-wrap position-relative d-inline-flex align-items-center justify-content-center ${className}`}
            style={{ width: size, height: size }}
        >
            <svg width={size} height={size} className="magic-circular-progress-svg">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="magic-circular-progress-bar"
                    style={{
                        transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                />
            </svg>
            {showValue && (
                <span
                    className="magic-circular-progress-text position-absolute fw-bold"
                    style={{ fontSize, color: "var(--text-main, #1F2937)" }}
                >
                    {Math.round(clampedValue)}%
                </span>
            )}
        </div>
    );
}
