import Link from 'next/link';

import Image from 'next/image';

export default function Footer() {
  const currentYear = 2026;

  const socialLinks = [
    {
      id: 'social_instagram',
      icon: 'CameraIcon',
      href: 'https://www.instagram.com/tonosgreekrestaurant',
      label: 'Instagram',
    },
    {
      id: 'social_whatsapp',
      icon: 'ChatBubbleLeftRightIcon',
      href: 'https://wa.me/971581391113',
      label: 'WhatsApp',
    },
  ];

  return (
    <footer className="bg-white border-t border-border py-12">
      <div className="container-custom">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Logo - Left */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/assets/images/logotonos-1770983075095.png"
                alt="Tonos Restaurant Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-serif font-medium tracking-wider text-secondary">
              Tonos
            </span>
          </div>

          {/* Navigation Links - Center */}
          <nav className="flex flex-wrap items-center justify-center gap-8">
            <Link
              href="/homepage"
              className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Menu
            </Link>
            <Link
              href="/delivery"
              className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Delivery
            </Link>
            <Link
              href="/reservations"
              className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Reservations
            </Link>
            <Link
              href="/about"
              className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/admin"
              className="font-sans text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Social Links - Right */}
          <div className="flex items-center gap-6">
            {socialLinks?.map((social) => (
              <a
                key={social?.id}
                href={social?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors"
                aria-label={social?.label}
              >
                {social?.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
          <p className="font-sans text-sm text-muted-foreground">
            © {currentYear} Tonos Greek Restaurant
          </p>
          <div className="flex gap-8">
            <Link
              href="#"
              className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
