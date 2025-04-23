
// Color palette for project stages - using same as project areas for consistency
export const projectStageColors = [
  // Row 1
  '#F5A3B3', '#F48F8F', '#F47E63', '#F4A363', '#F4C463',
  // Row 2
  '#A8E6A8', '#89CFF0', '#6B8FF9', '#9B87F5', '#FFE082',
  // Row 3
  '#89E6CF', '#7ECFD6', '#FFF3D4', '#D2C0A7', '#FFE566'
];

export const defaultStageColor = '#E5DEFF';

export const getDefaultStageColor = (color?: string): string => {
  return color || defaultStageColor;
};
