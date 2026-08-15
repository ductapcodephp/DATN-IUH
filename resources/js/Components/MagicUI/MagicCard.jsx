import React, { useRef, useState } from "react";

export default function MagicCard({
    children,
    className = "",
    gradientSize = 250,
    gradientColor = "rgba(234, 88, 12, 0.15)",
    gradientOpacity = 0.8,
    borderColor = "rgba(234, 88, 12, 0.4)",
    ...props
}) {
    const cardRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setMousePosition({ x: -1000, y: -1000 });
            }}
            className={`magic-card-wrapper position-relative ${className}`}
            {...props}
        >
            {/* Spotlight gradient layer */}
            <div
                className="magic-card-spotlight pointer-events-none"
                style={{
                    opacity: isHovered ? gradientOpacity : 0,
                    background: `radial-gradient(${gradientSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${gradientColor}, transparent 80%)`,
                }}
            />
            {/* Border glow layer */}
            <div
                className="magic-card-border pointer-events-none"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(${gradientSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${borderColor}, transparent 80%)`,
                }}
            />
            <div className="magic-card-inner position-relative z-1">{children}</div>
        </div>
    );
}
