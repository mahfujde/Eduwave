"use client";

import { useEffect } from "react";

/**
 * Lightweight scroll-reveal animation system.
 * Uses IntersectionObserver + CSS transitions (zero JS animation libraries).
 *
 * Elements use: data-anim="fade-up" | "fade-down" | "slide-left" | "slide-right" | "zoom" | "fade"
 * Optional: data-delay="0.2" for staggered entrance
 * Stagger: data-anim-stagger="fade-up" on parent — children animate sequentially
 *
 * FIX: Uses MutationObserver to detect dynamically added data-anim elements
 * (e.g. from async data loading like testimonials, universities, etc.)
 */
export default function ScrollAnimator() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("anim-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    // Helper: observe an element if not already observed
    const observed = new WeakSet<Element>();

    function observeElement(el: Element) {
      if (observed.has(el)) return;
      observed.add(el);
      el.classList.add("anim-init");
      observer.observe(el);
    }

    function processStaggerParent(parent: Element) {
      const type = parent.getAttribute("data-anim-stagger") || "fade-up";
      Array.from(parent.children).forEach((child, i) => {
        if (!child.hasAttribute("data-anim")) {
          (child as HTMLElement).setAttribute("data-anim", type);
          (child as HTMLElement).style.transitionDelay = `${i * 80}ms`;
        }
        observeElement(child);
      });
    }

    function scanDOM() {
      // Observe single elements with data-anim
      document.querySelectorAll("[data-anim]").forEach(observeElement);

      // Observe stagger parents — add delays to children
      document.querySelectorAll("[data-anim-stagger]").forEach(processStaggerParent);
    }

    // Initial scan
    scanDOM();

    // FIX: Watch for dynamically added elements (from async data loading)
    const mutationObserver = new MutationObserver((mutations) => {
      let needsScan = false;
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLElement) {
            if (node.hasAttribute("data-anim") || node.hasAttribute("data-anim-stagger") ||
                node.querySelector("[data-anim], [data-anim-stagger]")) {
              needsScan = true;
              break;
            }
          }
        }
        if (needsScan) break;
      }
      if (needsScan) scanDOM();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
