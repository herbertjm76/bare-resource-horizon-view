import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ConfidenceBadgeProps {
  confidence?: number;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  if (!confidence) return null;

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'bg-green-500/10 text-green-700 dark:text-green-400';
    if (conf >= 0.5) return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 0.8) return 'High';
    if (conf >= 0.5) return 'Medium';
    return 'Low';
  };

  return (
    <Badge 
      variant="secondary" 
      className={`text-xs ${getConfidenceColor(confidence)}`}
    >
      {getConfidenceLabel(confidence)} ({Math.round(confidence * 100)}%)
    </Badge>
  );
};
