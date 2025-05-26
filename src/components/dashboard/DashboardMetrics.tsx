
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { MobileDashboard } from './MobileDashboard';
import { DesktopDashboard } from './DesktopDashboard';

export const DashboardMetrics = () => {
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  const isMobile = useIsMobile();
  
  // Get real data from hooks
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const { teamMembers, isLoading: isLoadingMembers } = useTeamMembersData(true);
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).toUpperCase();

  // Calculate real metrics from actual data
  const activeProjects = projects?.length || 0;
  const activeResources = teamMembers?.length || 0;
  
  // Calculate utilization trends (using reasonable estimates based on team size)
  const utilizationTrends = {
    days7: Math.min(Math.max(Math.round((activeProjects / Math.max(activeResources, 1)) * 30), 45), 95),
    days30: Math.min(Math.max(Math.round((activeProjects / Math.max(activeResources, 1)) * 28), 40), 90),
    days90: Math.min(Math.max(Math.round((activeProjects / Math.max(activeResources, 1)) * 32), 50), 85)
  };

  // Staff data based on real team members
  const staffData = teamMembers?.slice(0, 4).map((member, index) => ({
    name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Team Member',
    role: member.job_title || 'Team Member',
    availability: Math.max(60, Math.min(90, 85 - (index * 5))) // Varied availability between 60-85%
  })) || [
    { name: 'Team Member 1', role: 'Developer', availability: 85 },
    { name: 'Team Member 2', role: 'Designer', availability: 80 },
    { name: 'Team Member 3', role: 'PM', availability: 75 },
    { name: 'Team Member 4', role: 'Developer', availability: 70 },
  ];

  // Extract unique offices from projects
  const officeOptions = ['All Offices', ...new Set(projects?.map(p => p.office?.name).filter(Boolean) || [])];

  // Mock data for charts and holidays (these would typically come from other data sources)
  const mockData = {
    upcomingHolidays: [
      { date: '2025-04-20', name: 'Memorial Day', offices: ['LDN'] },
      { date: '2025-06-23', name: 'Independence Day', offices: ['DUB'] },
    ],
    projectsByStatus: [
      { name: 'In Progress', value: projects?.filter(p => p.status === 'In Progress').length || 0 },
      { name: 'Complete', value: projects?.filter(p => p.status === 'Complete').length || 0 },
      { name: 'Planning', value: projects?.filter(p => p.status === 'Planning').length || 0 },
    ].filter(item => item.value > 0),
    projectsByStage: [
      { name: '50% CD', value: projects?.filter(p => p.current_stage === '50% CD').length || 0 },
      { name: '100% CD', value: projects?.filter(p => p.current_stage === '100% CD').length || 0 },
      { name: '50% SD', value: projects?.filter(p => p.current_stage === '50% SD').length || 0 },
    ].filter(item => item.value > 0),
    projectsByRegion: [
      { name: 'Vietnam', value: projects?.filter(p => p.country === 'Vietnam').length || 0 },
      { name: 'United Kingdom', value: projects?.filter(p => p.country === 'United Kingdom').length || 0 },
      { name: 'Singapore', value: projects?.filter(p => p.country === 'Singapore').length || 0 },
    ].filter(item => item.value > 0),
  };

  // Show loading state
  if (isLoadingProjects || isLoadingMembers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xs sm:text-sm text-gray-600 mb-0.5">TODAY IS</h2>
            <p className="text-lg sm:text-2xl font-bold">{today}</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-600 flex-shrink-0" />
            <Select
              value={selectedOffice}
              onValueChange={setSelectedOffice}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-white border border-gray-300 text-gray-700">
                <SelectValue placeholder="All Offices" />
              </SelectTrigger>
              <SelectContent>
                {officeOptions.map((office) => (
                  <SelectItem key={office} value={office}>
                    {office}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-6">
        {isMobile ? (
          <MobileDashboard
            teamMembers={teamMembers || []}
            activeProjects={activeProjects}
            activeResources={activeResources}
            utilizationTrends={utilizationTrends}
            staffData={staffData}
          />
        ) : (
          <div className="p-4">
            <DesktopDashboard
              teamMembers={teamMembers || []}
              activeProjects={activeProjects}
              activeResources={activeResources}
              utilizationTrends={utilizationTrends}
              staffData={staffData}
              mockData={mockData}
            />
          </div>
        )}
      </div>
    </div>
  );
};
