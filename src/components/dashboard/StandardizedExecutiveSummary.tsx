
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";

interface SummaryMetric {
  title: string;
  value: string | number | React.ReactNode;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: string;
  isGood?: boolean;
}

type GradientType = 'purple' | 'blue' | 'emerald' | 'violet';

interface StandardizedExecutiveSummaryProps {
  title?: string;
  timeRangeText?: string;
  metrics: SummaryMetric[];
  gradientType?: GradientType;
  cardOpacity?: number;
}

export const StandardizedExecutiveSummary: React.FC<StandardizedExecutiveSummaryProps> = ({
  metrics,
  gradientType = 'purple',
  cardOpacity = 0.9
}) => {
  console.log('StandardizedExecutiveSummary render (enhanced design format)');

  const getBadgeVariant = (color?: string) => {
    switch (color) {
      case 'red': return 'destructive';
      case 'orange': return 'secondary';
      case 'green': return 'default';
      case 'blue': return 'outline';
      default: return 'outline';
    }
  };

  const getBadgeBackgroundColor = (badgeColor?: string, isGood?: boolean) => {
    // Use indicator color for good/bad
    if (isGood === true) return 'bg-green-500/80 border-green-400/40';
    if (isGood === false) return 'bg-red-500/80 border-red-400/40';
    
    // Fallback to badge color
    switch (badgeColor) {
      case 'green': return 'bg-green-500/80 border-green-400/40';
      case 'red': return 'bg-red-500/80 border-red-400/40';
      case 'orange': return 'bg-orange-500/80 border-orange-400/40';
      case 'blue': return 'bg-blue-500/80 border-blue-400/40';
      default: return 'bg-white/20 border-white/30';
    }
  };

  // Generate default badge for cards that don't have one
  const getDefaultBadge = (metric: SummaryMetric, index: number) => {
    if (metric.badgeText) return { text: metric.badgeText, color: metric.badgeColor };
    
    // Generate contextual badges based on metric title
    const title = metric.title.toLowerCase();
    
    if (title.includes('utilization')) {
      // Only perform numeric comparison if value is a number or string that can be parsed
      const numericValue = typeof metric.value === 'number' ? metric.value : 
                          typeof metric.value === 'string' ? parseInt(metric.value) : null;
      
      if (numericValue !== null) {
        if (numericValue > 85) return { text: 'High', color: 'orange' };
        if (numericValue > 70) return { text: 'Good', color: 'green' };
        return { text: 'Low', color: 'blue' };
      }
      return { text: 'Active', color: 'blue' };
    }
    
    if (title.includes('capacity')) {
      return { text: 'Available', color: 'blue' };
    }
    
    if (title.includes('projects')) {
      return { text: 'Active', color: 'green' };
    }
    
    if (title.includes('team') || title.includes('members') || title.includes('size')) {
      return { text: 'Stable', color: 'green' };
    }
    
    if (title.includes('offices') || title.includes('locations')) {
      return { text: 'Multi-Site', color: 'blue' };
    }
    
    if (title.includes('completion') || title.includes('rate')) {
      return { text: 'On Track', color: 'green' };
    }
    
    // Default fallback
    return { text: 'Active', color: 'blue' };
  };

  console.log('Rendering enhanced design format');
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-brand-violet/20 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-violet/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
      
      <CardContent className="relative p-6">
        <div className="flex flex-wrap gap-6">
          {metrics.map((metric, index) => {
            const badge = getDefaultBadge(metric, index);
            
            return (
              <div key={index} className="flex-1 min-w-0">
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/40 rounded-xl transition-all duration-300 hover:shadow-lg hover:bg-white/95">
                  <CardContent className="p-6">
                    <div className="text-center">
                      {/* Title - gray-800, medium weight */}
                      <Typography variant="body-sm" className="font-medium text-gray-800 mb-2">
                        {metric.title}
                      </Typography>
                      
                      {/* Value - bold, 4xl, gray-900 */}
                      <div className="text-4xl font-bold text-gray-900 mb-3">
                        {metric.value}
                      </div>
                      
                      {/* Colored status pill */}
                      <Badge 
                        variant={getBadgeVariant(badge.color)} 
                        className={`text-xs text-white backdrop-blur-sm ${getBadgeBackgroundColor(badge.color, metric.isGood)}`}
                      >
                        {badge.text}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
