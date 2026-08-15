import React from "react";

export default function BorderBeam({
    className = "",
    size = 200,
    duration = 15,
    borderWidth = 1.5,
    anchor = 90,
    colorFrom = "#EA580C",
    colorTo = "#0284C7",
    delay = 0,
}) {
    return (
        <div
            style={{
                "--size": size,
                "--duration": `${duration}s`,
                "--anchor": anchor,
                "--border-width": `${borderWidth}px`,
                "--color-from": colorFrom,
                "--color-to": colorTo,
                "--delay": `-${delay}s`,
            }}
            className={`magic-border-beam pointer-events-none ${className}`}
        />
    );
}
