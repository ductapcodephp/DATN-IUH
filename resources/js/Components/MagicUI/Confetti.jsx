import React, { useEffect, useRef } from "react";

export function triggerConfetti(options = {}) {
    const count = options.count || 80;
    const duration = options.duration || 3000;
    const colors = options.colors || ["#EA580C", "#0284C7", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899"];

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "99999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height * 0.4 + (Math.random() - 0.5) * 100,
            w: Math.random() * 10 + 6,
            h: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 18,
            vy: (Math.random() - 0.8) * 15 - 5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            gravity: 0.35,
            opacity: 1,
        });
    }

    let startTime = performance.now();

    function render(time) {
        const elapsed = time - startTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.99;
            p.rotation += p.rotationSpeed;
            if (elapsed > duration * 0.6) {
                p.opacity = Math.max(0, 1 - (elapsed - duration * 0.6) / (duration * 0.4));
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        if (elapsed < duration) {
            requestAnimationFrame(render);
        } else {
            if (document.body.contains(canvas)) {
                document.body.removeChild(canvas);
            }
        }
    }

    requestAnimationFrame(render);
}

export default function Confetti({ active = false, duration = 3000, colors }) {
    useEffect(() => {
        if (active) {
            triggerConfetti({ duration, colors });
        }
    }, [active]);

    return null;
}
