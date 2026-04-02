import Link from 'next/link';
 import Icon from'@/components/ui/AppIcon';

export default function CTABanner() {
  return (
    <section className="section-padding greek-pattern-bg reveal">
      <div className="container-custom">
        <div className="bg-secondary text-secondary-foreground rounded-[48px] p-12 md:p-20 text-center space-y-8 shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-serif italic leading-tight">
            Experience the <br />
            <span className="text-primary">Mediterranean</span>
          </h2>
          <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl mx-auto">
            Reserve your table today and embark on a culinary journey through the Greek islands. 
            Fresh ingredients, authentic recipes, unforgettable flavors.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/reservations"
              className="px-10 py-5 rounded-full bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform shadow-lg"
            >
              Book a Table
            </Link>
            <a
              href="https://wa.me/971XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 rounded-full bg-white text-secondary font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
              <Icon name="ChatBubbleLeftRightIcon" size={20} />
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}