
import React from 'react';
import { CompactInsightCard } from './CompactInsightCard';
import { AlertTriangle, Users, Target, TrendingUp, Calendar, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  weekly_capacity?: number;
  job_title?: string;
}

interface EnhancedInsightsProps {
  teamMembers: TeamMember[];
  activeProjects: number;
  utilizationRate: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  staffMembers: any[];
}

export const EnhancedInsights: React.FC<EnhancedInsightsProps> = ({
  teamMembers,
  activeProjects,
  utilizationRate,
  utilizationTrends,
  staffMembers
}) => {
  const navigate = useNavigate();
  
  const generatePrimaryInsight = () => {
    const teamSize = teamMembers.length;
    const averageCapacity = teamMembers.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0) / teamSize;
    const totalWeeklyCapacity = teamSize * averageCapacity;
    const availableCapacity = totalWeeklyCapacity * (1 - utilizationRate / 100);
    
    // Priority insights based on severity
    if (utilizationRate > 90) {
      return {
        title: "Team Overutilization",
        description: `${Math.round(availableCapacity)}h weekly capacity remaining.`,
        severity: 'critical' as const,
        actionLabel: "Plan Hiring",
        onAction: () => navigate('/team-members'),
        metric: `${utilizationRate}%`,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
      };
    } else if (utilizationRate < 60) {
      return {
        title: "Low Utilization",
        description: `${Math.round(availableCapacity)}h weekly capacity available.`,
        severity: 'medium' as const,
        actionLabel: "View Capacity",
        onAction: () => navigate('/resources'),
        metric: `${utilizationRate}%`,
        icon: <TrendingUp className="h-4 w-4 text-orange-500" />
      };
    } else if (utilizationRate >= 70 && utilizationRate <= 85) {
      return {
        title: "Optimal Utilization",
        description: `${Math.round(availableCapacity)}h weekly capacity available.`,
        severity: 'low' as const,
        actionLabel: "View Planning",
        onAction: () => navigate('/workload'),
        metric: `${utilizationRate}%`,
        icon: <Target className="h-4 w-4 text-green-500" />
      };
    } else {
      return {
        title: "High Utilization",
        description: `${Math.round(availableCapacity)}h weekly capacity available.`,
        severity: 'high' as const,
        actionLabel: "View Capacity",
        onAction: () => navigate('/resources'),
        metric: `${utilizationRate}%`,
        icon: <TrendingUp className="h-4 w-4 text-orange-600" />
      };
    }
  };

  const primaryInsight = generatePrimaryInsight();
  const insightCount = 1; // Show single primary insight

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500 text-white text-xs">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 text-white text-xs">Medium</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs">Good</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Insight Count Badge */}
      <div className="flex justify-end">
        <Badge variant="outline" className="text-xs">
          {insightCount} insight{insightCount !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Primary Insight Card */}
      <div className={`${getSeverityColor(primaryInsight.severity)} border-l-4 rounded-lg p-4 transition-all hover:shadow-sm`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {primaryInsight.icon && (
              <div className="mt-1 flex-shrink-0">
                {primaryInsight.icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 truncate">{primaryInsight.title}</h3>
                {getSeverityBadge(primaryInsight.severity)}
              </div>
              <p className="text-sm text-gray-600 mb-3">{primaryInsight.description}</p>
              {primaryInsight.metric && (
                <div className="text-2xl font-bold text-brand-violet mb-3">{primaryInsight.metric}</div>
              )}
              {primaryInsight.actionLabel && primaryInsight.onAction && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={primaryInsight.onAction}
                  className="text-sm h-8 px-3 flex items-center gap-2"
                >
                  {primaryInsight.actionLabel}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
