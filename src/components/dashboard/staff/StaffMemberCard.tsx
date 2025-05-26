
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StaffMemberCardProps } from './types';
import { getProfileImage, getInitials } from './utils';
import { COLOR_SCHEMES } from './constants';

export const StaffMemberCard: React.FC<StaffMemberCardProps> = ({ member, colorScheme }) => {
  const colors = COLOR_SCHEMES[colorScheme];

  return (
    <div className={`flex items-center gap-3 p-3 ${colors.bg} rounded-lg border ${colors.border}`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={getProfileImage(member)} alt={`${member.first_name} ${member.last_name}`} />
        <AvatarFallback className={`${colors.avatarBg} ${colors.avatarText} text-sm`}>
          {getInitials(member)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-800">
            {member.first_name} {member.last_name}
          </span>
          <span className={`${colors.percentage} font-semibold`}>{member.availability}%</span>
        </div>
        <div className={`w-full h-1.5 ${colors.progressBg} rounded-full`}>
          <div 
            className={`h-1.5 rounded-full ${colors.progress}`}
            style={{ width: `${Math.min(member.availability, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
