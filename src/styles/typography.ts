
// Comprehensive Typography System
export const typography = {
  // Font families
  fontFamily: {
    primary: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
  },

  // Font sizes with consistent scale (1.125 ratio)
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights for optimal readability
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },

  // Semantic text styles
  heading: {
    h1: {
      fontSize: '3rem',
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: '600',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: '600',
      lineHeight: '1.25',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.25',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: '600',
      lineHeight: '1.25',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: '600',
      lineHeight: '1.25',
    },
  },

  // Body text variants
  body: {
    large: {
      fontSize: '1.125rem',
      fontWeight: '400',
      lineHeight: '1.75',
    },
    normal: {
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    small: {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    xs: {
      fontSize: '0.75rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
  },

  // UI component text
  ui: {
    button: {
      fontSize: '0.875rem',
      fontWeight: '500',
      lineHeight: '1.25',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      lineHeight: '1.25',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: '400',
      lineHeight: '1.25',
    },
  },
};

// Helper functions for typography
export const getTypographyClass = (variant: keyof typeof typography.heading | keyof typeof typography.body | keyof typeof typography.ui) => {
  if (variant in typography.heading) {
    const style = typography.heading[variant as keyof typeof typography.heading];
    return `text-${style.fontSize} font-${style.fontWeight} leading-${style.lineHeight}`;
  }
  
  if (variant in typography.body) {
    const style = typography.body[variant as keyof typeof typography.body];
    return `text-${style.fontSize} font-${style.fontWeight} leading-${style.lineHeight}`;
  }
  
  if (variant in typography.ui) {
    const style = typography.ui[variant as keyof typeof typography.ui];
    return `text-${style.fontSize} font-${style.fontWeight} leading-${style.lineHeight}`;
  }
  
  return '';
};
