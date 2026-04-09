'use client';
import { useEffect } from 'react';

export function useRevealAnimations() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal:not(.active)');
    if (!reveals.length) return;

    let staggerIndex = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = staggerIndex * 100;
          staggerIndex++;
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('active');
          observer.unobserve(el);
          setTimeout(() => {
            el.style.transitionDelay = '0ms';
          }, delay + 1000);
        });
      },
      { threshold: 0.01, rootMargin: '50px' }
    );

    // Observe immediately
    reveals.forEach((el) => observer.observe(el));

    // Safety: force-show everything after 500ms
    const safety = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.active)').forEach((el) => {
        (el as HTMLElement).style.transitionDelay = '0ms';
        el.classList.add('active');
      });
    }, 500);

    return () => {
      clearTimeout(safety);
      observer.disconnect();
    };
  }, []);
}
