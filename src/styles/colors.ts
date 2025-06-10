
// Enhanced Centralized Color System with Semantic Tokens
export const colors = {
  // Primary brand colors - standardized to #6465F0
  brand: {
    primary: '#6465F0',
    violet: '#6465F0',
    violetLight: '#ECECFB',
    gray: '#8E9196',
    border: '#F0F0F4',
  },

  // Semantic color tokens
  semantic: {
    // Text colors
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
      brand: '#6465F0',
    },
    
    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      accent: '#ECECFB',
      inverse: '#1F2937',
    },
    
    // Border colors
    border: {
      primary: '#E5E7EB',
      secondary: '#D1D5DB',
      accent: '#6465F0',
      focus: '#6465F0',
    },
    
    // State colors
    state: {
      success: {
        primary: '#10B981',
        background: '#D1FAE5',
        border: '#6EE7B7',
        text: '#065F46',
      },
      warning: {
        primary: '#F59E0B',
        background: '#FEF3C7',
        border: '#FCD34D',
        text: '#92400E',
      },
      error: {
        primary: '#EF4444',
        background: '#FEE2E2',
        border: '#FCA5A5',
        text: '#991B1B',
      },
      info: {
        primary: '#3B82F6',
        background: '#DBEAFE',
        border: '#93C5FD',
        text: '#1E40AF',
      },
    },
  },

  // Status colors for projects and resources
  status: {
    inProgress: { bg: '#E2F8F0', text: '#0D9488' },
    notStarted: { bg: '#E5DEFF', text: '#6465F0' },
    completed: { bg: '#E0F2FE', text: '#0EA5E9' },
    onHold: { bg: '#FEF3C7', text: '#D97706' },
    planning: { bg: '#E5DEFF', text: '#6465F0' },
    default: { bg: '#F3F4F6', text: '#6B7280' },
  },

  // Utilization indicator colors
  utilization: {
    low: { bg: '#10b981', shadow: 'rgba(16,185,129,0.4)' },
    medium: { bg: '#f59e0b', shadow: 'rgba(245,158,11,0.4)' },
    high: { bg: '#ef4444', shadow: 'rgba(239,68,68,0.4)' },
  },

  // Component-specific colors
  components: {
    // Card colors
    card: {
      background: '#FFFFFF',
      border: '#E5E7EB',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    
    // Button colors
    button: {
      primary: {
        background: '#6465F0',
        hover: '#5D3FD3',
        text: '#FFFFFF',
      },
      secondary: {
        background: '#F3F4F6',
        hover: '#E5E7EB',
        text: '#374151',
      },
    },
    
    // Input colors
    input: {
      background: '#FFFFFF',
      border: '#D1D5DB',
      borderHover: '#6465F0',
      borderFocus: '#6465F0',
      placeholder: '#9CA3AF',
    },
  },

  // Table and grid colors - updated with unified brand color
  table: {
    headerBg: 'linear-gradient(135deg, #6465F0 0%, #8b5cf6 100%)',
    headerText: '#ffffff',
    rowEven: '#D2C6FB',
    rowHover: 'linear-gradient(90deg, #D2C6FB 0%, #C4B5F7 100%)',
    border: '#e2e8f0',
    borderDark: 'rgba(156, 163, 175, 0.6)',
  },

  // Office and section headers - standardized to unified brand color
  office: {
    headerBg: 'linear-gradient(135deg, #6465F0 0%, #7c3aed 100%)',
    headerText: '#ffffff',
    hoverBg: 'linear-gradient(135deg, #5D3FD3 0%, #6b21a8 100%)',
  },

  // Weekend and special day styling
  weekend: {
    bg: 'rgba(107, 114, 128, 0.15)',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(156,163,175,0.1) 2px, rgba(156,163,175,0.1) 4px)',
  },

  // Project area and stage colors (consistent palette with unified brand color)
  projectColors: [
    '#F5A3B3', '#F48F8F', '#F47E63', '#F4A363', '#F4C463',
    '#A8E6A8', '#89CFF0', '#6465F0', '#9B87F5', '#FFE082',
    '#89E6CF', '#7ECFD6', '#FFF3D4', '#D2C0A7', '#FFE566'
  ],

  // Default colors
  defaults: {
    projectArea: '#E5DEFF',
    stage: '#E5DEFF',
  },

  // Badge and pill colors
  badges: {
    projectHours: {
      bg: '#1f2937',
      border: '#374151',
      text: '#ffffff',
    },
    summary: {
      blue: { bg: 'from-blue-50 to-blue-100/50', border: 'blue-200', text: 'blue-600', textDark: 'blue-800' },
      emerald: { bg: 'from-emerald-50 to-emerald-100/50', border: 'emerald-200', text: 'emerald-600', textDark: 'emerald-800' },
      violet: { bg: 'from-violet-50 to-violet-100/50', border: 'violet-200', text: 'violet-600', textDark: 'violet-800' },
    },
  },

  // Scrollbar colors
  scrollbar: {
    track: '#f1f5f9',
    trackGradient: 'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 100%)',
    thumb: '#94a3b8',
    thumbGradient: 'linear-gradient(90deg, #94a3b8 0%, #6b7280 100%)',
    thumbHover: '#64748b',
    thumbHoverGradient: 'linear-gradient(90deg, #64748b 0%, #4b5563 100%)',
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
