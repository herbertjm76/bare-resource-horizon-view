
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SummaryMetric {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: string;
}

type GradientType = 'purple' | 'blue' | 'emerald' | 'violet';

interface StandardizedExecutiveSummaryProps {
  title?: string;
  timeRangeText?: string;
  metrics: SummaryMetric[];
  gradientType?: GradientType;
}

export const StandardizedExecutiveSummary: React.FC<StandardizedExecutiveSummaryProps> = ({
  metrics,
  gradientType = 'purple'
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
    // Create a subtle gradient with smooth transitions using the specified colors
    return 'bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400';
  };

  return (
    <div className={`${getGradientClass(gradientType)} rounded-2xl p-4`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className="text-xl font-bold text-gray-900 mb-1">{metric.value}</p>
                {metric.subtitle && (
                  <p className="text-xs text-gray-500 mb-1">{metric.subtitle}</p>
                )}
                {metric.badgeText && (
                  <Badge variant={getBadgeVariant(metric.badgeColor)} className="text-xs">
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
