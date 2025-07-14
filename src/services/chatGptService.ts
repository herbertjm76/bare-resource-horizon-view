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
          maxTokens: 1500,
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
          maxTokens: 1200,
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
          maxTokens: 1000,
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
You are a senior resource management consultant with 15+ years of experience optimizing team performance and project delivery. Analyze this team workload data and provide strategic insights.

**Analysis Context:** ${context || 'Team workload analysis'}

**Current Metrics:**
${JSON.stringify(summaryData, null, 2)}

**Your Task:** Provide a comprehensive analysis formatted as follows:

## KEY INSIGHTS
Identify 3-4 critical observations about current resource utilization, focusing on:
- Utilization rates vs. industry benchmarks (70-85% is optimal)
- Resource distribution patterns and potential bottlenecks
- Team capacity vs. project demands
- Seasonal or cyclical trends

## STRATEGIC RECOMMENDATIONS
Provide 3-5 specific, actionable recommendations prioritized by impact:
- Immediate actions (next 1-2 weeks)
- Short-term optimizations (1-3 months)
- Include expected outcomes and success metrics

## RISK ASSESSMENT
Identify potential risks with severity levels:
- Resource burnout indicators
- Project delivery risks
- Client satisfaction threats
- Team morale factors

## GROWTH OPPORTUNITIES
Highlight areas for optimization and expansion:
- Underutilized capacity that could take on more work
- Skill gaps that could be filled for higher-value projects
- Process improvements for efficiency gains
- Team development opportunities

Focus on metrics-driven insights with specific percentages, time frames, and measurable outcomes. Consider industry best practices for professional services teams.
    `.trim();
  }

  private static buildWorkloadInsightsPrompt(workloadData: any): string {
    return `
You are an expert workforce analytics consultant specializing in optimizing team performance and resource allocation. Analyze the following workload data to identify patterns, inefficiencies, and opportunities.

**Workload Analytics Data:**
${JSON.stringify(workloadData, null, 2)}

**Analysis Framework:**

1. **UTILIZATION ANALYSIS**
   - Calculate individual and team utilization rates
   - Identify over-allocated (>90%) and under-utilized (<60%) team members
   - Compare against optimal utilization benchmarks (70-85%)

2. **WORKLOAD DISTRIBUTION**
   - Assess workload balance across team members
   - Identify workload concentration risks
   - Evaluate skill-based allocation efficiency

3. **CAPACITY PLANNING**
   - Analyze current vs. available capacity
   - Project future capacity needs based on trends
   - Identify peak workload periods and resource gaps

4. **PERFORMANCE INDICATORS**
   - Resource allocation efficiency metrics
   - Project delivery timeline adherence
   - Quality impact of current workload levels

**Deliverables:**
- 4-5 data-driven insights with specific metrics
- 3-4 prioritized recommendations with expected impact
- Risk factors and mitigation strategies
- Capacity optimization opportunities

Include specific numbers, percentages, and timeframes. Reference industry standards for professional services utilization (typically 70-85% billable utilization).
    `.trim();
  }

  private static buildRecommendationsPrompt(metricsData: any): string {
    return `
You are a strategic management consultant specializing in operational excellence and team optimization. Based on the performance metrics provided, create a comprehensive action plan that drives measurable improvements.

**Performance Metrics:**
${JSON.stringify(metricsData, null, 2)}

**Strategic Recommendation Framework:**

## IMMEDIATE PRIORITY ACTIONS (Next 1-2 weeks)
- Critical issues requiring immediate attention
- Resource reallocation opportunities
- Process bottlenecks to address
- Communication improvements needed
- Expected impact: Quantify improvement potential

## SHORT-TERM OPTIMIZATIONS (1-3 months)
- Workflow process improvements
- Technology or tool implementations
- Team skill development initiatives
- Client communication enhancements
- Performance measurement system improvements

## LONG-TERM STRATEGIC INITIATIVES (3-12 months)
- Capacity planning and hiring decisions
- Service offering optimization
- Team structure reorganization
- Technology infrastructure investments
- Market expansion opportunities

## RISK MITIGATION STRATEGIES
- Client satisfaction protection measures
- Employee retention strategies
- Quality assurance improvements
- Financial performance safeguards
- Competitive positioning maintenance

**For each recommendation, provide:**
- Specific action steps
- Success metrics and KPIs
- Timeline for implementation
- Resource requirements
- Expected ROI or business impact
- Risk level if not addressed

Focus on actionable strategies that can be implemented by a project management team with measurable business outcomes.
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