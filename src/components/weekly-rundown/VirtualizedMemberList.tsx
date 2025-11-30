import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MemberAvailabilityCard } from './MemberAvailabilityCard';
import { MemberVacationPopover } from './MemberVacationPopover';

interface ProjectAllocation {
  projectId: string;
  projectName: string;
  projectCode: string;
  hours: number;
}

interface AvailableMember {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  allocatedHours: number;
  availableHours: number;
  utilization: number;
  capacity: number;
  projectAllocations: ProjectAllocation[];
  memberType: 'active' | 'pre_registered';
}

interface VirtualizedMemberListProps {
  members: AvailableMember[];
  weekStartDate: string;
  threshold?: number;
}

export const VirtualizedMemberList: React.FC<VirtualizedMemberListProps> = ({
  members,
  weekStartDate,
  threshold = 80,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: members.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated width of each member card
    horizontal: true,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      style={{ width: '100%' }}
    >
      <div
        style={{
          width: `${virtualizer.getTotalSize()}px`,
          height: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const member = members[virtualItem.index];
          const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ') || 'Unknown';

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                transform: `translateX(${virtualItem.start}px)`,
              }}
            >
              <MemberVacationPopover
                memberId={member.id}
                memberName={fullName}
                weekStartDate={weekStartDate}
              >
                <div>
                  <MemberAvailabilityCard
                    avatarUrl={member.avatarUrl}
                    firstName={member.firstName}
                    lastName={member.lastName}
                    allocatedHours={member.allocatedHours}
                    projectAllocations={member.projectAllocations}
                    utilization={member.utilization}
                    threshold={threshold}
                    memberId={member.id}
                    memberType={member.memberType}
                    weekStartDate={weekStartDate}
                  />
                </div>
              </MemberVacationPopover>
            </div>
          );
        })}
      </div>
    </div>
  );
};