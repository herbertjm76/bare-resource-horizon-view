
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { LucideIcon } from 'lucide-react';

interface SummaryMetric {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: string;
  isGood?: boolean;
  icon?: LucideIcon;
  breakdowns?: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
}

type GradientType = 'purple' | 'blue' | 'emerald' | 'violet';
type CardFormat = 'simple' | 'detailed';

interface StandardizedExecutiveSummaryProps {
  title?: string;
  timeRangeText?: string;
  metrics: SummaryMetric[];
  gradientType?: GradientType;
  cardFormat?: CardFormat;
  /** @deprecated Use cardFormat instead. Will be removed in future versions. */
  useDetailedFormat?: boolean;
  cardOpacity?: number;
}

export const StandardizedExecutiveSummary: React.FC<StandardizedExecutiveSummaryProps> = ({
  metrics,
  gradientType = 'purple',
  cardFormat = 'simple',
  useDetailedFormat = false,
  cardOpacity = 0.9
}) => {
  // Determine the actual format to use
  const actualFormat: CardFormat = cardFormat || (useDetailedFormat ? 'detailed' : 'simple');

  console.log('StandardizedExecutiveSummary render:', { cardFormat, useDetailedFormat, actualFormat });

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

  const getBreakdownBulletColor = (color?: string) => {
    switch (color) {
      case 'green': return 'bg-green-400';
      case 'orange': return 'bg-orange-400';
      case 'red': return 'bg-red-400';
      case 'blue': return 'bg-blue-400';
      default: return 'bg-white/60';
    }
  };

  if (actualFormat === 'detailed') {
    console.log('Rendering detailed format');
    return (
      <div className={`${getGradientClass(gradientType)} rounded-2xl p-4`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className={`${getGlassMorphismClass()} transition-all duration-300 hover:bg-white/25 hover:shadow-elevation-3`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    {/* Left side: Icon and Title */}
                    <div className="flex items-center gap-2 flex-1">
                      {Icon && (
                        <div className="w-7 h-7 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white/90" />
                        </div>
                      )}
                      <Typography variant="body-sm" className="font-semibold text-white/90">
                        {metric.title}
                      </Typography>
                    </div>
                    
                    {/* Right side: Main value */}
                    <div className="text-right">
                      <Typography variant="h4" className="text-white">
                        {metric.value}
                      </Typography>
                    </div>
                  </div>
                  
                  {/* Bottom section: Breakdowns with colored bullets */}
                  {metric.breakdowns && (
                    <div className="flex items-center justify-between gap-3">
                      {metric.breakdowns.map((breakdown, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${getBreakdownBulletColor(breakdown.color)}`} />
                          <div className="flex flex-col">
                            <Typography variant="body-xs" className="text-white/70">
                              {breakdown.label}
                            </Typography>
                            <Typography variant="body-xs" className="text-white font-medium">
                              {breakdown.value}
                            </Typography>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Badge with colored background */}
                  {metric.badgeText && (
                    <div className="flex justify-end mt-3">
                      <Badge 
                        variant={getBadgeVariant(metric.badgeColor)} 
                        className={`text-xs text-white backdrop-blur-sm ${getBadgeBackgroundColor(metric.badgeColor, metric.isGood)}`}
                      >
                        {metric.badgeText}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

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
