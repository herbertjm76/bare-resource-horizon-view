
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
    // Debug logging for specific members
    if (member.first_name?.toLowerCase() === 'jingjing' && member.last_name?.toLowerCase() === 'kim') {
      console.log('🔍 Jingjing Kim Avatar Debug:');
      console.log('- avatar_url from member:', member.avatar_url);
      console.log('- member keys:', Object.keys(member));
    }
    
    if (member.first_name?.toLowerCase() === 'rob' && member.last_name?.toLowerCase() === 'night') {
      console.log('🔍 Rob Night Avatar Debug:');
      console.log('- avatar_url from member:', member.avatar_url);
      console.log('- member keys:', Object.keys(member));
    }
    
    // Get the avatar URL from the member object
    const avatarUrl = member.avatar_url;
    
    if (!avatarUrl) {
      return undefined;
    }
    
    // If it's already a full URL (starts with http/https), return as is
    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      return avatarUrl;
    }
    
    // If it starts with /lovable-uploads/, return it as is (this should work)
    if (avatarUrl.startsWith('/lovable-uploads/')) {
      return avatarUrl;
    }
    
    // For any other relative paths, return as is
    return avatarUrl;
  };

  const avatarUrl = getAvatarUrl(member);
  const initials = getUserInitials(member);

  // Debug logging for specific members - now with more detail
  if (member.first_name?.toLowerCase() === 'jingjing' && member.last_name?.toLowerCase() === 'kim') {
    console.log('🖼️ Final avatar rendering for Jingjing Kim:');
    console.log('- Final avatarUrl:', avatarUrl);
    console.log('- Initials fallback:', initials);
  }
  
  if (member.first_name?.toLowerCase() === 'rob' && member.last_name?.toLowerCase() === 'night') {
    console.log('🖼️ Final avatar rendering for Rob Night:');
    console.log('- Final avatarUrl:', avatarUrl);
    console.log('- Initials fallback:', initials);
  }

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage 
        src={avatarUrl} 
        alt={`${member.first_name} ${member.last_name}`}
        onLoad={(e) => {
          const memberName = `${member.first_name} ${member.last_name}`;
          console.log(`✅ AvatarImage onLoad triggered for ${memberName}`);
          console.log('- Image element:', e.target);
          console.log('- naturalWidth:', (e.target as HTMLImageElement).naturalWidth);
          console.log('- naturalHeight:', (e.target as HTMLImageElement).naturalHeight);
          console.log('- Final src:', (e.target as HTMLImageElement).src);
        }}
        onError={(e) => {
          const memberName = `${member.first_name} ${member.last_name}`;
          console.log(`❌ AvatarImage onError triggered for ${memberName}`);
          console.log('- Error target:', e.target);
          console.log('- Attempted URL:', avatarUrl);
          console.log('- Error type:', e.type);
          console.log('- Image src:', (e.target as HTMLImageElement).src);
        }}
      />
      <AvatarFallback className="bg-brand-violet text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
