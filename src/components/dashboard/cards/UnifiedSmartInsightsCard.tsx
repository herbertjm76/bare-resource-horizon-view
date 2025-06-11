
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp, Calendar, Clock, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';

interface SmartInsightsProps {
  teamMembers: any[];
  activeProjects: number;
  utilizationRate: number;
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
    case 'clock': return Clock;
    default: return priorityConfig.icon;
  }
};

export const UnifiedSmartInsightsCard: React.FC<SmartInsightsProps> = ({
  teamMembers,
  activeProjects,
  utilizationRate
}) => {
  // Generate sample insights based on the data
  const generateInsights = () => {
    const insights = [];

    // Utilization insights
    if (utilizationRate > 90) {
      insights.push({
        type: 'warning',
        icon: 'alert-triangle',
        title: 'High Team Utilization',
        description: `Team is at ${utilizationRate}% capacity - consider workload redistribution`,
        priority: 'high',
        metric: `${utilizationRate}% team utilization`
      });
    } else if (utilizationRate < 50) {
      insights.push({
        type: 'info',
        icon: 'trending-up',
        title: 'Capacity Available',
        description: `Team has ${100 - utilizationRate}% available capacity for new projects`,
        priority: 'medium',
        metric: `${100 - utilizationRate}% available capacity`
      });
    } else {
      insights.push({
        type: 'success',
        icon: 'check-circle',
        title: 'Optimal Utilization',
        description: `Team utilization at healthy ${utilizationRate}% level`,
        priority: 'low',
        metric: `${utilizationRate}% optimal range`
      });
    }

    // Project load insights
    if (activeProjects > 10) {
      insights.push({
        type: 'warning',
        icon: 'calendar',
        title: 'High Project Load',
        description: `Managing ${activeProjects} active projects - monitor resource allocation`,
        priority: 'medium',
        metric: `${activeProjects} active projects`
      });
    } else if (activeProjects === 0) {
      insights.push({
        type: 'info',
        icon: 'calendar',
        title: 'No Active Projects',
        description: 'Team available for new project assignments',
        priority: 'low',
        metric: 'No current projects'
      });
    }

    // Team size insights
    if (teamMembers.length < 5) {
      insights.push({
        type: 'info',
        icon: 'trending-up',
        title: 'Small Team Size',
        description: `Consider scaling team - currently ${teamMembers.length} members`,
        priority: 'medium',
        metric: `${teamMembers.length} team members`
      });
    }

    return insights.length > 0 ? insights : [{
      type: 'success',
      icon: 'check-circle',
      title: 'All Systems Green',
      description: 'No immediate concerns - performance looks healthy',
      priority: 'low',
      metric: 'Optimal performance'
    }];
  };

  const insights = generateInsights();

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white h-[600px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        {/* Title inside the card */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
            Smart Insights
          </h2>
          <StandardizedHeaderBadge>
            {insights.filter(i => i.priority === 'high').length} Active
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
