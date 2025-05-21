
import React, { useMemo, useState, useEffect } from 'react';
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
import { CapacityBar } from '@/components/week-resourcing/CapacityBar';
import { RemarksCell } from '@/components/week-resourcing/RemarksCell';
import { LeaveTooltip } from '@/components/week-resourcing/LeaveTooltip';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Briefcase, MapPin } from 'lucide-react';
import { useAnnualLeave } from '@/hooks/useAnnualLeave';
import { addDays, startOfWeek, parseISO, isWithinInterval, format } from 'date-fns';
import '../resources/resources-grid.css';

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
  
  // Parse week dates for leave filtering
  const weekStart = useMemo(() => new Date(weekStartDate), [weekStartDate]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
  
  // Get leave data from the annual_leave hook
  const { leaveData, isLoading: isLoadingLeave } = useAnnualLeave(weekStart);
  
  // Remarks state for manual input
  const [remarksData, setRemarksData] = useState<Record<string, string>>({});
  
  // Leave data state for sick/other leave types
  const [manualLeaveData, setManualLeaveData] = useState<Record<string, Record<string, number>>>({});
  
  // Organize allocations by member and project for easier access
  const allocationMap = useMemo(() => {
    const map = new Map();
    
    allocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      map.set(key, allocation.hours);
    });
    
    return map;
  }, [allocations]);
  
  // Count projects per member for this week
  const projectCountByMember = useMemo(() => {
    const countMap = new Map();
    
    members.forEach(member => {
      // Initialize count to 0
      countMap.set(member.id, 0);
    });
    
    allocations.forEach(allocation => {
      const memberId = allocation.resource_id;
      // Only count if hours > 0
      if (allocation.hours > 0) {
        // Get current count or 0 if not set
        const currentProjects = new Set(countMap.get(memberId + '_projects') || []);
        currentProjects.add(allocation.project_id);
        countMap.set(memberId + '_projects', currentProjects);
        countMap.set(memberId, currentProjects.size);
      }
    });
    
    return countMap;
  }, [members, allocations]);
  
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
  
  // Filter leave data for the selected week
  const getWeeklyLeave = (memberId: string) => {
    if (!leaveData[memberId]) return [];
    
    const memberLeaves = leaveData[memberId];
    const weekLeaveDays = Object.keys(memberLeaves)
      .filter(dateStr => {
        const date = new Date(dateStr);
        return isWithinInterval(date, { start: weekStart, end: weekEnd });
      })
      .map(dateStr => ({
        date: dateStr,
        hours: memberLeaves[dateStr]
      }));
      
    return weekLeaveDays;
  };
  
  // Calculate total leave hours for the week
  const getTotalWeeklyLeaveHours = (memberId: string) => {
    const weekLeaveDays = getWeeklyLeave(memberId);
    return weekLeaveDays.reduce((total, day) => total + day.hours, 0);
  };
  
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
  
  // Helper to get office location
  const getOfficeLocation = (member: any): string => {
    return member.location || 'No office';
  };

  // Handler for leave input changes
  const handleLeaveInputChange = (memberId: string, leaveType: string, value: string) => {
    const hours = value === '' ? 0 : Math.min(parseFloat(value), 40);
    
    if (isNaN(hours)) return;
    
    setManualLeaveData(prev => {
      const newLeaveData = {...prev};
      if (!newLeaveData[memberId]) {
        newLeaveData[memberId] = {};
      }
      newLeaveData[memberId][leaveType] = hours;
      return newLeaveData;
    });
  };
  
  // Handler for remarks updates
  const handleRemarksUpdate = (memberId: string, remarks: string) => {
    setRemarksData(prev => ({
      ...prev,
      [memberId]: remarks
    }));
  };
  
  // Get manual leave hours for a member and type
  const getManualLeaveHours = (memberId: string, leaveType: string): number => {
    return manualLeaveData[memberId]?.[leaveType] || 0;
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
                
                {/* Projects count column */}
                <TableHead className="sticky-header sticky-left-12 border-r border-b bg-muted/50 w-[70px] text-center">
                  Projects
                </TableHead>
                
                {/* Office location column */}
                <TableHead className="sticky-header sticky-left-24 border-r border-b bg-muted/50 w-[90px] text-center">
                  Location
                </TableHead>
                
                {/* Capacity column */}
                <TableHead className="sticky-header sticky-left-36 border-r border-b bg-muted/50 w-[120px] text-center">
                  Capacity
                </TableHead>
                
                {/* Leave columns group */}
                <TableHead colSpan={3} className="sticky-header border-r border-b bg-muted/50 text-center">
                  Leave
                </TableHead>
                
                {/* Remarks column */}
                <TableHead className="sticky-header border-r border-b bg-muted/50 w-[160px] text-center">
                  Remarks
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
                
                {/* Empty cell for Projects column */}
                <TableHead className="sticky-header sticky-left-12 border-r border-b bg-muted/30"></TableHead>
                
                {/* Empty cell for Location column */}
                <TableHead className="sticky-header sticky-left-24 border-r border-b bg-muted/30"></TableHead>
                
                {/* Empty cell for Capacity column */}
                <TableHead className="sticky-header sticky-left-36 border-r border-b bg-muted/30"></TableHead>
                
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
                
                {/* Remarks header */}
                <TableHead className="text-center border-r border-b bg-muted/30 text-xs"></TableHead>
                
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
                
                // Get project count for this member
                const projectCount = projectCountByMember.get(member.id) || 0;
                
                // Calculate leave hours
                const annualLeave = getTotalWeeklyLeaveHours(member.id) || 0;
                const sickLeave = getManualLeaveHours(member.id, 'sick') || 0;
                const otherLeave = getManualLeaveHours(member.id, 'other') || 0;
                const totalLeave = annualLeave + sickLeave + otherLeave;
                
                // Calculate available hours after allocated hours and leave
                const allocatedHours = totalHours + totalLeave;
                const availableHours = Math.max(0, weeklyCapacity - allocatedHours);
                
                // Get remarks for this member
                const memberRemarks = remarksData[member.id] || '';
                
                // Get leave days for tooltip
                const leaveDays = getWeeklyLeave(member.id);
                
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
                    
                    {/* Projects Count - Centered with icon */}
                    <TableCell className="sticky-column sticky-left-12 border-r p-0 text-center">
                      <div className="flex items-center justify-center gap-1 py-1">
                        <Briefcase size={14} className="text-muted-foreground" />
                        <span className="text-xs font-medium">{projectCount}</span>
                      </div>
                    </TableCell>
                    
                    {/* Office Location - Centered with icon */}
                    <TableCell className="sticky-column sticky-left-24 border-r p-0 text-center">
                      <div className="flex items-center justify-center gap-1 py-1">
                        <MapPin size={14} className="text-muted-foreground" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs truncate max-w-16">{getOfficeLocation(member)}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getOfficeLocation(member)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    
                    {/* Capacity Bar - horizontal */}
                    <TableCell className="sticky-column sticky-left-36 border-r p-0 align-middle">
                      <div className="flex justify-center px-2">
                        <CapacityBar
                          availableHours={availableHours} 
                          totalCapacity={weeklyCapacity} 
                        />
                      </div>
                    </TableCell>
                    
                    {/* Annual Leave Cell - with tooltip */}
                    <TableCell className="border-r p-0 text-center w-[80px]">
                      <LeaveTooltip leaveDays={leaveDays}>
                        <div className={`w-full h-8 flex items-center justify-center ${annualLeave > 0 ? 'bg-[#F2FCE2]' : ''}`}>
                          {annualLeave > 0 ? annualLeave : '—'}
                        </div>
                      </LeaveTooltip>
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
                    
                    {/* Remarks Cell */}
                    <TableCell className="border-r p-0">
                      <RemarksCell 
                        memberId={member.id}
                        initialRemarks={memberRemarks}
                        onUpdate={handleRemarksUpdate}
                      />
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
              <TableCell className="sticky-column sticky-left-24 border-r text-center py-1"></TableCell>
              <TableCell className="sticky-column sticky-left-36 border-r text-center py-1"></TableCell>
              <TableCell className="text-center border-r py-1"></TableCell>
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
