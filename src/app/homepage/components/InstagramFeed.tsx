'use client';
import Icon from '@/components/ui/AppIcon';


export default function InstagramFeed() {
  const instagramPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1625062948078-62b1b7183305",
    alt: 'Greek salad with fresh vegetables and feta cheese',
    likes: 245
  },
  {
    id: 2,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_193f2d7d6-1772387760212.png",
    alt: 'Grilled souvlaki skewers with vegetables',
    likes: 312
  },
  {
    id: 3,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1768eb915-1764717381729.png",
    alt: 'Traditional Greek moussaka dish',
    likes: 198
  },
  {
    id: 4,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ddac214f-1772440734330.png",
    alt: 'Fresh Mediterranean seafood platter',
    likes: 421
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1607459098853-da987d2f5a92",
    alt: 'Delicious baklava dessert with honey',
    likes: 356
  },
  {
    id: 6,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_129450ab7-1772387762220.png",
    alt: 'Greek restaurant interior ambiance',
    likes: 289
  }];


  return (
    <section className="py-20 bg-muted/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 reveal">
          <div className="inline-block pill-badge mb-4">Follow Us</div>
          <h2 className="text-4xl md:text-6xl font-serif italic text-foreground mb-4">
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-0">
            Join our community and stay updated with our latest dishes, events, and special moments.
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 reveal">
          {instagramPosts?.map((post) =>
          <div
            key={post?.id}
            className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-border transition-all duration-450 hover:border-primary hover:scale-105 hover:shadow-blue-glow-lg">
          </div>
          )}
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 reveal mt-0">
          <a
            href="https://www.instagram.com/tonosgreekrestaurant"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
            
            <Icon name="CameraIcon" size={20} />
            <span className="font-semibold">Instagram</span>
          </a>
          <a
            href="https://www.facebook.com/share/1GqDqm9cri/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
            
            <Icon name="UserGroupIcon" size={20} />
            <span className="font-semibold">Facebook</span>
          </a>
          <a
            href="https://wa.me/971581391113"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
            
            <Icon name="ChatBubbleLeftRightIcon" size={20} />
            <span className="font-semibold">WhatsApp</span>
          </a>
        </div>
      </div>
    </section>);

}