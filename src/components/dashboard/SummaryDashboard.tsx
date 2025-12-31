
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, TrendingDown, Users, Calendar, Clock, Target } from 'lucide-react';

interface SummaryMetric {
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'good' | 'warning' | 'danger' | 'info';
}

interface SummaryDashboardProps {
  title?: string;
  metrics: SummaryMetric[];
  className?: string;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  title,
  metrics,
  className = ""
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'good': return 'text-success bg-success/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'danger': return 'text-destructive bg-destructive/10';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-primary bg-primary/10';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3" />;
      case 'down': return <TrendingDown className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-muted-foreground mb-3">{title}</h2>
      )}
      <Card className="w-full bg-gradient-to-r from-card-gradient-start to-card-gradient-end border-2 border-card-gradient-border rounded-lg shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-white border border-gray-200 rounded-lg h-full">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{metric.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{metric.value}</p>
                        {metric.trend && getTrendIcon(metric.trend)}
                      </div>
                      {metric.subtitle && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{metric.subtitle}</p>
                      )}
                    </div>
                    <div className={`h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center flex-shrink-0 ml-2 ${getStatusColor(metric.status)}`}>
                      <div className="scale-75 sm:scale-100">{metric.icon}</div>
                    </div>
                  </div>
                  {metric.progress !== undefined && (
                    <Progress value={metric.progress} className="mt-2" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
