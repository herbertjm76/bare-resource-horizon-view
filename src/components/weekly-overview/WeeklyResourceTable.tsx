
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber, calculateUtilization, calculateCapacity } from './utils';
import { Eye, HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import './weekly-overview.css';

interface WeeklyResourceTableProps {
  selectedWeek: Date;
  filters: {
    office: string;
  };
}

interface MemberAllocation {
  id: string;
  annualLeave: number;
  publicHoliday: number;
  vacationLeave: number;
  medicalLeave: number;
  others: number;
  remarks: string;
  projects: string[];
  resourcedHours: number;
}

export const WeeklyResourceTable: React.FC<WeeklyResourceTableProps> = ({
  selectedWeek,
  filters
}) => {
  // Get current user ID
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    }
  });
  
  // Get team members data using the hook
  const { teamMembers, isLoading } = useTeamMembersData(session?.user?.id || null);

  // Fetch office locations
  const { data: officeLocations = [] } = useQuery({
    queryKey: ['officeLocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, code, city, country');
      
      if (error) throw error;
      return data;
    }
  });

  // Member allocations state
  const [memberAllocations, setMemberAllocations] = useState<Record<string, MemberAllocation>>({});

  // Initialize or get member allocation
  const getMemberAllocation = (memberId: string): MemberAllocation => {
    if (!memberAllocations[memberId]) {
      // For demo purposes - in a real app, you'd fetch this data from the backend
      const resourcedHours = Math.floor(Math.random() * 30);
      const allocation = {
        id: memberId,
        annualLeave: Math.floor(Math.random() * 8),
        publicHoliday: Math.floor(Math.random() * 8),
        vacationLeave: 0,
        medicalLeave: 0,
        others: 0,
        remarks: '',
        projects: new Array(Math.floor(Math.random() * 3) + 1).fill(0).map((_, i) => `Project ${i+1}`),
        resourcedHours,
      };
      setMemberAllocations(prev => ({...prev, [memberId]: allocation}));
      return allocation;
    }
    return memberAllocations[memberId];
  };

  // Handle input changes for editable fields
  const handleInputChange = (memberId: string, field: keyof MemberAllocation, value: any) => {
    const numValue = field !== 'remarks' && field !== 'projects' ? parseFloat(value) || 0 : value;
    
    setMemberAllocations(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: numValue,
      }
    }));
  };

  // Group team members by office
  const membersByOffice = teamMembers.reduce((acc, member) => {
    const location = member.location || 'Unassigned';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(member);
    return acc;
  }, {} as Record<string, typeof teamMembers>);

  // Filter by selected office if needed
  let filteredOffices = Object.keys(membersByOffice);
  if (filters.office !== 'all') {
    filteredOffices = filteredOffices.filter(office => office === filters.office);
  }

  // Sort offices alphabetically
  filteredOffices.sort();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading resources...</p>
      </div>
    );
  }

  // Helper function to get office code display name
  const getOfficeDisplay = (locationCode: string) => {
    const office = officeLocations.find(o => o.code === locationCode);
    return office ? `${office.code}` : locationCode;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-full text-xs">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="py-0 px-2 name-column">Name</TableHead>
              <TableHead className="py-0 px-2 min-w-[60px]">Office</TableHead>
              <TableHead className="vertical-text text-center w-8">
                <div className="transform -rotate-90 whitespace-nowrap">Projects</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8 bg-orange-400 text-white">
                <div className="transform -rotate-90 whitespace-nowrap">Capacity</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8">
                <div className="transform -rotate-90 whitespace-nowrap">Utilisation</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8 bg-yellow-100">
                <div className="transform -rotate-90 whitespace-nowrap">Annual Leave</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8">
                <div className="transform -rotate-90 whitespace-nowrap">Public Holiday</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8">
                <div className="transform -rotate-90 whitespace-nowrap">Vacation Leave</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8">
                <div className="transform -rotate-90 whitespace-nowrap">Medical Leave</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8">
                <div className="transform -rotate-90 whitespace-nowrap">Others</div>
              </TableHead>
              <TableHead className="py-0 px-2 min-w-[100px]">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffices.flatMap((office, officeIndex) => {
              const members = membersByOffice[office].sort((a, b) => {
                return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
              });

              return members.map((member, memberIndex) => {
                const allocation = getMemberAllocation(member.id);
                const capacity = calculateCapacity(allocation.resourcedHours);
                const utilization = calculateUtilization(allocation.resourcedHours, 40);
                
                return (
                  <TableRow key={member.id} className={memberIndex % 2 === 0 ? "bg-muted/10" : ""}>
                    <TableCell className="py-1 px-2 name-column">
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-blue-500 cursor-pointer" />
                        <span>{member.first_name} {member.last_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">{getOfficeDisplay(member.location || 'N/A')}</TableCell>
                    <TableCell className="py-1 px-0 text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="w-full h-full flex items-center justify-center">
                            {allocation.projects.length}
                          </TooltipTrigger>
                          <TooltipContent side="right" className="w-64">
                            <div className="p-1">
                              <strong>Projects:</strong>
                              <ul className="list-disc ml-4 mt-1">
                                {allocation.projects.map((project, idx) => (
                                  <li key={idx}>{project}</li>
                                ))}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="py-1 px-0 text-center bg-orange-400 text-white font-bold">{capacity}</TableCell>
                    <TableCell className="py-1 px-0 text-center">{formatNumber(utilization)}%</TableCell>
                    <TableCell className="py-1 px-0 text-center bg-yellow-100">
                      {allocation.annualLeave}
                    </TableCell>
                    <TableCell className="py-1 px-0 text-center">
                      {allocation.publicHoliday}
                    </TableCell>
                    <TableCell className="py-1 px-0 text-center">
                      <input
                        type="number"
                        min="0"
                        value={allocation.vacationLeave}
                        onChange={(e) => handleInputChange(member.id, 'vacationLeave', e.target.value)}
                        className="editable-cell"
                      />
                    </TableCell>
                    <TableCell className="py-1 px-0 text-center">
                      <input
                        type="number"
                        min="0"
                        value={allocation.medicalLeave}
                        onChange={(e) => handleInputChange(member.id, 'medicalLeave', e.target.value)}
                        className="editable-cell"
                      />
                    </TableCell>
                    <TableCell className="py-1 px-0 text-center">
                      <input
                        type="number"
                        min="0"
                        value={allocation.others}
                        onChange={(e) => handleInputChange(member.id, 'others', e.target.value)}
                        className="editable-cell"
                      />
                    </TableCell>
                    <TableCell className="py-1 px-2">
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
    </div>
  );
};
