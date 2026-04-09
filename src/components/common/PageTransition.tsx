'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<'visible' | 'exiting' | 'entering'>('visible');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Start exit
    setPhase('exiting');

    const exitTimer = setTimeout(() => {
      // Swap content and scroll to top
      setDisplayChildren(children);
      window.scrollTo(0, 0);
      setPhase('entering');

      const enterTimer = setTimeout(() => {
        setPhase('visible');
      }, 50);

      return () => clearTimeout(enterTimer);
    }, 300);

    return () => clearTimeout(exitTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Also update children when they change without route change
  useEffect(() => {
    if (phase === 'visible') {
      setDisplayChildren(children);
    }
  }, [children, phase]);

  return (
    <div
      className="page-transition"
      style={{
        opacity: phase === 'exiting' ? 0 : 1,
        transform:
          phase === 'exiting'
            ? 'translateY(12px)'
            : phase === 'entering'
              ? 'translateY(0)'
              : 'translateY(0)',
        transition:
          phase === 'exiting'
            ? 'opacity 0.3s cubic-bezier(0.4, 0, 1, 1), transform 0.3s cubic-bezier(0.4, 0, 1, 1)'
            : 'opacity 0.5s cubic-bezier(0, 0, 0.2, 1), transform 0.5s cubic-bezier(0, 0, 0.2, 1)',
      }}
    >
      {displayChildren}
    </div>
  );
}
