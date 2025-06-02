import React from 'react';
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CapacityBar } from './CapacityBar';

interface NewResourceTableProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: string;
}

export const NewResourceTable: React.FC<NewResourceTableProps> = ({
  projects,
  members,
  allocations,
  weekStartDate
}) => {
  // Create allocation map for quick lookups
  const allocationMap = new Map();
  allocations.forEach(allocation => {
    const key = `${allocation.resource_id}:${allocation.project_id}`;
    allocationMap.set(key, allocation.hours);
  });

  // Calculate member totals
  const getMemberTotal = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId)
      .reduce((sum, a) => sum + a.hours, 0);
  };

  // Calculate project count for member
  const getProjectCount = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId && a.hours > 0)
      .length;
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-full overflow-hidden border rounded-md shadow-sm mt-8">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-max">
            <TableHeader className="sticky top-0 z-10 bg-white border-b">
              <TableRow className="h-12">
                <TableHead className="w-48 border-r bg-white sticky left-0 z-20">Name</TableHead>
                <TableHead className="w-16 text-center border-r">#</TableHead>
                <TableHead className="w-32 text-center border-r">Capacity</TableHead>
                <TableHead className="w-12 text-center border-r">AL</TableHead>
                <TableHead className="w-12 text-center border-r">HO</TableHead>
                <TableHead className="w-12 text-center border-r">OL</TableHead>
                <TableHead className="w-16 text-center border-r">Off</TableHead>
                
                {/* Project headers */}
                {projects.slice(0, 15).map((project, idx) => (
                  <TableHead key={project.id} className="w-10 text-center border-r">
                    <div className="flex items-center justify-center h-full">
                      <div 
                        className="text-xs font-bold whitespace-nowrap"
                        style={{
                          transform: 'rotate(-90deg)',
                          transformOrigin: 'center',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {project.code || `P${idx + 1}`}
                      </div>
                    </div>
                  </TableHead>
                ))}
                
                {/* Fill empty project columns if less than 15 */}
                {Array.from({ length: Math.max(0, 15 - projects.length) }).map((_, idx) => (
                  <TableHead key={`empty-${idx}`} className="w-10 text-center border-r">
                    <div className="h-10"></div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {members.map((member, memberIndex) => {
                const weeklyCapacity = member.weekly_capacity || 40;
                const totalHours = getMemberTotal(member.id);
                const projectCount = getProjectCount(member.id);
                const availableHours = Math.max(0, weeklyCapacity - totalHours);
                const isEvenRow = memberIndex % 2 === 0;
                
                return (
                  <TableRow 
                    key={member.id}
                    className={`h-9 ${isEvenRow ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/50`}
                  >
                    {/* Name */}
                    <TableCell className="font-medium border-r bg-white sticky left-0 z-10">
                      <div className="truncate max-w-[180px]" title={`${member.first_name} ${member.last_name}`}>
                        {member.first_name} {member.last_name}
                      </div>
                    </TableCell>
                    
                    {/* Project Count */}
                    <TableCell className="text-center border-r">
                      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {projectCount}
                      </span>
                    </TableCell>
                    
                    {/* Capacity Bar */}
                    <TableCell className="border-r p-2">
                      <CapacityBar 
                        availableHours={availableHours} 
                        totalCapacity={weeklyCapacity} 
                      />
                    </TableCell>
                    
                    {/* Annual Leave */}
                    <TableCell className="text-center border-r">
                      <input
                        type="number"
                        min="0"
                        max="40"
                        defaultValue="0"
                        className="w-8 h-6 text-xs text-center border border-gray-300 rounded"
                        placeholder="0"
                      />
                    </TableCell>
                    
                    {/* Holiday */}
                    <TableCell className="text-center border-r">
                      <input
                        type="number"
                        min="0"
                        max="40"
                        defaultValue="0"
                        className="w-8 h-6 text-xs text-center border border-gray-300 rounded"
                        placeholder="0"
                      />
                    </TableCell>
                    
                    {/* Other Leave */}
                    <TableCell className="text-center border-r">
                      <input
                        type="number"
                        min="0"
                        max="40"
                        defaultValue="0"
                        className="w-8 h-6 text-xs text-center border border-gray-300 rounded"
                        placeholder="0"
                      />
                    </TableCell>
                    
                    {/* Office */}
                    <TableCell className="text-center border-r text-xs text-gray-600">
                      {member.location || 'N/A'}
                    </TableCell>
                    
                    {/* Project allocation cells */}
                    {projects.slice(0, 15).map((project) => {
                      const key = `${member.id}:${project.id}`;
                      const hours = allocationMap.get(key) || 0;
                      
                      return (
                        <TableCell key={project.id} className="border-r p-1">
                          <input
                            type="number"
                            min="0"
                            max="40"
                            value={hours || ''}
                            className="w-8 h-6 text-xs text-center border border-gray-300 rounded"
                            placeholder="0"
                            readOnly
                          />
                        </TableCell>
                      );
                    })}
                    
                    {/* Fill empty project columns if less than 15 */}
                    {Array.from({ length: Math.max(0, 15 - projects.length) }).map((_, idx) => (
                      <TableCell key={`empty-${idx}`} className="border-r p-1">
                        <input
                          type="number"
                          min="0"
                          max="40"
                          className="w-8 h-6 text-xs text-center border border-gray-300 rounded"
                          placeholder="0"
                          disabled
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};
