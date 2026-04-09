'use client';
import { useEffect, useRef } from 'react';

/**
 * Staggered fade+slide-up for direct children of a ref element on mount.
 * Only animates content elements — not the header/footer.
 */
export function usePageEnter() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll(':scope > *');
    children.forEach((child, i) => {
      const htmlEl = child as HTMLElement;
      htmlEl.style.opacity = '0';
      htmlEl.style.transform = 'translateY(20px)';
      htmlEl.style.transition = 'none';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          htmlEl.style.transition = `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`;
          htmlEl.style.opacity = '1';
          htmlEl.style.transform = 'translateY(0)';
        });
      });
    });
  }, []);

  return ref;
}
