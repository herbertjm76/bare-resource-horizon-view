
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from './types';

interface TeamMemberAvatarProps {
  member: TeamMember;
}

export const TeamMemberAvatar: React.FC<TeamMemberAvatarProps> = ({ member }) => {
  const getUserInitials = (member: TeamMember) => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarUrl = (member: TeamMember): string | undefined => {
    // Always try to access avatar_url directly from the member object
    const avatarUrl = member.avatar_url;
    
    // Return the avatar URL if it exists, undefined otherwise
    return avatarUrl || undefined;
  };

  const avatarUrl = getAvatarUrl(member);

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={avatarUrl} />
      <AvatarFallback className="bg-brand-violet text-white">
        {getUserInitials(member)}
      </AvatarFallback>
    </Avatar>
  );
};
