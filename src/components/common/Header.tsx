'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'nav_home', label: 'Home', href: '/homepage' },
    { id: 'nav_menu', label: 'Menu', href: '/menu' },
    { id: 'nav_delivery', label: 'Delivery', href: '/delivery' },
    { id: 'nav_reservations', label: 'Reservations', href: '/reservations' },
    { id: 'nav_about', label: 'About', href: '/about' },
    { id: 'nav_contact', label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container-custom h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/homepage" className="flex items-center group">
          <div className="relative w-16 h-16 transition-transform group-hover:scale-110">
            <Image
              src="/assets/images/logotonos-1770983075095.png"
              alt="Tonos Restaurant Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {navLinks?.map((link) => (
            <Link
              key={link?.id}
              href={link?.href}
              className={`nav-link pb-1 transition-colors ${
                pathname === link?.href
                  ? 'text-blue-500 active'
                  : isScrolled
                    ? 'text-black hover:text-blue-500'
                    : pathname === '/homepage'
                      ? 'text-white hover:text-blue-500'
                      : 'text-foreground hover:text-blue-500'
              }`}
            >
              {link?.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://wa.me/971581391113"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
            aria-label="WhatsApp"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={20} />
          </a>
          <Link href="/reservations" className="btn-primary">
            Reserve Table
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-foreground"
          aria-label="Toggle menu"
        >
          <Icon name={isMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={28} />
        </button>
      </nav>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-t border-border shadow-lg">
          <div className="container-custom py-6 space-y-4">
            {navLinks?.map((link) => (
              <Link
                key={link?.id}
                href={link?.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 rounded-2xl font-semibold ${
                  pathname === link?.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link?.label}
              </Link>
            ))}
            <Link
              href="/reservations"
              onClick={() => setIsMenuOpen(false)}
              className="block btn-primary text-center"
            >
              Reserve Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
