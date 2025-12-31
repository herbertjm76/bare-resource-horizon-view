import { useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { logger } from '@/utils/logger';

// Define applyThemeById FIRST so it can be used by other functions
export const applyThemeById = (themeId: string) => {
  const themes: Record<string, { start: string; mid: string; end: string }> = {
    default: {
      start: '245 60% 30%',
      mid: '275 60% 35%',
      end: '305 60% 38%',
    },
    corporate: {
      start: '220 60% 28%',
      mid: '225 65% 32%',
      end: '230 70% 36%',
    },
    slate: {
      start: '220 8% 14%',
      mid: '220 6% 18%',
      end: '220 5% 24%',
    },
    midnight: {
      start: '230 50% 22%',
      mid: '250 60% 28%',
      end: '270 55% 32%',
    },
    lightgrey: {
      start: '220 12% 35%',
      mid: '220 10% 48%',
      end: '220 8% 65%',
    },
    teal: {
      start: '180 70% 22%',
      mid: '185 65% 32%',
      end: '190 60% 45%',
    },
  };

  const theme = themes[themeId];
  if (!theme) return;

  logger.info('useTheme: Applying theme on app load:', themeId);
  const root = document.documentElement;
  root.style.setProperty('--gradient-start', theme.start);
  root.style.setProperty('--gradient-mid', theme.mid);
  root.style.setProperty('--gradient-end', theme.end);
  
  // Set theme color for buttons and UI elements (using mid color)
  root.style.setProperty('--theme-primary', theme.mid);
  root.style.setProperty('--theme-border', theme.start);
};

// Apply theme immediately on module load to prevent flash
const applyInitialTheme = () => {
  const savedTheme = localStorage.getItem('app-theme') || 'default';
  applyThemeById(savedTheme);
};

// Run immediately when module loads
if (typeof window !== 'undefined') {
  applyInitialTheme();
}

export const useTheme = () => {
  const { company } = useCompany();
  
  useEffect(() => {
    // Apply theme from company database, or fallback to localStorage, then default
    const companyTheme = company?.theme;
    const localTheme = localStorage.getItem('app-theme');
    const themeToApply = companyTheme || localTheme || 'default';
    
    logger.info('useTheme: Applying theme:', { companyTheme, localTheme, themeToApply });
    
    // Only apply if different from current
    if (themeToApply !== localTheme) {
      applyThemeById(themeToApply);
      localStorage.setItem('app-theme', themeToApply);
    }
    
    // Keep localStorage in sync for offline use
    if (companyTheme && companyTheme !== localTheme) {
      localStorage.setItem('app-theme', companyTheme);
    }
  }, [company]);
};
