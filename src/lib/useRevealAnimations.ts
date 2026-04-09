'use client';
import { useEffect } from 'react';

/**
 * Sets up IntersectionObserver for .reveal elements with staggered delays.
 * Elements already in viewport get staggered entrance animation.
 * Elements below the fold animate on scroll.
 */
export function useRevealAnimations() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    let staggerIndex = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          // Stagger elements that are initially visible
          const delay = staggerIndex * 120;
          staggerIndex++;
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('active');
          observer.unobserve(el);

          // Clear the delay after animation completes so it doesn't affect future transitions
          setTimeout(() => {
            el.style.transitionDelay = '0ms';
          }, delay + 1000);
        });
      },
      { threshold: 0.08 }
    );

    // Small delay to let the page render first, then start observing
    const timer = setTimeout(() => {
      reveals.forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}
