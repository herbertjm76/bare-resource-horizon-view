
import React from 'react';
import { ResourceUtilizationBadge } from './ResourceUtilizationBadge';
import { ResourceActions } from './ResourceActions';

interface ResourceInfoProps {
  resource: {
    id: string;
    name: string;
    role: string;
    isPending?: boolean;
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

  return (
    <td 
      className={`sticky-left-12 ${rowBgClass} z-10 p-0.5 group-hover:bg-gray-50`} 
      style={{ width: '200px', minWidth: '200px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="ml-5">
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
