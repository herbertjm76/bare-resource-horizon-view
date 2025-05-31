
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Metric {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: string;
}

interface StandardizedExecutiveSummaryProps {
  title?: string;
  timeRangeText?: string;
  metrics: Metric[];
  gradientType?: 'blue' | 'purple' | 'green';
}

export const StandardizedExecutiveSummary: React.FC<StandardizedExecutiveSummaryProps> = ({
  title = "Executive Summary",
  timeRangeText,
  metrics,
  gradientType = 'blue'
}) => {
  const getGradient = () => {
    switch (gradientType) {
      case 'purple':
        return 'linear-gradient(45deg, #895CF7 0%, #5669F7 55%, #E64FC4 100%)';
      case 'green':
        return 'linear-gradient(45deg, #10B981 0%, #059669 55%, #047857 100%)';
      default:
        return 'linear-gradient(45deg, #3B82F6 0%, #1D4ED8 55%, #1E40AF 100%)';
    }
  };

  const getBadgeVariant = (color?: string) => {
    switch (color) {
      case 'red': return 'destructive';
      case 'orange': return 'secondary';
      case 'green': return 'default';
      case 'blue': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="mb-3 relative">
      {/* Glass morphism background container with reduced height */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0" style={{ background: getGradient() }} />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
        
        {/* Top highlight gradient - reduced height */}
        <div className="absolute inset-x-0 top-0 h-12 bg-[radial-gradient(120%_30%_at_50%_0%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_70%)]" />
        
        <div className="relative z-10 p-3">
          {/* Header with reduced padding */}
          {timeRangeText && (
            <div className="mb-2">
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <p className="text-xs text-white/80">{timeRangeText}</p>
            </div>
          )}
          
          {/* Metrics grid with reduced gap and padding */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/80">{metric.title}</div>
                    {metric.badgeText && (
                      <Badge 
                        variant={getBadgeVariant(metric.badgeColor)} 
                        className="text-xs h-4 px-1.5"
                      >
                        {metric.badgeText}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xl font-bold text-white">{metric.value}</div>
                  {metric.subtitle && (
                    <div className="text-xs text-white/70">{metric.subtitle}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
