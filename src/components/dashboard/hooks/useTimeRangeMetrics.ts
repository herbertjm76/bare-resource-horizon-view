
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { TimeRange } from '../TimeRangeSelector';
import { startOfWeek, startOfMonth, subMonths, format } from 'date-fns';

interface TimeRangeMetrics {
  activeProjects: number;
  activeResources: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  projectsByStatus: { name: string; value: number; }[];
  projectsByStage: { name: string; value: number; color?: string; }[];
  projectsByLocation: { name: string; value: number; color?: string; }[];
  projectsByPM: { name: string; value: number; }[];
  totalRevenue: number;
  avgProjectValue: number;
}

const defaultMetrics: TimeRangeMetrics = {
  activeProjects: 0,
  activeResources: 0,
  utilizationTrends: { days7: 0, days30: 0, days90: 0 },
  projectsByStatus: [],
  projectsByStage: [],
  projectsByLocation: [],
  projectsByPM: [],
  totalRevenue: 0,
  avgProjectValue: 0
};

export const useTimeRangeMetrics = (selectedTimeRange: TimeRange) => {
  const [metrics, setMetrics] = useState<TimeRangeMetrics>(defaultMetrics);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();
  const abortControllerRef = useRef<AbortController | null>(null);
  const prevTimeRangeRef = useRef<TimeRange>(selectedTimeRange);

  // Calculate date range based on selected time range
  const dateRange = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    if (prevTimeRangeRef.current !== selectedTimeRange) {
      console.log(`🕒 TIME RANGE CHANGED: ${prevTimeRangeRef.current} → ${selectedTimeRange}`);
      prevTimeRangeRef.current = selectedTimeRange;
    }
    
    switch (selectedTimeRange) {
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      case '3months':
        startDate = subMonths(startOfMonth(now), 3);
        break;
      case '4months':
        startDate = subMonths(startOfMonth(now), 4);
        break;
      case '6months':
        startDate = subMonths(startOfMonth(now), 6);
        break;
      case 'year':
        startDate = subMonths(startOfMonth(now), 12);
        break;
      default:
        startDate = startOfMonth(now);
    }
    
    return {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd')
    };
  }, [selectedTimeRange]);

  const fetchTimeRangeMetrics = useCallback(async () => {
    if (!company?.id) {
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    
    try {
      console.log('📊 Fetching metrics for time range:', selectedTimeRange, dateRange);

      // Fetch ALL projects with basic information and manager details
      const { data: allProjects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          current_stage,
          country,
          created_at,
          temp_office_location_id,
          project_manager_id,
          project_manager:profiles!project_manager_id(first_name, last_name)
        `)
        .eq('company_id', company.id)
        .abortSignal(signal);

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw projectsError;
      }

      if (signal.aborted) return;

      // Fetch office locations
      const { data: officeLocations, error: locationsError } = await supabase
        .from('office_locations')
        .select('id, city, country, emoji')
        .eq('company_id', company.id)
        .abortSignal(signal);

      if (locationsError) {
        console.error('Error fetching office locations:', locationsError);
        throw locationsError;
      }

      if (signal.aborted) return;

      // Fetch office stages with colors
      const { data: officeStages, error: stagesError } = await supabase
        .from('office_stages')
        .select('id, name, color')
        .eq('company_id', company.id)
        .abortSignal(signal);

      if (stagesError) {
        console.error('Error fetching office stages:', stagesError);
        throw stagesError;
      }

      if (signal.aborted) return;

      // Fetch team members for active resources count
      const { data: teamMembers, error: teamError } = await supabase
        .from('profiles')
        .select('id')
        .eq('company_id', company.id)
        .abortSignal(signal);

      if (teamError) {
        console.error('Error fetching team members:', teamError);
        throw teamError;
      }

      if (signal.aborted) return;

      // Fetch project stages/fees within the time range
      const { data: projectStages, error: stagesProjectError } = await supabase
        .from('project_stages')
        .select('fee, project_id, created_at')
        .eq('company_id', company.id)
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
        .abortSignal(signal);

      if (stagesProjectError) {
        console.error('Error fetching project stages:', stagesProjectError);
        throw stagesProjectError;
      }

      if (signal.aborted) return;

      // Fetch allocations for utilization trends within the time range
      const { data: allocations, error: allocationsError } = await supabase
        .from('project_resource_allocations')
        .select('hours, week_start_date, resource_id, project_id')
        .eq('company_id', company.id)
        .gte('week_start_date', dateRange.startDate)
        .lte('week_start_date', dateRange.endDate)
        .abortSignal(signal);

      if (allocationsError) {
        console.error('Error fetching allocations:', allocationsError);
        throw allocationsError;
      }

      if (signal.aborted) return;

      // For analytics, show ALL projects regardless of time range activity
      // But for metrics like revenue, use time-range filtered data
      console.log(`📈 Found ${allProjects?.length || 0} total projects`);
      console.log('🗺️ All projects by location:', allProjects?.map(p => ({ name: p.name, country: p.country, temp_office_location_id: p.temp_office_location_id })));

      // Calculate metrics based on ALL projects for analytics
      const activeProjects = allProjects?.length || 0;
      
      // Calculate active resources (all team members with profiles)
      const activeResources = teamMembers?.length || 0;
      
      // Calculate revenue from stages in the time range (time-filtered)
      const totalRevenue = projectStages?.reduce((sum, stage) => sum + (stage.fee || 0), 0) || 0;
      const avgProjectValue = activeProjects > 0 ? totalRevenue / activeProjects : 0;

      // Calculate utilization (simplified for now)
      const totalHours = allocations?.reduce((sum, alloc) => sum + (alloc.hours || 0), 0) || 0;
      const uniqueResources = new Set(allocations?.map(alloc => alloc.resource_id) || []).size;
      const avgUtilization = uniqueResources > 0 ? Math.min((totalHours / (uniqueResources * 40)) * 100, 100) : 0;

      // Group ALL projects by status
      const statusGroups = (allProjects || []).reduce((acc, project) => {
        const status = project.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const projectsByStatus = Object.entries(statusGroups).map(([name, value]) => ({
        name,
        value
      }));

      // Group ALL projects by stage with colors from office stages
      const stageGroups = (allProjects || []).reduce((acc, project) => {
        const stage = project.current_stage || 'Unknown';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const projectsByStage = Object.entries(stageGroups).map(([name, value]) => {
        // Find the color for this stage from office settings
        const stageColor = officeStages?.find(stage => stage.name === name)?.color || '#E5DEFF';
        return {
          name,
          value,
          color: stageColor
        };
      });

      // Group ALL projects by location using country or office location
      const locationGroups = (allProjects || []).reduce((acc, project) => {
        let locationKey = 'Unknown';
        
        // Try to get location from office location first, then fallback to country
        if (project.temp_office_location_id && officeLocations) {
          const officeLocation = officeLocations.find(loc => loc.id === project.temp_office_location_id);
          if (officeLocation) {
            locationKey = officeLocation.country || officeLocation.city || 'Unknown';
          }
        } else if (project.country) {
          locationKey = project.country;
        }
        
        console.log(`📍 Project ${project.name}: ${locationKey} (office_id: ${project.temp_office_location_id}, country: ${project.country})`);
        
        acc[locationKey] = (acc[locationKey] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('🗺️ Location groups result:', locationGroups);

      // Create location data with colors from office settings or fallback colors
      const locationColors = ['#059669', '#0891B2', '#7C3AED', '#F59E0B', '#EF4444'];
      const projectsByLocation = Object.entries(locationGroups).map(([name, value], index) => ({
        name,
        value,
        color: locationColors[index % locationColors.length]
      }));

      // Group ALL projects by project manager
      const pmGroups = (allProjects || []).reduce((acc, project) => {
        let pmName = 'Unassigned';
        
        if (project.project_manager && Array.isArray(project.project_manager) && project.project_manager.length > 0) {
          const pm = project.project_manager[0];
          pmName = `${pm.first_name || ''} ${pm.last_name || ''}`.trim() || 'Unknown';
        } else if (project.project_manager && typeof project.project_manager === 'object') {
          const pm = project.project_manager;
          pmName = `${pm.first_name || ''} ${pm.last_name || ''}`.trim() || 'Unknown';
        }
        
        acc[pmName] = (acc[pmName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const projectsByPM = Object.entries(pmGroups).map(([name, value]) => ({
        name,
        value
      }));

      console.log('📈 Calculated metrics for ' + selectedTimeRange + ':', {
        activeProjects,
        activeResources,
        totalRevenue,
        avgProjectValue,
        avgUtilization,
        statusGroups,
        stageGroups,
        locationGroups,
        pmGroups
      });

      // Only update state if request wasn't aborted
      if (!signal.aborted) {
        setMetrics({
          activeProjects,
          activeResources,
          utilizationTrends: {
            days7: Math.round(avgUtilization),
            days30: Math.round(avgUtilization * 0.9),
            days90: Math.round(avgUtilization * 0.85)
          },
          projectsByStatus,
          projectsByStage,
          projectsByLocation,
          projectsByPM,
          totalRevenue,
          avgProjectValue
        });
      }

    } catch (error) {
      if (!signal.aborted) {
        console.error('Error calculating time range metrics:', error);
        setMetrics(defaultMetrics);
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [company?.id, selectedTimeRange, dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    console.log(`🔄 useTimeRangeMetrics effect running for: ${selectedTimeRange}`);
    fetchTimeRangeMetrics();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchTimeRangeMetrics]);

  return { metrics, isLoading };
};
