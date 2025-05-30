
import React from 'react';
import { CheckCircle } from 'lucide-react';

export const EmptyInsightsState: React.FC = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-300" />
      <p className="text-sm font-medium mb-1">All Systems Optimal</p>
      <p className="text-xs">Your team metrics are well-balanced with no immediate concerns.</p>
    </div>
  );
};
