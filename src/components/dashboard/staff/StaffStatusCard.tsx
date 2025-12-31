
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, AlertTriangle, Target } from 'lucide-react';
import { StaffStatusCardProps } from './types';
import { StaffSection } from './StaffSection';
import { categorizeStaff } from './utils';
import { TimeRange } from '../TimeRangeSelector';
import { logger } from '@/utils/logger';

interface ExtendedStaffStatusCardProps extends StaffStatusCardProps {
  selectedTimeRange: TimeRange;
}

export const StaffStatusCard: React.FC<ExtendedStaffStatusCardProps> = ({ 
  staffData, 
  selectedTimeRange 
}) => {
  // Debug logging
  useEffect(() => {
    logger.debug('=== STAFF STATUS CARD UPDATE ===');
    logger.debug('Staff data received:', staffData.length);
    logger.debug('Selected time range:', selectedTimeRange);
    logger.debug('Staff members with availability:', staffData.map(s => ({ 
      name: s.name, 
      availability: s.availability 
    })));
    logger.debug('=== END STAFF STATUS CARD ===');
  }, [staffData, selectedTimeRange]);

  const { atCapacityStaff, optimalStaff, readyStaff } = categorizeStaff(staffData);

  // Get time range display text
  const getTimeRangeText = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return 'This Quarter';
      default: return 'Selected Period';
    }
  };

  return (
    <Card className="h-[400px] flex flex-col bg-card border-border shadow-sm">
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="p-2 rounded-lg bg-theme-primary/10">
            <Users className="h-5 w-5 text-theme-primary" strokeWidth={1.5} />
          </div>
          <span className="text-theme-primary font-semibold">Staff Status</span>
          <StandardizedBadge variant="secondary" size="sm">
            {getTimeRangeText()}
          </StandardizedBadge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-6 px-6 pb-6">
            {/* At Capacity Staff (>90%) - Pastel Red for critical status */}
            <StaffSection
              title="At Capacity"
              icon={<AlertTriangle className="h-4 w-4 text-red-400" strokeWidth={1.5} />}
              members={atCapacityStaff}
              colorScheme="red"
            />

            {/* Optimally Allocated Staff (66-90%) - Pastel Orange for warning status */}
            <StaffSection
              title="Optimally Allocated"
              icon={<Target className="h-4 w-4 text-orange-400" strokeWidth={1.5} />}
              members={optimalStaff}
              colorScheme="orange"
            />

            {/* Ready for Projects Staff (≤65%) - Pastel Green for good status */}
            <StaffSection
              title="Ready for Projects"
              icon={<Target className="h-4 w-4 text-green-400" strokeWidth={1.5} />}
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
