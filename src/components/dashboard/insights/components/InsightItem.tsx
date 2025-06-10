
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { InsightData } from '../types';

interface InsightItemProps {
  insight: InsightData;
}

// Pastel colors for status card backgrounds
const getSeverityCardStyle = (type: string) => {
  switch (type) {
    case 'critical': return 'bg-gradient-to-r from-red-50 to-red-100 border-[3px] border-red-200'; // Pastel red
    case 'warning': return 'bg-gradient-to-r from-orange-50 to-orange-100 border-[3px] border-orange-200'; // Pastel orange
    case 'success': return 'bg-gradient-to-r from-green-50 to-green-100 border-[3px] border-green-200'; // Pastel green
    case 'info': return 'bg-gradient-to-r from-blue-50 to-blue-100 border-[3px] border-blue-200'; // Brand blue
    default: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-[3px] border-gray-200';
  }
};

export const InsightItem: React.FC<InsightItemProps> = ({ insight }) => {
  const Icon = insight.icon;
  
  return (
    <div className={`flex items-start gap-3 p-6 rounded-xl shadow-sm transition-all hover:shadow-md ${getSeverityCardStyle(insight.type)}`}>
      <div className={`p-2 rounded-full flex-shrink-0 ${
        insight.type === 'critical' ? 'bg-red-100' : // Pastel red
        insight.type === 'warning' ? 'bg-orange-100' : // Pastel orange
        insight.type === 'success' ? 'bg-green-100' : 'bg-blue-100' // Pastel green/blue
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
          <Badge variant="outline" className="text-xs px-2 py-1">
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
