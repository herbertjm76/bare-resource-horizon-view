
import React from 'react';
import { Card } from '@/components/ui/card';

interface CapacityCardProps {
  profile: any;
}

export const CapacityCard: React.FC<CapacityCardProps> = ({ profile }) => {
  return (
    <Card className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Current Capacity</h3>
        
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">Weekly Capacity</p>
            <p className="text-xl font-bold text-gray-900">{profile.weekly_capacity || 40}h</p>
          </div>

          <div className="space-y-1.5">
            <div>
              <p className="text-xs text-gray-500">This Week</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-xs font-medium">30h</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">This Month</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-xs font-medium">136h</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">This Quarter</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <span className="text-xs font-medium">468h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
