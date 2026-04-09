'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Image from 'next/image';

const NAV_ICONS: Record<string, string> = {
  '/homepage': 'HomeIcon',
  '/menu': 'BookOpenIcon',
  '/delivery': 'TruckIcon',
  '/reservations': 'CalendarIcon',
  '/about': 'InformationCircleIcon',
  '/contact': 'EnvelopeIcon',
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { id: 'nav_home', label: 'Home', href: '/homepage' },
    { id: 'nav_menu', label: 'Menu', href: '/menu' },
    { id: 'nav_delivery', label: 'Delivery', href: '/delivery' },
    { id: 'nav_reservations', label: 'Reservations', href: '/reservations' },
    { id: 'nav_about', label: 'About', href: '/about' },
    { id: 'nav_contact', label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav className="container-custom h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/homepage" className="flex items-center group relative z-50">
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
            className={`md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
              isMenuOpen
                ? 'bg-primary/10 text-primary'
                : isScrolled
                  ? 'text-foreground'
                  : pathname === '/homepage'
                    ? 'text-white'
                    : 'text-foreground'
            }`}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              {/* Animated hamburger to X */}
              <span
                className={`absolute left-0 h-0.5 w-6 rounded-full transition-all duration-300 ${
                  isMenuOpen
                    ? 'top-[11px] rotate-45 bg-primary'
                    : 'top-[4px] bg-current'
                }`}
              />
              <span
                className={`absolute left-0 top-[11px] h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-6 rounded-full transition-all duration-300 ${
                  isMenuOpen
                    ? 'top-[11px] -rotate-45 bg-primary'
                    : 'top-[18px] bg-current'
                }`}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel - slides down from top */}
        <div
          ref={menuRef}
          className={`absolute top-0 left-0 right-0 bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
          style={{ paddingTop: '80px', borderRadius: '0 0 32px 32px' }}
        >
          <div className="px-6 pb-8 pt-4">
            {/* Nav Links */}
            <div className="space-y-1.5">
              {navLinks?.map((link, index) => (
                <Link
                  key={link?.id}
                  href={link?.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 py-3.5 px-4 rounded-2xl font-semibold text-base transition-all duration-300 ${
                    pathname === link?.href
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-foreground hover:bg-primary/5 active:bg-primary/10'
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                    opacity: isMenuOpen ? 1 : 0,
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `opacity 0.4s ease ${index * 50}ms, transform 0.4s ease ${index * 50}ms, background-color 0.2s ease, color 0.2s ease`,
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      pathname === link?.href
                        ? 'bg-white/20'
                        : 'bg-primary/10'
                    }`}
                  >
                    <Icon
                      name={NAV_ICONS[link.href] || 'HomeIcon'}
                      size={20}
                      className={pathname === link?.href ? 'text-white' : 'text-primary'}
                    />
                  </div>
                  <span>{link?.label}</span>
                  {pathname === link?.href && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white/60" />
                  )}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-border my-5" />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/reservations"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider shadow-lg transition-transform active:scale-95"
                style={{
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.4s ease 350ms, transform 0.4s ease 350ms',
                  boxShadow: '0 4px 14px 0 rgba(137, 207, 240, 0.39)',
                }}
              >
                <Icon name="CalendarIcon" size={18} />
                Reserve Table
              </Link>

              <a
                href="https://wa.me/971581391113"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 border-primary/30 text-foreground font-bold text-sm uppercase tracking-wider transition-all active:scale-95 hover:bg-primary/5"
                style={{
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.4s ease 400ms, transform 0.4s ease 400ms',
                }}
              >
                <Icon name="ChatBubbleLeftRightIcon" size={18} className="text-primary" />
                WhatsApp Us
              </a>
            </div>

            {/* Hours badge */}
            <div
              className="mt-5 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-primary/5 border border-primary/15"
              style={{
                opacity: isMenuOpen ? 1 : 0,
                transition: 'opacity 0.4s ease 450ms',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-muted-foreground">
                Open 24 Hours
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
