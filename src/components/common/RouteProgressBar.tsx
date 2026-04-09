'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function RouteProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    // Flash a quick completion bar on route change
    setVisible(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setVisible(false), 400);

    return () => clearTimeout(timeout.current);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none">
      <div
        className="h-full rounded-r-full"
        style={{
          animation: 'progressSlide 0.4s ease-out forwards',
          background: 'linear-gradient(90deg, #89CFF0, #1E3A5F)',
          boxShadow: '0 0 8px rgba(137,207,240,0.5)',
        }}
      />
      <style>{`
        @keyframes progressSlide {
          0% { width: 0%; }
          60% { width: 80%; }
          100% { width: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
