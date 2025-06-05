
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, AlertTriangle, Target } from 'lucide-react';
import { StaffStatusCardProps } from './types';
import { StaffSection } from './StaffSection';
import { categorizeStaff } from './utils';
import { TimeRange } from '../TimeRangeSelector';

interface ExtendedStaffStatusCardProps extends StaffStatusCardProps {
  selectedTimeRange: TimeRange;
}

export const StaffStatusCard: React.FC<ExtendedStaffStatusCardProps> = ({ 
  staffData, 
  selectedTimeRange 
}) => {
  // Debug logging
  useEffect(() => {
    console.log('=== STAFF STATUS CARD UPDATE ===');
    console.log('Staff data received:', staffData.length);
    console.log('Selected time range:', selectedTimeRange);
    console.log('Staff members with availability:', staffData.map(s => ({ 
      name: s.name, 
      availability: s.availability 
    })));
    console.log('=== END STAFF STATUS CARD ===');
  }, [staffData, selectedTimeRange]);

  const { atCapacityStaff, optimalStaff, readyStaff } = categorizeStaff(staffData);

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
    <Card className="h-[400px] flex flex-col bg-gradient-to-br from-gray-50 to-white border-gray-200/50">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-brand-violet" strokeWidth={1.5} />
          <span className="text-brand-violet font-semibold">Staff Status</span>
          <span className="text-sm font-normal ml-2 bg-gray-100 px-2 py-0.5 rounded">
            {getTimeRangeText()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-6 px-6 pb-6">
            {/* At Capacity Staff (>90%) */}
            <StaffSection
              title="At Capacity"
              icon={<AlertTriangle className="h-4 w-4 text-red-500" strokeWidth={1.5} />}
              members={atCapacityStaff}
              colorScheme="red"
            />

            {/* Optimally Allocated Staff (66-90%) */}
            <StaffSection
              title="Optimally Allocated"
              icon={<Target className="h-4 w-4 text-blue-500" strokeWidth={1.5} />}
              members={optimalStaff}
              colorScheme="blue"
            />

            {/* Ready for Projects Staff (≤65%) */}
            <StaffSection
              title="Ready for Projects"
              icon={<Target className="h-4 w-4 text-green-500" strokeWidth={1.5} />}
              members={readyStaff}
              colorScheme="green"
              showLimit={4}
              subtitle="available for new work"
            />

            {/* Show message if no staff data */}
            {staffData.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No staff data available
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
