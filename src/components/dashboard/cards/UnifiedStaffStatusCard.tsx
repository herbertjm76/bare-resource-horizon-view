
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { StaffSection } from '../staff/StaffSection';
import { categorizeStaff } from '../staff/utils';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { UnifiedDashboardData } from '../hooks/useDashboardData';
import { TimeRange } from '../TimeRangeSelector';

interface UnifiedStaffStatusCardProps {
  data: UnifiedDashboardData;
  selectedTimeRange?: TimeRange;
}

export const UnifiedStaffStatusCard: React.FC<UnifiedStaffStatusCardProps> = ({
  data,
  selectedTimeRange = 'week'
}) => {
  const { atCapacityStaff, optimalStaff, readyStaff } = categorizeStaff(data.transformedStaffData);
  
  // Get time range display text
  const getTimeRangeText = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return 'This Quarter';
      case '4months': return '4 Months';
      case '6months': return '6 Months';
      case 'year': return 'This Year';
      default: return 'Selected Period';
    }
  };

  return (
    <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        {/* Title inside the card */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            Team Status
          </h2>
          <StandardizedHeaderBadge>
            {getTimeRangeText()}
          </StandardizedHeaderBadge>
        </div>

        {/* Direct team member sections without inner container */}
        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            {/* At Capacity Staff (>90%) - Show all members */}
            <StaffSection
              title="At Capacity"
              icon={<Users className="h-4 w-4 text-red-400" strokeWidth={1.5} />}
              members={atCapacityStaff}
              colorScheme="red"
              memberUtilizations={data.memberUtilizations}
              selectedTimeRange={selectedTimeRange}
            />

            {/* Optimally Allocated Staff (66-90%) - Show all members */}
            <StaffSection
              title="Optimally Allocated"
              icon={<Users className="h-4 w-4 text-orange-400" strokeWidth={1.5} />}
              members={optimalStaff}
              colorScheme="orange"
              memberUtilizations={data.memberUtilizations}
              selectedTimeRange={selectedTimeRange}
            />

            {/* Ready for Projects Staff (≤65%) - Show all members, no limit */}
            <StaffSection
              title="Ready for Projects"
              icon={<Users className="h-4 w-4 text-green-400" strokeWidth={1.5} />}
              members={readyStaff}
              colorScheme="green"
              subtitle="available for new work"
              memberUtilizations={data.memberUtilizations}
              selectedTimeRange={selectedTimeRange}
            />

            {/* Show message if no staff data */}
            {data.transformedStaffData.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No team members available
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
