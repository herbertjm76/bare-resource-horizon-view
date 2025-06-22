
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
    
    // Get the avatar URL from the member object
    const avatarUrl = member.avatar_url;
    
    if (!avatarUrl) {
      return undefined;
    }
    
    // If it's already a full URL (starts with http/https), return as is
    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      return avatarUrl;
    }
    
    // If it starts with /lovable-uploads/, convert to full path
    if (avatarUrl.startsWith('/lovable-uploads/')) {
      // Extract just the filename
      const filename = avatarUrl.replace('/lovable-uploads/', '');
      // Return the full public path
      return `/lovable-uploads/${filename}`;
    }
    
    // For any other relative paths, return as is
    return avatarUrl;
  };

  const avatarUrl = getAvatarUrl(member);
  const initials = getUserInitials(member);

  // Debug logging for Jingjing Kim specifically - now with more detail
  if (member.first_name?.toLowerCase() === 'jingjing' && member.last_name?.toLowerCase() === 'kim') {
    console.log('🖼️ Final avatar rendering for Jingjing Kim:');
    console.log('- Final avatarUrl:', avatarUrl);
    console.log('- Initials fallback:', initials);
    console.log('- Testing image accessibility...');
    
    // Test if the image is accessible by trying to fetch it
    if (avatarUrl) {
      fetch(avatarUrl, { method: 'HEAD' })
        .then(response => {
          console.log('✅ Image fetch successful:', response.status, response.statusText);
          console.log('- Response headers:', Object.fromEntries(response.headers.entries()));
        })
        .catch(error => {
          console.log('❌ Image fetch failed:', error);
          console.log('- Trying alternative: Check if file exists in public directory');
        });
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
            console.log('- Final src:', (e.target as HTMLImageElement).src);
          }
        }}
        onError={(e) => {
          if (member.first_name?.toLowerCase() === 'jingjing' && member.last_name?.toLowerCase() === 'kim') {
            console.log('❌ AvatarImage onError triggered for Jingjing Kim');
            console.log('- Error target:', e.target);
            console.log('- Attempted URL:', avatarUrl);
            console.log('- Error type:', e.type);
            console.log('- Image src:', (e.target as HTMLImageElement).src);
          }
        }}
      />
      <AvatarFallback className="bg-brand-violet text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
