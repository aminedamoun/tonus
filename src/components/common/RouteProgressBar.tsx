'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function RouteProgressBar() {
  const pathname = usePathname();
  const [barWidth, setBarWidth] = useState(0);
  const [show, setShow] = useState(false);
  const prevPath = useRef(pathname);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  const clear = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  // Complete on route change
  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;
    clear();
    setBarWidth(100);
    timeouts.current.push(
      setTimeout(() => {
        setShow(false);
        timeouts.current.push(setTimeout(() => setBarWidth(0), 300));
      }, 300)
    );
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Start on internal link click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('/') || href === pathname) return;
      clear();
      setShow(true);
      setBarWidth(0);
      requestAnimationFrame(() => {
        setBarWidth(15);
        timeouts.current.push(
          setTimeout(() => setBarWidth(45), 150),
          setTimeout(() => setBarWidth(75), 400)
        );
      });
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname]);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          zIndex: 99999,
          pointerEvents: 'none',
          opacity: show ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${barWidth}%`,
            background: 'linear-gradient(90deg, #89CFF0 0%, #1E3A5F 50%, #89CFF0 100%)',
            backgroundSize: '200% 100%',
            animation: show ? 'barShimmer 1.2s ease-in-out infinite' : 'none',
            borderRadius: '0 4px 4px 0',
            transition:
              barWidth === 0
                ? 'none'
                : barWidth === 100
                  ? 'width 0.25s ease-out'
                  : 'width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
            boxShadow: '0 0 12px rgba(137,207,240,0.6)',
          }}
        />
      </div>
      <style>{`
        @keyframes barShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
