
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

// Generate a random distinct color using HSL for better visual variety
export const generateRandomColor = (): string => {
  // Generate hue from 0-360 with good distribution
  const hue = Math.floor(Math.random() * 360);
  
  // Use saturation between 60-80% for vibrant but not overwhelming colors
  const saturation = Math.floor(Math.random() * 20) + 60;
  
  // Use lightness between 45-65% for good contrast on both light and dark backgrounds
  const lightness = Math.floor(Math.random() * 20) + 45;
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
