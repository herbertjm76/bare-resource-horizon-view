
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WorkloadBreakdown } from './hooks/types';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName } from '@/utils/projectDisplay';

interface ProjectAllocation {
  project_id: string;
  project_name: string;
  project_code: string;
  hours: number;
}

interface WorkloadTooltipProps {
  children: React.ReactNode;
  breakdown: WorkloadBreakdown & {
    projects?: ProjectAllocation[];
  };
  memberName: string;
  date: string;
}

export const WorkloadTooltip: React.FC<WorkloadTooltipProps> = ({
  children,
  breakdown,
  memberName,
  date
}) => {
  const { projectDisplayPreference } = useAppSettings();
  
  if (breakdown.total === 0) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="bg-white border shadow-lg p-3 max-w-sm z-[100]">
        <div className="space-y-2">
          <div className="font-medium text-sm text-gray-900 border-b border-gray-200 pb-2">
            {memberName} - {date}
          </div>
          
          {/* Project Hours Breakdown */}
          {breakdown.projectHours > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">Project Hours:</span>
                <span className="font-bold text-blue-700">{breakdown.projectHours}h</span>
              </div>
              
              {/* Itemized Projects */}
              {breakdown.projects && breakdown.projects.length > 0 && (
                <div className="ml-2 space-y-1 bg-blue-50 p-2 rounded text-xs">
                  <div className="font-medium text-blue-800 mb-1">Project Breakdown:</div>
                  {breakdown.projects.map((project, index) => (
                    <div key={project.project_id || index} className="flex justify-between items-center">
                      <span className="text-blue-700 truncate max-w-[120px]" title={project.project_name}>
                        {getProjectDisplayName({ code: project.project_code, name: project.project_name }, projectDisplayPreference)}
                      </span>
                      <span className="font-medium text-blue-800 ml-2">
                        {project.hours}h
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Leave Breakdown */}
          <div className="space-y-1 text-xs">
            {breakdown.annualLeave > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600">Annual Leave:</span>
                <span className="font-medium">{breakdown.annualLeave}h</span>
              </div>
            )}
            {breakdown.officeHolidays > 0 && (
              <div className="flex justify-between">
                <span className="text-purple-600">Holiday Hours:</span>
                <span className="font-medium">{breakdown.officeHolidays}h</span>
              </div>
            )}
            {breakdown.otherLeave > 0 && (
              <div className="flex justify-between">
                <span className="text-orange-600">Other Leave:</span>
                <span className="font-medium">{breakdown.otherLeave}h</span>
              </div>
            )}
            
            {/* Total */}
            <div className="border-t pt-1 mt-2 flex justify-between font-bold text-gray-900">
              <span>Total Hours:</span>
              <span>{breakdown.total}h</span>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
