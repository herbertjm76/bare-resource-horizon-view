
import React, { useState, useCallback } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ResourceAllocationGrid } from '@/components/resources/ResourceAllocationGrid';
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const HEADER_HEIGHT = 56;

const ProjectResourcing = () => {
  // Get the start of the current week (Monday)
  const today = new Date();
  const mondayOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  
  const [selectedWeek, setSelectedWeek] = useState<Date>(mondayOfCurrentWeek);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
    weeksToShow: 12, // Default is 12 weeks
  });
  
  // Get project data
  const { projects } = useProjects();
  
  // Get team members data
  const { teamMembers } = useTeamMembersData(true);
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleWeeksChange = (weeks: number) => {
    setFilters(prev => ({
      ...prev,
      weeksToShow: weeks
    }));
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Week navigation functions
  const goToPreviousWeek = useCallback(() => {
    setSelectedWeek(prevWeek => subWeeks(prevWeek, 1));
  }, []);

  const goToNextWeek = useCallback(() => {
    setSelectedWeek(prevWeek => addWeeks(prevWeek, 1));
  }, []);

  // Week options for the dropdown
  const weekOptions = [
    { value: '8', label: '8 Weeks' },
    { value: '12', label: '12 Weeks' },
    { value: '16', label: '16 Weeks' },
    { value: '26', label: '26 Weeks' },
    { value: '52', label: '52 Weeks' },
  ];
  
  // Format the week label
  const weekLabel = format(selectedWeek, "MMM d, yyyy");

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background flex flex-col" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
            <div className="flex-grow flex flex-col max-w-full h-full">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-brand-primary">Project Resourcing</h1>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {/* Week selector */}
                <div className="flex border rounded-md p-2 items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={goToPreviousWeek}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="px-2 min-w-[180px] text-center">
                    Week of {weekLabel}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={goToNextWeek}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  {/* Weeks dropdown */}
                  <div className="ml-4">
                    <select
                      className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      value={filters.weeksToShow.toString()}
                      onChange={(e) => handleWeeksChange(Number(e.target.value))}
                    >
                      {weekOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Search and filter */}
                <div className="flex items-center border rounded-md p-2 gap-2 flex-1 max-w-md">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-8"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
              
              <Card className="flex-1 shadow-sm">
                <CardContent className="p-0 h-full">
                  <OfficeSettingsProvider>
                    <ResourceAllocationGrid 
                      startDate={selectedWeek}
                      weeksToShow={filters.weeksToShow}
                      filters={{
                        ...filters,
                        searchTerm
                      }}
                    />
                  </OfficeSettingsProvider>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProjectResourcing;
