
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Clock, FolderKanban } from 'lucide-react';
import { useWeeklyOverviewMetrics } from './WeeklyOverviewMetrics';

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

  // Map colors to exact badge styles from the image
  const getBadgeClasses = (badgeColor?: string, isGood?: boolean) => {
    if (isGood === true) return 'bg-green-500 text-white';
    if (isGood === false) return 'bg-red-500 text-white';
    
    switch (badgeColor) {
      case 'green': return 'bg-green-500 text-white';
      case 'red': return 'bg-red-500 text-white';
      case 'orange': return 'bg-orange-500 text-white';
      case 'blue': return 'bg-blue-500 text-white';
      case 'yellow': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  // Get icon for each metric with purple color
  const getIcon = (metric: any) => {
    const title = metric.title.toLowerCase();
    if (title.includes('utilization')) return FolderKanban;
    if (title.includes('projects')) return FolderKanban;
    if (title.includes('members') || title.includes('team')) return Users;
    if (title.includes('hours') || title.includes('available')) return Clock;
    return TrendingUp;
  };

  return (
    <div className="print:hidden mb-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = getIcon(metric);
          
          return (
            <Card key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-brand-violet/10">
                    <IconComponent className="h-4 w-4 text-brand-violet" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{metric.title}</span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  {metric.badgeText && (
                    <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeClasses(metric.badgeColor, metric.isGood)}`}>
                      {metric.badgeText}
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">{metric.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
