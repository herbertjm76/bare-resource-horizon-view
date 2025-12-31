/**
 * @fileoverview Theme color generation utilities
 * 
 * Utilities for generating cohesive color palettes based on the current theme.
 * Used primarily for data visualization (charts, graphs) to maintain
 * visual consistency with the application theme.
 * 
 * @module utils/themeColorUtils
 * 
 * @example
 * ```ts
 * import { generateMonochromaticShades } from '@/utils/themeColorUtils';
 * 
 * // Generate colors for 5 projects in a chart
 * const projects = ['A', 'B', 'C', 'D', 'E'];
 * const colors = projects.map((_, i) => 
 *   generateMonochromaticShades(i, projects.length)
 * );
 * // Returns: ['hsl(245, 60%, 35%)', 'hsl(245, 60%, 42.5%)', ...]
 * ```
 */

/**
 * Generate monochromatic color shades from the current theme color
 * 
 * Creates a cohesive color palette by varying the lightness of the theme's
 * primary color. This ensures charts and visualizations always match the
 * current theme, whether light, dark, or custom branded.
 * 
 * @param projectIndex - Zero-based index of the current item in the series
 * @param totalProjects - Total number of items that need distinct colors
 * @returns HSL color string (e.g., 'hsl(245, 60%, 50%)')
 * 
 * @remarks
 * - Reads the --theme-primary CSS variable from :root
 * - Generates lightness values from 35% (darkest) to 65% (lightest)
 * - Falls back to `hsl(var(--primary))` if theme color is not available
 * - Single item gets 50% lightness (middle of range)
 * 
 * @example
 * ```ts
 * // For a bar chart with 3 categories
 * const color1 = generateMonochromaticShades(0, 3); // Darkest
 * const color2 = generateMonochromaticShades(1, 3); // Middle
 * const color3 = generateMonochromaticShades(2, 3); // Lightest
 * 
 * // For a single item, gets middle shade
 * const singleColor = generateMonochromaticShades(0, 1); // 50% lightness
 * ```
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
