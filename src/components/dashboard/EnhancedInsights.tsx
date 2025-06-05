
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp } from 'lucide-react';
import { TimeRange } from './TimeRangeSelector';
import { getAllInsights } from './insights/utils/insightAggregator';
import { InsightItem } from './insights/components/InsightItem';
import { MetricsSummary } from './insights/components/MetricsSummary';
import { EmptyInsightsState } from './insights/components/EmptyInsightsState';
import { StandardizedBadge } from "@/components/ui/standardized-badge";

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

  const insights = getAllInsights(utilizationRate, teamSize, activeProjects, selectedTimeRange);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-violet" />
          Smart Insights
          <StandardizedBadge variant="status" className="text-xs">
            {getTimeRangeText()}
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
