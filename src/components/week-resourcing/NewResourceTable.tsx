
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NewResourceTableRow } from './NewResourceTableRow';
import { NewResourceSummaryRow } from './NewResourceSummaryRow';

interface NewResourceTableProps {
  members: any[];
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  otherLeaveData?: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  updateOtherLeave?: (memberId: string, hours: number, notes?: string) => Promise<boolean>;
  viewMode: 'compact' | 'expanded';
  selectedWeek?: Date;
}

export const NewResourceTable: React.FC<NewResourceTableProps> = ({
  members,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  otherLeaveData = {},
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  updateOtherLeave,
  viewMode,
  selectedWeek = new Date()
}) => {
  // Debug viewMode prop
  console.log('NewResourceTable RENDER - Received viewMode:', viewMode);
  
  // Add useEffect to track viewMode changes  
  React.useEffect(() => {
    console.log('NewResourceTable useEffect - viewMode prop changed to:', viewMode);
  }, [viewMode]);
  
  // Filter projects to only show those with allocated hours
  const projectsWithHours = React.useMemo(() => {
    return projects.filter(project => {
      let projectTotal = 0;
      
      // Calculate total hours for this project across all members
      members.forEach(member => {
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        projectTotal += hours;
      });
      
      console.log(`Project ${project.code || project.name}: ${projectTotal}h total - ${projectTotal > 0 ? 'SHOWING' : 'HIDING'}`);
      return projectTotal > 0;
    });
  }, [projects, members, allocationMap]);
  
  console.log('NewResourceTable - Projects filtering:', {
    originalCount: projects.length,
    filteredCount: projectsWithHours.length,
    hiddenCount: projects.length - projectsWithHours.length
  });
  
  const tableClassName = viewMode === 'compact' 
    ? 'resource-table-compact weekly-table' 
    : 'resource-table-expanded weekly-table';

  const containerClassName = viewMode === 'compact'
    ? 'resource-table-compact-container'
    : 'resource-table-expanded-container';

  console.log('NewResourceTable - Using classes:', { tableClassName, containerClassName });

  return (
    <div className={containerClassName}>
      <div className="overflow-x-auto">
        <Table className={`${tableClassName} min-w-full`}>
          <TableHeader>
            <TableRow className="bg-[#6465F0] hover:bg-[#6465F0] border-b-2 border-slate-200">
              {/* Team Member Column */}
              <TableHead className="text-center font-semibold text-white sticky left-0 bg-[#6465F0] z-20 border-r border-white/20 text-sm" style={{ width: 180, minWidth: 180 }}>
                Team Member
              </TableHead>
              
              {/* Utilization Column */}
              <TableHead className="text-center font-semibold text-white bg-[#6465F0] border-r border-white/20 text-sm" style={{ width: 200, minWidth: 200 }}>
                Total Utilization (1 week)
              </TableHead>
              
              {/* Leave Column */}
              <TableHead className="text-center font-semibold text-white bg-[#6465F0] border-r border-white/20 text-sm" style={{ width: 150, minWidth: 150 }}>
                Leave
              </TableHead>
              
              {/* Project Count Column */}
              <TableHead className="text-center font-semibold text-white bg-[#6465F0] border-r border-white/20 text-sm" style={{ width: 35, minWidth: 35 }}>
                Count
              </TableHead>
              
              {/* Project Columns with Rotated Text - Only show projects with hours */}
              {projectsWithHours.map((project) => (
                <TableHead 
                  key={project.id} 
                  className="text-center font-semibold text-white border-r border-white/20 bg-[#6465F0] relative text-sm"
                  style={{ width: 35, minWidth: 35, height: 120 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="transform -rotate-90 whitespace-nowrap text-xs font-medium"
                      style={{ 
                        transformOrigin: 'center',
                        maxWidth: '100px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={`${project.code || project.name} - ${project.name}`}
                    >
                      {project.code || project.name}
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, index) => (
              <NewResourceTableRow
                key={member.id}
                member={member}
                memberIndex={index}
                projects={projectsWithHours}
                allocationMap={allocationMap}
                annualLeaveData={annualLeaveData}
                holidaysData={holidaysData}
                otherLeaveData={otherLeaveData}
                getMemberTotal={getMemberTotal}
                getProjectCount={getProjectCount}
                getWeeklyLeave={getWeeklyLeave}
                updateOtherLeave={updateOtherLeave}
                viewMode={viewMode}
                selectedWeek={selectedWeek}
              />
            ))}
            <NewResourceSummaryRow
              projects={projectsWithHours}
              allocationMap={allocationMap}
              members={members}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
