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
  const displayName = member.first_name 
    ? `${member.first_name} ${member.last_name?.charAt(0) || ''}.`
    : 'Unknown';

  const initials = member.first_name && member.last_name
    ? `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`
    : 'UM';

  const getAvatarUrl = (member: TeamMember): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Theme-based alternating row colors
  const rowBgColor = memberIndex % 2 === 0 
    ? 'hsl(var(--background))' 
    : 'hsl(var(--theme-primary) / 0.02)';

  return (
    <td 
      className="workload-grid-cell member-cell"
      style={{
        backgroundColor: 'hsl(var(--theme-primary) / 0.05)',
        width: '180px',
        minWidth: '180px',
        maxWidth: '180px',
        position: shouldCenterAlign ? 'static' : 'sticky',
        left: shouldCenterAlign ? 'auto' : '0',
        zIndex: shouldCenterAlign ? 'auto' : 20,
        textAlign: 'left',
        padding: '0 8px',
        borderRight: '2px solid hsl(var(--theme-primary) / 0.15)',
        borderBottom: '1px solid hsl(var(--border) / 0.5)',
        verticalAlign: 'middle',
        height: '28px'
      }}
    >
      <div className="flex items-center gap-2 h-full" style={{ minHeight: 0 }}>
        <Avatar className="h-[22px] w-[22px] flex-shrink-0">
          <AvatarImage src={getAvatarUrl(member)} alt={displayName} />
          <AvatarFallback 
            className="text-[10px]"
            style={{ 
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'white'
            }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <span 
          className="text-[13px] font-medium truncate leading-none"
          style={{ 
            maxWidth: 'calc(100% - 30px)',
            color: 'hsl(var(--foreground))'
          }}
        >
          {displayName}
        </span>
        {isAtRisk && (
          <span 
            className="flex-shrink-0 inline-flex items-center text-[9px] font-semibold px-1 rounded"
            style={{
              backgroundColor: 'hsl(var(--destructive) / 0.1)',
              color: 'hsl(var(--destructive))'
            }}
          >
            <AlertTriangle size={8} className="mr-0.5" />
            !
          </span>
        )}
      </div>
    </td>
  );
};