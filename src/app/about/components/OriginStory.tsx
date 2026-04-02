import AppImage from '@/components/ui/AppImage';

export default function OriginStory() {
  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Image */}
      <div className="relative">
        <div className="aspect-[4/5] rounded-[48px] overflow-hidden border-2 border-primary/40 transition-all duration-500 hover:border-primary/60 hover:shadow-blue-glow-lg">
          <AppImage
            src="https://images.unsplash.com/photo-1414269902003-a5673f7ae2ea"
            alt="Vintage Greek restaurant interior with traditional decor and Mediterranean atmosphere"
            className="w-full h-full object-cover transition-all duration-700" />
          
        </div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-glow-pulse"></div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="inline-block pill-badge">Since 1985</div>
          <h2 className="text-5xl md:text-6xl font-serif italic text-foreground leading-tight">
            A Journey from <br />
            <span className="text-primary">Greece to Dubai</span>
          </h2>
        </div>

        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            Tonos Greek Restaurant was born from a passion for authentic Mediterranean cuisine and a dream to share the vibrant flavors of the Greek islands with Dubai. Our founders, inspired by generations of Greek culinary traditions, wanted to bring the heart and soul of Greece to every table.

Every dish at Tonos reflects the spirit of Greek hospitality — from fresh seafood and hand‑rolled moussaka to creamy tzatziki and delicate pastries. We honor our roots by sourcing the finest ingredients directly from Greece, including extra virgin olive oil from Kalamata, feta from Thessaly, and herbs from the mountains of Crete.

From our kitchen to your table, each bite tells a story of tradition, love, and the timeless Mediterranean way of life.
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm font-bold text-foreground mb-2">Our Promise</p>
          <p className="text-sm text-muted-foreground italic">
            " To welcome every guest like family, serving dishes made with heart and crafted from ingredients that honor the authentic flavors of Greece."
          </p>
        </div>
      </div>
    </div>);

}