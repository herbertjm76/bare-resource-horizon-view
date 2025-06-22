
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
    // Debug logging for Jingjing Kim specifically
    if (member.first_name?.toLowerCase() === 'jingjing' && member.last_name?.toLowerCase() === 'kim') {
      console.log('🔍 Jingjing Kim Avatar Debug:');
      console.log('- avatar_url from member:', member.avatar_url);
      console.log('- member keys:', Object.keys(member));
    }
    
    // Always try to access avatar_url directly from the member object
    const avatarUrl = member.avatar_url;
    
    // Return the avatar URL if it exists, undefined otherwise
    return avatarUrl || undefined;
  };

  const avatarUrl = getAvatarUrl(member);
  const initials = getUserInitials(member);

  // Debug logging for Jingjing Kim specifically - now with more detail
  if (member.first_name?.toLowerCase() === 'jingjing' && member.last_name?.toLowerCase() === 'kim') {
    console.log('🖼️ Final avatar rendering for Jingjing Kim:');
    console.log('- Final avatarUrl:', avatarUrl);
    console.log('- Initials fallback:', initials);
    console.log('- Testing image accessibility...');
    
    // Test if the image is accessible
    if (avatarUrl) {
      const img = new Image();
      img.onload = () => {
        console.log('✅ Image loaded successfully from:', avatarUrl);
      };
      img.onerror = (error) => {
        console.log('❌ Image failed to load from:', avatarUrl);
        console.log('Error details:', error);
      };
      img.src = avatarUrl;
    }
  }

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage 
        src={avatarUrl} 
        alt={`${member.first_name} ${member.last_name}`}
        onLoad={(e) => {
          if (member.first_name?.toLowerCase() === 'jingjing' && member.last_name?.toLowerCase() === 'kim') {
            console.log('✅ AvatarImage onLoad triggered for Jingjing Kim');
            console.log('- Image element:', e.target);
            console.log('- naturalWidth:', (e.target as HTMLImageElement).naturalWidth);
            console.log('- naturalHeight:', (e.target as HTMLImageElement).naturalHeight);
          }
        }}
        onError={(e) => {
          if (member.first_name?.toLowerCase() === 'jingjing' && member.last_name?.toLowerCase() === 'kim') {
            console.log('❌ AvatarImage onError triggered for Jingjing Kim');
            console.log('- Error target:', e.target);
            console.log('- Attempted URL:', avatarUrl);
            console.log('- Error type:', e.type);
          }
        }}
      />
      <AvatarFallback className="bg-brand-violet text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
