import { supabase } from '@/integrations/supabase/client';

export interface AIInsight {
  type: 'utilization' | 'capacity' | 'project_load' | 'team_scaling' | 'efficiency';
  category: 'Resource Management' | 'Team Performance' | 'Project Planning' | 'Risk Management';
  priority: 'critical' | 'warning' | 'opportunity' | 'success';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  confidence: number;
  timeframe: 'immediate' | 'short_term' | 'long_term';
  icon: string;
}

export interface AIInsightsResponse {
  success: boolean;
  insights: AIInsight[];
  metadata?: {
    teamSize: number;
    activeProjects: number;
    totalProjects: number;
    generatedAt: string;
  };
  error?: string;
}

export class AIInsightsService {
  static async generateInsights(companyId: string, timeRange: string = '30d'): Promise<AIInsightsResponse> {
    try {
      console.log('Generating AI insights for company:', companyId);
      
      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: {
          companyId,
          timeRange
        }
      });

      if (error) {
        console.error('Error calling AI insights function:', error);
        throw new Error(error.message || 'Failed to generate insights');
      }

      if (!data.success) {
        console.error('AI insights function returned error:', data.error);
        throw new Error(data.error || 'Failed to generate insights');
      }

      console.log('AI insights generated successfully:', data.insights?.length || 0, 'insights');
      return data;

    } catch (error) {
      console.error('Error in AIInsightsService:', error);
      return {
        success: false,
        insights: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'opportunity':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  static getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'alert-circle';
      case 'warning':
        return 'alert-triangle';
      case 'opportunity':
        return 'lightbulb';
      case 'success':
        return 'check-circle';
      default:
        return 'info';
    }
  }

  static getTimeframeText(timeframe: string): string {
    switch (timeframe) {
      case 'immediate':
        return 'Act Now';
      case 'short_term':
        return '1-3 Months';
      case 'long_term':
        return '3+ Months';
      default:
        return 'Review';
    }
  }
}