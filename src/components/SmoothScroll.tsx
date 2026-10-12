"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LenisProps {
    children: React.ReactNode;
    isInsideModal?: boolean;
}

function SmoothScroll({ children, isInsideModal = false }: LenisProps) {
    const lenis = useLenis();

    // Sync Lenis scroll events to GSAP ScrollTrigger so ScrollTrigger
    // always reads the same scroll position that Lenis is displaying.
    // Without this, ScrollTrigger sees a stale native scroll position and
    // re-fires its callbacks from the beginning when jumping to a section.
    useEffect(() => {
        if (!lenis) return;
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
        return () => {
            lenis.off("scroll", ScrollTrigger.update);
            gsap.ticker.remove((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(64);
        };
    }, [lenis]);

    useEffect(() => {
        document.addEventListener("DOMContentLoaded", () => {
            lenis?.stop();
            lenis?.start();
        });
    }, [lenis]);

    return (
        <ReactLenis
            root
            options={{
                duration: 2,
                prevent: (node) => {
                    if (isInsideModal) return true;
                    const modalOpen = node.classList.contains("modall");
                    return modalOpen;
                },
            }}
        >
            {children}
        </ReactLenis>
    );
}

export default SmoothScroll;
