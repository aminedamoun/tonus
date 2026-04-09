'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const startProgress = useCallback(() => {
    setIsVisible(true);
    setIsAnimating(true);
    setProgress(0);

    // Quick jump to ~30%
    requestAnimationFrame(() => {
      setProgress(30);
    });

    // Ease to ~70%
    const t1 = setTimeout(() => setProgress(70), 200);
    // Ease to ~90%
    const t2 = setTimeout(() => setProgress(90), 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const completeProgress = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsAnimating(false);
      setIsVisible(false);
      setProgress(0);
    }, 400);
  }, []);

  // Intercept link clicks for progress bar
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || href === '#') return;
      if (href === pathname) return;

      cleanup = startProgress();
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      cleanup?.();
    };
  }, [pathname, startProgress]);

  // Complete when route actually changes
  useEffect(() => {
    if (isAnimating) {
      completeProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* Progress bar */}
      {isVisible && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
          <div
            className="h-full rounded-r-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #89CFF0, #1E3A5F, #89CFF0)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s linear infinite',
              transition: progress === 0
                ? 'none'
                : progress === 100
                  ? 'width 0.3s cubic-bezier(0.0, 0, 0.2, 1)'
                  : 'width 0.8s cubic-bezier(0.0, 0, 0.2, 1)',
              boxShadow: '0 0 10px rgba(137,207,240,0.5), 0 0 5px rgba(137,207,240,0.3)',
            }}
          />
        </div>
      )}

      {/* Page content with entrance animation */}
      <div key={pathname} className="page-enter">
        {children}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .page-enter {
          animation: pageEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </>
  );
}
