
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
    
    // Log allocations for debugging
    console.log('Processing allocations:', allocations);
    
    allocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      // Log each allocation we're processing
      console.log(`Found allocation: ${allocation.resource_id} -> ${allocation.project_id}: ${allocation.hours}h`);
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
  
  // Helper to get member display name
  const getMemberName = (member: any): string => {
    if (!member) return 'Unknown';
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed';
  };

  return (
    <div className="rounded-md border shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[200px]">Resources</TableHead>
            {projects.map(project => (
              <TableHead key={project.id} className="text-center">
                <div className="flex flex-col items-center">
                  <span className="font-semibold">{project.code}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={project.name}>
                    {project.name}
                  </span>
                </div>
              </TableHead>
            ))}
            <TableHead className="text-center">Total</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {Array.from(membersMap.values()).map((member: any) => {
            // Get weekly capacity or default to 40
            const weeklyCapacity = member.weekly_capacity || 40;
            const totalHours = memberTotals.get(member.id) || 0;
            const utilization = Math.round((totalHours / weeklyCapacity) * 100);
            
            return (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{getMemberName(member)}</span>
                    <span className="text-xs text-muted-foreground">
                      {member.job_title || 'Team Member'}
                    </span>
                  </div>
                </TableCell>
                
                {projects.map(project => {
                  const key = `${member.id}:${project.id}`;
                  const hours = allocationMap.get(key) || 0;
                  
                  return (
                    <TableCell key={`${member.id}-${project.id}`} className="text-center">
                      <ResourceAllocationCell 
                        hours={hours}
                        resourceId={member.id}
                        projectId={project.id}
                        weekStartDate={weekStartDate}
                      />
                    </TableCell>
                  );
                })}
                
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{totalHours}h</span>
                    <Badge variant={utilization > 100 ? "destructive" : utilization > 80 ? "outline" : "outline"}>
                      {utilization}%
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        
        {/* Totals row */}
        <TableRow className="bg-muted/30 font-medium">
          <TableCell>Project Totals</TableCell>
          
          {projects.map(project => (
            <TableCell key={`total-${project.id}`} className="text-center">
              {projectTotals.get(project.id) || 0}h
            </TableCell>
          ))}
          
          <TableCell className="text-center">
            {Array.from(projectTotals.values()).reduce((sum, hours) => sum + hours, 0)}h
          </TableCell>
        </TableRow>
      </Table>
    </div>
  );
};
