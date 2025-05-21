
import React, { useMemo } from 'react';
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
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

  return (
    <TooltipProvider>
      <div className="annual-leave-calendar grid-table-outer-container border rounded-md shadow-sm">
        <div className="grid-table-container">
          <Table className="resource-allocation-table">
            <TableHeader>
              <TableRow className="bg-muted/50 h-12">
                <TableHead className="sticky-header sticky-left-0 border-r border-b bg-muted/50 w-[80px]">Resources</TableHead>
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
                <TableHead className="sticky-header text-center border-b bg-muted/50 w-[60px]">Total</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {Array.from(membersMap.values()).map((member: any, idx: number) => {
                // Get weekly capacity or default to 40
                const weeklyCapacity = member.weekly_capacity || 40;
                const totalHours = memberTotals.get(member.id) || 0;
                const utilization = Math.round((totalHours / weeklyCapacity) * 100);
                
                // Alternating row background
                const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-muted/10';
                
                return (
                  <TableRow key={member.id} className={`h-9 ${rowBg} hover:bg-muted/20`}>
                    <TableCell className="sticky-column sticky-left-0 border-r font-medium pl-2 pr-1 py-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{getFirstName(member)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getMemberName(member)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    
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
              <TableCell className="sticky-column sticky-left-0 border-r font-semibold pl-2 py-1">Project Totals</TableCell>
              
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
