
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useWeeklyResourceData } from './hooks/useWeeklyResourceData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber, calculateUtilization } from './utils';

interface WeeklyResourceTableProps {
  selectedWeek: Date;
  filters: {
    office: string;
  };
}

export const WeeklyResourceTable: React.FC<WeeklyResourceTableProps> = ({
  selectedWeek,
  filters
}) => {
  const {
    allMembers,
    filteredOffices,
    membersByOffice,
    getMemberAllocation,
    handleInputChange,
    getOfficeDisplay,
    isLoading,
    error
  } = useWeeklyResourceData(selectedWeek, filters);

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading resources...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
        <p className="font-semibold">Error loading data</p>
        <p className="text-sm">{typeof error === 'string' ? error : 'An error occurred while loading data. Please try again later.'}</p>
      </div>
    );
  }

  // Empty state
  if (!allMembers.length) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground mb-2">No team members found. Add team members to see the weekly overview.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="min-w-max">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[200px] py-2 px-4">
                  <div className="font-medium">Name</div>
                </TableHead>
                
                <TableHead className="w-[60px] text-center py-2 px-4">
                  <div className="font-medium">Office</div>
                </TableHead>
                
                {/* Acronym header cells with tooltips */}
                <TooltipProvider>
                  <TableHead className="w-[50px] text-center">
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div className="font-medium">PRJ</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Projects</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  
                  <TableHead className="w-[50px] text-center">
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div className="font-medium">CAP</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Capacity</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  
                  <TableHead className="w-[50px] text-center">
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div className="font-medium">UTL</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Utilisation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  
                  <TableHead className="w-[50px] text-center bg-yellow-100">
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div className="font-medium">AL</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Annual Leave</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  
                  <TableHead className="w-[50px] text-center">
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div className="font-medium">PH</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Public Holiday</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  
                  <TableHead className="w-[50px] text-center">
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div className="font-medium">VL</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Vacation Leave</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  
                  <TableHead className="w-[50px] text-center">
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div className="font-medium">ML</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Medical Leave</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  
                  <TableHead className="w-[50px] text-center">
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div className="font-medium">OL</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Others</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                </TooltipProvider>
                
                <TableHead className="w-[150px] py-2 px-4">
                  <div className="font-medium">Remarks</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOffices.flatMap((office, officeIndex) => {
                const members = membersByOffice[office].sort((a, b) => {
                  return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
                });

                return members.map((member, memberIndex) => {
                  const allocation = getMemberAllocation(member.id);
                  const isEven = memberIndex % 2 === 0;
                  const weeklyCapacity = member.weekly_capacity || 40;
                  const utilization = calculateUtilization(allocation.resourcedHours, weeklyCapacity);
                  
                  return (
                    <TableRow key={member.id} className={isEven ? "bg-muted/10" : ""}>
                      <TableCell className="py-1 px-4">
                        <div className="flex items-center gap-2">
                          <span>
                            {member.first_name} {member.last_name}
                            {member.isPending && <span className="text-muted-foreground text-xs ml-1">(pending)</span>}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-1 px-4 text-center">
                        <div className="flex items-center justify-center">
                          {getOfficeDisplay(member.location || 'N/A')}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-1 px-1 text-center">
                        <div className="flex items-center justify-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                                  {allocation.projects.length}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="w-64">
                                <div className="p-1">
                                  <strong>Projects:</strong>
                                  {allocation.projects.length > 0 ? (
                                    <ul className="list-disc ml-4 mt-1">
                                      {allocation.projects.map((project, idx) => (
                                        <li key={idx}>{project}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="mt-1 text-muted-foreground">No projects assigned</p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-1 px-1 text-center font-bold">
                        <div className="flex justify-center">{formatNumber(allocation.resourcedHours || 0)}</div>
                      </TableCell>
                      
                      <TableCell className="py-1 px-1 text-center">
                        <div className="flex justify-center">{formatNumber(utilization)}%</div>
                      </TableCell>
                      
                      <TableCell className="py-1 px-1 bg-yellow-100 text-center">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min="0"
                            value={allocation.annualLeave}
                            onChange={(e) => handleInputChange(member.id, 'annualLeave', e.target.value)}
                            className="w-full h-6 p-0 text-center border border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-1 px-1 text-center">
                        <div className="flex justify-center">{allocation.publicHoliday}</div>
                      </TableCell>
                      
                      <TableCell className="py-1 px-1 text-center">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min="0"
                            value={allocation.vacationLeave}
                            onChange={(e) => handleInputChange(member.id, 'vacationLeave', e.target.value)}
                            className="w-full h-6 p-0 text-center border border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-1 px-1 text-center">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min="0"
                            value={allocation.medicalLeave}
                            onChange={(e) => handleInputChange(member.id, 'medicalLeave', e.target.value)}
                            className="w-full h-6 p-0 text-center border border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-1 px-1 text-center">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min="0"
                            value={allocation.others}
                            onChange={(e) => handleInputChange(member.id, 'others', e.target.value)}
                            className="w-full h-6 p-0 text-center border border-transparent bg-transparent hover:border-gray-200 hover:bg-gray-50 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-1 px-4">
                        <Textarea 
                          value={allocation.remarks}
                          onChange={(e) => handleInputChange(member.id, 'remarks', e.target.value)}
                          className="min-h-0 h-6 p-1 text-xs resize-none"
                        />
                      </TableCell>
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};
