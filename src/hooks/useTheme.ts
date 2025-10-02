import { useEffect } from 'react';

export const useTheme = () => {
  useEffect(() => {
    // Load and apply saved theme on mount
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      applyThemeById(savedTheme);
    }
  }, []);
};

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
    forest: {
      start: '150 45% 22%',
      mid: '160 50% 28%',
      end: '170 45% 32%',
    },
    crimson: {
      start: '345 70% 25%',
      mid: '355 65% 30%',
      end: '5 60% 32%',
    },
  };

  const theme = themes[themeId];
  if (!theme) return;

  console.log('useTheme: Applying theme on app load:', themeId);
  const root = document.documentElement;
  root.style.setProperty('--gradient-start', theme.start);
  root.style.setProperty('--gradient-mid', theme.mid);
  root.style.setProperty('--gradient-end', theme.end);
};
