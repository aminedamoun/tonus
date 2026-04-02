import Icon from '@/components/ui/AppIcon';

interface Value {
  id: string;
  icon: string;
  title: string;
  description: string;
  featured?: boolean;
}

export default function PhilosophyValues() {
  const values: Value[] = [
    {
      id: 'value_authentic',
      icon: 'ShieldCheckIcon',
      title: 'Authenticity',
      description:
        'Every recipe is rooted in Greek tradition, passed down through generations and prepared with the same care as in our family kitchens.',
      featured: true,
    },
    {
      id: 'value_quality',
      icon: 'SparklesIcon',
      title: 'Quality Ingredients',
      description:
        'We source premium products from Greece: Kalamata olive oil, Thessaly feta, Cretan herbs, and fresh seafood from the Mediterranean.',
    },
    {
      id: 'value_hospitality',
      icon: 'HeartIcon',
      title: 'Greek Hospitality',
      description:
        'Philoxenia (love of strangers) is at our core. Every guest is welcomed as family, creating a warm, inviting atmosphere.',
      featured: true,
    },
    {
      id: 'value_fresh',
      icon: 'SunIcon',
      title: 'Fresh Daily',
      description:
        'Our ingredients are sourced fresh each morning from local markets, ensuring every dish bursts with Mediterranean flavor.',
    },
    {
      id: 'value_traditional',
      icon: 'BookOpenIcon',
      title: 'Traditional Methods',
      description:
        'We honor centuries-old cooking techniques: slow-roasting lamb, hand-rolling phyllo, and wood-fired grilling.',
    },
    {
      id: 'value_community',
      icon: 'UserGroupIcon',
      title: 'Community',
      description:
        'We believe food brings people together. Our restaurant is a gathering place for families, friends, and neighbors.',
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-block pill-badge mb-4">Our Values</div>
        <h2 className="text-5xl md:text-6xl font-serif italic text-foreground">
          The <span className="text-primary">Mediterranean</span> Way
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our philosophy is simple: honor tradition, celebrate quality, and share the warmth of
          Greek hospitality with every guest.
        </p>
      </div>

      {/* Creative Staggered Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Row 1: Featured card + Regular card */}
        <div className="lg:col-span-7 group">
          <div className="floating-card p-10 h-full space-y-6 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-glow transition-all duration-500 group-hover:rotate-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Icon name={values[0].icon as any} size={32} className="text-white" />
            </div>
            <h3 className="text-3xl font-serif text-foreground">{values[0].title}</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {values[0].description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 group">
          <div className="floating-card p-8 h-full space-y-4 hover:bg-primary/5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/30 group-hover:border-primary/60 group-hover:shadow-blue-glow transition-all duration-500 group-hover:-rotate-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Icon name={values[1].icon as any} size={28} className="text-primary" />
            </div>
            <h3 className="text-2xl font-serif text-foreground">{values[1].title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{values[1].description}</p>
          </div>
        </div>

        {/* Row 2: Regular card + Featured card */}
        <div className="lg:col-span-5 group">
          <div className="floating-card p-8 h-full space-y-4 hover:bg-primary/5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/30 group-hover:border-primary/60 group-hover:shadow-blue-glow transition-all duration-500 group-hover:rotate-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Icon name={values[3].icon as any} size={28} className="text-primary" />
            </div>
            <h3 className="text-2xl font-serif text-foreground">{values[3].title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{values[3].description}</p>
          </div>
        </div>

        <div className="lg:col-span-7 group">
          <div className="floating-card p-10 h-full space-y-6 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-glow transition-all duration-500 group-hover:-rotate-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Icon name={values[2].icon as any} size={32} className="text-white" />
            </div>
            <h3 className="text-3xl font-serif text-foreground">{values[2].title}</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {values[2].description}
            </p>
          </div>
        </div>

        {/* Row 3: Two regular cards */}
        <div className="lg:col-span-6 group">
          <div className="floating-card p-8 h-full space-y-4 hover:bg-primary/5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/30 group-hover:border-primary/60 group-hover:shadow-blue-glow transition-all duration-500 group-hover:-rotate-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Icon name={values[4].icon as any} size={28} className="text-primary" />
            </div>
            <h3 className="text-2xl font-serif text-foreground">{values[4].title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{values[4].description}</p>
          </div>
        </div>

        <div className="lg:col-span-6 group">
          <div className="floating-card p-8 h-full space-y-4 hover:bg-primary/5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/30 group-hover:border-primary/60 group-hover:shadow-blue-glow transition-all duration-500 group-hover:rotate-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Icon name={values[5].icon as any} size={28} className="text-primary" />
            </div>
            <h3 className="text-2xl font-serif text-foreground">{values[5].title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{values[5].description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
