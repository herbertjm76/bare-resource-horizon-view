
import React from 'react';
import { DollarSign } from 'lucide-react';

export const NoFeeBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
      <DollarSign className="h-3 w-3" />
      <span>Not set</span>
    </div>
  );
};
