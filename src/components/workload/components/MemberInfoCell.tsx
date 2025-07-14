import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TeamMember } from '@/components/dashboard/types';

interface MemberInfoCellProps {
  member: TeamMember;
  memberIndex: number;
  shouldCenterAlign?: boolean;
}

export const MemberInfoCell: React.FC<MemberInfoCellProps> = ({
  member,
  memberIndex,
  shouldCenterAlign = false
}) => {
  const displayName = member.first_name && member.last_name 
    ? `${member.first_name} ${member.last_name}`
    : 'Unknown Member';

  const initials = member.first_name && member.last_name
    ? `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`
    : 'UM';

  const getAvatarUrl = (member: TeamMember): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  const rowBgColor = memberIndex % 2 === 0 ? '#ffffff' : '#f9fafb';

  return (
    <td 
      className="workload-grid-cell member-cell"
      style={{
        backgroundColor: rowBgColor,
        width: '250px',
        minWidth: '250px',
        maxWidth: '250px',
        position: shouldCenterAlign ? 'static' : 'sticky',
        left: shouldCenterAlign ? 'auto' : '0',
        zIndex: shouldCenterAlign ? 'auto' : 20,
        textAlign: 'left',
        padding: '12px 16px',
        borderRight: '2px solid rgba(156, 163, 175, 0.3)',
        borderBottom: '1px solid rgba(156, 163, 175, 0.2)',
        verticalAlign: 'middle'
      }}
    >
      <div className="member-info">
        <Avatar className="member-avatar">
          <AvatarImage src={getAvatarUrl(member)} alt={displayName} />
          <AvatarFallback style={{ backgroundColor: '#6366f1', color: 'white' }}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div style={{ flex: '1', minWidth: '0' }}>
          <span className="member-name">
            {displayName}
          </span>
          {'isPending' in member && member.isPending && (
            <span style={{ 
              display: 'inline-block',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              fontSize: '10px',
              fontWeight: '600',
              padding: '2px 6px',
              borderRadius: '4px',
              marginLeft: '8px'
            }}>
              Pending
            </span>
          )}
        </div>
      </div>
    </td>
  );
};