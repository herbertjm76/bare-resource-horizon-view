
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";

interface SummaryMetric {
  title: string;
  value: string | number;
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
  console.log('StandardizedExecutiveSummary render (simple format only)');

  const getBadgeVariant = (color?: string) => {
    switch (color) {
      case 'red': return 'destructive';
      case 'orange': return 'secondary';
      case 'green': return 'default';
      case 'blue': return 'outline';
      default: return 'outline';
    }
  };

  const getGradientClass = (type: GradientType) => {
    return 'bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400';
  };

  const getGlassMorphismClass = () => {
    return 'bg-white/20 backdrop-blur-md border border-white/30 shadow-elevation-2';
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

  // Simple format - centered cards with standardized styling
  console.log('Rendering simple format');
  return (
    <div className={`${getGradientClass(gradientType)} rounded-2xl p-4`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric, index) => (
          <Card key={index} className={`${getGlassMorphismClass()} transition-all duration-300 hover:bg-white/25 hover:shadow-elevation-3`}>
            <CardContent className="p-3">
              <div className="text-center">
                {/* Title using standardized typography */}
                <Typography variant="body-sm" className="font-semibold text-white/90 mb-2">
                  {metric.title}
                </Typography>
                
                {/* Value using KPI typography */}
                <Typography variant="kpi" className="text-white mb-2">
                  {metric.value}
                </Typography>
                
                {metric.subtitle && (
                  <Typography variant="body-xs" className="text-white/70 mb-2">
                    {metric.subtitle}
                  </Typography>
                )}
                
                {metric.badgeText && (
                  <Badge 
                    variant={getBadgeVariant(metric.badgeColor)} 
                    className={`text-xs text-white backdrop-blur-sm ${getBadgeBackgroundColor(metric.badgeColor, metric.isGood)}`}
                  >
                    {metric.badgeText}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
