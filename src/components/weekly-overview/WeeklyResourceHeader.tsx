
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const WeeklyResourceHeader: React.FC = () => {
  return (
    <TableHeader className="bg-muted/50 sticky top-0 z-10">
      <TableRow>
        <TableHead className="py-2 px-4 name-column">
          <div className="font-medium">Name</div>
        </TableHead>
        
        <TableHead className="py-2 px-4 office-column">
          <div className="font-medium">Office</div>
        </TableHead>
        
        {/* Normal horizontal header cells */}
        <TableHead className="header-cell number-column">
          <div className="font-medium">Projects</div>
        </TableHead>
        
        <TableHead className="header-cell number-column bg-orange-400 text-white">
          <div className="font-medium">Capacity</div>
        </TableHead>
        
        <TableHead className="header-cell number-column">
          <div className="font-medium">Utilisation</div>
        </TableHead>
        
        <TableHead className="header-cell number-column bg-yellow-100">
          <div className="font-medium">Annual Leave</div>
        </TableHead>
        
        <TableHead className="header-cell number-column">
          <div className="font-medium">Public Holiday</div>
        </TableHead>
        
        <TableHead className="header-cell number-column">
          <div className="font-medium">Vacation Leave</div>
        </TableHead>
        
        <TableHead className="header-cell number-column">
          <div className="font-medium">Medical Leave</div>
        </TableHead>
        
        <TableHead className="header-cell number-column">
          <div className="font-medium">Others</div>
        </TableHead>
        
        <TableHead className="py-2 px-4 remarks-column">
          <div className="font-medium">Remarks</div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
