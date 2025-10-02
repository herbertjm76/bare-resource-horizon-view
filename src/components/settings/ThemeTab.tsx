import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

type Theme = {
  id: string;
  name: string;
  description: string;
  colors: {
    start: string;
    mid: string;
    end: string;
  };
};

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Modern Gradient',
    description: 'Blue, purple, and pink mesh',
    colors: {
      start: '220 100% 60%',
      mid: '280 100% 70%',
      end: '340 100% 70%',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blue to turquoise',
    colors: {
      start: '200 100% 40%',
      mid: '180 100% 50%',
      end: '160 100% 60%',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange to pink',
    colors: {
      start: '25 100% 60%',
      mid: '340 100% 65%',
      end: '320 100% 70%',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep green to emerald',
    colors: {
      start: '140 60% 40%',
      mid: '160 70% 45%',
      end: '180 60% 50%',
    },
  },
  {
    id: 'royal',
    name: 'Royal Purple',
    description: 'Deep purple to violet',
    colors: {
      start: '270 80% 50%',
      mid: '280 85% 60%',
      end: '290 80% 65%',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark blue to indigo',
    colors: {
      start: '230 50% 30%',
      mid: '250 60% 40%',
      end: '270 55% 45%',
    },
  },
];

export const ThemeTab: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('default');

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('app-theme') || 'default';
    setSelectedTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--gradient-start', theme.colors.start);
    root.style.setProperty('--gradient-mid', theme.colors.mid);
    root.style.setProperty('--gradient-end', theme.colors.end);
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem('app-theme', themeId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme & Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of your application with different color themes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className="relative group"
            >
              <div
                className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                  selectedTheme === theme.id
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-border hover:border-primary/50 hover:scale-102'
                }`}
              >
                {/* Gradient Preview */}
                <div
                  className="h-32 w-full"
                  style={{
                    background: `linear-gradient(135deg, 
                      hsl(${theme.colors.start}) 0%, 
                      hsl(${theme.colors.mid}) 50%, 
                      hsl(${theme.colors.end}) 100%)`,
                  }}
                />
                
                {/* Theme Info */}
                <div className="p-4 bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">{theme.name}</h3>
                    {selectedTheme === theme.id && (
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
