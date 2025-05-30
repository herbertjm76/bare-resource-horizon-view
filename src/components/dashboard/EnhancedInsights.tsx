
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { TimeRange } from './TimeRangeSelector';

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
  const getInsights = () => {
    const insights = [];
    
    // Utilization insights based on standardized rate
    if (utilizationRate > 90) {
      insights.push({
        title: "Team Over-Utilized",
        description: `At ${utilizationRate}% utilization, your team may be at risk of burnout. Consider hiring or redistributing workload.`,
        type: "warning" as const,
        icon: AlertTriangle,
        priority: 1
      });
    } else if (utilizationRate > 75) {
      insights.push({
        title: "Optimal Utilization",
        description: `Your team is well-utilized at ${utilizationRate}%. This is a healthy balance of productivity and capacity.`,
        type: "success" as const,
        icon: CheckCircle,
        priority: 2
      });
    } else if (utilizationRate < 50) {
      insights.push({
        title: "Underutilized Capacity",
        description: `At ${utilizationRate}% utilization, you have significant capacity for new projects or strategic initiatives.`,
        type: "info" as const,
        icon: TrendingUp,
        priority: 2
      });
    }
    
    // Project load insights
    const projectsPerPerson = teamSize > 0 ? activeProjects / teamSize : 0;
    if (projectsPerPerson > 2) {
      insights.push({
        title: "High Project Load",
        description: `With ${projectsPerPerson.toFixed(1)} projects per team member, consider project prioritization or team expansion.`,
        type: "warning" as const,
        icon: Users,
        priority: 1
      });
    }
    
    // Team size insights
    if (teamSize < 5 && activeProjects > 3) {
      insights.push({
        title: "Small Team, Multiple Projects",
        description: "Your lean team is managing multiple projects. Monitor workload closely to prevent overcommitment.",
        type: "info" as const,
        icon: Users,
        priority: 3
      });
    }
    
    return insights.sort((a, b) => a.priority - b.priority).slice(0, 3);
  };

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

  const insights = getInsights();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-violet" />
          Smart Insights
          <Badge variant="outline" className="text-xs">
            {getTimeRangeText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length > 0 ? (
          insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/50">
                <div className={`p-1.5 rounded-full flex-shrink-0 ${
                  insight.type === 'warning' ? 'bg-orange-100' :
                  insight.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <Icon className={`h-4 w-4 ${
                    insight.type === 'warning' ? 'text-orange-600' :
                    insight.type === 'success' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No specific insights available for the current data.</p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Utilization Rate:</strong> {utilizationRate}% ({getTimeRangeText()})</p>
            <p><strong>Team Size:</strong> {teamSize} members</p>
            <p><strong>Active Projects:</strong> {activeProjects}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
