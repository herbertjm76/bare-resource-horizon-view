
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from './types';
import { logger } from '@/utils/logger';

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
    
    logger.debug(`🔍 Processing avatar for ${memberName}:`);
    logger.debug('- Raw avatar_url:', member.avatar_url);
    logger.debug('- Member object keys:', Object.keys(member));
    logger.debug('- Full member object:', member);
    
    const avatarUrl = member.avatar_url;
    
    if (!avatarUrl) {
      logger.debug(`❌ No avatar URL found for ${memberName}`);
      return undefined;
    }
    
    // Return the URL as-is - let's not modify it
    logger.debug(`✅ Final avatar URL for ${memberName}:`, avatarUrl);
    return avatarUrl;
  };

  const avatarUrl = getAvatarUrl(member);
  const initials = getUserInitials(member);
  const memberName = `${member.first_name} ${member.last_name}`;

  logger.debug(`🖼️ Rendering avatar for ${memberName}:`);
  logger.debug('- Avatar URL to render:', avatarUrl);
  logger.debug('- Initials fallback:', initials);

  return (
    <Avatar className="h-10 w-10">
      {avatarUrl && (
        <AvatarImage 
          src={avatarUrl} 
          alt={`${member.first_name} ${member.last_name}`}
          onLoad={(e) => {
            logger.debug(`✅ Image SUCCESSFULLY loaded for ${memberName}`);
            logger.debug('- Image element:', e.target);
            logger.debug('- Natural dimensions:', (e.target as HTMLImageElement).naturalWidth, 'x', (e.target as HTMLImageElement).naturalHeight);
            logger.debug('- Final src used:', (e.target as HTMLImageElement).src);
            logger.debug('- Current src attribute:', (e.target as HTMLImageElement).getAttribute('src'));
          }}
          onError={(e) => {
            logger.debug(`❌ Image FAILED to load for ${memberName}`);
            logger.debug('- Error target:', e.target);
            logger.debug('- Attempted URL:', avatarUrl);
            logger.debug('- Error event:', e);
            logger.debug('- Image src:', (e.target as HTMLImageElement).src);
            logger.debug('- Current src attribute:', (e.target as HTMLImageElement).getAttribute('src'));
            
            // Test if we can fetch the URL directly
            fetch(avatarUrl).then(response => {
              logger.debug(`🔍 Direct fetch test for ${memberName}:`, response.status, response.statusText);
            }).catch(fetchError => {
              logger.debug(`❌ Direct fetch failed for ${memberName}:`, fetchError);
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
