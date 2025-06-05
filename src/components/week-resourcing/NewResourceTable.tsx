
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NewResourceTableRow } from './NewResourceTableRow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Target, Download, Upload } from 'lucide-react';

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
  // Create allocation map for quick lookup
  const allocationMap = useMemo(() => {
    const map = new Map<string, number>();
    allocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      map.set(key, allocation.hours || 0);
    });
    return map;
  }, [allocations]);

  // Calculate member totals
  const getMemberTotal = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId)
      .reduce((sum, a) => sum + (a.hours || 0), 0);
  };

  // Calculate project count per member
  const getProjectCount = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId && a.hours > 0)
      .length;
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand-violet" />
            <span className="text-sm font-medium">Weekly Resource Allocation</span>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {members.length} Team Members
          </Badge>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {projects.length} Projects
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table Container with rounded corners */}
      <Card className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/30">
        <div className="weekly-table-wrapper">
          <div className="weekly-table-container">
            <Table className="weekly-overview-table">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="font-semibold text-center border-r bg-brand-violet text-white sticky left-0 z-15 min-w-[150px] rounded-tl-xl">
                    Name
                  </TableHead>
                  <TableHead className="text-center border-r bg-brand-violet text-white">
                    <div className="weekly-project-header">Projects</div>
                  </TableHead>
                  <TableHead className="text-center border-r bg-brand-violet text-white">
                    <div className="weekly-project-header">Capacity</div>
                  </TableHead>
                  <TableHead className="text-center border-r bg-brand-violet text-white">
                    <div className="weekly-project-header">AL</div>
                  </TableHead>
                  <TableHead className="text-center border-r bg-brand-violet text-white">
                    <div className="weekly-project-header">Holiday</div>
                  </TableHead>
                  <TableHead className="text-center border-r bg-brand-violet text-white">
                    <div className="weekly-project-header">OL</div>
                  </TableHead>
                  <TableHead className="text-center border-r bg-brand-violet text-white">
                    <div className="weekly-project-header">Office</div>
                  </TableHead>
                  
                  {/* Project columns - minimum 15 */}
                  {Array.from({ length: Math.max(15, projects.length) }).map((_, idx) => {
                    const project = projects[idx];
                    return (
                      <TableHead 
                        key={project?.id || `empty-${idx}`} 
                        className={`text-center border-r bg-brand-violet text-white ${idx === Math.max(15, projects.length) - 1 ? 'rounded-tr-xl border-r-0' : ''}`}
                      >
                        <div className="weekly-project-header">
                          {project ? project.code || project.name?.substring(0, 6) : ''}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {members.map((member, idx) => (
                  <NewResourceTableRow
                    key={member.id}
                    member={member}
                    memberIndex={idx}
                    projects={projects}
                    allocationMap={allocationMap}
                    getMemberTotal={getMemberTotal}
                    getProjectCount={getProjectCount}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};
