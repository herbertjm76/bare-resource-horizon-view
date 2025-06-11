
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useUnifiedMemberInsights } from '@/hooks/useUnifiedMemberInsights';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SmartInsightsProps {
  memberId: string;
  weeklyCapacity: number;
}

export const TeamMemberSmartInsights: React.FC<SmartInsightsProps> = ({
  memberId,
  weeklyCapacity
}) => {
  const { insights, isLoading } = useUnifiedMemberInsights(memberId, weeklyCapacity);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'alert-triangle': return <AlertTriangle className="h-4 w-4" />;
      case 'check-circle': return <CheckCircle className="h-4 w-4" />;
      case 'trending-up': return <TrendingUp className="h-4 w-4" />;
      case 'calendar': return <Calendar className="h-4 w-4" />;
      case 'clock': return <Clock className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 h-full">
        <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
          <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
          Smart Insights
        </h2>
        
        <div className="space-y-4">
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
      <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
        <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
        Smart Insights
      </h2>
      
      <ScrollArea className="flex-1">
        <div className="pr-4 space-y-4">
          {displayInsights.slice(0, 5).map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50">
              <div className={`p-1 rounded ${
                insight.type === 'warning' ? 'bg-orange-100 text-orange-600' : 
                insight.type === 'success' ? 'bg-green-100 text-green-600' : 
                insight.type === 'critical' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {getIcon(insight.icon)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <Badge className={`${getBadgeColor(insight.type)} border text-xs`}>
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
                {insight.metric && (
                  <p className="text-xs text-gray-500 mt-1">{insight.metric}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
