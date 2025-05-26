
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Briefcase, Calendar, User, MapPin, Building } from 'lucide-react';
import { StaffMember } from './types';

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
}

export const StaffAllocationDialog: React.FC<StaffAllocationDialogProps> = ({
  open,
  onOpenChange,
  member,
  allocations,
  weeklyCapacity,
  isLoading = false
}) => {
  if (!member) return null;

  const totalAllocatedHours = allocations.reduce((sum, allocation) => sum + allocation.hours, 0);
  const utilizationPercentage = weeklyCapacity > 0 ? (totalAllocatedHours / weeklyCapacity) * 100 : 0;

  // Get member details - handle both active members and pre-registered invites
  const memberDetails = {
    id: 'id' in member ? member.id : 'N/A',
    name: member.name,
    role: member.role || 'Team Member',
    email: 'email' in member ? member.email : 'N/A',
    department: 'department' in member ? member.department : 'N/A',
    location: 'location' in member ? member.location : 'N/A',
    weeklyCapacity: 'weekly_capacity' in member ? member.weekly_capacity : weeklyCapacity,
    isPending: 'isPending' in member ? member.isPending : false
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
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
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Member Information Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Member Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500">ID:</span>
                    <span className="ml-2 font-mono text-xs">{memberDetails.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2">{memberDetails.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-gray-500">Department:</span>
                    <span className="ml-2">{memberDetails.department}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-gray-500">Location:</span>
                    <span className="ml-2">{memberDetails.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Weekly Capacity:</span>
                    <span className="ml-2 font-medium">{memberDetails.weeklyCapacity}h</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Current Week Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-blue-500 mb-1" />
                  <div className="text-lg font-semibold">{totalAllocatedHours}h</div>
                  <div className="text-xs text-gray-500">Allocated</div>
                </div>
                <div className="flex flex-col items-center">
                  <Calendar className="h-5 w-5 text-green-500 mb-1" />
                  <div className="text-lg font-semibold">{memberDetails.weeklyCapacity}h</div>
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
              Project Allocations ({allocations.length} projects)
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
            ) : allocations.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center text-gray-500">
                  <div className="mb-2">No project allocations found for this week</div>
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
                {allocations.map((allocation, index) => (
                  <Card key={index} className="hover:bg-gray-50">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{allocation.projectName}</div>
                          <div className="text-xs text-gray-500 font-mono">{allocation.projectCode}</div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Week of {new Date(allocation.weekStartDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            Project ID: {allocation.projectId}
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {allocation.hours}h
                        </Badge>
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
              {totalAllocatedHours}h allocated of {memberDetails.weeklyCapacity}h capacity
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
