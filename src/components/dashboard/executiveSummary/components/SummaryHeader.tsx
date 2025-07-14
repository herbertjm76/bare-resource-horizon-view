
import React from 'react';
import { DollarSign } from 'lucide-react';

interface SummaryHeaderProps {
  timeRangeText: string;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({ timeRangeText }) => {
  return (
    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
      <div className="p-2 rounded-xl glass-card">
        <DollarSign className="h-6 w-6" />
      </div>
      Executive Summary
      <span className="text-sm font-medium ml-3 glass-card px-3 py-1.5 rounded-full border border-white/20">
        {timeRangeText}
      </span>
    </h2>
  );
};
