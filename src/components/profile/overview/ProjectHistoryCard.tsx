
import React from 'react';
import { Card } from '@/components/ui/card';

export const ProjectHistoryCard: React.FC = () => {
  return (
    <Card className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Project History</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
            <div className="min-w-0">
              <h4 className="text-xs font-medium text-gray-900 truncate">Project Delta</h4>
              <p className="text-xs text-gray-600">March 2025</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-gray-900">127h</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
            <div className="min-w-0">
              <h4 className="text-xs font-medium text-gray-900 truncate">Project Echo</h4>
              <p className="text-xs text-gray-600">January 2025</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-gray-900">89h</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
            <div className="min-w-0">
              <h4 className="text-xs font-medium text-gray-900 truncate">Project Foxtrot</h4>
              <p className="text-xs text-gray-600">December 2024</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-gray-900">156h</p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-900">Total Hours</p>
              <p className="text-sm font-bold text-gray-900">445h</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
