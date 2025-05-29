
// Import centralized color system
import { colors, getProjectColor } from '@/styles/colors';

// Re-export for backward compatibility
export const projectAreaColors = colors.projectColors;
export const defaultProjectAreaColor = colors.defaults.projectArea;

export const getDefaultColor = (color?: string): string => {
  return color || colors.defaults.projectArea;
};

export const isValidColor = (color: string): boolean => {
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return colorRegex.test(color);
};
