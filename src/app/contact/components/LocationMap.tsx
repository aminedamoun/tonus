'use client';
import { useState, useEffect } from 'react';



export default function LocationMap() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-block pill-badge mb-4">Visit Us</div>
        <h2 className="text-4xl md:text-5xl font-serif italic text-foreground">
          Our <span className="text-primary">Location</span>
        </h2>
      </div>

      <div className="relative rounded-[48px] overflow-hidden border-2 border-primary/40 transition-all duration-500 hover:border-primary/60 hover:shadow-blue-glow-lg h-[500px]">
        {isHydrated && (
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.106445792126!2d55.27063887675307!3d25.199632531599477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43e9e80bd6e5%3A0xea35880fe1607382!2sTonos%20Greek%20Restaurant!5e0!3m2!1sen!2sae!4v1771576699209!5m2!1sen!2sae"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="GreekRestaurant location in Dubai"
          ></iframe>
        )}
      </div>
    </div>
  )
}