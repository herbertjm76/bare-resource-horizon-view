
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
    const memberName = `${member.first_name} ${member.last_name}`;
    
    console.log(`🔍 Processing avatar for ${memberName}:`);
    console.log('- Raw avatar_url:', member.avatar_url);
    console.log('- Member object keys:', Object.keys(member));
    console.log('- Full member object:', member);
    
    const avatarUrl = member.avatar_url;
    
    if (!avatarUrl) {
      console.log(`❌ No avatar URL found for ${memberName}`);
      return undefined;
    }
    
    // Return the URL as-is - let's not modify it
    console.log(`✅ Final avatar URL for ${memberName}:`, avatarUrl);
    return avatarUrl;
  };

  const avatarUrl = getAvatarUrl(member);
  const initials = getUserInitials(member);
  const memberName = `${member.first_name} ${member.last_name}`;

  console.log(`🖼️ Rendering avatar for ${memberName}:`);
  console.log('- Avatar URL to render:', avatarUrl);
  console.log('- Initials fallback:', initials);

  return (
    <Avatar className="h-10 w-10">
      {avatarUrl && (
        <AvatarImage 
          src={avatarUrl} 
          alt={`${member.first_name} ${member.last_name}`}
          onLoad={(e) => {
            console.log(`✅ Image SUCCESSFULLY loaded for ${memberName}`);
            console.log('- Image element:', e.target);
            console.log('- Natural dimensions:', (e.target as HTMLImageElement).naturalWidth, 'x', (e.target as HTMLImageElement).naturalHeight);
            console.log('- Final src used:', (e.target as HTMLImageElement).src);
            console.log('- Current src attribute:', (e.target as HTMLImageElement).getAttribute('src'));
          }}
          onError={(e) => {
            console.log(`❌ Image FAILED to load for ${memberName}`);
            console.log('- Error target:', e.target);
            console.log('- Attempted URL:', avatarUrl);
            console.log('- Error event:', e);
            console.log('- Image src:', (e.target as HTMLImageElement).src);
            console.log('- Current src attribute:', (e.target as HTMLImageElement).getAttribute('src'));
            
            // Test if we can fetch the URL directly
            fetch(avatarUrl).then(response => {
              console.log(`🔍 Direct fetch test for ${memberName}:`, response.status, response.statusText);
            }).catch(fetchError => {
              console.log(`❌ Direct fetch failed for ${memberName}:`, fetchError);
            });
          }}
        />
      )}
      <AvatarFallback className="bg-gradient-modern text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
