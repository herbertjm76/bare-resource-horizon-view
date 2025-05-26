
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Briefcase, Calendar } from 'lucide-react';
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
}

export const StaffAllocationDialog: React.FC<StaffAllocationDialogProps> = ({
  open,
  onOpenChange,
  member,
  allocations,
  weeklyCapacity
}) => {
  if (!member) return null;

  const totalAllocatedHours = allocations.reduce((sum, allocation) => sum + allocation.hours, 0);
  const utilizationPercentage = weeklyCapacity > 0 ? (totalAllocatedHours / weeklyCapacity) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
            <div>
              <div className="font-semibold">{member.name}</div>
              <div className="text-sm text-gray-500 font-normal">{member.role}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Card */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-blue-500 mb-1" />
                  <div className="text-lg font-semibold">{totalAllocatedHours}h</div>
                  <div className="text-xs text-gray-500">Allocated</div>
                </div>
                <div className="flex flex-col items-center">
                  <Calendar className="h-5 w-5 text-green-500 mb-1" />
                  <div className="text-lg font-semibold">{weeklyCapacity}h</div>
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
            
            {allocations.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center text-gray-500">
                  No project allocations found for this week
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
                          <div className="text-xs text-gray-500">{allocation.projectCode}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Week of {new Date(allocation.weekStartDate).toLocaleDateString()}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
