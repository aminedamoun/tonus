'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function QuickOrderBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-primary text-primary-foreground p-4 border-2 border-primary/60 shadow-blue-glow-lg">
        <a
          href="https://wa.me/971XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-wider"
        >
          <Icon name="ChatBubbleLeftRightIcon" size={24} />
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}
