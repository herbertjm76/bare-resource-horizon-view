import React from 'react';
import { TableHead, TableRow } from "@/components/ui/table";

type ColumnKey = 'code' | 'abbreviation' | 'name' | 'pm' | 'status' | 'country' | 'department' | 'stage';

interface ProjectTableHeaderProps {
  editMode: boolean;
  office_stages: Array<{ id: string; name: string; color?: string }>;
  expandedColumn: ColumnKey | null;
  onColumnClick: (column: ColumnKey) => void;
}

export const ProjectTableHeader: React.FC<ProjectTableHeaderProps> = ({ 
  editMode, 
  office_stages,
  expandedColumn,
  onColumnClick
}) => {
  const handleColumnClick = (column: ColumnKey) => {
    onColumnClick(expandedColumn === column ? null : column);
  };

  return (
    <TableRow style={{ background: 'linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-mid)), hsl(var(--gradient-end)))' }}>
      {editMode && <TableHead className="w-10" style={{ background: 'transparent', color: 'white' }}><span className="sr-only">Select</span></TableHead>}
      <TableHead 
        className="cursor-pointer hover:opacity-80 transition-opacity" 
        style={{ background: 'transparent', color: 'white' }}
        onClick={() => handleColumnClick('code')}
      >
        Code
      </TableHead>
      <TableHead 
        className="cursor-pointer hover:opacity-80 transition-opacity" 
        style={{ background: 'transparent', color: 'white' }}
        onClick={() => handleColumnClick('abbreviation')}
      >
        Abbreviation
      </TableHead>
      <TableHead 
        className="cursor-pointer hover:opacity-80 transition-opacity" 
        style={{ background: 'transparent', color: 'white' }}
        onClick={() => handleColumnClick('name')}
      >
        Project Name
      </TableHead>
      <TableHead 
        className="cursor-pointer hover:opacity-80 transition-opacity" 
        style={{ background: 'transparent', color: 'white' }}
        onClick={() => handleColumnClick('pm')}
      >
        PM
      </TableHead>
      <TableHead 
        className="cursor-pointer hover:opacity-80 transition-opacity" 
        style={{ background: 'transparent', color: 'white' }}
        onClick={() => handleColumnClick('status')}
      >
        Status
      </TableHead>
      <TableHead 
        className="cursor-pointer hover:opacity-80 transition-opacity" 
        style={{ background: 'transparent', color: 'white' }}
        onClick={() => handleColumnClick('country')}
      >
        Country
      </TableHead>
      <TableHead 
        className="cursor-pointer hover:opacity-80 transition-opacity" 
        style={{ background: 'transparent', color: 'white' }}
        onClick={() => handleColumnClick('department')}
      >
        Department
      </TableHead>
      <TableHead 
        className="cursor-pointer hover:opacity-80 transition-opacity" 
        style={{ background: 'transparent', color: 'white' }}
        onClick={() => handleColumnClick('stage')}
      >
        Current Stage
      </TableHead>
      {editMode && <TableHead className="w-24" style={{ background: 'transparent', color: 'white' }}>Actions</TableHead>}
    </TableRow>
  );
};
