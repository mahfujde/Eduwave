"use client";

import { useEffect } from "react";

/**
 * Global scroll-triggered animation observer.
 * Adds `.anim-show` class when elements with `.anim-hidden`, `.anim-slide-left`,
 * `.anim-slide-right`, or `.anim-zoom` enter the viewport.
 */
export default function ScrollAnimator() {
  useEffect(() => {
    const selectors = ".anim-hidden, .anim-slide-left, .anim-slide-right, .anim-zoom";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("anim-show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    // Observe all current animated elements
    document.querySelectorAll(selectors).forEach((el) => observer.observe(el));

    // MutationObserver to handle dynamically added elements
    const mutObs = new MutationObserver(() => {
      document.querySelectorAll(selectors).forEach((el) => {
        if (!el.classList.contains("anim-show")) observer.observe(el);
      });
    });
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObs.disconnect();
    };
  }, []);

  return null;
}
