
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const WeeklyResourceHeader: React.FC = () => {
  return (
    <TableHeader className="bg-muted/50 sticky top-0 z-10">
      <TableRow>
        <TableHead className="py-2 px-4 name-column">
          <div>Name</div>
        </TableHead>
        <TableHead className="py-2 px-4">
          <div>Office</div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>
            <span className="font-medium">Projects</span>
          </div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column bg-orange-400 text-white">
          <div>
            <span className="font-medium">Capacity</span>
          </div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>
            <span className="font-medium">Utilisation</span>
          </div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column bg-yellow-100">
          <div>
            <span className="font-medium">Annual Leave</span>
          </div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>
            <span className="font-medium">Public Holiday</span>
          </div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>
            <span className="font-medium">Vacation Leave</span>
          </div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>
            <span className="font-medium">Medical Leave</span>
          </div>
        </TableHead>
        <TableHead className="vertical-text text-center number-column">
          <div>
            <span className="font-medium">Others</span>
          </div>
        </TableHead>
        <TableHead className="py-2 px-4 min-w-[100px]">
          <div>Remarks</div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
