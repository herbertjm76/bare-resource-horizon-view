
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const CurrentProjectsCard: React.FC = () => {
  return (
    <Card className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Current Projects</h3>
        
        <div className="space-y-2">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-medium text-gray-900">Project Alpha</h4>
              <Badge variant="outline" className="text-xs py-0 px-1">Active</Badge>
            </div>
            <p className="text-xs text-gray-600">Due: June 15, 2025</p>
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-blue-200 rounded-full h-1">
                  <div className="bg-blue-600 h-1 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-xs font-medium">60%</span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-medium text-gray-900">Project Beta</h4>
              <Badge variant="outline" className="text-xs py-0 px-1">Planning</Badge>
            </div>
            <p className="text-xs text-gray-600">Due: July 30, 2025</p>
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-green-200 rounded-full h-1">
                  <div className="bg-green-600 h-1 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-xs font-medium">25%</span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-medium text-gray-900">Project Gamma</h4>
              <Badge variant="outline" className="text-xs py-0 px-1">Review</Badge>
            </div>
            <p className="text-xs text-gray-600">Due: June 8, 2025</p>
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-orange-200 rounded-full h-1">
                  <div className="bg-orange-600 h-1 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="text-xs font-medium">95%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
