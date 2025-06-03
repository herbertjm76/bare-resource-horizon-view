
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
      <TableRow style={{ backgroundColor: '#6465F0' }}>
        {editMode && <TableHead className="w-10" style={{ backgroundColor: '#6465F0', color: 'white' }}><span className="sr-only">Select</span></TableHead>}
        <TableHead className="w-20" style={{ backgroundColor: '#6465F0', color: 'white' }}>Code</TableHead>
        <TableHead style={{ backgroundColor: '#6465F0', color: 'white' }}>Project Name</TableHead>
        <TableHead style={{ backgroundColor: '#6465F0', color: 'white' }}>PM</TableHead>
        <TableHead style={{ backgroundColor: '#6465F0', color: 'white' }}>Status</TableHead>
        <TableHead style={{ backgroundColor: '#6465F0', color: 'white' }}>Country</TableHead>
        <TableHead style={{ backgroundColor: '#6465F0', color: 'white' }}>%Profit</TableHead>
        <TableHead style={{ backgroundColor: '#6465F0', color: 'white' }}>Current Stage</TableHead>
        {office_stages.map((stage) => (
          <TableHead 
            key={stage.id}
            style={{
              backgroundColor: '#6465F0',
              color: 'white'
            }}
          >
            {stage.name}
          </TableHead>
        ))}
        {editMode && <TableHead className="w-24" style={{ backgroundColor: '#6465F0', color: 'white' }}>Actions</TableHead>}
      </TableRow>
    </TableHeader>
  );
};
