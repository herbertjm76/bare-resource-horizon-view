
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
      <TableRow>
        {editMode && <TableHead className="w-10"><span className="sr-only">Select</span></TableHead>}
        <TableHead className="w-20">Code</TableHead>
        <TableHead>Project Name</TableHead>
        <TableHead>PM</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Country</TableHead>
        <TableHead>%Profit</TableHead>
        <TableHead>Current Stage</TableHead>
        {office_stages.map((stage) => (
          <TableHead 
            key={stage.id}
            style={{
              backgroundColor: stage.color || "#E5DEFF",
              color: "#212172"
            }}
          >
            {stage.name}
          </TableHead>
        ))}
        {editMode && <TableHead className="w-24">Actions</TableHead>}
      </TableRow>
    </TableHeader>
  );
};
