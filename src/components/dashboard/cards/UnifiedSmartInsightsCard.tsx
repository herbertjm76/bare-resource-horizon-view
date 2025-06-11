
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp, Calendar, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { UnifiedDashboardData } from '../hooks/useDashboardData';

interface UnifiedSmartInsightsCardProps {
  data: UnifiedDashboardData;
}

// Unified priority system for colors and icons
const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'high':
      return {
        color: 'bg-red-100 text-red-800 border-red-200',
        bgColor: 'bg-red-100 text-red-600',
        icon: AlertTriangle
      };
    case 'medium':
      return {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        bgColor: 'bg-orange-100 text-orange-600',
        icon: TrendingUp
      };
    case 'low':
      return {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        bgColor: 'bg-blue-100 text-blue-600',
        icon: Info
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        bgColor: 'bg-gray-100 text-gray-600',
        icon: CheckCircle
      };
  }
};

// Get specific icons for insight types while maintaining priority colors
const getInsightIcon = (iconName: string, priority: string) => {
  const priorityConfig = getPriorityConfig(priority);
  
  switch (iconName) {
    case 'alert-triangle': return AlertTriangle;
    case 'check-circle': return CheckCircle;
    case 'trending-up': return TrendingUp;
    case 'calendar': return Calendar;
    default: return priorityConfig.icon;
  }
};

export const UnifiedSmartInsightsCard: React.FC<UnifiedSmartInsightsCardProps> = ({ data }) => {
  // Generate insights focused on resourcing and capacity
  const generateInsights = () => {
    const insights = [];
    const { currentUtilizationRate, activeProjects, totalTeamSize } = data;

    // Utilization and capacity insights
    if (currentUtilizationRate > 90) {
      insights.push({
        type: 'warning',
        icon: 'alert-triangle',
        title: 'Team Over-Capacity',
        description: `Team is at ${currentUtilizationRate}% utilization - consider workload redistribution or additional resources`,
        priority: 'high',
        metric: `${currentUtilizationRate}% team utilization`
      });
    } else if (currentUtilizationRate < 50) {
      insights.push({
        type: 'info',
        icon: 'trending-up',
        title: 'Available Capacity',
        description: `Team has ${100 - currentUtilizationRate}% available capacity for new projects or strategic initiatives`,
        priority: 'medium',
        metric: `${100 - currentUtilizationRate}% available capacity`
      });
    } else {
      insights.push({
        type: 'success',
        icon: 'check-circle',
        title: 'Optimal Resource Utilization',
        description: `Team utilization at ${currentUtilizationRate}% is within the optimal range for sustainable productivity`,
        priority: 'low',
        metric: `${currentUtilizationRate}% optimal range`
      });
    }

    // Project load and resource allocation insights
    if (activeProjects > 10 && totalTeamSize < 8) {
      insights.push({
        type: 'warning',
        icon: 'calendar',
        title: 'High Project-to-Team Ratio',
        description: `${activeProjects} active projects for ${totalTeamSize} team members may strain resources - consider prioritization`,
        priority: 'medium',
        metric: `${(activeProjects / totalTeamSize).toFixed(1)} projects per team member`
      });
    } else if (activeProjects === 0) {
      insights.push({
        type: 'info',
        icon: 'calendar',
        title: 'Full Resource Availability',
        description: 'No active projects - all team resources available for new assignments',
        priority: 'low',
        metric: 'No current projects'
      });
    }

    // Team scaling insights
    if (totalTeamSize < 5 && activeProjects > 8) {
      insights.push({
        type: 'info',
        icon: 'trending-up',
        title: 'Consider Team Expansion',
        description: `Small team of ${totalTeamSize} managing ${activeProjects} projects - scaling may improve capacity`,
        priority: 'medium',
        metric: `${totalTeamSize} team members`
      });
    }

    // Capacity buffer insights
    const capacityBuffer = 100 - currentUtilizationRate;
    if (capacityBuffer < 20 && currentUtilizationRate > 70) {
      insights.push({
        type: 'warning',
        icon: 'alert-triangle',
        title: 'Limited Capacity Buffer',
        description: `Only ${capacityBuffer}% capacity buffer remaining - risk of overallocation with new work`,
        priority: 'high',
        metric: `${capacityBuffer}% capacity buffer`
      });
    }

    return insights.length > 0 ? insights : [{
      type: 'success',
      icon: 'check-circle',
      title: 'Optimal Resource Balance',
      description: 'Team capacity and project load are well-balanced for sustained performance',
      priority: 'low',
      metric: 'Balanced allocation'
    }];
  };

  const insights = generateInsights();
  const highPriorityInsights = insights.filter(i => i.priority === 'high').length;

  return (
    <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        {/* Title inside the card */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
            Smart Insights
          </h2>
          <StandardizedHeaderBadge>
            {highPriorityInsights > 0 ? `${highPriorityInsights} High Priority` : `${insights.length} Insights`}
          </StandardizedHeaderBadge>
        </div>
        
        {/* Scrollable content */}
        <ScrollArea className="flex-1">
          <div className="pr-4 space-y-4">
            {insights.slice(0, 5).map((insight, index) => {
              const priorityConfig = getPriorityConfig(insight.priority);
              const IconComponent = getInsightIcon(insight.icon, insight.priority);
              
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50">
                  <div className={`p-1 rounded ${priorityConfig.bgColor}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <Badge className={`${priorityConfig.color} border text-xs`}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    {insight.metric && (
                      <p className="text-xs text-gray-500 mt-1">{insight.metric}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
