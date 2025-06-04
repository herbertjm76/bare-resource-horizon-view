
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { StaffStatusCard } from '../staff/StaffStatusCard';
import { TimeRange } from '../TimeRangeSelector';

interface MobileTeamStatusProps {
  transformedStaffData: any[];
  selectedTimeRange: TimeRange;
}

export const MobileTeamStatus: React.FC<MobileTeamStatusProps> = ({
  transformedStaffData,
  selectedTimeRange
}) => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <span className="truncate font-medium">Team Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <StaffStatusCard 
          staffData={transformedStaffData} 
          selectedTimeRange={selectedTimeRange}
        />
      </CardContent>
    </Card>
  );
};
