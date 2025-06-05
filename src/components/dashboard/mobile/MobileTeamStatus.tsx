
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { StaffStatusCard } from '../staff/StaffStatusCard';
import { TimeRange } from '../TimeRangeSelector';
import { StandardizedHeaderBadge } from './components/StandardizedHeaderBadge';

interface MobileTeamStatusProps {
  transformedStaffData: any[];
  selectedTimeRange: TimeRange;
}

export const MobileTeamStatus: React.FC<MobileTeamStatusProps> = ({
  transformedStaffData,
  selectedTimeRange
}) => {
  const getTimeRangeText = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return 'This Quarter';
      case '4months': return '4 Months';
      case '6months': return '6 Months';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="text-lg flex items-center gap-3">
          <Users className="h-5 w-5 text-brand-violet" strokeWidth={1.5} />
          <span className="text-brand-violet font-semibold">
            Staff Status
          </span>
          <StandardizedHeaderBadge>
            {getTimeRangeText()}
          </StandardizedHeaderBadge>
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
