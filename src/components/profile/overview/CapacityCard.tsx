
import React from 'react';
import { Card } from '@/components/ui/card';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getMemberCapacity } from '@/utils/capacityUtils';

interface CapacityCardProps {
  profile: any;
}

export const CapacityCard: React.FC<CapacityCardProps> = ({ profile }) => {
  const { workWeekHours } = useAppSettings();
  const weeklyCapacity = getMemberCapacity(profile.weekly_capacity, workWeekHours);
  
  return (
    <Card className="bg-card border-2 border-border rounded-xl p-4 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Capacity</h3>
        
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Weekly Capacity</p>
            <p className="text-xl font-bold text-foreground">{weeklyCapacity}h</p>
          </div>

          <div className="space-y-1.5">
            <div>
              <p className="text-xs text-muted-foreground">This Week</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-xs font-medium">30h</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">This Month</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-xs font-medium">136h</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">This Quarter</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5">
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
