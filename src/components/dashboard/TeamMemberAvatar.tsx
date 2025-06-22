
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
    console.log('=== Avatar Debug Info ===');
    console.log('Member:', member.first_name, member.last_name);
    console.log('Member object keys:', Object.keys(member));
    console.log('Has isPending property:', 'isPending' in member);
    console.log('isPending value:', (member as any).isPending);
    console.log('Direct avatar_url access:', member.avatar_url);
    console.log('Member type check - has avatar_url in member:', 'avatar_url' in member);
    
    // Always try to access avatar_url directly from the member object
    const avatarUrl = member.avatar_url;
    console.log('Final avatar URL:', avatarUrl);
    console.log('========================');
    
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
