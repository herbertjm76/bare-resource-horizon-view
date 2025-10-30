/**
 * Generate monochromatic color shades from the current theme color
 * This creates a cohesive color palette that adapts to theme changes
 */
export const generateMonochromaticShades = (projectIndex: number, totalProjects: number): string => {
  // Get the theme primary color from CSS variable
  const themeColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--theme-primary')
    .trim();
  
  // If theme color exists (format: "245 60% 30%")
  if (themeColor) {
    const [hue, saturation] = themeColor.split(' ');
    
    // Generate lightness values from 35% (dark) to 65% (light)
    // Distribute evenly across projects
    const minLightness = 35;
    const maxLightness = 65;
    const lightnessRange = maxLightness - minLightness;
    const lightness = totalProjects > 1 
      ? minLightness + (lightnessRange * projectIndex / (totalProjects - 1))
      : 50; // middle shade if only one project
    
    return `hsl(${hue}, ${saturation}, ${lightness}%)`;
  }
  
  // Fallback to default primary color
  return 'hsl(var(--primary))';
};
