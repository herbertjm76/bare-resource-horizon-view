
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp, Calendar } from 'lucide-react';

interface SmartInsightsProps {
  utilization: {
    days7: number;
    days30: number;
    days90: number;
  };
  activeProjectsCount: number;
  weeklyCapacity: number;
}

export const TeamMemberSmartInsights: React.FC<SmartInsightsProps> = ({
  utilization,
  activeProjectsCount,
  weeklyCapacity
}) => {
  const insights = [];

  // Utilization insights
  if (utilization.days7 > 100) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle className="h-4 w-4" />,
      title: 'Overallocation Alert',
      description: `Currently allocated ${utilization.days7}% - consider redistributing workload`,
      priority: 'high'
    });
  } else if (utilization.days7 < 50) {
    insights.push({
      type: 'info',
      icon: <TrendingUp className="h-4 w-4" />,
      title: 'Capacity Available',
      description: `Only ${utilization.days7}% utilized - opportunity for additional projects`,
      priority: 'medium'
    });
  } else if (utilization.days7 >= 75 && utilization.days7 <= 90) {
    insights.push({
      type: 'success',
      icon: <CheckCircle className="h-4 w-4" />,
      title: 'Optimal Utilization',
      description: `Well-balanced at ${utilization.days7}% - maintaining healthy workload`,
      priority: 'low'
    });
  }

  // Trend insights
  const trend = utilization.days7 - utilization.days90;
  if (Math.abs(trend) > 20) {
    insights.push({
      type: trend > 0 ? 'warning' : 'info',
      icon: <TrendingUp className="h-4 w-4" />,
      title: trend > 0 ? 'Utilization Spike' : 'Utilization Drop',
      description: `${Math.abs(trend)}% ${trend > 0 ? 'increase' : 'decrease'} from quarterly average`,
      priority: 'medium'
    });
  }

  // Project load insights
  if (activeProjectsCount > 5) {
    insights.push({
      type: 'warning',
      icon: <Calendar className="h-4 w-4" />,
      title: 'High Project Load',
      description: `Managing ${activeProjectsCount} projects - monitor for context switching`,
      priority: 'medium'
    });
  } else if (activeProjectsCount === 0) {
    insights.push({
      type: 'info',
      icon: <Calendar className="h-4 w-4" />,
      title: 'No Active Projects',
      description: 'Available for new project assignments',
      priority: 'low'
    });
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (insights.length === 0) {
    insights.push({
      type: 'success',
      icon: <CheckCircle className="h-4 w-4" />,
      title: 'All Good',
      description: 'No immediate concerns - performance looks healthy',
      priority: 'low'
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
        <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
        Smart Insights
      </h2>
      
      <Card>
        <CardContent className="p-3 sm:p-6 space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50">
              <div className={`p-1 rounded ${insight.type === 'warning' ? 'bg-orange-100 text-orange-600' : insight.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                {insight.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <Badge className={`${getBadgeColor(insight.type)} border text-xs`}>
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
