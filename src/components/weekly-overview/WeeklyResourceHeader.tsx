
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const WeeklyResourceHeader: React.FC = () => {
  return (
    <TableHeader className="bg-muted/50 sticky top-0 z-10">
      <TableRow>
        <TableHead className="py-0 px-4 name-column">
          <div>Name</div>
        </TableHead>
        <TableHead className="py-0 px-4">
          <div>Office</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div className="font-medium">Projects</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column bg-orange-400 text-white">
          <div className="font-medium">Capacity</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div className="font-medium">Utilisation</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column bg-yellow-100">
          <div className="font-medium">Annual Leave</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div className="font-medium">Public Holiday</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div className="font-medium">Vacation Leave</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div className="font-medium">Medical Leave</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div className="font-medium">Others</div>
        </TableHead>
        <TableHead className="py-0 px-4 min-w-[100px]">
          <div>Remarks</div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
