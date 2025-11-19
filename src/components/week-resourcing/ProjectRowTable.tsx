import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResourceAllocationCell } from './ResourceAllocationCell';

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

  const getAvatarUrl = (member: any): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  const getFirstName = (member: any): string => {
    return member.first_name || 'Unnamed';
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full weekly-table">
        <TableHeader>
          <TableRow style={{ background: 'hsl(var(--gradient-start))' }} className="border-b-2 border-slate-200">
            {/* Project Column */}
            <TableHead className="text-left font-semibold text-white sticky left-0 z-20 border-r border-white/20 text-sm px-4" style={{ width: 220, minWidth: 220, background: 'hsl(var(--gradient-start))' }}>
              Project
            </TableHead>
            
            {/* FTE Column */}
            <TableHead className="text-center font-semibold text-white border-r border-white/20 text-xs px-2" style={{ width: 80, minWidth: 80, background: 'hsl(var(--gradient-start))' }}>
              FTE
            </TableHead>
            
            {/* Member Columns */}
            {members.map(member => (
              <TableHead key={member.id} className="text-center font-semibold text-white border-r border-white/20 text-xs px-2" style={{ width: 60, minWidth: 60, background: 'hsl(var(--gradient-start))' }}>
                <div className="flex flex-col items-center gap-2 py-2">
                  <Avatar className="h-7 w-7 border border-white/30">
                    <AvatarImage src={getAvatarUrl(member)} alt={getFirstName(member)} />
                    <AvatarFallback className="bg-white/20 text-white text-[10px]">
                      {getUserInitials(member.first_name, member.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className="text-[10px] font-medium"
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                      whiteSpace: 'nowrap',
                      maxHeight: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {getFirstName(member)}
                  </div>
                </div>
              </TableHead>
            ))}
            
            {/* Total Column */}
            <TableHead className="text-center font-semibold text-white border-l-2 border-white/40 text-xs px-2" style={{ width: 60, minWidth: 60, background: 'hsl(var(--gradient-start))' }}>
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, index) => (
            <TableRow 
              key={project.id} 
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'} hover:bg-blue-50/80 transition-all duration-150`}
              style={{ height: 48, minHeight: 48 }}
            >
              <TableCell className="sticky left-0 z-10 bg-inherit border-r border-slate-200 px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">{project.code}</span>
                  <span className="text-sm font-medium">{project.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center border-r border-slate-200 p-0 align-middle" style={{ height: 48 }}>
                <div className="flex items-center justify-center h-full">
                  {getProjectTotal(project.id) > 0 ? (
                    <div className="inline-flex items-center justify-center bg-slate-500 text-white font-bold rounded px-2.5 py-1 text-sm min-w-[36px]">
                      {getProjectTotal(project.id)}
                    </div>
                  ) : (
                    <span className="text-transparent select-none">0</span>
                  )}
                </div>
              </TableCell>
              {members.map(member => {
                const key = `${member.id}:${project.id}`;
                const hours = allocationMap.get(key) || 0;
                return (
                  <TableCell
                    key={member.id}
                    className="text-center border-r border-slate-200 px-0.5 py-0.5 project-column bg-gradient-to-r from-purple-50 to-violet-50"
                    style={{ width: 60, minWidth: 60 }}
                  >
                    {hours > 0 && (
                      <span className="inline-flex items-center justify-center w-8 h-7 bg-emerald-500 text-white rounded-sm font-semibold text-sm hover:bg-emerald-600 transition-colors duration-100">
                        {hours}
                      </span>
                    )}
                  </TableCell>
                );
              })}
              <TableCell className="text-center bg-slate-100/80 border-l-2 border-slate-300 p-0 align-middle" style={{ height: 48 }}>
                <div className="flex items-center justify-center h-full">
                  {getProjectTotal(project.id) > 0 ? (
                    <div className="inline-flex items-center justify-center bg-slate-500 text-white font-bold rounded px-2.5 py-1 text-sm min-w-[36px]">
                      {getProjectTotal(project.id)}
                    </div>
                  ) : (
                    <span className="text-transparent select-none">0</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {/* Totals Row */}
          <TableRow style={{ background: 'hsl(var(--gradient-start))', height: 48 }} className="border-t-2 border-slate-300">
            <TableCell className="sticky left-0 z-10 text-left font-semibold text-white border-r border-white/20 px-4" style={{ background: 'hsl(var(--gradient-start))', height: 48 }}>
              Weekly Total
            </TableCell>
            <TableCell className="text-center border-r border-white/20 p-0 align-middle" style={{ background: 'hsl(var(--gradient-start))', height: 48 }}>
              <div className="flex items-center justify-center h-full">
                <div className="inline-flex items-center justify-center bg-slate-700 text-white font-bold rounded px-2.5 py-1 text-sm min-w-[36px]">
                  {members.reduce((sum, member) => sum + getMemberTotal(member.id), 0)}
                </div>
              </div>
            </TableCell>
            {members.map(member => (
              <TableCell key={member.id} className="text-center border-r border-white/20 p-0 align-middle" style={{ background: 'hsl(var(--gradient-start))', height: 48 }}>
                <div className="flex items-center justify-center h-full">
                  {getMemberTotal(member.id) > 0 ? (
                    <div className="inline-flex items-center justify-center bg-slate-700 text-white font-bold rounded px-2.5 py-1 text-sm min-w-[36px]">
                      {getMemberTotal(member.id)}
                    </div>
                  ) : (
                    <span className="text-transparent select-none">0</span>
                  )}
                </div>
              </TableCell>
            ))}
            <TableCell className="text-center border-l-2 border-white/40 p-0 align-middle" style={{ background: 'hsl(var(--gradient-start))', height: 48 }}>
              <div className="flex items-center justify-center h-full">
                <div className="inline-flex items-center justify-center bg-slate-700 text-white font-bold rounded px-2.5 py-1 text-sm min-w-[36px]">
                  {members.reduce((sum, member) => sum + getMemberTotal(member.id), 0)}
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
