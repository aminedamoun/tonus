import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function MediterraneanStory() {
  const values = [
    {
      id: 'value_fresh',
      icon: 'SparklesIcon',
      title: 'Fresh Ingredients',
      description: 'Sourced daily from local markets and imported from Greece',
    },
    {
      id: 'value_olive',
      icon: 'BeakerIcon',
      title: 'Premium Olive Oil',
      description: 'Extra virgin olive oil from Kalamata, Greece',
    },
    {
      id: 'value_family',
      icon: 'HeartIcon',
      title: 'Family Recipes',
      description: 'Traditional recipes passed down since 1985',
    },
  ];

  return (
    <section className="section-padding bg-cream reveal">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-[48px] overflow-hidden border-2 border-primary/40 transition-all duration-500 hover:border-primary/60 hover:shadow-blue-glow-lg">
              <AppImage
                src="/assets/images/homepage/santorini-aerial.webp"
                alt="Aerial view of white buildings and blue domes in Santorini Greece overlooking Aegean Sea"
                className="w-full h-full object-cover transition-all duration-700"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-glow-pulse"></div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block pill-badge">Our Philosophy</div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-foreground leading-tight">
                Mediterranean <br />
                <span className="text-primary">Authenticity</span>
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              At Tonos Greek Restaurant, we bring the soul of the Greek islands straight to the
              heart of Downtown Dubai. Nestled on Sheikh Mohammed bin Rashid Boulevard in Boulevard
              Plaza, our kitchen celebrates the vibrancy of traditional Greek and Mediterranean
              cuisine with love and authenticity
            </p>

            {/* Values Grid */}
            <div className="grid gap-6 pt-8">
              {values.map((value) => (
                <div
                  key={value.id}
                  className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-border hover:border-primary transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Icon name={value.icon as any} size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-1">{value.title}</h4>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/about" className="btn-secondary">
                Read Our Full Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
