
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from './utils';
import { Eye } from "lucide-react";

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
        <Table className="min-w-full">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-8 text-center">#</TableHead>
              <TableHead className="w-8 text-center">View</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Office</TableHead>
              <TableHead className="text-center">Projects</TableHead>
              <TableHead className="text-center w-24">Capacity</TableHead>
              <TableHead className="text-center">Utilisation</TableHead>
              <TableHead className="text-center">Utilisation (incl. leave)</TableHead>
              <TableHead className="text-center">Vacation / Holiday</TableHead>
              <TableHead className="text-center">General Office</TableHead>
              <TableHead className="text-center">Marketing / BD</TableHead>
              <TableHead className="text-center">Public Holiday</TableHead>
              <TableHead className="text-center">Medical Leave / Hospitalisation</TableHead>
              <TableHead className="text-center">Annual Leave / Birthday Leave / Child Care/Unpaid Leave</TableHead>
              <TableHead className="text-right">Remarks / Stage Deadline</TableHead>
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
                    <TableCell className="text-center">{officeIndex * 100 + memberIndex + 1}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Eye className="h-4 w-4 text-blue-500 cursor-pointer" />
                      </div>
                    </TableCell>
                    <TableCell>{member.first_name} {member.last_name}</TableCell>
                    <TableCell>{getOfficeDisplay(member.location || 'N/A')}</TableCell>
                    <TableCell className="text-center">{projectCount}</TableCell>
                    <TableCell className="text-center bg-orange-400 text-white font-bold">{capacity}</TableCell>
                    <TableCell className="text-center">{formatNumber(utilisation)}%</TableCell>
                    <TableCell className="text-center">{formatNumber(utilisationWithLeave)}%</TableCell>
                    <TableCell className="text-center bg-yellow-100">0</TableCell>
                    <TableCell className="text-center">0</TableCell>
                    <TableCell className="text-center">0</TableCell>
                    <TableCell className="text-center">0</TableCell>
                    <TableCell className="text-center">0</TableCell>
                    <TableCell className="text-center">0</TableCell>
                    <TableCell className="text-right"></TableCell>
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
