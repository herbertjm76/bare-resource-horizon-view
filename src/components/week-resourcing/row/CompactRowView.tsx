
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

  // Get total hours for this member
  const totalHours = getMemberTotal(member.id);
  const projectCount = getProjectCount(member.id);
  
  // Calculate all leave hours
  const annualLeave = annualLeaveData[member.id] || 0;
  const holidayHours = holidaysData[member.id] || 0;
  const otherLeave = otherLeaveData[member.id] || 0;
  
  // Total used hours (project + leave)
  const totalUsedHours = totalHours + annualLeave + holidayHours + otherLeave;
  const weeklyCapacity = member.weekly_capacity || 40;
  
  // Calculate utilization percentage
  const utilizationPercentage = weeklyCapacity > 0 ? (totalUsedHours / weeklyCapacity) * 100 : 0;

  console.log(`CompactRowView for ${displayName}:`, {
    memberId: member.id,
    projectsCount: projects.length,
    allocationMapSize: allocationMap?.size || 0,
    totalUsedHours,
    projectCount
  });

  const rowBgColor = memberIndex % 2 === 0 ? '#ffffff' : '#f9fafb';

  return (
    <TableRow className="hover:bg-gray-50">
      {/* Member info column */}
      <TableCell 
        className="sticky left-0 z-20 border-r border-gray-200 text-sm"
        style={{
          backgroundColor: rowBgColor,
          width: '180px',
          minWidth: '180px',
          maxWidth: '180px',
          padding: '8px 12px'
        }}
      >
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={getAvatarUrl(member)} alt={displayName} />
            <AvatarFallback style={{ backgroundColor: '#6366f1', color: 'white', fontSize: '11px' }}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div style={{ flex: '1', minWidth: '0' }}>
            <span className="font-medium text-sm truncate block">
              {displayName}
            </span>
            {'isPending' in member && member.isPending && (
              <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded mt-1">
                Pending
              </span>
            )}
          </div>
        </div>
      </TableCell>
      
      {/* Total Hours column */}
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
        <span className="font-semibold text-sm">
          {totalHours}h
        </span>
      </TableCell>
      
      {/* Project allocation cells */}
      {projects.map((project) => {
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        
        return (
          <TableCell 
            key={project.id} 
            className="text-center border-r border-gray-200 text-sm"
            style={{ 
              width: '35px', 
              minWidth: '35px',
              maxWidth: '35px',
              backgroundColor: rowBgColor,
              padding: '4px'
            }}
          >
            {hours > 0 ? (
              <div 
                className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium bg-blue-100 text-blue-800"
                title={`${hours}h allocated to ${project.code || project.name}`}
              >
                {hours}
              </div>
            ) : (
              <span className="text-gray-300 text-xs">—</span>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
});

CompactRowView.displayName = 'CompactRowView';
