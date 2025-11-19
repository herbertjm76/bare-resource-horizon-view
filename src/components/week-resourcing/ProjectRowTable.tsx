import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProjectRowTableProps {
  projects: any[];
  members: any[];
  allocationMap: Map<string, number>;
  weekStartDate: string;
}

export const ProjectRowTable: React.FC<ProjectRowTableProps> = ({
  projects,
  members,
  allocationMap,
  weekStartDate
}) => {
  // Calculate member totals
  const getMemberTotal = (memberId: string): number => {
    let total = 0;
    projects.forEach(project => {
      const key = `${memberId}:${project.id}`;
      total += allocationMap.get(key) || 0;
    });
    return total;
  };

  // Calculate project totals
  const getProjectTotal = (projectId: string): number => {
    let total = 0;
    members.forEach(member => {
      const key = `${member.id}:${projectId}`;
      total += allocationMap.get(key) || 0;
    });
    return total;
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    const first = (firstName || '').trim();
    const last = (lastName || '').trim();
    if (!first && !last) return '?';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 bg-muted font-semibold min-w-[200px]">
              Project
            </TableHead>
            {members.map(member => (
              <TableHead key={member.id} className="text-center min-w-[80px] font-medium">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {getUserInitials(member.first_name, member.last_name)}
                  </div>
                  <div className="text-xs truncate max-w-[80px]">
                    {member.first_name} {member.last_name}
                  </div>
                </div>
              </TableHead>
            ))}
            <TableHead className="text-center font-semibold bg-muted/50">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, index) => (
            <TableRow key={project.id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{project.code}</span>
                  <span className="text-sm">{project.name}</span>
                </div>
              </TableCell>
              {members.map(member => {
                const key = `${member.id}:${project.id}`;
                const hours = allocationMap.get(key) || 0;
                return (
                  <TableCell key={member.id} className="text-center">
                    {hours > 0 ? (
                      <span className="text-sm font-medium">{hours}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                );
              })}
              <TableCell className="text-center font-semibold bg-muted/30">
                {getProjectTotal(project.id)}
              </TableCell>
            </TableRow>
          ))}
          {/* Totals Row */}
          <TableRow className="bg-muted font-semibold">
            <TableCell className="sticky left-0 z-10 bg-muted">
              FTE/Week
            </TableCell>
            {members.map(member => (
              <TableCell key={member.id} className="text-center">
                {getMemberTotal(member.id)}
              </TableCell>
            ))}
            <TableCell className="text-center">
              {members.reduce((sum, member) => sum + getMemberTotal(member.id), 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
