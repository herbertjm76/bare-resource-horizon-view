
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

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
        
        {/* Acronym header cells with tooltips */}
        <TooltipProvider>
          <TableHead className="header-cell number-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">PRJ</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Projects</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column bg-orange-400 text-white">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">CAP</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Capacity</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">UTL</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Utilisation</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column bg-yellow-100">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">ANN</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Annual Leave</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">PUB</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Public Holiday</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">VAC</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vacation Leave</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">MED</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Medical Leave</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">OTH</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Others</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
        </TooltipProvider>
        
        <TableHead className="py-2 px-4 remarks-column">
          <div className="font-medium">Remarks</div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
