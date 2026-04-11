/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)', // white
        foreground: 'var(--color-foreground)', // charcoal
        border: 'var(--color-border)', // gray-200
        input: 'var(--color-input)', // gray-100
        ring: 'var(--color-ring)', // baby-blue-400
        
        card: {
          DEFAULT: 'var(--color-card)', // white
          foreground: 'var(--color-card-foreground)', // charcoal
        },
        
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)', // charcoal
        },
        
        muted: {
          DEFAULT: 'var(--color-muted)', // gray-100
          foreground: 'var(--color-muted-foreground)', // gray-500
        },
        
        primary: {
          DEFAULT: 'var(--color-primary)', // baby-blue-400
          foreground: 'var(--color-primary-foreground)', // charcoal
        },
        
        secondary: {
          DEFAULT: 'var(--color-secondary)', // deep-blue-900
          foreground: 'var(--color-secondary-foreground)', // white
        },
        
        accent: {
          DEFAULT: 'var(--color-accent)', // olive-green-600
          foreground: 'var(--color-accent-foreground)', // white
        },
        
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-500
          foreground: 'var(--color-destructive-foreground)', // white
        },
        
        success: {
          DEFAULT: 'var(--color-success)', // emerald-500
          foreground: 'var(--color-success-foreground)', // white
        },
        
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-500
          foreground: 'var(--color-warning-foreground)', // white
        },
        
        error: {
          DEFAULT: 'var(--color-error)', // red-600
          foreground: 'var(--color-error-foreground)', // white
        },
        
        cream: 'var(--color-cream)', // cream-50
        pattern: 'var(--color-pattern)', // baby-blue with opacity
        'hover-light-blue': 'var(--color-hover-light-blue)', // very light blue for hover
      },
      
     fontFamily: {
  sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
  serif: ['var(--font-serif)', 'Playfair Display', 'serif'],
},

      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'hero': ['clamp(3rem, 10vw, 8rem)', { lineHeight: '0.9' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      
      boxShadow: {
        'soft': '0 10px 40px rgba(0, 0, 0, 0.05)',
        'medium': '0 20px 60px rgba(0, 0, 0, 0.08)',
        'hard': '0 30px 80px rgba(0, 0, 0, 0.12)',
        'primary': '0 10px 40px rgba(137, 207, 240, 0.15)',
        'primary-lg': '0 20px 60px rgba(137, 207, 240, 0.25)',
        'blue-glow': '0 0 20px rgba(137, 207, 240, 0.4), 0 0 40px rgba(137, 207, 240, 0.2)',
        'blue-glow-lg': '0 0 30px rgba(137, 207, 240, 0.5), 0 0 60px rgba(137, 207, 240, 0.3), 0 10px 40px rgba(137, 207, 240, 0.2)',
      },
      
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(137, 207, 240, 0.4), 0 0 40px rgba(137, 207, 240, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(137, 207, 240, 0.6), 0 0 60px rgba(137, 207, 240, 0.3)' },
        },
      },
      
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}