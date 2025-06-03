
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CompactInsightCard } from './CompactInsightCard';
import { Brain } from 'lucide-react';
import { useIntelligentInsights } from './intelligent-insights/hooks/useIntelligentInsights';
import { EmptyInsightsState } from './intelligent-insights/components/EmptyInsightsState';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  weekly_capacity?: number;
  job_title?: string;
}

interface IntelligentInsightsProps {
  teamMembers: TeamMember[];
  activeProjects: number;
  utilizationRate: number;
}

export const IntelligentInsights: React.FC<IntelligentInsightsProps> = ({
  teamMembers,
  activeProjects,
  utilizationRate
}) => {
  const { insights } = useIntelligentInsights({
    teamMembers,
    activeProjects,
    utilizationRate
  });

  if (insights.length === 0) {
    return (
      <Card className="h-[400px] flex flex-col">
        <CardHeader className="flex-shrink-0 p-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-brand-violet" />
            Smart Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <EmptyInsightsState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="flex-shrink-0 p-6">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-brand-violet" />
          Smart Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-3 px-6 pb-6">
            {insights.slice(0, 3).map((insight, index) => (
              <CompactInsightCard
                key={index}
                {...insight}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
