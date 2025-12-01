
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp, Calendar, Clock, Info } from 'lucide-react';
import { useUnifiedMemberInsights } from '@/hooks/useUnifiedMemberInsights';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SmartInsightsProps {
  memberId: string;
  weeklyCapacity: number;
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
  
  // Use specific icons for certain types, but fallback to priority-based icons
  switch (iconName) {
    case 'alert-triangle': return AlertTriangle;
    case 'check-circle': return CheckCircle;
    case 'trending-up': return TrendingUp;
    case 'calendar': return Calendar;
    case 'clock': return Clock;
    default: return priorityConfig.icon;
  }
};

export const TeamMemberSmartInsights: React.FC<SmartInsightsProps> = ({
  memberId,
  weeklyCapacity
}) => {
  const { insights, isLoading } = useUnifiedMemberInsights(memberId, weeklyCapacity);

  if (isLoading) {
    return (
      <div className="space-y-4 h-full flex flex-col">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
          Smart Insights
        </h2>
        
        <div className="space-y-4 flex-1">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50">
              <div className="p-1 rounded bg-gray-200 animate-pulse">
                <div className="h-4 w-4"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Combine all insights and sort by priority
  const allInsights = [
    ...insights.utilizationInsights,
    ...insights.trendInsights,
    ...insights.projectLoadInsights,
    ...insights.capacityInsights
  ].sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
           (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
  });

  // If no insights, show default positive message
  const displayInsights = allInsights.length > 0 ? allInsights : [{
    type: 'success',
    icon: 'check-circle',
    title: 'All Good',
    description: 'No immediate concerns - performance looks healthy',
    priority: 'low',
    metric: 'Optimal performance'
  }];

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
        <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
        Smart Insights
      </h2>
      
      <ScrollArea className="flex-1">
        <div className="pr-4 space-y-4">
          {displayInsights.slice(0, 5).map((insight, index) => {
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
    </div>
  );
};
