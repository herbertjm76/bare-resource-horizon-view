
import React, { useState } from 'react';
import { StaffSectionProps } from './types';
import { StaffMemberCard } from './StaffMemberCard';
import { StaffAllocationDialog } from './StaffAllocationDialog';
import { useStaffAllocations } from './useStaffAllocations';
import { TimeRange } from '../TimeRangeSelector';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getMemberCapacity } from '@/utils/capacityUtils';
import { logger } from '@/utils/logger';

export const StaffSection: React.FC<StaffSectionProps & { selectedTimeRange?: TimeRange }> = ({
  title,
  icon,
  members,
  colorScheme,
  showLimit,
  subtitle,
  memberUtilizations,
  selectedTimeRange
}) => {
  const { workWeekHours } = useAppSettings();
  const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Use the actual member ID from the selected member
  const memberId = selectedMember ? 
    // Check if it's a regular team member with an id property
    ('id' in selectedMember ? selectedMember.id : 
     // Or if it's from invites, try to find the actual member ID
     selectedMember.first_name && selectedMember.last_name ? 
     `${selectedMember.first_name}_${selectedMember.last_name}` : null) : null;

  const { allocations, isLoading } = useStaffAllocations(memberId, selectedTimeRange);

  const handleMemberClick = (member: typeof members[0]) => {
    logger.debug('Selected member:', member);
    setSelectedMember(member);
    setDialogOpen(true);
  };

  // Find utilization data for the selected member
  const selectedMemberUtilization = selectedMember && memberUtilizations ? 
    memberUtilizations.find(u => u.memberId === selectedMember.id) : null;

  // Show all members unless showLimit is specifically set
  const membersToShow = showLimit ? members.slice(0, showLimit) : members;
  const remainingCount = showLimit && members.length > showLimit ? members.length - showLimit : 0;

  if (members.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="font-medium text-sm text-gray-700">
          {title} ({members.length})
          {subtitle && <span className="text-gray-500 font-normal"> - {subtitle}</span>}
        </h4>
      </div>
      
      <div className="space-y-2">
        {membersToShow.map((member, index) => (
          <StaffMemberCard
            key={index}
            member={member}
            colorScheme={colorScheme}
            onClick={() => handleMemberClick(member)}
          />
        ))}
        
        {remainingCount > 0 && (
          <div className="text-xs text-gray-500 text-center py-2">
            +{remainingCount} more members
          </div>
        )}
      </div>

      <StaffAllocationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={selectedMember}
        allocations={allocations}
        isLoading={isLoading}
        weeklyCapacity={getMemberCapacity(selectedMember?.weekly_capacity, workWeekHours)}
        utilizationRate={selectedMember?.availability}
        selectedTimeRange={selectedTimeRange}
      />
    </div>
  );
};
