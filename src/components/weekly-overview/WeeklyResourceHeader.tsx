
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const WeeklyResourceHeader: React.FC = () => {
  return (
    <TableHeader className="bg-muted/50 sticky top-0 z-10">
      <TableRow>
        <TableHead className="py-0 px-2 name-column">Name</TableHead>
        <TableHead className="py-0 px-2">Office</TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>Projects</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column bg-orange-400 text-white">
          <div>Capacity</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>Utilisation</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column bg-yellow-100">
          <div>Annual Leave</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>Public Holiday</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>Vacation Leave</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>Medical Leave</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>Others</div>
        </TableHead>
        <TableHead className="py-0 px-2 min-w-[100px]">Remarks</TableHead>
      </TableRow>
    </TableHeader>
  );
};
