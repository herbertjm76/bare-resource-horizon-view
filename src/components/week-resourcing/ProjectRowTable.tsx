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
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow style={{ background: 'hsl(var(--gradient-start))' }} className="border-b-2 border-slate-200">
            {/* Project Column */}
            <TableHead className="text-center font-semibold text-white sticky left-0 z-20 border-r border-white/20 text-sm" style={{ width: 180, minWidth: 180, background: 'hsl(var(--gradient-start))' }}>
              Project
            </TableHead>
            
            {/* Member Columns */}
            {members.map(member => (
              <TableHead key={member.id} className="text-center font-semibold text-white border-r border-white/20 text-sm" style={{ width: 120, minWidth: 120, background: 'hsl(var(--gradient-start))' }}>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold text-white">
                    {getUserInitials(member.first_name, member.last_name)}
                  </div>
                  <div className="text-xs truncate max-w-[100px]">
                    {member.first_name} {member.last_name}
                  </div>
                </div>
              </TableHead>
            ))}
            
            {/* Total Column */}
            <TableHead className="text-center font-semibold text-white border-l-2 border-white/40 text-sm" style={{ width: 100, minWidth: 100, background: 'hsl(var(--gradient-start))' }}>
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, index) => (
            <TableRow key={project.id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
              <TableCell className="sticky left-0 z-10 bg-background font-medium border-r border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{project.code}</span>
                  <span className="text-sm">{project.name}</span>
                </div>
              </TableCell>
              {members.map(member => {
                const key = `${member.id}:${project.id}`;
                const hours = allocationMap.get(key) || 0;
                return (
                  <TableCell key={member.id} className="text-center border-r border-slate-200">
                    {hours > 0 ? (
                      <span className="text-sm font-medium">{hours}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                );
              })}
              <TableCell className="text-center font-semibold bg-muted/30 border-l-2 border-slate-300">
                {getProjectTotal(project.id)}
              </TableCell>
            </TableRow>
          ))}
          {/* Totals Row */}
          <TableRow style={{ background: 'hsl(var(--gradient-start))' }} className="border-t-2 border-slate-300">
            <TableCell className="sticky left-0 z-10 text-center font-semibold text-white border-r border-white/20" style={{ background: 'hsl(var(--gradient-start))' }}>
              FTE/Week
            </TableCell>
            {members.map(member => (
              <TableCell key={member.id} className="text-center font-semibold text-white border-r border-white/20" style={{ background: 'hsl(var(--gradient-start))' }}>
                {getMemberTotal(member.id)}
              </TableCell>
            ))}
            <TableCell className="text-center font-semibold text-white border-l-2 border-white/40" style={{ background: 'hsl(var(--gradient-start))' }}>
              {members.reduce((sum, member) => sum + getMemberTotal(member.id), 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
