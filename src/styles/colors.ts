// Centralized color system for the entire application
export const colors = {
  // Primary brand colors
  brand: {
    primary: '#6F4BF6',
    violet: '#6F4BF6',
    violetLight: '#ECECFB',
    gray: '#8E9196',
    border: '#F0F0F4',
  },

  // Status colors for projects and resources
  status: {
    inProgress: { bg: '#E2F8F0', text: '#0D9488' },
    notStarted: { bg: '#E5DEFF', text: '#6E59A5' },
    completed: { bg: '#E0F2FE', text: '#0EA5E9' },
    onHold: { bg: '#FEF3C7', text: '#D97706' },
    planning: { bg: '#E5DEFF', text: '#6E59A5' },
    default: { bg: '#F3F4F6', text: '#6B7280' },
  },

  // Utilization indicator colors
  utilization: {
    low: { bg: '#10b981', shadow: 'rgba(16,185,129,0.4)' },
    medium: { bg: '#f59e0b', shadow: 'rgba(245,158,11,0.4)' },
    high: { bg: '#ef4444', shadow: 'rgba(239,68,68,0.4)' },
  },

  // Table and grid colors
  table: {
    headerBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    headerText: '#ffffff',
    rowEven: 'rgba(248,250,252,0.3)',
    rowHover: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
    border: '#e2e8f0',
    borderDark: 'rgba(156, 163, 175, 0.6)',
  },

  // Office and section headers
  office: {
    headerBg: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
    headerText: '#ffffff',
    hoverBg: 'linear-gradient(135deg, #4c1d95 0%, #6b21a8 100%)',
  },

  // Weekend and special day styling
  weekend: {
    bg: 'rgba(107, 114, 128, 0.15)',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(156,163,175,0.1) 2px, rgba(156,163,175,0.1) 4px)',
  },

  // Input and form elements
  input: {
    border: '#e2e8f0',
    borderHover: '#a5b4fc',
    borderFocus: '#6366f1',
    bg: '#ffffff',
    bgFocus: '#fafbff',
    shadow: '0 0 0 3px rgba(99,102,241,0.1)',
  },

  // Project area and stage colors (consistent palette)
  projectColors: [
    '#F5A3B3', '#F48F8F', '#F47E63', '#F4A363', '#F4C463',
    '#A8E6A8', '#89CFF0', '#6B8FF9', '#9B87F5', '#FFE082',
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

  // Scrollbar colors - Updated to purple-gray theme
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
