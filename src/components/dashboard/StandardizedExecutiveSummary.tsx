
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { LucideIcon } from 'lucide-react';

interface Metric {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  badgeText?: string;
  badgeColor?: 'green' | 'blue' | 'purple' | 'red' | 'orange';
}

interface StandardizedExecutiveSummaryProps {
  title?: string;
  timeRangeText?: string;
  metrics: Metric[];
  gradientType?: 'purple' | 'blue' | 'green';
  badgePosition?: 'title' | 'inline';
}

const getMetricColors = (index: number) => {
  const colorSchemes = [
    { bg: 'bg-emerald-50/80', border: 'border-emerald-100/60', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { bg: 'bg-blue-50/80', border: 'border-blue-100/60', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { bg: 'bg-purple-50/80', border: 'border-purple-100/60', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { bg: 'bg-orange-50/80', border: 'border-orange-100/60', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' }
  ];
  return colorSchemes[index % colorSchemes.length];
};

const getBadgeStyle = (color?: string) => {
  switch (color) {
    case 'green':
      return { backgroundColor: '#EDFAE5', color: '#25701B' };
    case 'blue':
      return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
    case 'purple':
      return { backgroundColor: '#F1F0FB', color: '#6E59A5' };
    case 'red':
      return { backgroundColor: '#FFDEE2', color: '#C0392B' };
    case 'orange':
      return { backgroundColor: '#FEF7CD', color: '#856404' };
    default:
      return { backgroundColor: '#F3F4F6', color: '#6B7280' };
  }
};

export const StandardizedExecutiveSummary: React.FC<StandardizedExecutiveSummaryProps> = ({
  title = "Executive Summary",
  timeRangeText,
  metrics,
  gradientType = 'purple',
  badgePosition = 'inline'
}) => {
  const getGradientColors = () => {
    switch (gradientType) {
      case 'blue':
        return 'from-blue-600 to-blue-700';
      case 'green':
        return 'from-emerald-600 to-emerald-700';
      default:
        return 'from-brand-violet to-purple-600';
    }
  };

  return (
    <Card className="w-full bg-white border border-gray-200/60 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getGradientColors()} p-6 text-white relative overflow-hidden rounded-t-2xl`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-3 -translate-x-3"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
                {badgePosition === 'title' && timeRangeText && (
                  <StandardizedBadge
                    variant="status"
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm px-3 py-1"
                  >
                    {timeRangeText}
                  </StandardizedBadge>
                )}
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => {
                const colors = getMetricColors(index);
                return (
                  <Card key={index} className={`${colors.bg} ${colors.border} border rounded-xl p-4`}>
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-2">{metric.title}</p>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                            {badgePosition === 'inline' && metric.badgeText && (
                              <StandardizedBadge
                                variant="status"
                                className="text-xs px-2 py-0.5"
                                style={getBadgeStyle(metric.badgeColor)}
                              >
                                {metric.badgeText}
                              </StandardizedBadge>
                            )}
                          </div>
                          {metric.subtitle && (
                            <p className="text-xs text-gray-600">{metric.subtitle}</p>
                          )}
                        </div>
                        {metric.icon && (
                          <div className={`${colors.iconBg} ${colors.iconColor} p-2 rounded-lg flex-shrink-0`}>
                            <metric.icon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
