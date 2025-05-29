
// Import centralized color system
import { colors } from '@/styles/colors';

// Use the same color palette for consistency
export const projectStageColors = colors.projectColors;
export const defaultStageColor = colors.defaults.stage;

export const getDefaultStageColor = (color?: string): string => {
  return color || colors.defaults.stage;
};
