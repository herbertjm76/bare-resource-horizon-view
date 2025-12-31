
// Enhanced Centralized Color System - Uses CSS Variables for Theming
// Note: This file provides JavaScript access to color values that are also defined in index.css

export const colors = {
  // Primary brand colors - uses CSS variable --brand-primary (hsl(239, 84%, 67%))
  brand: {
    primary: 'hsl(var(--brand-primary))',
    violet: 'hsl(var(--brand-primary))',
    violetLight: 'hsl(var(--brand-accent))',
    gray: 'hsl(var(--muted-foreground))',
    border: 'hsl(var(--border))',
  },

  // Semantic color tokens
  semantic: {
    // Text colors
    text: {
      primary: 'hsl(var(--foreground))',
      secondary: 'hsl(var(--muted-foreground))',
      tertiary: 'hsl(var(--muted-foreground) / 0.7)',
      inverse: 'hsl(var(--primary-foreground))',
      brand: 'hsl(var(--brand-primary))',
    },
    
    // Background colors
    background: {
      primary: 'hsl(var(--background))',
      secondary: 'hsl(var(--muted))',
      tertiary: 'hsl(var(--accent))',
      accent: 'hsl(var(--brand-accent))',
      inverse: 'hsl(var(--foreground))',
    },
    
    // Border colors
    border: {
      primary: 'hsl(var(--border))',
      secondary: 'hsl(var(--border) / 0.8)',
      accent: 'hsl(var(--brand-primary))',
      focus: 'hsl(var(--ring))',
    },
    
    // State colors - using semantic CSS variables
    state: {
      success: {
        primary: 'hsl(var(--success))',
        background: 'hsl(var(--success) / 0.1)',
        border: 'hsl(var(--success) / 0.3)',
        text: 'hsl(var(--success-foreground))',
      },
      warning: {
        primary: 'hsl(var(--warning))',
        background: 'hsl(var(--warning) / 0.1)',
        border: 'hsl(var(--warning) / 0.3)',
        text: 'hsl(var(--warning-foreground))',
      },
      error: {
        primary: 'hsl(var(--destructive))',
        background: 'hsl(var(--destructive) / 0.1)',
        border: 'hsl(var(--destructive) / 0.3)',
        text: 'hsl(var(--destructive-foreground))',
      },
      info: {
        primary: 'hsl(var(--info))',
        background: 'hsl(var(--info) / 0.1)',
        border: 'hsl(var(--info) / 0.3)',
        text: 'hsl(var(--info-foreground))',
      },
    },
  },

  // Status colors for projects and resources
  status: {
    inProgress: { bg: 'hsl(var(--success) / 0.15)', text: 'hsl(var(--success))' },
    notStarted: { bg: 'hsl(var(--brand-accent))', text: 'hsl(var(--brand-primary))' },
    completed: { bg: 'hsl(var(--info) / 0.15)', text: 'hsl(var(--info))' },
    onHold: { bg: 'hsl(var(--warning) / 0.15)', text: 'hsl(var(--warning))' },
    planning: { bg: 'hsl(var(--brand-accent))', text: 'hsl(var(--brand-primary))' },
    default: { bg: 'hsl(var(--muted))', text: 'hsl(var(--muted-foreground))' },
  },

  // Utilization indicator colors
  utilization: {
    low: { bg: 'hsl(var(--success))', shadow: 'hsl(var(--success) / 0.4)' },
    medium: { bg: 'hsl(var(--warning))', shadow: 'hsl(var(--warning) / 0.4)' },
    high: { bg: 'hsl(var(--destructive))', shadow: 'hsl(var(--destructive) / 0.4)' },
  },

  // Component-specific colors
  components: {
    // Card colors
    card: {
      background: 'hsl(var(--card))',
      border: 'hsl(var(--border))',
      shadow: 'hsl(var(--foreground) / 0.1)',
    },
    
    // Button colors
    button: {
      primary: {
        background: 'hsl(var(--primary))',
        hover: 'hsl(var(--primary) / 0.9)',
        text: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        background: 'hsl(var(--secondary))',
        hover: 'hsl(var(--secondary) / 0.8)',
        text: 'hsl(var(--secondary-foreground))',
      },
    },
    
    // Input colors
    input: {
      background: 'hsl(var(--background))',
      border: 'hsl(var(--input))',
      borderHover: 'hsl(var(--brand-primary))',
      borderFocus: 'hsl(var(--ring))',
      placeholder: 'hsl(var(--muted-foreground))',
    },
  },

  // Table and grid colors - using CSS variables
  table: {
    headerBg: 'linear-gradient(135deg, hsl(var(--gradient-start)) 0%, hsl(var(--gradient-end)) 100%)',
    headerText: 'hsl(var(--header-foreground))',
    rowEven: 'hsl(var(--brand-accent) / 0.5)',
    rowHover: 'linear-gradient(90deg, hsl(var(--brand-accent) / 0.5) 0%, hsl(var(--brand-accent) / 0.7) 100%)',
    border: 'hsl(var(--border))',
    borderDark: 'hsl(var(--muted-foreground) / 0.6)',
  },

  // Office and section headers
  office: {
    headerBg: 'linear-gradient(135deg, hsl(var(--gradient-start)) 0%, hsl(var(--gradient-end)) 100%)',
    headerText: 'hsl(var(--header-foreground))',
    hoverBg: 'linear-gradient(135deg, hsl(var(--gradient-start) / 0.9) 0%, hsl(var(--gradient-end) / 0.9) 100%)',
  },

  // Weekend and special day styling
  weekend: {
    bg: 'hsl(var(--muted-foreground) / 0.15)',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 2px, hsl(var(--muted-foreground) / 0.1) 2px, hsl(var(--muted-foreground) / 0.1) 4px)',
  },

  // Project area and stage colors (consistent palette)
  projectColors: [
    '#F5A3B3', '#F48F8F', '#F47E63', '#F4A363', '#F4C463',
    '#A8E6A8', '#89CFF0', '#6465F0', '#9B87F5', '#FFE082',
    '#89E6CF', '#7ECFD6', '#FFF3D4', '#D2C0A7', '#FFE566'
  ],

  // Default colors
  defaults: {
    projectArea: 'hsl(var(--brand-accent))',
    stage: 'hsl(var(--brand-accent))',
  },

  // Badge and pill colors
  badges: {
    projectHours: {
      bg: 'hsl(var(--foreground))',
      border: 'hsl(var(--foreground) / 0.8)',
      text: 'hsl(var(--background))',
    },
    summary: {
      blue: { bg: 'from-blue-50 to-blue-100/50', border: 'blue-200', text: 'blue-600', textDark: 'blue-800' },
      emerald: { bg: 'from-emerald-50 to-emerald-100/50', border: 'emerald-200', text: 'emerald-600', textDark: 'emerald-800' },
      violet: { bg: 'from-violet-50 to-violet-100/50', border: 'violet-200', text: 'violet-600', textDark: 'violet-800' },
    },
  },

  // Scrollbar colors
  scrollbar: {
    track: 'hsl(var(--muted))',
    trackGradient: 'linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted) / 0.9) 100%)',
    thumb: 'hsl(var(--muted-foreground) / 0.5)',
    thumbGradient: 'linear-gradient(90deg, hsl(var(--muted-foreground) / 0.5) 0%, hsl(var(--muted-foreground) / 0.7) 100%)',
    thumbHover: 'hsl(var(--muted-foreground) / 0.7)',
    thumbHoverGradient: 'linear-gradient(90deg, hsl(var(--muted-foreground) / 0.7) 0%, hsl(var(--muted-foreground) / 0.9) 100%)',
  },
};

// Helper functions for color usage
export const getStatusColor = (status: string) => {
  const normalizedStatus = status.replace(/\s+/g, '').toLowerCase();
  
  switch (normalizedStatus) {
    case 'inprogress':
      return colors.status.inProgress;
    case 'notstarted':
      return colors.status.notStarted;
    case 'completed':
      return colors.status.completed;
    case 'onhold':
      return colors.status.onHold;
    case 'planning':
      return colors.status.planning;
    default:
      return colors.status.default;
  }
};

export const getUtilizationColor = (level: 'low' | 'medium' | 'high') => {
  return colors.utilization[level];
};

export const getProjectColor = (index: number) => {
  return colors.projectColors[index % colors.projectColors.length];
};

export const getDefaultColor = (color?: string) => {
  return color || colors.defaults.projectArea;
};

// Semantic color helpers
export const getSemanticColor = (category: keyof typeof colors.semantic, variant: string) => {
  const categoryColors = colors.semantic[category] as any;
  return categoryColors[variant] || categoryColors.primary;
};
