
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'danger': return 'text-red-600 bg-red-100';
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
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-muted-foreground">{title}</h2>
      )}
      
      {/* Enhanced container with Team Member Insights Highlight design */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-brand-violet/20 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-violet/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
        
        <CardContent className="relative p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border-2 border-white/40 rounded-xl hover:bg-white/95 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{metric.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        {metric.trend && getTrendIcon(metric.trend)}
                      </div>
                      {metric.subtitle && (
                        <p className="text-xs text-gray-600 mt-2">{metric.subtitle}</p>
                      )}
                    </div>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(metric.status)}`}>
                      {metric.icon}
                    </div>
                  </div>
                  {metric.progress !== undefined && (
                    <Progress value={metric.progress} className="mt-3" />
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
