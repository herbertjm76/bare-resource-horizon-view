import React, { useMemo, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ResourceAllocationCell } from '@/components/week-resourcing/ResourceAllocationCell';
import { CapacityGauge } from '@/components/week-resourcing/CapacityGauge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import '../resources/resources-grid.css'; // Import resource grid styling

interface ResourceTableProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: string;
}

export const ResourceTable: React.FC<ResourceTableProps> = ({
  projects,
  members,
  allocations,
  weekStartDate
}) => {
  // Process data for efficient rendering
  const membersMap = useMemo(() => {
    const map = new Map();
    members.forEach(member => {
      map.set(member.id, member);
    });
    return map;
  }, [members]);
  
  // Leave data state for manual input
  const [leaveData, setLeaveData] = useState<Record<string, Record<string, number>>>({});
  
  // Organize allocations by member and project for easier access
  const allocationMap = useMemo(() => {
    const map = new Map();
    
    allocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      map.set(key, allocation.hours);
    });
    
    return map;
  }, [allocations]);
  
  // Calculate total project hours
  const projectTotals = useMemo(() => {
    const totals = new Map();
    
    allocations.forEach(allocation => {
      const projectId = allocation.project_id;
      const currentTotal = totals.get(projectId) || 0;
      totals.set(projectId, currentTotal + allocation.hours);
    });
    
    return totals;
  }, [allocations]);
  
  // Calculate total member hours
  const memberTotals = useMemo(() => {
    const totals = new Map();
    
    allocations.forEach(allocation => {
      const memberId = allocation.resource_id;
      const currentTotal = totals.get(memberId) || 0;
      totals.set(memberId, currentTotal + allocation.hours);
    });
    
    return totals;
  }, [allocations]);
  
  // Helper to get just the first name
  const getFirstName = (member: any): string => {
    if (!member) return 'Unknown';
    return member.first_name || 'Unnamed';
  };

  // Helper to get member display name for tooltip
  const getMemberName = (member: any): string => {
    if (!member) return 'Unknown';
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed';
  };

  // Handler for leave input changes
  const handleLeaveInputChange = (memberId: string, leaveType: string, value: string) => {
    const hours = value === '' ? 0 : Math.min(parseFloat(value), 40);
    
    if (isNaN(hours)) return;
    
    setLeaveData(prev => {
      const newLeaveData = {...prev};
      if (!newLeaveData[memberId]) {
        newLeaveData[memberId] = {};
      }
      newLeaveData[memberId][leaveType] = hours;
      return newLeaveData;
    });
  };
  
  // Get leave hours for a member and type
  const getLeaveHours = (memberId: string, leaveType: string): number => {
    return leaveData[memberId]?.[leaveType] || 0;
  };

  return (
    <TooltipProvider>
      <div className="annual-leave-calendar grid-table-outer-container border rounded-md shadow-sm">
        <div className="grid-table-container">
          <Table className="resource-allocation-table">
            <TableHeader>
              <TableRow className="bg-muted/50 h-12">
                {/* Resource name column */}
                <TableHead className="sticky-header sticky-left-0 border-r border-b bg-muted/50 w-[80px] text-center">
                  Resources
                </TableHead>
                
                {/* Capacity column */}
                <TableHead className="sticky-header sticky-left-12 border-r border-b bg-muted/50 w-[120px] text-center">
                  Capacity
                </TableHead>
                
                {/* Leave columns group */}
                <TableHead colSpan={3} className="sticky-header border-r border-b bg-muted/50 text-center">
                  Leave
                </TableHead>
                
                {/* Project columns - rotated headers */}
                {projects.map(project => (
                  <TableHead 
                    key={project.id} 
                    className="sticky-header text-center border-r border-b bg-muted/50 w-[48px] p-0 relative"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="date-label h-full w-full cursor-help">
                          <span className="font-semibold">{project.code}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{project.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                ))}
                
                {/* Total column */}
                <TableHead className="sticky-header text-center border-b bg-muted/50 w-[60px]">
                  Total
                </TableHead>
              </TableRow>
              
              {/* Sub-header for leave types */}
              <TableRow className="bg-muted/30 h-8">
                {/* Empty cell for Resource column */}
                <TableHead className="sticky-header sticky-left-0 border-r border-b bg-muted/30"></TableHead>
                
                {/* Empty cell for Capacity column */}
                <TableHead className="sticky-header sticky-left-12 border-r border-b bg-muted/30"></TableHead>
                
                {/* Leave sub-columns */}
                <TableHead className="text-center border-r border-b bg-muted/30 text-xs w-[80px]">
                  Annual
                </TableHead>
                <TableHead className="text-center border-r border-b bg-muted/30 text-xs w-[80px]">
                  Sick/Medical
                </TableHead>
                <TableHead className="text-center border-r border-b bg-muted/30 text-xs w-[80px]">
                  Other
                </TableHead>
                
                {/* Empty cells for Project columns */}
                {projects.map(project => (
                  <TableHead key={`empty-${project.id}`} className="border-r border-b bg-muted/30"></TableHead>
                ))}
                
                {/* Empty cell for Total column */}
                <TableHead className="border-b bg-muted/30"></TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {Array.from(membersMap.values()).map((member: any, idx: number) => {
                // Get weekly capacity or default to 40
                const weeklyCapacity = member.weekly_capacity || 40;
                const totalHours = memberTotals.get(member.id) || 0;
                const utilization = Math.round((totalHours / weeklyCapacity) * 100);
                
                // Calculate leave hours
                const annualLeave = getLeaveHours(member.id, 'annual') || 0;
                const sickLeave = getLeaveHours(member.id, 'sick') || 0;
                const otherLeave = getLeaveHours(member.id, 'other') || 0;
                const totalLeave = annualLeave + sickLeave + otherLeave;
                
                // Calculate available hours after allocated hours and leave
                const allocatedHours = totalHours + totalLeave;
                const availableHours = Math.max(0, weeklyCapacity - allocatedHours);
                const availablePercentage = (availableHours / weeklyCapacity) * 100;
                
                // Alternating row background
                const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-muted/10';
                
                return (
                  <TableRow key={member.id} className={`h-9 ${rowBg} hover:bg-muted/20`}>
                    {/* Resource Name - Centered */}
                    <TableCell className="sticky-column sticky-left-0 border-r font-medium py-1 text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{getFirstName(member)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getMemberName(member)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    
                    {/* Capacity Gauge - more compact */}
                    <TableCell className="sticky-column sticky-left-12 border-r p-0 align-middle">
                      <div className="flex justify-center">
                        <CapacityGauge 
                          availableHours={availableHours} 
                          totalCapacity={weeklyCapacity} 
                        />
                      </div>
                    </TableCell>
                    
                    {/* Annual Leave Cell */}
                    <TableCell className="border-r p-0 text-center w-[80px]">
                      <div className="allocation-input-container">
                        <Input
                          type="number"
                          min="0"
                          max="40"
                          value={annualLeave || ''}
                          onChange={(e) => handleLeaveInputChange(member.id, 'annual', e.target.value)}
                          className="w-full h-8 text-center p-0 bg-[#F2FCE2]"
                          placeholder="0"
                        />
                      </div>
                    </TableCell>
                    
                    {/* Sick/Medical Leave Cell */}
                    <TableCell className="border-r p-0 text-center w-[80px]">
                      <div className="allocation-input-container">
                        <Input
                          type="number"
                          min="0"
                          max="40"
                          value={sickLeave || ''}
                          onChange={(e) => handleLeaveInputChange(member.id, 'sick', e.target.value)}
                          className="w-full h-8 text-center p-0 bg-[#FEF7CD]"
                          placeholder="0"
                        />
                      </div>
                    </TableCell>
                    
                    {/* Other Leave Cell */}
                    <TableCell className="border-r p-0 text-center w-[80px]">
                      <div className="allocation-input-container">
                        <Input
                          type="number"
                          min="0"
                          max="40"
                          value={otherLeave || ''}
                          onChange={(e) => handleLeaveInputChange(member.id, 'other', e.target.value)}
                          className="w-full h-8 text-center p-0 bg-[#FEC6A1]"
                          placeholder="0"
                        />
                      </div>
                    </TableCell>
                    
                    {/* Project allocation cells */}
                    {projects.map(project => {
                      const key = `${member.id}:${project.id}`;
                      const hours = allocationMap.get(key) || 0;
                      
                      return (
                        <TableCell 
                          key={`${member.id}-${project.id}`} 
                          className="leave-cell text-center border-r p-0 align-middle"
                        >
                          <ResourceAllocationCell 
                            hours={hours}
                            resourceId={member.id}
                            projectId={project.id}
                            weekStartDate={weekStartDate}
                          />
                        </TableCell>
                      );
                    })}
                    
                    {/* Total Column with Utilization Badge */}
                    <TableCell className="text-center p-0">
                      <div className="flex flex-col items-center py-1">
                        <span className="font-medium">{totalHours}</span>
                        <Badge 
                          variant={utilization > 100 ? "destructive" : utilization > 80 ? "warning" : "outline"} 
                          className="text-xs py-0 px-1.5 h-5"
                        >
                          {utilization}%
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            
            {/* Totals row */}
            <TableRow className="bg-muted/30 font-medium h-10 border-t">
              <TableCell className="sticky-column sticky-left-0 border-r font-semibold pl-2 py-1 text-center">Totals</TableCell>
              <TableCell className="sticky-column sticky-left-12 border-r text-center py-1"></TableCell>
              <TableCell className="text-center border-r py-1"></TableCell>
              <TableCell className="text-center border-r py-1"></TableCell>
              <TableCell className="text-center border-r py-1"></TableCell>
              
              {projects.map(project => (
                <TableCell key={`total-${project.id}`} className="text-center border-r py-1">
                  {projectTotals.get(project.id) || 0}
                </TableCell>
              ))}
              
              <TableCell className="text-center py-1 font-semibold">
                {Array.from(projectTotals.values()).reduce((sum, hours) => sum + hours, 0)}
              </TableCell>
            </TableRow>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};
