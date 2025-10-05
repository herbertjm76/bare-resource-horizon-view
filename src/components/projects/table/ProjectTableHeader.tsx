
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProjectTableHeaderProps {
  editMode: boolean;
  office_stages: Array<{ id: string; name: string; color?: string }>;
}

export const ProjectTableHeader: React.FC<ProjectTableHeaderProps> = ({ 
  editMode, 
  office_stages 
}) => {
  return (
    <TableHeader>
      <TableRow style={{ background: 'linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-mid)), hsl(var(--gradient-end)))' }}>
        {editMode && <TableHead className="w-10" style={{ background: 'transparent', color: 'white' }}><span className="sr-only">Select</span></TableHead>}
        <TableHead className="w-20" style={{ background: 'transparent', color: 'white' }}>Code</TableHead>
        <TableHead style={{ background: 'transparent', color: 'white' }}>Project Name</TableHead>
        <TableHead style={{ background: 'transparent', color: 'white' }}>PM</TableHead>
        <TableHead style={{ background: 'transparent', color: 'white' }}>Status</TableHead>
        <TableHead style={{ background: 'transparent', color: 'white' }}>Country</TableHead>
        {/* <TableHead style={{ background: 'transparent', color: 'white' }}>%Profit</TableHead> */}
        <TableHead style={{ background: 'transparent', color: 'white' }}>Current Stage</TableHead>
        {/* Stage fee columns hidden for MVP */}
        {/* {office_stages.map((stage) => (
          <TableHead 
            key={stage.id}
            className="text-center px-2 py-4 min-w-[100px]"
            style={{ background: 'transparent' }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div 
                className="px-3 py-2 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: stage.color || '#E5DEFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <span 
                  className="text-xs font-semibold whitespace-nowrap"
                  style={{ 
                    color: '#212172',
                    fontSize: '11px'
                  }}
                >
                  {stage.name}
                </span>
              </div>
            </div>
          </TableHead>
        ))} */}
        {editMode && <TableHead className="w-24" style={{ background: 'transparent', color: 'white' }}>Actions</TableHead>}
      </TableRow>
    </TableHeader>
  );
};
