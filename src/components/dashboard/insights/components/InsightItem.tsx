
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { InsightData } from '../types';

interface InsightItemProps {
  insight: InsightData;
}

export const InsightItem: React.FC<InsightItemProps> = ({ insight }) => {
  const Icon = insight.icon;
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/50">
      <div className={`p-1.5 rounded-full flex-shrink-0 ${
        insight.type === 'critical' ? 'bg-red-100' :
        insight.type === 'warning' ? 'bg-orange-100' :
        insight.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
      }`}>
        <Icon className={`h-4 w-4 ${
          insight.type === 'critical' ? 'text-red-600' :
          insight.type === 'warning' ? 'text-orange-600' :
          insight.type === 'success' ? 'text-green-600' : 'text-blue-600'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm text-gray-900">
            {insight.title}
          </h4>
          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
            {insight.category}
          </Badge>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {insight.description}
        </p>
      </div>
    </div>
  );
};
