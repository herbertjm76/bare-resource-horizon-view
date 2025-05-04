
import React from 'react';

export const useOfficeMembers = (
  allMembers: any[], 
  filters: { office: string }
) => {
  // Group team members by office
  const membersByOffice = React.useMemo(() => {
    return allMembers.reduce((acc, member) => {
      const location = member.location || 'Unassigned';
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(member);
      return acc;
    }, {} as Record<string, typeof allMembers>);
  }, [allMembers]);

  // Filter by selected office if needed
  const filteredOffices = React.useMemo(() => {
    let offices = Object.keys(membersByOffice);
    
    if (filters.office !== 'all') {
      offices = offices.filter(office => office === filters.office);
    }
    
    // Sort offices alphabetically
    return offices.sort();
  }, [membersByOffice, filters.office]);

  return { membersByOffice, filteredOffices };
};
