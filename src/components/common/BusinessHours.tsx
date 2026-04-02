'use client';


export default function BusinessHours() {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-serif font-medium text-foreground mb-4">Hours</h3>
      
      <div className="space-y-3">
        {/* Open 24 Hours Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-full border border-primary/20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-base font-bold text-foreground">Open 24 Hours</span>
        </div>
        
        {/* Service Hours Grid */}
        <div className="grid gap-2 mt-3">
          {/* Lunch */}
          <div className="flex items-start gap-2 group">
            <span className="inline-flex items-center justify-center min-w-[90px] px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-md border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
              🍽️ Lunch
            </span>
            <span className="text-sm text-muted-foreground pt-0.5">Mon-Fri 11 AM–4 PM</span>
          </div>
          
          {/* Happy Hours */}
          <div className="flex items-start gap-2 group">
            <span className="inline-flex items-center justify-center min-w-[90px] px-3 py-1 bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-md border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
              🍹 Happy
            </span>
            <span className="text-sm text-muted-foreground pt-0.5">Daily 10 AM–5 PM</span>
          </div>
          
          {/* Delivery */}
          <div className="flex items-start gap-2 group">
            <span className="inline-flex items-center justify-center min-w-[90px] px-3 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-md border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
              🚚 Delivery
            </span>
            <span className="text-sm text-muted-foreground pt-0.5">Daily 11 AM–2:30 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}