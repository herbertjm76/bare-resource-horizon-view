
import React from 'react';
import { CompactInsightCard } from './CompactInsightCard';
import { AlertTriangle, Users, Target, TrendingUp, Calendar, Briefcase, Clock, UserCheck, Zap, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  const generateAdvancedInsights = () => {
    const insights = [];
    const teamSize = teamMembers.length;
    const averageCapacity = teamMembers.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0) / teamSize;
    const totalWeeklyCapacity = teamSize * averageCapacity;
    const availableCapacity = totalWeeklyCapacity * (1 - utilizationRate / 100);
    
    // Calculate utilization trends
    const trend7to30 = utilizationTrends.days30 - utilizationTrends.days7;
    const trend30to90 = utilizationTrends.days90 - utilizationTrends.days30;
    
    // 1. CAPACITY FORECASTING - Priority insight
    if (utilizationRate > 85) {
      const weeksUntilOvercapacity = Math.max(1, Math.round(availableCapacity / (utilizationRate * 0.1)));
      insights.push({
        title: "Capacity Crisis Approaching",
        description: `Team will be overcapacity in ~${weeksUntilOvercapacity} weeks at current growth rate.`,
        severity: 'critical' as const,
        actionLabel: "Plan Hiring",
        onAction: () => navigate('/team-members'),
        metric: `${weeksUntilOvercapacity}w`,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
      });
    } else if (utilizationRate < 50 && trend7to30 < -5) {
      insights.push({
        title: "Declining Utilization",
        description: `Utilization dropped ${Math.abs(trend7to30).toFixed(1)}% recently. Need more projects.`,
        severity: 'high' as const,
        actionLabel: "Business Development",
        onAction: () => navigate('/projects'),
        metric: `${trend7to30.toFixed(1)}%`,
        icon: <TrendingUp className="h-4 w-4 text-orange-500" />
      });
    }

    // 2. WORKLOAD DISTRIBUTION ANALYSIS
    const memberStats = staffMembers.map(member => ({
      ...member,
      utilizationCategory: member.availability < 50 ? 'under' : 
                          member.availability > 100 ? 'over' : 'optimal'
    }));
    
    const overAllocated = memberStats.filter(m => m.utilizationCategory === 'over').length;
    const underAllocated = memberStats.filter(m => m.utilizationCategory === 'under').length;
    
    if (overAllocated > 0 && underAllocated > 0) {
      insights.push({
        title: "Workload Imbalance",
        description: `${overAllocated} members overloaded, ${underAllocated} underutilized. Rebalance needed.`,
        severity: 'high' as const,
        actionLabel: "Rebalance Work",
        onAction: () => navigate('/workload'),
        metric: `${overAllocated}/${underAllocated}`,
        icon: <BarChart3 className="h-4 w-4 text-orange-600" />
      });
    }

    // 3. PROJECT COMPLEXITY ANALYSIS
    const projectsPerPerson = activeProjects / teamSize;
    const complexityScore = projectsPerPerson * (utilizationRate / 100);
    
    if (complexityScore > 2.5) {
      insights.push({
        title: "High Project Complexity",
        description: `${projectsPerPerson.toFixed(1)} projects per person with ${utilizationRate}% utilization creates complexity.`,
        severity: 'medium' as const,
        actionLabel: "Simplify Portfolio",
        onAction: () => navigate('/projects'),
        metric: `${complexityScore.toFixed(1)}x`,
        icon: <Briefcase className="h-4 w-4 text-yellow-600" />
      });
    }

    // 4. TEAM VELOCITY INSIGHTS
    if (trend7to30 > 10) {
      insights.push({
        title: "Rapid Growth Pattern",
        description: `Utilization increased ${trend7to30.toFixed(1)}% recently. Monitor for burnout risk.`,
        severity: 'medium' as const,
        actionLabel: "Monitor Team",
        onAction: () => navigate('/team-members'),
        metric: `+${trend7to30.toFixed(1)}%`,
        icon: <Zap className="h-4 w-4 text-purple-500" />
      });
    }

    // 5. EFFICIENCY OPPORTUNITIES
    if (utilizationRate > 70 && utilizationRate < 85 && teamSize >= 5) {
      const efficiencyGain = Math.round((85 - utilizationRate) * totalWeeklyCapacity / 100);
      insights.push({
        title: "Efficiency Opportunity",
        description: `Could gain ${efficiencyGain}h weekly capacity through optimization.`,
        severity: 'low' as const,
        actionLabel: "Optimize Workflow",
        onAction: () => navigate('/workload'),
        metric: `+${efficiencyGain}h`,
        icon: <Target className="h-4 w-4 text-green-500" />
      });
    }

    // 6. HIRING RECOMMENDATIONS
    const optimalTeamSize = Math.ceil(activeProjects / 2.5); // 2.5 projects per person is optimal
    if (teamSize < optimalTeamSize && utilizationRate > 80) {
      const hiringNeed = optimalTeamSize - teamSize;
      insights.push({
        title: "Strategic Hiring Need",
        description: `Consider hiring ${hiringNeed} more team member${hiringNeed > 1 ? 's' : ''} for optimal project distribution.`,
        severity: 'medium' as const,
        actionLabel: "Hiring Plan",
        onAction: () => navigate('/team-members'),
        metric: `+${hiringNeed}`,
        icon: <Users className="h-4 w-4 text-blue-500" />
      });
    }

    // 7. CAPACITY BUFFER WARNING
    if (availableCapacity < 80 && utilizationRate > 75) {
      insights.push({
        title: "Low Capacity Buffer",
        description: `Only ${Math.round(availableCapacity)}h buffer remaining. Risk for emergency projects.`,
        severity: 'high' as const,
        actionLabel: "Build Buffer",
        onAction: () => navigate('/resources'),
        metric: `${Math.round(availableCapacity)}h`,
        icon: <Clock className="h-4 w-4 text-red-400" />
      });
    }

    // 8. TEAM STABILITY
    if (utilizationTrends.days90 > 60 && Math.abs(trend30to90) < 5) {
      insights.push({
        title: "Stable Team Performance",
        description: `Consistent ${utilizationTrends.days90}% utilization over 90 days shows good stability.`,
        severity: 'low' as const,
        metric: `${utilizationTrends.days90}%`,
        icon: <UserCheck className="h-4 w-4 text-green-500" />
      });
    }

    return insights;
  };

  const insights = generateAdvancedInsights();

  // Prioritize insights by severity
  const prioritizedInsights = insights.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

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

  if (prioritizedInsights.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-end mb-4">
          <Badge variant="outline" className="text-xs">0 insights</Badge>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-green-900 mb-2">Optimal Performance</h3>
            <p className="text-xs text-green-700">Team utilization and project load are well-balanced.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-1">
          {/* Insight Count Badge */}
          <div className="flex justify-end">
            <Badge variant="outline" className="text-xs">
              {prioritizedInsights.length} insight{prioritizedInsights.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Show top 3 insights */}
          {prioritizedInsights.slice(0, 3).map((insight, index) => (
            <div key={index} className={`${getSeverityColor(insight.severity)} border-l-4 rounded-lg p-4 transition-all hover:shadow-sm`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {insight.icon && (
                    <div className="mt-1 flex-shrink-0">
                      {insight.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{insight.title}</h3>
                      {getSeverityBadge(insight.severity)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    {insight.metric && (
                      <div className="text-2xl font-bold text-brand-violet mb-3">{insight.metric}</div>
                    )}
                    {insight.actionLabel && insight.onAction && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={insight.onAction}
                        className="text-sm h-8 px-3 flex items-center gap-2"
                      >
                        {insight.actionLabel}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Show additional insights count if there are more */}
          {prioritizedInsights.length > 3 && (
            <div className="text-center py-2">
              <Badge variant="outline" className="text-xs">
                +{prioritizedInsights.length - 3} more insights available
              </Badge>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
