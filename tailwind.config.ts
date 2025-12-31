
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        hero: 'linear-gradient(145deg, hsl(var(--gradient-start)), hsl(var(--gradient-mid)), hsl(var(--gradient-end)))',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Theme-based colors from company settings (use these for branded elements)
        "theme-primary": "hsl(var(--theme-primary))",
        "theme-border": "hsl(var(--theme-border))",
        
        // Gradient colors (for custom gradients)
        "gradient-start": "hsl(var(--gradient-start))",
        "gradient-mid": "hsl(var(--gradient-mid))",
        "gradient-end": "hsl(var(--gradient-end))",
        
        // Semantic color tokens
        "text-primary": "hsl(var(--text-primary))",
        "text-secondary": "hsl(var(--text-secondary))",
        "text-tertiary": "hsl(var(--text-tertiary))",
        "text-inverse": "hsl(var(--text-inverse))",
        
        "bg-primary": "hsl(var(--bg-primary))",
        "bg-secondary": "hsl(var(--bg-secondary))",
        "bg-tertiary": "hsl(var(--bg-tertiary))",
        "bg-accent": "hsl(var(--bg-accent))",
        "bg-inverse": "hsl(var(--bg-inverse))",
        
        // Card gradients
        "card-gradient-1": "hsl(var(--card-gradient-1))",
        "card-gradient-2": "hsl(var(--card-gradient-2))",
        "card-gradient-3": "hsl(var(--card-gradient-3))",
        "card-gradient-4": "hsl(var(--card-gradient-4))",
        
        // Brand colors
        "brand-primary": "hsl(var(--brand-primary))",
        "brand-secondary": "hsl(var(--brand-secondary))",
        "brand-accent": "hsl(var(--brand-accent))",
        "brand-highlight": "hsl(var(--brand-highlight))",
        
        // Header colors
        "header-bg": "hsl(var(--header-bg))",
        "header-foreground": "hsl(var(--header-foreground))",
        
        // Card gradient backgrounds
        "card-gradient-start": "hsl(var(--card-gradient-start))",
        "card-gradient-end": "hsl(var(--card-gradient-end))",
        "card-gradient-border": "hsl(var(--card-gradient-border))",
        
        // Landing page colors
        "landing-footer": "hsl(var(--landing-footer-bg))",
        "landing-gradient-1": "hsl(var(--landing-gradient-1))",
        "landing-gradient-2": "hsl(var(--landing-gradient-2))",
        "landing-gradient-3": "hsl(var(--landing-gradient-3))",
        
        // Shadcn colors
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          'primary-foreground': "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          'accent-foreground': "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      
      // Enhanced typography system
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'mono': ['Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.75' }],
        'xl': ['1.25rem', { lineHeight: '1.25' }],
        '2xl': ['1.5rem', { lineHeight: '1.25' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.25' }],
        '5xl': ['3rem', { lineHeight: '1.25' }],
        '6xl': ['3.75rem', { lineHeight: '1.25' }],
        'kpi': ['3rem', { lineHeight: '1.25', fontWeight: '700' }],
        
        // Semantic font sizes
        'heading-1': ['3rem', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.025em' }],
        'heading-2': ['2.25rem', { lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.025em' }],
        'heading-3': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'heading-4': ['1.5rem', { lineHeight: '1.25', fontWeight: '600' }],
        'heading-5': ['1.25rem', { lineHeight: '1.25', fontWeight: '600' }],
        'heading-6': ['1.125rem', { lineHeight: '1.25', fontWeight: '600' }],
        
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body': ['1rem', { lineHeight: '1.5' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
        
        'ui-button': ['0.875rem', { lineHeight: '1.25', fontWeight: '500' }],
        'ui-label': ['0.875rem', { lineHeight: '1.25', fontWeight: '500' }],
        'ui-caption': ['0.75rem', { lineHeight: '1.25' }],
      },
      
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      
      lineHeight: {
        'tight': '1.25',
        'normal': '1.5',
        'relaxed': '1.75',
      },
      
      letterSpacing: {
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
      },
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '16px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevation-1': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'elevation-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
