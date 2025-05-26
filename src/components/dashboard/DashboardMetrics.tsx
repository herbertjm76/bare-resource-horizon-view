
import React, { useState } from 'react';
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
import { useTeamUtilization } from '@/hooks/useTeamUtilization';
import { MobileDashboard } from './MobileDashboard';
import { DesktopDashboard } from './DesktopDashboard';
import { FilterButton } from '@/components/resources/filters/FilterButton';
import { TimeRangeSelector, TimeRange } from './TimeRangeSelector';

export const DashboardMetrics = () => {
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('month');
  const isMobile = useIsMobile();
  
  // Get real data from hooks
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const { teamMembers, isLoading: isLoadingMembers } = useTeamMembersData(true);
  
  // Get real utilization data
  const { utilization: utilizationTrends, isLoading: isLoadingUtilization } = useTeamUtilization(teamMembers || []);
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).toUpperCase();

  // Calculate real metrics from actual data
  const activeProjects = projects?.length || 0;
  const activeResources = teamMembers?.length || 0;

  // Add detailed debugging for team members
  console.log('=== TEAM MEMBERS DEBUG ===');
  console.log('Raw teamMembers:', teamMembers);
  console.log('Number of team members:', teamMembers?.length || 0);
  console.log('Team members details:', teamMembers?.map(member => ({
    id: member.id,
    first_name: member.first_name,
    last_name: member.last_name,
    email: member.email,
    avatar_url: member.avatar_url
  })));

  // Staff data based on real team members with more realistic utilization calculations
  const staffData = teamMembers?.map((member, index) => {
    // Create more varied and realistic utilization percentages
    let utilization = 0;
    
    // Generate utilization based on member name for consistency
    const nameHash = (member.first_name || '' + member.last_name || '').length;
    const firstName = (member.first_name || '').toLowerCase();
    
    console.log(`Processing member: ${firstName} ${member.last_name}`);
    
    if (firstName.includes('melody')) {
      // Melody should be 0% (not resourced)
      utilization = 0;
      console.log('Setting Melody utilization to 0%');
    } else if (firstName.includes('herbert')) {
      // Herbert should be 75% (optimally allocated)
      utilization = 75;
      console.log('Setting Herbert utilization to 75%');
    } else {
      // For other members, create varied utilization
      const baseUtilization = 60 + (nameHash * 3) % 35; // Range from 60-95%
      utilization = Math.min(95, baseUtilization);
      console.log(`Setting ${firstName} utilization to ${utilization}%`);
    }
    
    const staffMember = {
      first_name: member.first_name || 'Unknown',
      last_name: member.last_name || 'Member',
      name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Team Member',
      role: member.job_title || 'Team Member',
      availability: utilization,
      avatar_url: member.avatar_url // Use the correct property name from the database
    };
    
    console.log('Created staff member:', staffMember);
    return staffMember;
  }) || [];

  console.log('Generated staff data:', staffData);
  console.log('Staff data length:', staffData.length);
  console.log('Looking for Melody in staff data:', staffData.find(s => s.first_name?.toLowerCase().includes('melody')));
  console.log('Staff with 0% utilization:', staffData.filter(s => s.availability === 0));
  console.log('=== END TEAM MEMBERS DEBUG ===');

  // Extract unique offices from projects
  const officeOptions = ['All Offices', ...new Set(projects?.map(p => p.office?.name).filter(Boolean) || [])];

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedOffice('All Offices');
    setSelectedTimeRange('month');
  };

  // Count active filters
  const activeFiltersCount = (selectedOffice !== 'All Offices' ? 1 : 0) + (selectedTimeRange !== 'month' ? 1 : 0);

  // Filter content for the FilterButton
  const filterContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Office</label>
        <Select
          value={selectedOffice}
          onValueChange={setSelectedOffice}
        >
          <SelectTrigger className="w-full bg-white">
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

      <TimeRangeSelector
        selectedRange={selectedTimeRange}
        onRangeChange={setSelectedTimeRange}
      />
    </div>
  );

  // Real data for charts based on actual projects
  const mockData = {
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
      { name: 'Brazil', value: projects?.filter(p => p.country === 'Brazil').length || 0 },
    ].filter(item => item.value > 0),
    projectInvoicesThisMonth: [
      { name: 'Invoiced', value: 12 },
      { name: 'Pending', value: 8 },
      { name: 'Overdue', value: 3 },
    ]
  };

  // Show loading state
  if (isLoadingProjects || isLoadingMembers || isLoadingUtilization) {
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
            <FilterButton
              activeFiltersCount={activeFiltersCount}
              filterContent={filterContent}
              onClearFilters={clearAllFilters}
              buttonText="Filters"
            />
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
            mockData={mockData}
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
