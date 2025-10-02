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
    name: 'Modern Dark',
    description: 'Indigo to violet, high contrast',
    colors: {
      start: '245 60% 30%',
      mid: '275 60% 35%',
      end: '305 60% 38%',
    },
  },
  {
    id: 'corporate',
    name: 'Corporate Blue',
    description: 'Professional dark blue',
    colors: {
      start: '220 60% 28%',
      mid: '225 65% 32%',
      end: '230 70% 36%',
    },
  },
  {
    id: 'slate',
    name: 'Monochrome Slate',
    description: 'Neutral greys',
    colors: {
      start: '220 8% 14%',
      mid: '220 6% 18%',
      end: '220 5% 24%',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Navy to indigo',
    colors: {
      start: '230 50% 22%',
      mid: '250 60% 28%',
      end: '270 55% 32%',
    },
  },
  {
    id: 'forest',
    name: 'Forest Dark',
    description: 'Deep green to teal',
    colors: {
      start: '150 45% 22%',
      mid: '160 50% 28%',
      end: '170 45% 32%',
    },
  },
  {
    id: 'crimson',
    name: 'Crimson Red',
    description: 'Deep red gradient',
    colors: {
      start: '345 70% 25%',
      mid: '355 65% 30%',
      end: '5 60% 32%',
    },
  },
];

export const ThemeTab: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('default');
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('app-theme') || 'default';
    setSelectedTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    console.log('Applying theme:', themeId, theme.colors);
    const root = document.documentElement;
    root.style.setProperty('--gradient-start', theme.colors.start);
    root.style.setProperty('--gradient-mid', theme.colors.mid);
    root.style.setProperty('--gradient-end', theme.colors.end);
    
    // Log to confirm
    console.log('CSS variables set:', {
      start: getComputedStyle(root).getPropertyValue('--gradient-start'),
      mid: getComputedStyle(root).getPropertyValue('--gradient-mid'),
      end: getComputedStyle(root).getPropertyValue('--gradient-end'),
    });
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem('app-theme', themeId);
    setPreviewKey(prev => prev + 1); // Force preview to update
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme & Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of your application with different color themes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Large Live Preview */}
        <div key={previewKey} className="relative overflow-hidden rounded-2xl h-64 bg-gradient-modern shadow-2xl" style={{ ['--gradient-start' as any]: themes.find(t => t.id === selectedTheme)?.colors.start, ['--gradient-mid' as any]: themes.find(t => t.id === selectedTheme)?.colors.mid, ['--gradient-end' as any]: themes.find(t => t.id === selectedTheme)?.colors.end }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <h3 className="text-4xl font-bold text-white drop-shadow-lg">
                {themes.find(t => t.id === selectedTheme)?.name}
              </h3>
              <p className="text-white/90 text-lg drop-shadow">
                Live Preview
              </p>
            </div>
          </div>
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/10 rounded-full blur-3xl animate-float animation-delay-1000"></div>
          </div>
        </div>

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
