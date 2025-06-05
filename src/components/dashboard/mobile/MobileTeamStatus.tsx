
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-brand-violet to-purple-600">
            <Users className="h-4 w-4 text-white" />
          </div>
          <span className="text-brand-violet font-semibold">
            Staff Status
          </span>
          <Badge variant="brand" className="bg-brand-violet/20 text-brand-violet border-brand-violet/20 ml-auto">
            This Month
          </Badge>
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
