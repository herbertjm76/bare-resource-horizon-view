
import React, { useMemo } from 'react';
import { useResourceUtilization } from '@/hooks/allocations/useResourceUtilization';
import { formatUtilization, getUtilizationStatus } from '@/hooks/allocations/utils/utilizationUtils';

interface TeamUtilizationSummaryProps {
  resources: Array<{
    id: string;
    name: string;
    isPending?: boolean;
  }>;
  weeks: { startDate: Date }[];
  className?: string;
}

export const TeamUtilizationSummary: React.FC<TeamUtilizationSummaryProps> = ({
  resources,
  weeks,
  className = ''
}) => {
  // Extract resource IDs and week keys
  const resourceIds = useMemo(() => resources.map(r => r.id), [resources]);
  const weekKeys = useMemo(() => weeks.map(w => w.startDate.toISOString().split('T')[0]), [weeks]);
  
  // Calculate active vs pre-registered resources
  const activeResources = resources.filter(r => !r.isPending);
  const pendingResources = resources.filter(r => r.isPending);
  
  // Use our utilization hook to get allocation data
  const { 
    getTeamUtilization, 
    utilizations, 
    isLoading 
  } = useResourceUtilization(resourceIds, weekKeys);
  
  // Get overall team utilization
  const teamUtilization = getTeamUtilization();
  const { color: utilizationColor } = getUtilizationStatus(teamUtilization);
  
  // Count underutilized and overutilized resources
  const underUtilizedCount = Object.values(utilizations).filter(u => u.utilization < 40).length;
  const overUtilizedCount = Object.values(utilizations).filter(u => u.utilization > 100).length;
  
  if (isLoading) {
    return (
      <div className={`p-4 border rounded-lg animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`p-4 border rounded-lg shadow-sm bg-white ${className}`}>
      <h3 className="text-sm font-medium text-gray-900">Team Utilization Summary</h3>
      
      <div className="mt-2 flex items-center">
        <div className="text-2xl font-bold" style={{ color: utilizationColor }}>
          {formatUtilization(teamUtilization)}
        </div>
        <div className="text-sm ml-2 text-gray-500">overall utilization</div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div className="p-2 border rounded-md">
          <div className="font-medium">{resources.length}</div>
          <div className="text-gray-500">Total Resources</div>
        </div>
        
        <div className="p-2 border rounded-md">
          <div className="font-medium text-amber-500">{underUtilizedCount}</div>
          <div className="text-gray-500">Under Utilized</div>
        </div>
        
        <div className="p-2 border rounded-md">
          <div className="font-medium text-red-500">{overUtilizedCount}</div>
          <div className="text-gray-500">Over Allocated</div>
        </div>
      </div>
    </div>
  );
};
