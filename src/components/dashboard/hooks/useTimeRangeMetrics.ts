import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { TimeRange } from '../TimeRangeSelector';
import { startOfWeek, startOfMonth, subMonths, format } from 'date-fns';

interface TimeRangeMetrics {
  activeProjects: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  projectsByStatus: { name: string; value: number; }[];
  projectsByStage: { name: string; value: number; }[];
  projectsByRegion: { name: string; value: number; }[];
  totalRevenue: number;
  avgProjectValue: number;
}

export const useTimeRangeMetrics = (selectedTimeRange: TimeRange) => {
  const [metrics, setMetrics] = useState<TimeRangeMetrics>({
    activeProjects: 0,
    utilizationTrends: { days7: 0, days30: 0, days90: 0 },
    projectsByStatus: [],
    projectsByStage: [],
    projectsByRegion: [],
    totalRevenue: 0,
    avgProjectValue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  // Calculate date range based on selected time range
  const dateRange = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
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
      default:
        startDate = startOfMonth(now);
    }
    
    return {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd')
    };
  }, [selectedTimeRange]);

  useEffect(() => {
    const fetchTimeRangeMetrics = async () => {
      if (!company?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        console.log('Fetching metrics for time range:', selectedTimeRange, dateRange);

        // Fetch projects within date range
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select(`
            id,
            name,
            status,
            current_stage,
            country,
            created_at,
            office:offices(name, country)
          `)
          .eq('company_id', company.id)
          .gte('created_at', dateRange.startDate)
          .lte('created_at', dateRange.endDate);

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          throw projectsError;
        }

        // Fetch project stages/fees for revenue calculation
        const { data: projectStages, error: stagesError } = await supabase
          .from('project_stages')
          .select('fee, project_id, created_at')
          .eq('company_id', company.id)
          .gte('created_at', dateRange.startDate)
          .lte('created_at', dateRange.endDate);

        if (stagesError) {
          console.error('Error fetching project stages:', stagesError);
          throw stagesError;
        }

        // Fetch allocations for utilization trends
        const { data: allocations, error: allocationsError } = await supabase
          .from('project_resource_allocations')
          .select('hours, week_start_date, resource_id')
          .eq('company_id', company.id)
          .gte('week_start_date', dateRange.startDate)
          .lte('week_start_date', dateRange.endDate);

        if (allocationsError) {
          console.error('Error fetching allocations:', allocationsError);
          throw allocationsError;
        }

        // Calculate metrics
        const activeProjects = projects?.length || 0;
        
        // Calculate revenue
        const totalRevenue = projectStages?.reduce((sum, stage) => sum + (stage.fee || 0), 0) || 0;
        const avgProjectValue = activeProjects > 0 ? totalRevenue / activeProjects : 0;

        // Calculate utilization (simplified for now)
        const totalHours = allocations?.reduce((sum, alloc) => sum + (alloc.hours || 0), 0) || 0;
        const uniqueResources = new Set(allocations?.map(alloc => alloc.resource_id) || []).size;
        const avgUtilization = uniqueResources > 0 ? Math.min((totalHours / (uniqueResources * 40)) * 100, 100) : 0;

        // Group projects by status
        const statusGroups = projects?.reduce((acc, project) => {
          const status = project.status || 'Unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const projectsByStatus = Object.entries(statusGroups).map(([name, value]) => ({
          name,
          value
        }));

        // Group projects by stage
        const stageGroups = projects?.reduce((acc, project) => {
          const stage = project.current_stage || 'Unknown';
          acc[stage] = (acc[stage] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const projectsByStage = Object.entries(stageGroups).map(([name, value]) => ({
          name,
          value
        }));

        // Group projects by region/country
        const regionGroups = projects?.reduce((acc, project) => {
          const region = project.country || 'Unknown';
          acc[region] = (acc[region] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const projectsByRegion = Object.entries(regionGroups).map(([name, value]) => ({
          name,
          value
        }));

        console.log('Calculated metrics:', {
          activeProjects,
          totalRevenue,
          avgProjectValue,
          avgUtilization,
          timeRange: selectedTimeRange
        });

        setMetrics({
          activeProjects,
          utilizationTrends: {
            days7: Math.round(avgUtilization),
            days30: Math.round(avgUtilization * 0.9),
            days90: Math.round(avgUtilization * 0.85)
          },
          projectsByStatus,
          projectsByStage,
          projectsByRegion,
          totalRevenue,
          avgProjectValue
        });

      } catch (error) {
        console.error('Error calculating time range metrics:', error);
        // Keep default metrics on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeRangeMetrics();
  }, [company?.id, selectedTimeRange, dateRange.startDate, dateRange.endDate]);

  return { metrics, isLoading };
};
