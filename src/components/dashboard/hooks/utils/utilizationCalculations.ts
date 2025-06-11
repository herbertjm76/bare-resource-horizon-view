
import { UtilizationStatusData } from '../types/dashboardTypes';

export const calculateUtilizationRate = (
  teamMembers: any[], 
  preRegisteredMembers: any[]
): number => {
  const activeMembers = teamMembers?.filter(member => 
    member.role && ['owner', 'admin', 'member'].includes(member.role)
  ) || [];
  
  const totalCapacity = activeMembers.reduce((total, member) => total + (member.weekly_capacity || 40), 0);
  const preRegisteredCapacity = (preRegisteredMembers || []).reduce((total, member) => total + (member.weekly_capacity || 40), 0);
  const totalTeamCapacity = totalCapacity + preRegisteredCapacity;
  
  // Mock utilization calculation - replace with actual logic
  return Math.min(Math.round((activeMembers.length * 30) / Math.max(totalTeamCapacity, 1) * 100), 100);
};

export const getUtilizationStatus = (utilizationRate: number): UtilizationStatusData => {
  if (utilizationRate >= 90) {
    return {
      status: 'High Load',
      color: '#ef4444',
      textColor: 'text-red-700'
    };
  } else if (utilizationRate >= 75) {
    return {
      status: 'Optimal',
      color: '#22c55e',
      textColor: 'text-green-700'
    };
  } else {
    return {
      status: 'Available',
      color: '#3b82f6',
      textColor: 'text-blue-700'
    };
  }
};

export const generateUtilizationTrends = (currentRate: number) => ({
  days7: currentRate,
  days30: Math.round(currentRate * 0.9),
  days90: Math.round(currentRate * 0.85)
});
