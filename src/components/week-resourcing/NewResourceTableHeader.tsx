
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface NewResourceTableHeaderProps {
  projects: any[];
  viewMode?: 'compact' | 'expanded';
}

export const NewResourceTableHeader: React.FC<NewResourceTableHeaderProps> = ({
  projects,
  viewMode = 'compact'
}) => {
  if (viewMode === 'expanded') {
    return (
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-slate-100 to-gray-100 border-b-2 border-gray-300">
          <TableHead className="font-bold text-gray-800 border-r border-gray-200 px-4 py-3 min-w-[180px]">
            Team Member
          </TableHead>
          <TableHead className="text-center font-bold text-gray-800 border-r border-gray-200 px-3 py-3">
            Projects
          </TableHead>
          <TableHead className="text-center font-bold text-gray-800 border-r border-gray-200 px-3 py-3">
            Weekly Capacity Utilization
          </TableHead>
          <TableHead className="text-center font-bold text-gray-800 border-r border-gray-200 px-3 py-3">
            Leave Status
          </TableHead>
          {projects.map((project) => (
            <TableHead
              key={project.id}
              className="text-center font-bold text-gray-800 border-r border-gray-200 px-2 py-3"
              style={{ minWidth: 60 }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-gray-600">
                  {project.code || 'N/A'}
                </span>
                <span className="text-sm font-bold text-gray-800 leading-tight">
                  {project.name}
                </span>
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    );
  }

  // Compact view
  return (
    <TableHeader>
      <TableRow className="border-b-2 border-gray-300" style={{ backgroundColor: '#6465F0' }}>
        {/* Team Member - 180px */}
        <TableHead 
          className="font-bold border-r border-gray-200 px-2 py-2 name-column"
          style={{ width: 180, minWidth: 180, maxWidth: 180, backgroundColor: '#6465F0', color: 'white' }}
        >
          <div className="text-center text-xs leading-tight">
            <div>Team</div>
            <div>Member</div>
          </div>
        </TableHead>
        
        {/* Utilization - flexible width with 2-line title */}
        <TableHead 
          className="text-center font-bold border-r border-gray-200 px-1 py-2 utilization-column"
          style={{ backgroundColor: '#6465F0', color: 'white' }}
        >
          <div className="text-xs leading-tight">
            <div>Weekly Resource</div>
            <div>Utilization & Capacity</div>
          </div>
        </TableHead>
        
        {/* Leave Status - 150px */}
        <TableHead 
          className="text-center font-bold border-r border-gray-200 px-1 py-2 leave-column"
          style={{ width: 150, minWidth: 150, maxWidth: 150, backgroundColor: '#6465F0', color: 'white' }}
        >
          <div className="text-xs leading-tight">
            <div>Leave</div>
            <div>Status</div>
          </div>
        </TableHead>

        {/* Project Count - 35px with rotated text */}
        <TableHead 
          className="text-center font-bold border-r border-gray-200 count-column count-column-header relative"
          style={{ width: 35, minWidth: 35, maxWidth: 35, backgroundColor: '#6465F0', color: 'white' }}
        >
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              fontSize: '11px',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            No. of Projects
          </div>
        </TableHead>
        
        {/* Project columns - all 35px wide with rotated text */}
        {projects.map((project) => (
          <TableHead
            key={project.id}
            className="text-center font-bold border-r border-gray-200 px-1 py-2 project-column project-code-header relative"
            style={{ width: 35, minWidth: 35, maxWidth: 35, backgroundColor: '#6465F0', color: 'white' }}
          >
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
                fontSize: '10px',
                fontWeight: 700,
                whiteSpace: 'nowrap'
              }}
            >
              {project.code || 'N/A'}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
