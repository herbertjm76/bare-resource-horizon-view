
import React from 'react';
import { Target } from 'lucide-react';

export const EmptyInsightsState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-green-50 border border-green-200 rounded-lg m-6">
      <div className="text-center">
        <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-green-900 mb-1">All Systems Running Smoothly</h3>
        <p className="text-xs text-green-700">Team utilization and project load are well-balanced.</p>
      </div>
    </div>
  );
};
