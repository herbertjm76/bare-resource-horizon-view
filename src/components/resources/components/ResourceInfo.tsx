
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResourceUtilizationBadge } from './ResourceUtilizationBadge';
import { ResourceActions } from './ResourceActions';

interface ResourceInfoProps {
  resource: {
    id: string;
    name: string;
    role: string;
    isPending?: boolean;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
  };
  utilizationPercentage: number;
  rowBgClass: string;
  onDeleteResource: (resourceId: string, globalDelete?: boolean) => void;
  onCheckOtherProjects?: (resourceId: string, resourceType: 'active' | 'pre_registered') => Promise<{ hasOtherAllocations: boolean; projectCount: number; }>;
}

export const ResourceInfo: React.FC<ResourceInfoProps> = ({
  resource,
  utilizationPercentage,
  rowBgClass,
  onDeleteResource,
  onCheckOtherProjects
}) => {
  const resourceType = resource.isPending ? 'pre_registered' : 'active';

  // Helper to get user initials from name or first_name/last_name
  const getUserInitials = (): string => {
    if (resource.first_name && resource.last_name) {
      return `${resource.first_name.charAt(0)}${resource.last_name.charAt(0)}`.toUpperCase();
    }
    // Fallback to splitting the name field
    const nameParts = resource.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
    }
    return resource.name.substring(0, 2).toUpperCase();
  };

  // Helper to get avatar URL safely
  const getAvatarUrl = (): string | undefined => {
    return 'avatar_url' in resource ? resource.avatar_url || undefined : undefined;
  };

  return (
    <td 
      className={`sticky-left-12 ${rowBgClass} z-10 p-0.5 group-hover:bg-gray-50`} 
      style={{ width: '200px', minWidth: '200px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getAvatarUrl()} alt={resource.name} />
            <AvatarFallback className="bg-brand-violet text-white text-xs">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-xs truncate flex items-center gap-1">
              {resource.name}
              <ResourceUtilizationBadge utilization={utilizationPercentage} size="xs" />
            </div>
          </div>
        </div>
        <ResourceActions
          resourceId={resource.id}
          resourceName={resource.name}
          resourceType={resourceType}
          onDeleteResource={onDeleteResource}
          onCheckOtherProjects={onCheckOtherProjects}
        />
      </div>
    </td>
  );
};
