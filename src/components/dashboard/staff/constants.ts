
export const STAFF_THRESHOLDS = {
  AT_CAPACITY: 90,
  OPTIMAL_MIN: 65,
  OPTIMAL_MAX: 90,
  READY_MAX: 65,
} as const;

export const COLOR_SCHEMES = {
  red: {
    bg: 'bg-red-50',
    border: 'border-red-100',
    text: 'text-red-700',
    percentage: 'text-red-600',
    progress: 'bg-red-500',
    progressBg: 'bg-red-100',
    avatarBg: 'bg-[#6F4BF6]', // Unified brand color
    avatarText: 'text-white',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-700',
    percentage: 'text-blue-600',
    progress: 'bg-blue-500',
    progressBg: 'bg-blue-100',
    avatarBg: 'bg-[#6F4BF6]', // Unified brand color
    avatarText: 'text-white',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-100',
    text: 'text-green-700',
    percentage: 'text-green-600',
    progress: 'bg-green-500',
    progressBg: 'bg-green-100',
    avatarBg: 'bg-[#6F4BF6]', // Unified brand color
    avatarText: 'text-white',
  },
} as const;
