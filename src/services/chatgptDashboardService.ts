import { supabase } from '@/integrations/supabase/client';
import { TimeRange } from '@/components/dashboard/TimeRangeSelector';

export interface ChatGPTTeamMember {
  id: string;
  name: string;
  utilization: number;
  availability: number;
  totalAllocatedHours: number;
  weeklyCapacity: number;
}

export interface ChatGPTTeamMetrics {
  totalMembers: number;
  averageUtilization: number;
  totalActiveProjects: number;
}

export interface ChatGPTProjectMetrics {
  activeProjects: number;
  totalAllocatedHours: number;
}

export interface ChatGPTDashboardData {
  teamMembers: ChatGPTTeamMember[];
  teamMetrics: ChatGPTTeamMetrics;
  projectMetrics: ChatGPTProjectMetrics;
  timestamp: string;
}

export class ChatGPTDashboardService {
  static async calculateDashboardData(
    companyId: string, 
    timeRange: TimeRange
  ): Promise<ChatGPTDashboardData> {
    try {
      console.log('🤖 ChatGPT Dashboard Service: Calculating data for', { companyId, timeRange });

      const { data, error } = await supabase.functions.invoke('dashboard-calculations', {
        body: {
          companyId,
          timeRange
        }
      });

      if (error) {
        console.error('❌ ChatGPT Dashboard Service error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to calculate dashboard data');
      }

      console.log('✅ ChatGPT Dashboard Service: Calculations complete', data.data);
      
      return {
        ...data.data,
        timestamp: data.timestamp
      };

    } catch (error) {
      console.error('❌ ChatGPT Dashboard Service: Service error', error);
      throw error;
    }
  }

  static async getTeamMemberUtilization(
    companyId: string,
    memberId: string,
    timeRange: TimeRange
  ): Promise<ChatGPTTeamMember | null> {
    try {
      const dashboardData = await this.calculateDashboardData(companyId, timeRange);
      const member = dashboardData.teamMembers.find(m => m.id === memberId);
      
      console.log('🔍 ChatGPT: Found member utilization', { memberId, member });
      
      return member || null;
    } catch (error) {
      console.error('❌ ChatGPT: Error getting member utilization', error);
      return null;
    }
  }
}