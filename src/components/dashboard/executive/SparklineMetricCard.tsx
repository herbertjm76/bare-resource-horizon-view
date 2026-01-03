import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface SparklineMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number[]; // Array of values for sparkline
  status?: 'good' | 'warning' | 'danger';
  badge?: string;
}

export const SparklineMetricCard: React.FC<SparklineMetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = [],
  status = 'good',
  badge
}) => {
  const getBadgeVariant = () => {
    switch (status) {
      case 'danger': return 'destructive';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'danger': return 'hsl(var(--destructive))';
      case 'warning': return 'hsl(var(--warning))';
      default: return 'hsl(var(--primary))';
    }
  };

  // Simple sparkline SVG
  const renderSparkline = () => {
    if (!trend.length) return null;
    
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;
    const width = 100;
    const height = 24;
    
    const points = trend.map((val, idx) => {
      const x = (idx / (trend.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="mt-2">
        <polyline
          points={points}
          fill="none"
          stroke={getStatusColor()}
          strokeWidth="2"
          opacity="0.6"
        />
      </svg>
    );
  };

  return (
    <Card className="rounded-2xl border-border/50 bg-card hover:shadow-md transition-shadow h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 min-h-[2rem]">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1 min-h-[1rem]">{subtitle}</p>
            )}
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 ml-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <div className="mt-auto">
          {badge && (
            <Badge variant={getBadgeVariant()} className="text-xs mb-2">
              {badge}
            </Badge>
          )}
          
          <div className="h-[24px]">
            {renderSparkline()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
