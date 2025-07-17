import { supabase } from '@/integrations/supabase/client';
import { TimeRange } from '@/components/dashboard/TimeRangeSelector';

interface DashboardDataRequest {
  companyId: string;
  timeRange: TimeRange;
}

interface CachedDashboardData {
  teamMembers: any[];
  projects: any[];
  teamComposition: any[];
  preRegisteredMembers: any[];
  holidays: any[];
  timestamp: number;
  expiresAt: number;
}

class DashboardDataService {
  private cache: Map<string, CachedDashboardData> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(companyId: string, timeRange: TimeRange): string {
    return `${companyId}-${timeRange}`;
  }

  private isDataFresh(data: CachedDashboardData): boolean {
    return Date.now() < data.expiresAt;
  }

  async fetchAllDashboardData({ companyId, timeRange }: DashboardDataRequest): Promise<CachedDashboardData> {
    const cacheKey = this.getCacheKey(companyId, timeRange);
    const cachedData = this.cache.get(cacheKey);

    // Return cached data if fresh
    if (cachedData && this.isDataFresh(cachedData)) {
      console.log('📦 Using cached dashboard data');
      return cachedData;
    }

    console.log('🔄 Fetching fresh dashboard data');

    try {
      // Fetch all data in parallel for better performance
      const [
        teamMembersResult,
        projectsResult,
        teamCompositionResult,
        preRegisteredResult,
        holidaysResult
      ] = await Promise.all([
        this.fetchTeamMembers(companyId),
        this.fetchProjects(companyId),
        this.fetchTeamComposition(companyId),
        this.fetchPreRegisteredMembers(companyId),
        this.fetchHolidays(companyId)
      ]);

      const dashboardData: CachedDashboardData = {
        teamMembers: teamMembersResult,
        projects: projectsResult,
        teamComposition: teamCompositionResult,
        preRegisteredMembers: preRegisteredResult,
        holidays: holidaysResult,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION
      };

      // Cache the data
      this.cache.set(cacheKey, dashboardData);

      return dashboardData;
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      
      // Return stale cache if available
      if (cachedData) {
        console.log('⚠️ Using stale cached data due to error');
        return cachedData;
      }
      
      throw error;
    }
  }

  private async fetchTeamMembers(companyId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('company_id', companyId)
      .order('first_name');

    if (error) throw error;
    return data || [];
  }

  private async fetchProjects(companyId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('company_id', companyId)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  private async fetchTeamComposition(companyId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('project_team_composition')
      .select('*')
      .eq('company_id', companyId);

    if (error) throw error;
    return data || [];
  }

  private async fetchPreRegisteredMembers(companyId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'pending');

    if (error) throw error;
    return data || [];
  }

  private async fetchHolidays(companyId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('office_holidays')
      .select('*')
      .eq('company_id', companyId)
      .gte('date', new Date().toISOString().split('T')[0]);

    if (error) throw error;
    return data || [];
  }

  // Clear cache for a specific company
  clearCache(companyId: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(companyId));
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log('🗑️ Cleared cache for company:', companyId);
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
    console.log('🗑️ Cleared all dashboard cache');
  }
}

export const dashboardDataService = new DashboardDataService();