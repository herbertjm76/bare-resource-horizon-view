
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';
import { ResourceAllocationCell } from '../ResourceAllocationCell';
import { 
  calculateMemberProjectHours, 
  calculateUtilizationPercentage, 
  getUtilizationColor,
  calculateCapacityDisplay
} from '../utils/utilizationCalculations';
import { format, startOfWeek } from 'date-fns';

interface CompactRowViewProps {
  member: any;
  memberIndex: number;
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  otherLeaveData?: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  updateOtherLeave?: (memberId: string, hours: number, notes?: string) => Promise<boolean>;
  onOtherLeaveEdit?: (memberId: string, value: number) => void;
  selectedWeek?: Date;
  viewMode: 'compact' | 'expanded';
}

export const CompactRowView: React.FC<CompactRowViewProps> = React.memo(({
  member,
  memberIndex,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  otherLeaveData = {},
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  updateOtherLeave,
  selectedWeek = new Date(),
}) => {
  const displayName = member.first_name && member.last_name 
    ? `${member.first_name} ${member.last_name}`
    : 'Unknown Member';

  const initials = member.first_name && member.last_name
    ? `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`
    : 'UM';

  const getAvatarUrl = (member: any): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  const { workWeekHours, displayPreference, startOfWorkWeek } = useAppSettings();

  // STANDARDIZED CALCULATIONS - Use the utility functions ONLY
  const weeklyCapacity = member.weekly_capacity || workWeekHours;
  const capacityDisplay = calculateCapacityDisplay(member.id, allocationMap, weeklyCapacity);
  const projectCount = getProjectCount(member.id);

  // Calculate weekStartDate for inline editing
  const weekStartDay = startOfWorkWeek === 'Sunday' ? 0 : startOfWorkWeek === 'Saturday' ? 6 : 1;
  const weekStartDate = format(startOfWeek(selectedWeek, { weekStartsOn: weekStartDay as 0 | 1 | 6 }), 'yyyy-MM-dd');

  const rowBgColor = memberIndex % 2 === 0 ? '#ffffff' : '#f9fafb';

  return (
    <TableRow className="hover:bg-gray-50" style={{ height: '40px' }}>
      {/* Member info column */}
      <TableCell 
        className="sticky left-0 z-20 border-r border-gray-200 text-sm"
        style={{
          backgroundColor: rowBgColor,
          width: '180px',
          minWidth: '180px',
          maxWidth: '180px',
          padding: '4px 8px'
        }}
      >
        <div className="flex items-center gap-1">
          <Avatar className="w-6 h-6">
            <AvatarImage src={getAvatarUrl(member)} alt={displayName} />
            <AvatarFallback className="bg-gradient-modern text-white text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div style={{ flex: '1', minWidth: '0' }}>
            <span className="font-medium text-xs truncate block">
              {displayName}
            </span>
            {'isPending' in member && member.isPending && (
              <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-medium px-1 py-0.5 rounded">
                Pending
              </span>
            )}
          </div>
        </div>
      </TableCell>
      
      {/* Total Hours column with STANDARDIZED utilization percentage */}
      <TableCell 
        className="text-center border-r border-gray-200 text-sm font-medium"
        style={{ 
          width: '80px', 
          minWidth: '80px',
          maxWidth: '80px',
          backgroundColor: '#f8fafc',
          padding: '8px'
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold px-2 py-1 rounded text-gray-800">
            {capacityDisplay.utilizationPercentage}%
          </span>
        </div>
      </TableCell>
      
      {/* Project allocation cells - with inline editing */}
      {projects.map((project) => {
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        
        // Calculate other projects hours for this member
        let otherProjectsHours = 0;
        allocationMap.forEach((h, k) => {
          if (k.startsWith(`${member.id}:`) && k !== key) {
            otherProjectsHours += h;
          }
        });
        
        const leaveHours = (annualLeaveData[member.id] || 0) + (holidaysData[member.id] || 0);
        
        return (
          <TableCell 
            key={project.id} 
            className="text-center border-r border-gray-200 text-sm p-0"
            style={{ 
              width: '50px', 
              minWidth: '50px',
              maxWidth: '50px',
              backgroundColor: rowBgColor,
            }}
          >
            <ResourceAllocationCell
              resourceId={member.id}
              projectId={project.id}
              hours={hours}
              weekStartDate={weekStartDate}
              memberCapacity={weeklyCapacity}
              totalOtherHours={otherProjectsHours}
              leaveHours={leaveHours}
              editable={true}
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
});

CompactRowView.displayName = 'CompactRowView';
