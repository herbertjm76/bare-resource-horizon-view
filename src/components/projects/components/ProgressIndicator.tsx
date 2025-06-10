
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, TrendingUp } from 'lucide-react';

interface ProgressIndicatorProps {
  label: string;
  current: number;
  total: number;
  unit?: string;
  variant?: 'hours' | 'budget' | 'progress';
  showPercentage?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  label,
  current,
  total,
  unit = '',
  variant = 'progress',
  showPercentage = true
}) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  
  const getIcon = () => {
    switch (variant) {
      case 'hours': return <Clock className="h-4 w-4" />;
      case 'budget': return <Target className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };
  
  const getVariant = () => {
    if (percentage >= 90) return 'destructive';
    if (percentage >= 75) return 'secondary';
    return 'default';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-sm font-medium">{label}</span>
        </div>
        {showPercentage && (
          <Badge variant={getVariant()}>
            {percentage.toFixed(1)}%
          </Badge>
        )}
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{current.toLocaleString()} {unit}</span>
        <span>{total.toLocaleString()} {unit}</span>
      </div>
    </div>
  );
};
