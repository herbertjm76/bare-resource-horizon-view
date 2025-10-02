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
      start: '220 100% 60%',
      mid: '280 100% 70%',
      end: '340 100% 70%',
    },
    ocean: {
      start: '200 100% 40%',
      mid: '180 100% 50%',
      end: '160 100% 60%',
    },
    sunset: {
      start: '25 100% 60%',
      mid: '340 100% 65%',
      end: '320 100% 70%',
    },
    forest: {
      start: '140 60% 40%',
      mid: '160 70% 45%',
      end: '180 60% 50%',
    },
    royal: {
      start: '270 80% 50%',
      mid: '280 85% 60%',
      end: '290 80% 65%',
    },
    midnight: {
      start: '230 50% 30%',
      mid: '250 60% 40%',
      end: '270 55% 45%',
    },
  };

  const theme = themes[themeId];
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty('--gradient-start', theme.start);
  root.style.setProperty('--gradient-mid', theme.mid);
  root.style.setProperty('--gradient-end', theme.end);
};
