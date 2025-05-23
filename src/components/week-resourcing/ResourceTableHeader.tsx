
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

interface ResourceTableHeaderProps {
  projects: any[];
  showRemarks?: boolean;  // Added the showRemarks property as optional
}

export const ResourceTableHeader: React.FC<ResourceTableHeaderProps> = ({ projects, showRemarks = false }) => {
  return (
    <TableHeader className="sticky top-0 z-10 bg-white border-b">
      <TableRow className="h-12">
        {/* Member info cells */}
        <TableHead className="w-48 max-w-48 min-w-32 border-r sticky left-0 z-20 bg-white">Name</TableHead>
        <TableHead className="w-12 text-center border-r">#</TableHead>
        
        {/* Capacity bar header */}
        <TableHead className="w-24 text-center border-r">Capacity</TableHead>
        
        {/* Leave cells - rearranged order */}
        <TableHead className="w-10 text-center border-r">AL</TableHead>
        <TableHead className="w-10 text-center border-r">HO</TableHead>
        <TableHead className="w-10 text-center border-r">OL</TableHead>
        
        {/* Office Location Header - moved to the end */}
        <TableHead className="w-14 text-center border-r">Off</TableHead>
        
        {/* Project allocation headers - with more distinct styling */}
        {projects.map((project, idx) => {
          // Add a thicker border between every third project
          const borderClass = (idx + 1) % 3 === 0 ? "border-r-2 border-r-brand-violet/20" : "border-r";
          return (
            <TableHead 
              key={project.id} 
              className={`w-10 text-center ${borderClass} ${!project.isEmpty ? "bg-brand-violet-light/40 text-brand-violet font-medium" : ""}`}
            >
              {!project.isEmpty ? `P${idx + 1}` : ''}
            </TableHead>
          );
        })}
        
        {/* Add Remarks column if showRemarks is true */}
        {showRemarks && (
          <TableHead className="w-40 text-center border-r">Remarks</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};
