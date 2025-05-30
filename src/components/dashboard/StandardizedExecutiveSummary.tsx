
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  cardFormat = 'simple', // Default to simple
  useDetailedFormat = false,
  cardOpacity = 0.9
}) => {
  // Determine the actual format to use
  // Priority: cardFormat prop > useDetailedFormat prop (for backward compatibility)
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
    return 'bg-white/15 backdrop-blur-xl border border-white/20 shadow-xl';
  };

  const getBreakdownColorClass = (color?: string) => {
    switch (color) {
      case 'green': return 'bg-emerald-400/90';
      case 'orange': return 'bg-amber-400/90';
      case 'red': return 'bg-red-400/90';
      case 'blue': return 'bg-blue-400/90';
      default: return 'bg-slate-400/90';
    }
  };

  const getBadgeClass = (color?: string) => {
    switch (color) {
      case 'red': return 'bg-red-500/90 text-white border-red-400/30 shadow-lg';
      case 'orange': return 'bg-amber-500/90 text-white border-amber-400/30 shadow-lg';
      case 'green': return 'bg-emerald-500/90 text-white border-emerald-400/30 shadow-lg';
      case 'blue': return 'bg-blue-500/90 text-white border-blue-400/30 shadow-lg';
      default: return 'bg-slate-500/90 text-white border-slate-400/30 shadow-lg';
    }
  };

  if (actualFormat === 'detailed') {
    console.log('Rendering detailed format');
    return (
      <div className={`${getGradientClass(gradientType)} rounded-2xl p-4`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className={`${getGlassMorphismClass()} transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:scale-[1.02]`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    {/* Left side: Icon and Title */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {Icon && (
                        <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg backdrop-blur-sm">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white/95 leading-tight">{metric.title}</p>
                      </div>
                    </div>
                    
                    {/* Right side: Main value */}
                    <div className="text-right ml-2">
                      <p className="text-2xl font-bold text-white leading-none">{metric.value}</p>
                    </div>
                  </div>
                  
                  {/* Bottom section: Breakdowns in horizontal layout */}
                  {metric.breakdowns && (
                    <div className="flex items-center justify-between gap-3 mb-3">
                      {metric.breakdowns.map((breakdown, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs min-w-0 flex-1">
                          <div className={`w-2.5 h-2.5 rounded-full ${getBreakdownColorClass(breakdown.color)} shadow-sm flex-shrink-0`} />
                          <div className="min-w-0 flex-1">
                            <div className="text-white/80 font-medium leading-tight truncate">{breakdown.label}</div>
                            <div className="text-white font-semibold text-sm leading-tight">{breakdown.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Badge */}
                  {metric.badgeText && (
                    <div className="flex justify-end">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-semibold border-0 backdrop-blur-sm ${getBadgeClass(metric.badgeColor)}`}
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

  // Simple format - centered cards with improved styling
  console.log('Rendering simple format');
  return (
    <div className={`${getGradientClass(gradientType)} rounded-2xl p-4`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className={`${getGlassMorphismClass()} transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:scale-[1.02]`}>
            <CardContent className="p-5">
              <div className="text-center space-y-3">
                <p className="text-sm font-semibold text-white/95">{metric.title}</p>
                <p className={`text-3xl font-bold leading-none ${
                  metric.isGood === true ? 'text-emerald-200' :
                  metric.isGood === false ? 'text-red-200' :
                  'text-white'
                }`}>
                  {metric.value}
                </p>
                {metric.subtitle && (
                  <p className="text-sm text-white/80 font-medium">{metric.subtitle}</p>
                )}
                {metric.badgeText && (
                  <Badge 
                    variant="outline"
                    className={`text-xs font-semibold border-0 backdrop-blur-sm ${getBadgeClass(metric.badgeColor)}`}
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
