
import React from 'react';
import { DollarSign } from 'lucide-react';

interface SummaryHeaderProps {
  timeRangeText: string;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({ timeRangeText }) => {
  return (
    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
      <DollarSign className="h-5 w-5" />
      Executive Summary
      <span className="text-sm font-normal ml-2 bg-white/20 px-2 py-0.5 rounded">
        {timeRangeText}
      </span>
    </h2>
  );
};
