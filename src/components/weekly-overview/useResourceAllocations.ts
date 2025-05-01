
import { useState } from 'react';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  location: string | null;
  isPending?: boolean;
}

export interface MemberAllocation {
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

export function useResourceAllocations(teamMembers: TeamMember[]) {
  // Member allocations state
  const [memberAllocations, setMemberAllocations] = useState<Record<string, MemberAllocation>>({});

  // Initialize or get member allocation
  const getMemberAllocation = (memberId: string): MemberAllocation => {
    if (!memberAllocations[memberId]) {
      // For demo purposes - in a real app, you'd fetch this data from the backend
      // Different defaults for pending vs active members
      const isPending = teamMembers.find(m => m.id === memberId)?.isPending;
      const resourcedHours = isPending ? 0 : Math.floor(Math.random() * 30);
      const projectCount = isPending ? 0 : Math.floor(Math.random() * 3) + 1;
      
      const allocation = {
        id: memberId,
        annualLeave: 0,
        publicHoliday: Math.floor(Math.random() * 8),
        vacationLeave: 0,
        medicalLeave: 0,
        others: 0,
        remarks: isPending ? 'Pending team member' : '',
        projects: new Array(projectCount).fill(0).map((_, i) => `Project ${i+1}`),
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

  return {
    memberAllocations,
    getMemberAllocation,
    handleInputChange
  };
}
