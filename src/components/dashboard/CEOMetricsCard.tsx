
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { StandardizedBadge } from "@/components/ui/standardized-badge";

interface CEOMetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  status?: 'good' | 'warning' | 'danger' | 'info';
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage?: number;
  };
}

export const CEOMetricsCard: React.FC<CEOMetricsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  status = 'info',
  trend
}) => {
  const getStatusColors = () => {
    switch (status) {
      case 'good': return 'bg-white text-gray-900';
      case 'warning': return 'bg-white text-gray-900';
      case 'danger': return 'bg-white text-gray-900';
      default: return 'bg-white text-gray-900';
    }
  };

  const getIconColors = () => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'danger': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <Card className={`rounded-2xl border-0 shadow-sm ${getStatusColors()} transition-all hover:shadow-md`}>
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
            {subtitle && (
              <p className="text-xs font-medium text-gray-500 mb-1">{subtitle}</p>
            )}
            {trend && (
              <StandardizedBadge variant="status" className="text-xs">
                {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}
                {trend.percentage && ` ${trend.percentage}%`}
              </StandardizedBadge>
            )}
          </div>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ml-2 ${getIconColors()}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
