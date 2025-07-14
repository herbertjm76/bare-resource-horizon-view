import { supabase } from '@/integrations/supabase/client';

export interface ChatGPTRequest {
  prompt: string;
  context?: any;
  maxTokens?: number;
  temperature?: number;
}

export interface ChatGPTResponse {
  success: boolean;
  content: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface SummaryInterpretation {
  insights: string[];
  recommendations: string[];
  risks: string[];
  opportunities: string[];
  keyMetrics: {
    metric: string;
    value: string;
    interpretation: string;
    trend: 'positive' | 'negative' | 'neutral';
  }[];
}

export class ChatGPTService {
  static async interpretSummaryData(summaryData: any, context?: string): Promise<ChatGPTResponse> {
    try {
      const prompt = this.buildSummaryInterpretationPrompt(summaryData, context);
      
      const { data, error } = await supabase.functions.invoke('chatgpt-interpret', {
        body: {
          prompt,
          maxTokens: 1000,
          temperature: 0.3
        }
      });

      if (error) {
        console.error('Error calling ChatGPT function:', error);
        throw new Error(error.message || 'Failed to interpret summary data');
      }

      return data;
    } catch (error) {
      console.error('Error in ChatGPTService:', error);
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async generateWorkloadInsights(workloadData: any): Promise<ChatGPTResponse> {
    try {
      const prompt = this.buildWorkloadInsightsPrompt(workloadData);
      
      const { data, error } = await supabase.functions.invoke('chatgpt-interpret', {
        body: {
          prompt,
          maxTokens: 800,
          temperature: 0.4
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate workload insights');
      }

      return data;
    } catch (error) {
      console.error('Error generating workload insights:', error);
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async generateRecommendations(metricsData: any): Promise<ChatGPTResponse> {
    try {
      const prompt = this.buildRecommendationsPrompt(metricsData);
      
      const { data, error } = await supabase.functions.invoke('chatgpt-interpret', {
        body: {
          prompt,
          maxTokens: 600,
          temperature: 0.5
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate recommendations');
      }

      return data;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private static buildSummaryInterpretationPrompt(summaryData: any, context?: string): string {
    return `
As a resource management expert, analyze this team workload summary data and provide insights:

**Context:** ${context || 'Team workload analysis'}

**Summary Data:**
${JSON.stringify(summaryData, null, 2)}

Please provide a structured analysis including:
1. **Key Insights:** 3-4 main observations about the current state
2. **Recommendations:** Specific actionable steps to improve utilization
3. **Risks:** Potential issues to watch for
4. **Opportunities:** Areas for optimization or growth

Format your response as a clear, business-focused analysis that a project manager would find actionable.
    `.trim();
  }

  private static buildWorkloadInsightsPrompt(workloadData: any): string {
    return `
Analyze this workload metrics data for resource management insights:

**Workload Metrics:**
${JSON.stringify(workloadData, null, 2)}

Focus on:
- Team utilization patterns
- Resource allocation efficiency
- Capacity management
- Workload distribution

Provide 3-4 key insights and 2-3 specific recommendations for improvement.
    `.trim();
  }

  private static buildRecommendationsPrompt(metricsData: any): string {
    return `
Based on these performance metrics, provide strategic recommendations:

**Metrics Data:**
${JSON.stringify(metricsData, null, 2)}

Generate:
1. **Immediate Actions:** What should be done in the next 1-2 weeks
2. **Strategic Improvements:** Medium-term optimizations (1-3 months)
3. **Risk Mitigation:** How to address potential issues

Keep recommendations specific and actionable.
    `.trim();
  }

  static parseStructuredResponse(content: string): SummaryInterpretation {
    // Parse the ChatGPT response into structured data
    const insights: string[] = [];
    const recommendations: string[] = [];
    const risks: string[] = [];
    const opportunities: string[] = [];
    const keyMetrics: SummaryInterpretation['keyMetrics'] = [];

    // Simple parsing logic - can be enhanced with better NLP
    const lines = content.split('\n').filter(line => line.trim());
    
    let currentSection = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.toLowerCase().includes('insights')) {
        currentSection = 'insights';
      } else if (trimmed.toLowerCase().includes('recommendations')) {
        currentSection = 'recommendations';
      } else if (trimmed.toLowerCase().includes('risks')) {
        currentSection = 'risks';
      } else if (trimmed.toLowerCase().includes('opportunities')) {
        currentSection = 'opportunities';
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const item = trimmed.substring(2);
        
        switch (currentSection) {
          case 'insights':
            insights.push(item);
            break;
          case 'recommendations':
            recommendations.push(item);
            break;
          case 'risks':
            risks.push(item);
            break;
          case 'opportunities':
            opportunities.push(item);
            break;
        }
      }
    }

    return {
      insights,
      recommendations,
      risks,
      opportunities,
      keyMetrics
    };
  }
}