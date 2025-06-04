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
  console.log('StandardizedExecutiveSummary render (mobile 2-column grid format)');

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
      default: return 'bg-gray-500/60 border-gray-400/30';
    }
  };

  // Generate default badge and subtitle for cards that don't have them
  const getDefaultBadgeAndSubtitle = (metric: SummaryMetric, index: number) => {
    const title = metric.title.toLowerCase();
    
    // Return existing badge/subtitle if provided
    if (metric.badgeText && metric.subtitle) {
      return { 
        badge: { text: metric.badgeText, color: metric.badgeColor },
        subtitle: metric.subtitle
      };
    }
    
    // Generate contextual badges and subtitles based on metric title
    if (title.includes('utilization')) {
      const numericValue = typeof metric.value === 'number' ? metric.value : 
                          typeof metric.value === 'string' ? parseInt(metric.value) : null;
      
      if (numericValue !== null) {
        if (numericValue > 85) return { 
          badge: { text: 'High', color: 'orange' },
          subtitle: 'Above optimal range'
        };
        if (numericValue > 70) return { 
          badge: { text: 'Optimal', color: 'green' },
          subtitle: 'Healthy utilization'
        };
        return { 
          badge: { text: 'Low', color: 'blue' },
          subtitle: 'Room for more projects'
        };
      }
      return { 
        badge: { text: 'Active', color: 'blue' },
        subtitle: 'Team utilization tracking'
      };
    }
    
    if (title.includes('capacity') || title.includes('hours')) {
      return { 
        badge: { text: 'Available', color: 'blue' },
        subtitle: metric.subtitle || 'Resource capacity'
      };
    }
    
    if (title.includes('projects')) {
      return { 
        badge: { text: 'Active', color: 'green' },
        subtitle: metric.subtitle || 'Current portfolio'
      };
    }
    
    if (title.includes('team') || title.includes('members') || title.includes('size')) {
      return { 
        badge: { text: 'Stable', color: 'green' },
        subtitle: metric.subtitle || 'Team composition'
      };
    }
    
    if (title.includes('offices') || title.includes('locations')) {
      return { 
        badge: { text: 'Multi-Site', color: 'blue' },
        subtitle: metric.subtitle || 'Geographic presence'
      };
    }
    
    if (title.includes('completion') || title.includes('rate')) {
      return { 
        badge: { text: 'On Track', color: 'green' },
        subtitle: metric.subtitle || 'Progress tracking'
      };
    }

    if (title.includes('resourcing')) {
      return { 
        badge: { text: 'Review', color: 'orange' },
        subtitle: metric.subtitle || 'Needs attention'
      };
    }

    if (title.includes('overloaded')) {
      return { 
        badge: { text: 'Alert', color: 'red' },
        subtitle: metric.subtitle || 'Capacity exceeded'
      };
    }
    
    // Default fallback
    return { 
      badge: { text: 'Active', color: 'blue' },
      subtitle: metric.subtitle || 'Current status'
    };
  };

  console.log('Rendering mobile 2-column grid format');
  return (
    <div className="w-full bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-xl p-2 sm:p-3 lg:p-4 border border-purple-100/50 shadow-sm">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {metrics.map((metric, index) => {
          const { badge, subtitle } = getDefaultBadgeAndSubtitle(metric, index);
          
          return (
            <div key={index} className="min-w-0">
              <Card className="bg-white border border-gray-100 rounded-lg transition-all duration-300 hover:shadow-md h-full shadow-sm">
                <CardContent className="p-2 sm:p-2.5">
                  <div className="text-center space-y-1">
                    {/* Line 1: Small status indicator at top */}
                    <div className="flex justify-center">
                      <Badge 
                        variant={getBadgeVariant(badge.color)} 
                        className={`text-[9px] sm:text-[10px] text-white backdrop-blur-sm ${getBadgeBackgroundColor(badge.color, metric.isGood)} px-1 py-0.5 h-4 sm:h-5`}
                      >
                        {badge.text}
                      </Badge>
                    </div>
                    
                    {/* Line 2: Clean title typography */}
                    <Typography variant="body-sm" className="font-medium text-gray-700 text-[10px] sm:text-xs leading-tight px-1">
                      {metric.title}
                    </Typography>
                    
                    {/* Line 3: Prominent value display */}
                    <div className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 leading-none py-0.5">
                      {metric.value}
                    </div>
                    
                    {/* Line 4: Subtle subtitle/context */}
                    <p className="text-[8px] sm:text-[10px] text-gray-500 leading-tight px-1">
                      {subtitle}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
