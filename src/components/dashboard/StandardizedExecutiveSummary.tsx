
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Metric {
  title: string;
  value: string | number | React.ReactNode;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: 'green' | 'blue' | 'orange' | 'red' | 'gray' | 'purple';
}

interface StandardizedExecutiveSummaryProps {
  title?: string;
  timeRangeText?: string;
  metrics: Metric[];
  gradientType?: 'default' | 'purple';
}

export const StandardizedExecutiveSummary: React.FC<StandardizedExecutiveSummaryProps> = ({
  title = "Executive Summary",
  timeRangeText,
  metrics,
  gradientType = 'default'
}) => {
  const getBadgeStyle = (color?: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'orange':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'gray':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const gradientClass = gradientType === 'purple' 
    ? 'bg-gradient-to-br from-purple-50 via-white to-purple-50/30' 
    : 'bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20';

  return (
    <Card className={`${gradientClass} border-0 shadow-sm`}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
          {timeRangeText && (
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {timeRangeText}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Force single row layout on all screen sizes with horizontal scroll if needed */}
        <div className="flex gap-3 overflow-x-auto pb-2 min-w-0">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-100 p-3 min-w-[140px] sm:min-w-[160px]"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600 truncate">
                  {metric.title}
                </p>
                <div className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {metric.value}
                </div>
                {metric.subtitle && (
                  <p className="text-xs text-gray-500 truncate">
                    {metric.subtitle}
                  </p>
                )}
                {metric.badgeText && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs border ${getBadgeStyle(metric.badgeColor)}`}
                  >
                    {metric.badgeText}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
