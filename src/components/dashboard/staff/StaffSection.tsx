
import React, { useState } from 'react';
import { StaffSectionProps } from './types';
import { StaffMemberCard } from './StaffMemberCard';
import { StaffAllocationDialog } from './StaffAllocationDialog';
import { useStaffAllocations } from './useStaffAllocations';

export const StaffSection: React.FC<StaffSectionProps> = ({
  title,
  icon,
  members,
  colorScheme,
  showLimit,
  subtitle
}) => {
  const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { allocations, isLoading } = useStaffAllocations(selectedMember?.first_name && selectedMember?.last_name ? 
    // We need the actual member ID, but for now we'll use a placeholder
    selectedMember.name : null
  );

  const handleMemberClick = (member: typeof members[0]) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

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
        weeklyCapacity={40} // Default capacity, you might want to get this from member data
      />
    </div>
  );
};
