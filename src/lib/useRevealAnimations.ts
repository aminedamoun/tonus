'use client';
import { useEffect } from 'react';

export function useRevealAnimations() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal:not(.active)');
    if (!reveals.length) return;

    // Step 1: Immediately show everything already in the viewport (no animation)
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 50) {
        (el as HTMLElement).style.transition = 'none';
        el.classList.add('active');
        // Re-enable transitions after paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            (el as HTMLElement).style.transition = '';
          });
        });
      }
    });

    // Step 2: Observe remaining elements for scroll-into-view animation
    const remaining = document.querySelectorAll('.reveal:not(.active)');
    if (!remaining.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '20px' }
    );

    remaining.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
