import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TeamMember } from '@/components/dashboard/types';
import { AlertTriangle } from 'lucide-react';

interface MemberInfoCellProps {
  member: TeamMember;
  memberIndex: number;
  shouldCenterAlign?: boolean;
  isAtRisk?: boolean;
}

export const MemberInfoCell: React.FC<MemberInfoCellProps> = ({
  member,
  memberIndex,
  shouldCenterAlign = false,
  isAtRisk = false
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
        width: '180px',
        minWidth: '180px',
        maxWidth: '180px',
        position: shouldCenterAlign ? 'static' : 'sticky',
        left: shouldCenterAlign ? 'auto' : '0',
        zIndex: shouldCenterAlign ? 'auto' : 20,
        textAlign: 'left',
        padding: '0 8px',
        borderRight: '2px solid rgba(156, 163, 175, 0.3)',
        borderBottom: '1px solid rgba(156, 163, 175, 0.2)',
        verticalAlign: 'middle',
        height: '28px'
      }}
    >
      <div className="flex items-center gap-2 h-full" style={{ minHeight: 0 }}>
        <Avatar className="h-[22px] w-[22px] flex-shrink-0">
          <AvatarImage src={getAvatarUrl(member)} alt={displayName} />
          <AvatarFallback 
            className="text-[10px] text-white"
            style={{ backgroundColor: '#6366f1' }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <span 
          className="text-[13px] font-medium text-gray-900 truncate leading-none"
          style={{ maxWidth: 'calc(100% - 30px)' }}
        >
          {displayName}
        </span>
        {isAtRisk && (
          <span 
            className="flex-shrink-0 inline-flex items-center bg-red-50 text-red-600 text-[9px] font-semibold px-1 rounded"
          >
            <AlertTriangle size={8} className="mr-0.5" />
            !
          </span>
        )}
      </div>
    </td>
  );
};