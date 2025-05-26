
import React from 'react';
import { CompactInsightCard } from './CompactInsightCard';
import { AlertTriangle, Users, Target, TrendingUp, Calendar, Briefcase, Clock, UserCheck, Zap, BarChart3, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFinancialInsights } from './hooks/useFinancialInsights';

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
  const { financialData, isLoading } = useFinancialInsights();
  
  const generateOperationalInsights = () => {
    const insights = [];
    const teamSize = teamMembers.length;
    
    if (isLoading || !financialData) {
      return [{
        title: "Analyzing Operations",
        description: "Checking team utilization and project resourcing...",
        severity: 'low' as const,
        metric: "Loading...",
        icon: <BarChart3 className="h-4 w-4 text-gray-500" />
      }];
    }

    const {
      totalProjectRevenue,
      projectsWithoutFees,
      averageHourlyRate
    } = financialData;

    // 1. TEAM OVERWORKING - Critical Priority
    const overworkedMembers = staffMembers.filter(member => member.availability > 100);
    if (overworkedMembers.length > 0) {
      const maxUtilization = Math.max(...overworkedMembers.map(m => m.availability));
      insights.push({
        title: "Team Overworking",
        description: `${overworkedMembers.length} team members over 100% capacity. Risk of burnout and quality issues.`,
        severity: 'critical' as const,
        actionLabel: "Review Workload",
        onAction: () => navigate('/workload'),
        metric: `${maxUtilization}% max`,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
      });
    }

    // 2. MISSING PROJECT FEES - High Priority for Revenue
    if (projectsWithoutFees > 0) {
      insights.push({
        title: "Missing Project Fees",
        description: `${projectsWithoutFees} projects have no fee structure. Revenue at risk.`,
        severity: 'high' as const,
        actionLabel: "Set Project Fees",
        onAction: () => navigate('/projects'),
        metric: `${projectsWithoutFees} projects`,
        icon: <DollarSign className="h-4 w-4 text-orange-500" />
      });
    }

    // 3. HIRING NEEDS - Based on sustained high utilization
    if (utilizationTrends.days30 > 85 && utilizationTrends.days90 > 80) {
      insights.push({
        title: "Consider Hiring",
        description: `Sustained high utilization (${utilizationTrends.days30}% last 30 days). Team may need expansion.`,
        severity: 'high' as const,
        actionLabel: "Plan Hiring",
        onAction: () => navigate('/team-members'),
        metric: `${utilizationTrends.days30}% utilization`,
        icon: <Users className="h-4 w-4 text-blue-500" />
      });
    }

    // 4. LOW UTILIZATION - Capacity Available
    if (utilizationRate < 60) {
      insights.push({
        title: "Capacity Available",
        description: `Team at ${utilizationRate}% utilization. Opportunity for new projects or training.`,
        severity: 'medium' as const,
        actionLabel: "View Capacity",
        onAction: () => navigate('/resources'),
        metric: `${utilizationRate}% utilized`,
        icon: <Calendar className="h-4 w-4 text-green-500" />
      });
    }

    // 5. PROJECT RESOURCING ANALYSIS - Compare revenue to team cost
    if (totalProjectRevenue > 0 && teamSize > 0) {
      const estimatedMonthlyCost = teamSize * averageHourlyRate * 160; // Assume 160 hours/month
      const monthlyRevenue = totalProjectRevenue / 12;
      
      if (monthlyRevenue < estimatedMonthlyCost * 0.8) {
        insights.push({
          title: "Under-Resourced Projects",
          description: `Revenue suggests projects may be under-priced for current team size.`,
          severity: 'medium' as const,
          actionLabel: "Review Pricing",
          onAction: () => navigate('/projects'),
          metric: `$${Math.round(monthlyRevenue/1000)}k monthly`,
          icon: <TrendingUp className="h-4 w-4 text-orange-400" />
        });
      } else if (monthlyRevenue > estimatedMonthlyCost * 2) {
        insights.push({
          title: "Well-Resourced Projects",
          description: `Strong revenue-to-cost ratio. Projects are well-priced for team capacity.`,
          severity: 'low' as const,
          metric: `$${Math.round(monthlyRevenue/1000)}k monthly`,
          icon: <Target className="h-4 w-4 text-green-500" />
        });
      }
    }

    // 6. UTILIZATION TRENDS - Declining performance
    if (utilizationTrends.days7 < utilizationTrends.days30 - 15) {
      insights.push({
        title: "Utilization Declining",
        description: `Current week (${utilizationTrends.days7}%) down from 30-day average (${utilizationTrends.days30}%).`,
        severity: 'medium' as const,
        actionLabel: "Check Schedule",
        onAction: () => navigate('/workload'),
        metric: `${utilizationTrends.days7}% this week`,
        icon: <Clock className="h-4 w-4 text-orange-500" />
      });
    }

    // 7. TEAM AT OPTIMAL CAPACITY
    const atCapacityMembers = staffMembers.filter(member => 
      member.availability >= 80 && member.availability <= 100
    );
    if (atCapacityMembers.length === teamSize && teamSize > 0) {
      insights.push({
        title: "Optimal Team Utilization",
        description: `All ${teamSize} team members operating at ideal capacity (80-100%).`,
        severity: 'low' as const,
        metric: `${teamSize} members`,
        icon: <UserCheck className="h-4 w-4 text-green-500" />
      });
    }

    return insights;
  };

  const insights = generateOperationalInsights();

  // Show most important insights first (overworking and missing fees are top priority)
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
      case 'critical': return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
      case 'high': return <Badge className="bg-orange-500 text-white text-xs">Important</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 text-white text-xs">Review</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs">Good</Badge>;
      default: return null;
    }
  };

  if (prioritizedInsights.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-end mb-4">
          <Badge variant="outline" className="text-xs">All systems optimal</Badge>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-green-900 mb-2">Operations Running Smoothly!</h3>
            <p className="text-xs text-green-700">Team utilization and project resourcing are optimal.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-1">
          {/* Show top 3 most important insights */}
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

          {/* Show count if there are more insights */}
          {prioritizedInsights.length > 3 && (
            <div className="text-center py-2">
              <Badge variant="outline" className="text-xs">
                +{prioritizedInsights.length - 3} more operational insights
              </Badge>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
