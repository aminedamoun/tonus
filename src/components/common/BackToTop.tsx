'use client';
import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-4 opacity-0 scale-75 pointer-events-none'
      }`}
      style={{
        background: isHovered
          ? 'linear-gradient(135deg, #1E3A5F 0%, #2a4f7a 100%)'
          : 'linear-gradient(135deg, #89CFF0 0%, #6bb8e8 100%)',
        boxShadow: isHovered
          ? '0 8px 30px rgba(30,58,95,0.4), 0 0 0 4px rgba(30,58,95,0.1)'
          : '0 4px 20px rgba(137,207,240,0.4), 0 0 0 4px rgba(137,207,240,0.1)',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="transition-transform duration-300"
        style={{ transform: isHovered ? 'translateY(-2px)' : 'translateY(0)' }}
      >
        <path
          d="M10 15V5M10 5L5 10M10 5L15 10"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
