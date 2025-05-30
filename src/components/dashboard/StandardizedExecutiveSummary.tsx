
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

interface StandardizedExecutiveSummaryProps {
  title?: string;
  timeRangeText?: string;
  metrics: SummaryMetric[];
  gradientType?: GradientType;
  useDetailedFormat?: boolean;
  cardOpacity?: number;
}

export const StandardizedExecutiveSummary: React.FC<StandardizedExecutiveSummaryProps> = ({
  metrics,
  gradientType = 'purple',
  useDetailedFormat = false,
  cardOpacity = 0.9
}) => {
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

  const getNumberColorClass = (metric: SummaryMetric) => {
    if (metric.isGood === true) {
      return 'text-green-600';
    } else if (metric.isGood === false) {
      return 'text-red-600';
    }
    return 'text-gray-900';
  };

  const getGlassMorphismClass = () => {
    return 'bg-white/20 backdrop-blur-md border border-white/30 shadow-lg';
  };

  if (useDetailedFormat) {
    return (
      <div className={`${getGradientClass(gradientType)} rounded-2xl p-4`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className={`${getGlassMorphismClass()} transition-all duration-300 hover:bg-white/25 hover:shadow-xl`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header with icon and title */}
                    <div className="flex items-center gap-2">
                      {Icon && (
                        <div className="w-6 h-6 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white/80" />
                        </div>
                      )}
                      <p className="text-xs font-medium text-white/80">{metric.title}</p>
                    </div>
                    
                    {/* Main value */}
                    <div>
                      <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                    </div>
                    
                    {/* Breakdowns */}
                    {metric.breakdowns && (
                      <div className="space-y-1">
                        {metric.breakdowns.map((breakdown, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                breakdown.color === 'green' ? 'bg-green-400' :
                                breakdown.color === 'orange' ? 'bg-orange-400' :
                                breakdown.color === 'red' ? 'bg-red-400' :
                                'bg-blue-400'
                              }`} />
                              <span className="text-white/70">{breakdown.label}</span>
                            </div>
                            <span className="text-white font-medium">{breakdown.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Badge */}
                    {metric.badgeText && (
                      <div className="flex justify-end">
                        <Badge 
                          variant={getBadgeVariant(metric.badgeColor)} 
                          className="text-xs bg-red-500/80 text-white border-0 backdrop-blur-sm"
                        >
                          {metric.badgeText}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Original format for dashboard with glass morphism
  return (
    <div className={`${getGradientClass(gradientType)} rounded-2xl p-4`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric, index) => (
          <Card key={index} className={`${getGlassMorphismClass()} transition-all duration-300 hover:bg-white/25 hover:shadow-xl`}>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xs font-medium text-white/80 mb-1">{metric.title}</p>
                <p className={`text-3xl font-bold mb-1 ${
                  metric.isGood === true ? 'text-green-100' :
                  metric.isGood === false ? 'text-red-100' :
                  'text-white'
                }`}>
                  {metric.value}
                </p>
                {metric.subtitle && (
                  <p className="text-xs text-white/70 mb-1">{metric.subtitle}</p>
                )}
                {metric.badgeText && (
                  <Badge 
                    variant={getBadgeVariant(metric.badgeColor)} 
                    className="text-xs bg-white/20 text-white border border-white/30 backdrop-blur-sm"
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
