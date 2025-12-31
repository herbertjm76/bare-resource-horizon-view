
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Briefcase, Calendar, User } from 'lucide-react';
import { StaffMember } from './types';
import { TimeRange } from '../TimeRangeSelector';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue, formatUtilizationSummary } from '@/utils/allocationDisplay';
import { logger } from '@/utils/logger';

interface StaffAllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: StaffMember | null;
  allocations: Array<{
    projectId: string;
    projectName: string;
    projectCode: string;
    hours: number;
    weekStartDate: string;
  }>;
  weeklyCapacity: number;
  isLoading?: boolean;
  utilizationRate?: number; // Standardized utilization rate from dashboard data
  selectedTimeRange?: TimeRange;
}

export const StaffAllocationDialog: React.FC<StaffAllocationDialogProps> = ({
  open,
  onOpenChange,
  member,
  allocations,
  weeklyCapacity,
  isLoading = false,
  utilizationRate,
  selectedTimeRange
}) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  
  if (!member) return null;

  // Consolidate allocations by project
  const consolidatedAllocations = allocations.reduce((acc, allocation) => {
    const key = `${allocation.projectId}-${allocation.projectCode}`;
    if (acc[key]) {
      acc[key].hours += allocation.hours;
    } else {
      acc[key] = {
        projectName: allocation.projectName,
        projectCode: allocation.projectCode,
        hours: allocation.hours,
        weekStartDate: allocation.weekStartDate
      };
    }
    return acc;
  }, {} as Record<string, { projectName: string; projectCode: string; hours: number; weekStartDate: string; }>);

  const consolidatedAllocationsList = Object.values(consolidatedAllocations);
  const totalAllocatedHours = consolidatedAllocationsList.reduce((sum, allocation) => sum + allocation.hours, 0);
  
  // Use standardized utilization rate if provided, otherwise calculate from allocations
  const utilizationPercentage = utilizationRate !== undefined ? 
    utilizationRate : 
    (weeklyCapacity > 0 ? (totalAllocatedHours / weeklyCapacity) * 100 : 0);
  
  // Debug log for utilization data consistency
  if (member?.name?.includes('Paul')) {
    logger.debug('🔍 DIALOG - Paul Julius utilization data:', {
      memberName: member.name,
      standardizedUtilization: utilizationRate,
      calculatedUtilization: (totalAllocatedHours / weeklyCapacity) * 100,
      finalUtilization: utilizationPercentage,
      totalAllocatedHours,
      weeklyCapacity
    });
  }

  // Get time period display text
  const getTimePeriodText = () => {
    switch (selectedTimeRange || 'week') {
      case 'week': return 'Current Week';
      case 'month': return 'Current Month';
      case '3months': return 'This Quarter';
      default: return 'Selected Period';
    }
  };

  // Get member details - handle both active members and pre-registered invites
  const memberDetails = {
    name: member.name,
    role: member.role || 'Team Member',
    weeklyCapacity: 'weekly_capacity' in member ? member.weekly_capacity : weeklyCapacity,
    isPending: 'isPending' in member ? member.isPending : false
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">{memberDetails.name}</div>
              <div className="text-sm text-gray-500 font-normal flex items-center gap-4">
                <span>{memberDetails.role}</span>
                {memberDetails.isPending && (
                  <StandardizedBadge variant="warning" size="sm">
                    Pending
                  </StandardizedBadge>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">{getTimePeriodText()} Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-blue-500 mb-1" />
                  <div className="text-lg font-semibold">{formatAllocationValue(totalAllocatedHours, memberDetails.weeklyCapacity, displayPreference)}</div>
                  <div className="text-xs text-gray-500">For {getTimePeriodText()}</div>
                </div>
                <div className="flex flex-col items-center">
                  <Calendar className="h-5 w-5 text-green-500 mb-1" />
                  <div className="text-lg font-semibold">{formatAllocationValue(memberDetails.weeklyCapacity, memberDetails.weeklyCapacity, displayPreference)}</div>
                  <div className="text-xs text-gray-500">Capacity</div>
                </div>
                <div className="flex flex-col items-center">
                  <Briefcase className="h-5 w-5 text-purple-500 mb-1" />
                  <div className="text-lg font-semibold">{Math.round(utilizationPercentage)}%</div>
                  <div className="text-xs text-gray-500">Utilization</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Allocations */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Project Allocations ({consolidatedAllocationsList.length} projects)
            </h3>
            
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                        <Skeleton className="h-6 w-12 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : consolidatedAllocationsList.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center text-gray-500">
                  <div className="mb-2">No project allocations found for {getTimePeriodText().toLowerCase()}</div>
                  <div className="text-xs">
                    {memberDetails.isPending ? 
                      'This member is pending registration and may have pre-allocated resources.' :
                      'Member may be available for new project assignments.'
                    }
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {consolidatedAllocationsList.map((allocation, index) => (
                  <Card key={index} className="hover:bg-muted">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{allocation.projectName}</div>
                          <div className="text-xs text-muted-foreground font-mono">{allocation.projectCode}</div>
                          <div className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Week of {new Date(allocation.weekStartDate).toLocaleDateString()}
                          </div>
                        </div>
                        <StandardizedBadge variant="metric" size="sm" className="ml-2">
                          {formatAllocationValue(allocation.hours, memberDetails.weeklyCapacity, displayPreference)}
                        </StandardizedBadge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Utilization Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Capacity Utilization</span>
              <span>{Math.round(utilizationPercentage)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  utilizationPercentage > 90 ? 'bg-red-500' : 
                  utilizationPercentage > 65 ? 'bg-blue-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {utilizationPercentage > 100 && 'Over-allocated! '}
              {formatUtilizationSummary(totalAllocatedHours, memberDetails.weeklyCapacity, displayPreference)} capacity
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
