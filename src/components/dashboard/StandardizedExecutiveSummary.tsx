
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, Briefcase } from 'lucide-react';
import { TeamSizeCard } from './executiveSummary/components/TeamSizeCard';

interface Metric {
  title: string;
  value: string | number | React.ReactNode;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: 'red' | 'orange' | 'green' | 'blue' | 'purple' | string;
  customData?: {
    activeResources?: number;
    totalTeamMembers?: number;
    preRegisteredCount?: number;
    utilizationRate?: number;
  };
  icon?: React.ComponentType<any>;
}

interface StandardizedExecutiveSummaryProps {
  title?: string;
  timeRangeText?: string;
  metrics: Metric[];
  badgePosition?: 'title' | 'metric';
  gradientType?: 'blue' | 'purple' | 'green';
}

const getMetricIcon = (title: string) => {
  switch (title.toLowerCase()) {
    case 'team utilization':
      return TrendingUp;
    case 'team size':
      return Users;
    case 'available capacity':
    case 'over capacity':
      return Clock;
    case 'active projects':
      return Briefcase;
    default:
      return TrendingUp;
  }
};

const getBadgeVariant = (color?: string) => {
  switch (color) {
    case 'red': return 'destructive';
    case 'green': return 'default';
    case 'orange': return 'secondary';
    case 'blue': return 'outline';
    case 'purple': return 'outline';
    default: return 'outline';
  }
};

const getBadgeClass = (color?: string) => {
  switch (color) {
    case 'red': return 'border-red-200 bg-red-50 text-red-800';
    case 'green': return 'border-green-200 bg-green-50 text-green-800';
    case 'orange': return 'border-orange-200 bg-orange-50 text-orange-800';
    case 'blue': return 'border-blue-200 bg-blue-50 text-blue-800';
    case 'purple': return 'border-purple-200 bg-purple-50 text-purple-800';
    default: return '';
  }
};

const getGradientClass = (type: string = 'blue') => {
  switch (type) {
    case 'purple':
      return 'bg-gradient-to-br from-purple-50 via-purple-25 to-white';
    case 'green':
      return 'bg-gradient-to-br from-green-50 via-green-25 to-white';
    case 'blue':
    default:
      return 'bg-gradient-to-br from-blue-50 via-blue-25 to-white';
  }
};

export const StandardizedExecutiveSummary: React.FC<StandardizedExecutiveSummaryProps> = ({
  title = "Summary",
  timeRangeText,
  metrics,
  badgePosition = 'metric',
  gradientType = 'blue'
}) => {
  return (
    <Card className={`rounded-2xl border-2 border-zinc-300 shadow-sm mb-4 lg:mb-6 ${getGradientClass(gradientType)}`}>
      <CardContent className="p-3 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary">
            {title}
          </h2>
          {badgePosition === 'title' && timeRangeText && (
            <Badge variant="outline" className="text-xs sm:text-sm bg-white/60">
              {timeRangeText}
            </Badge>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {metrics.map((metric, index) => {
            // Use custom TeamSizeCard for team size metric
            if (metric.title === "Team Size" && metric.customData) {
              return (
                <TeamSizeCard
                  key={index}
                  activeResources={metric.customData.activeResources || 0}
                  utilizationRate={metric.customData.utilizationRate || 0}
                  totalTeamMembers={metric.customData.totalTeamMembers}
                  preRegisteredCount={metric.customData.preRegisteredCount}
                />
              );
            }

            // Standard metric card for other metrics
            const IconComponent = metric.icon || getMetricIcon(metric.title);
            
            return (
              <Card key={index} className="rounded-2xl border-0 shadow-sm bg-white">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-600 mb-1">{metric.title}</p>
                      <div className="text-2xl font-bold text-gray-900 mb-0.5">
                        {typeof metric.value === 'string' || typeof metric.value === 'number' ? (
                          metric.value
                        ) : (
                          metric.value
                        )}
                      </div>
                      {metric.subtitle && (
                        <p className="text-xs font-medium text-gray-500 mb-1">{metric.subtitle}</p>
                      )}
                      {badgePosition === 'metric' && metric.badgeText && (
                        <Badge 
                          variant={getBadgeVariant(metric.badgeColor)} 
                          className={`text-xs ${getBadgeClass(metric.badgeColor)}`}
                        >
                          {metric.badgeText}
                        </Badge>
                      )}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 ml-2">
                      <IconComponent className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
