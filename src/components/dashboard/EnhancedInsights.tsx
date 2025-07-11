
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, Loader2 } from 'lucide-react';
import { TimeRange } from './TimeRangeSelector';
import { getAllInsights } from './insights/utils/insightAggregator';
import { InsightItem } from './insights/components/InsightItem';
import { MetricsSummary } from './insights/components/MetricsSummary';
import { EmptyInsightsState } from './insights/components/EmptyInsightsState';
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { AIInsightsService, AIInsight } from '@/services/aiInsightsService';
import { useCompany } from '@/context/CompanyContext';

interface EnhancedInsightsProps {
  utilizationRate: number;
  teamSize: number;
  activeProjects: number;
  selectedTimeRange: TimeRange;
}

export const EnhancedInsights: React.FC<EnhancedInsightsProps> = ({
  utilizationRate,
  teamSize,
  activeProjects,
  selectedTimeRange
}) => {
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useAI, setUseAI] = useState(true);
  const { company } = useCompany();

  const getTimeRangeText = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return 'This Quarter';
      case '4months': return '4 Months';
      case '6months': return '6 Months';
      case 'year': return 'This Year';
      default: return 'Selected Period';
    }
  };

  // Load AI insights
  useEffect(() => {
    const loadAIInsights = async () => {
      if (!company?.id || !useAI) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await AIInsightsService.generateInsights(company.id, '30d');
        
        if (response.success && response.insights.length > 0) {
          setAiInsights(response.insights);
        } else {
          console.log('AI insights failed, falling back to local insights');
          setUseAI(false);
        }
      } catch (error) {
        console.error('Error loading AI insights:', error);
        setUseAI(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAIInsights();
  }, [company?.id, useAI]);

  // Use AI insights if available, otherwise fall back to local insights
  const fallbackInsights = getAllInsights(utilizationRate, teamSize, activeProjects, selectedTimeRange);
  const insights = useAI && aiInsights.length > 0 ? aiInsights : fallbackInsights;

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2 flex-shrink-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-brand-violet animate-spin" />
            Smart Insights
            <StandardizedBadge variant="status" className="text-xs">
              AI Processing
            </StandardizedBadge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-brand-violet/10 mx-auto w-16 h-16 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-brand-violet animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Analyzing Your Data</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                AI is processing your team and project data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-violet" />
          Smart Insights
          <StandardizedBadge variant="status" className="text-xs">
            {useAI && aiInsights.length > 0 ? 'AI-Powered' : getTimeRangeText()}
          </StandardizedBadge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-3 px-6 pb-4">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <InsightItem key={index} insight={insight} />
              ))
            ) : (
              <EmptyInsightsState />
            )}
            
            <MetricsSummary
              utilizationRate={utilizationRate}
              teamSize={teamSize}
              activeProjects={activeProjects}
              selectedTimeRange={selectedTimeRange}
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
