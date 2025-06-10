
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Clock, FolderKanban } from 'lucide-react';
import { useWeeklyOverviewMetrics } from './WeeklyOverviewMetrics';
import { UtilizationCalculationService } from '@/services/utilizationCalculationService';

interface WeeklyExecutiveSummaryProps {
  selectedWeek: Date;
}

export const WeeklyExecutiveSummary: React.FC<WeeklyExecutiveSummaryProps> = ({
  selectedWeek
}) => {
  const { metrics, isLoading } = useWeeklyOverviewMetrics({ selectedWeek });

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  // Map colors to Tailwind classes
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'orange':
        return 'bg-orange-100 text-orange-800';
      case 'red':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get icon for each metric
  const getIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('utilization')) return TrendingUp;
    if (lowerTitle.includes('projects')) return FolderKanban;
    if (lowerTitle.includes('members') || lowerTitle.includes('team')) return Users;
    if (lowerTitle.includes('hours') || lowerTitle.includes('available')) return Clock;
    return TrendingUp;
  };

  return (
    <div className="print:hidden mb-4 w-full">
      <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Weekly Overview Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => {
              const IconComponent = getIcon(metric.title);
              const iconColor = metric.title.toLowerCase().includes('utilization') ? 'text-purple-600' :
                               metric.title.toLowerCase().includes('projects') ? 'text-green-600' :
                               metric.title.toLowerCase().includes('members') ? 'text-blue-600' :
                               'text-orange-600';
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-4 w-4 ${iconColor}`} />
                    <span className="text-sm font-medium text-gray-700">{metric.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                    {metric.badgeText && (
                      <Badge className={`text-xs ${getColorClasses(metric.badgeColor || 'gray')}`}>
                        {metric.badgeText}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{metric.subtitle}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
