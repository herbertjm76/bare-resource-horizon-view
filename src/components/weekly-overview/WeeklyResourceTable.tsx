
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from './utils';
import { Eye } from "lucide-react";
import './weekly-overview.css';

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
              <TableHead className="py-0 px-2 min-w-[120px]">Name</TableHead>
              <TableHead className="py-0 px-2 min-w-[60px]">Office</TableHead>
              <TableHead className="vertical-text text-center w-8 h-28">
                <div className="transform -rotate-90 whitespace-nowrap">Projects</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8 h-28 bg-orange-400 text-white">
                <div className="transform -rotate-90 whitespace-nowrap">Capacity</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8 h-28">
                <div className="transform -rotate-90 whitespace-nowrap">Utilisation</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8 h-28">
                <div className="transform -rotate-90 whitespace-nowrap">Utilisation (incl. leave)</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8 h-28 bg-yellow-100">
                <div className="transform -rotate-90 whitespace-nowrap">Vacation / Holiday</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8 h-28">
                <div className="transform -rotate-90 whitespace-nowrap">General Office</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8 h-28">
                <div className="transform -rotate-90 whitespace-nowrap">Marketing / BD</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8 h-28">
                <div className="transform -rotate-90 whitespace-nowrap">Public Holiday</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8 h-28">
                <div className="transform -rotate-90 whitespace-nowrap">Medical Leave / Hospitalisation</div>
              </TableHead>
              <TableHead className="vertical-text text-center w-8 h-28">
                <div className="transform -rotate-90 whitespace-nowrap">Annual Leave / Birthday Leave / Child Care/Unpaid Leave</div>
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
                // For demonstration, generating some mock data
                const projectCount = Math.floor(Math.random() * 3);
                const capacity = 40;
                const utilisation = Math.random() * 100;
                const utilisationWithLeave = utilisation - (Math.random() * 20);
                
                return (
                  <TableRow key={member.id} className={memberIndex % 2 === 0 ? "bg-muted/10" : ""}>
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-blue-500 cursor-pointer" />
                        <span>{member.first_name} {member.last_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">{getOfficeDisplay(member.location || 'N/A')}</TableCell>
                    <TableCell className="py-1 px-0 text-center">{projectCount}</TableCell>
                    <TableCell className="py-1 px-0 text-center bg-orange-400 text-white font-bold">{capacity}</TableCell>
                    <TableCell className="py-1 px-0 text-center">{formatNumber(utilisation)}%</TableCell>
                    <TableCell className="py-1 px-0 text-center">{formatNumber(utilisationWithLeave)}%</TableCell>
                    <TableCell className="py-1 px-0 text-center bg-yellow-100">0</TableCell>
                    <TableCell className="py-1 px-0 text-center">0</TableCell>
                    <TableCell className="py-1 px-0 text-center">0</TableCell>
                    <TableCell className="py-1 px-0 text-center">0</TableCell>
                    <TableCell className="py-1 px-0 text-center">0</TableCell>
                    <TableCell className="py-1 px-0 text-center">0</TableCell>
                    <TableCell className="py-1 px-2"></TableCell>
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
