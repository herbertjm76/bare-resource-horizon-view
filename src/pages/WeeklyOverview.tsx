
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { WeeklyOverviewControls } from '@/components/weekly-overview/WeeklyOverviewControls';
import { EnhancedWeeklyResourceTable } from '@/components/weekly-overview/EnhancedWeeklyResourceTable';
import { startOfWeek, format, addWeeks, subWeeks } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { Toaster } from 'sonner';
import { Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

const WeeklyOverview = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
    searchTerm: ""
  });

  const { company } = useCompany();

  // Get Monday of the current week
  const weekStart = startOfWeek(selectedWeek, {
    weekStartsOn: 1
  });

  // Format the week label for display
  const weekLabel = `Week of ${format(weekStart, 'MMMM d, yyyy')}`;
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePreviousWeek = () => {
    setSelectedWeek(subWeeks(selectedWeek, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(addWeeks(selectedWeek, 1));
  };

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('company_id', company.id)
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
  });

  // Fetch team members (using profiles table)
  const { data: members = [] } = useQuery({
    queryKey: ['profiles', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', company.id)
        .order('first_name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
  });

  // Fetch allocations for the selected week
  const { data: allocations = [] } = useQuery({
    queryKey: ['weekly-allocations', company?.id, format(weekStart, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('*')
        .eq('company_id', company.id)
        .eq('week_start_date', format(weekStart, 'yyyy-MM-dd'));
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
  });
  
  return (
    <StandardLayout>
      <div className="w-full space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: '#6465F0' }}>
            <Calendar className="h-8 w-8 inline-block mr-3" style={{ color: '#6465F0' }} />
            Weekly Overview
          </h1>
        </div>
        
        <OfficeSettingsProvider>
          <WeeklyOverviewControls
            selectedWeek={selectedWeek}
            handlePreviousWeek={handlePreviousWeek}
            handleNextWeek={handleNextWeek}
            weekLabel={weekLabel}
            filters={{
              office: filters.office
            }}
            handleFilterChange={handleFilterChange}
          />
          
          <EnhancedWeeklyResourceTable
            projects={projects}
            members={members}
            allocations={allocations}
            selectedWeek={selectedWeek}
            filters={{
              office: filters.office
            }}
          />
        </OfficeSettingsProvider>
      </div>
      <Toaster position="top-right" />
    </StandardLayout>
  );
};

export default WeeklyOverview;
