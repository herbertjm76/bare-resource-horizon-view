
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ResourceActions } from './ResourceActions';
import { ResourceUtilizationBadge } from './ResourceUtilizationBadge';

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
  const displayName = resource.first_name && resource.last_name 
    ? `${resource.first_name} ${resource.last_name}`
    : resource.name;

  const initials = resource.first_name && resource.last_name
    ? `${resource.first_name.charAt(0)}${resource.last_name.charAt(0)}`
    : resource.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2);

  return (
    <td className={`project-name-column ${rowBgClass} p-2 group-hover:bg-gray-50`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0 flex-grow">
          <Avatar className="h-6 w-6 border border-gray-200 flex-shrink-0">
            <AvatarImage src={resource.avatar_url} alt={displayName} />
            <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="min-w-0 flex-grow">
            <div className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {resource.role}
              {resource.isPending && <span className="text-amber-600 ml-1">(Pending)</span>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <ResourceUtilizationBadge utilization={utilizationPercentage} />
          <ResourceActions 
            resourceId={resource.id}
            resourceName={displayName}
            resourceType={resource.isPending ? 'pre_registered' : 'active'}
            onDeleteResource={onDeleteResource}
            onCheckOtherProjects={onCheckOtherProjects}
          />
        </div>
      </div>
    </td>
  );
};
