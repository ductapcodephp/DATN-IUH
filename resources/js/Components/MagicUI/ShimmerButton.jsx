import React from "react";
import { Link } from "@inertiajs/react";

export default function ShimmerButton({
    children,
    className = "",
    shimmerColor = "#ffffff",
    shimmerSize = "0.1em",
    borderRadius = "8px",
    shimmerDuration = "2.5s",
    background,
    href,
    asLink = false,
    onClick,
    type = "button",
    disabled = false,
    ...props
}) {
    const isLink = Boolean(href) || asLink;
    const Component = isLink ? (href?.startsWith("http") || href?.startsWith("#") ? "a" : Link) : "button";

    const commonProps = {
        ...props,
        onClick,
        className: `magic-shimmer-button ${className} ${disabled ? "disabled" : ""}`,
        style: {
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            ...(background ? { "--bg": background } : {}),
            ...props.style,
        },
    };


    if (asLink) {
        return (
            <Component href={href} {...commonProps}>
                <div className="magic-shimmer-sparkle"></div>
                <div className="magic-shimmer-content">{children}</div>
            </Component>
        );
    }

    return (
        <button type={type} disabled={disabled} {...commonProps}>
            <div className="magic-shimmer-sparkle"></div>
            <div className="magic-shimmer-content">{children}</div>
        </button>
    );
}
