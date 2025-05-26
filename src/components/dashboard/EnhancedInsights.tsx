
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
  
  const generateSimpleInsights = () => {
    const insights = [];
    const teamSize = teamMembers.length;
    
    // 1. TEAM OVERLOAD - Critical
    if (utilizationRate > 90) {
      insights.push({
        title: "Team Overloaded",
        description: `Your team is working at ${utilizationRate}%. This is unsustainable.`,
        severity: 'critical' as const,
        actionLabel: "Consider Hiring",
        onAction: () => navigate('/team-members'),
        metric: `${utilizationRate}%`,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
      });
    }

    // 2. NOT ENOUGH WORK - High Priority
    else if (utilizationRate < 60) {
      insights.push({
        title: "Team Underutilized",
        description: `Your team is only ${utilizationRate}% busy. You could take on more work.`,
        severity: 'high' as const,
        actionLabel: "Find More Projects",
        onAction: () => navigate('/projects'),
        metric: `${utilizationRate}%`,
        icon: <TrendingUp className="h-4 w-4 text-orange-500" />
      });
    }

    // 3. TOO MANY PROJECTS PER PERSON
    const projectsPerPerson = activeProjects / teamSize;
    if (projectsPerPerson > 3) {
      insights.push({
        title: "Too Many Projects",
        description: `Each person is handling ${projectsPerPerson.toFixed(1)} projects. This hurts quality.`,
        severity: 'high' as const,
        actionLabel: "Review Projects",
        onAction: () => navigate('/projects'),
        metric: `${projectsPerPerson.toFixed(1)} per person`,
        icon: <Briefcase className="h-4 w-4 text-orange-600" />
      });
    }

    // 4. WORKLOAD IMBALANCE
    const overWorked = staffMembers.filter(m => m.availability > 100).length;
    const underWorked = staffMembers.filter(m => m.availability < 50).length;
    
    if (overWorked > 0 && underWorked > 0) {
      insights.push({
        title: "Uneven Workload",
        description: `${overWorked} people are overworked while ${underWorked} have too little work.`,
        severity: 'medium' as const,
        actionLabel: "Balance Work",
        onAction: () => navigate('/workload'),
        metric: `${overWorked} overworked`,
        icon: <BarChart3 className="h-4 w-4 text-orange-600" />
      });
    }

    // 5. GROWING TOO FAST
    const recentGrowth = utilizationTrends.days7 - utilizationTrends.days30;
    if (recentGrowth > 15) {
      insights.push({
        title: "Growing Very Fast",
        description: `Workload increased ${recentGrowth.toFixed(0)}% recently. Watch for burnout.`,
        severity: 'medium' as const,
        actionLabel: "Monitor Team",
        onAction: () => navigate('/team-members'),
        metric: `+${recentGrowth.toFixed(0)}%`,
        icon: <Zap className="h-4 w-4 text-purple-500" />
      });
    }

    // 6. NEED MORE PEOPLE
    if (teamSize < 5 && activeProjects > 8) {
      insights.push({
        title: "Need More People",
        description: `${activeProjects} projects with only ${teamSize} people is risky.`,
        severity: 'medium' as const,
        actionLabel: "Plan Hiring",
        onAction: () => navigate('/team-members'),
        metric: `${teamSize} people`,
        icon: <Users className="h-4 w-4 text-blue-500" />
      });
    }

    // 7. NO BREATHING ROOM
    const totalWeeklyHours = teamSize * 40;
    const availableHours = totalWeeklyHours * (1 - utilizationRate / 100);
    
    if (availableHours < 40 && utilizationRate > 80) {
      insights.push({
        title: "No Emergency Capacity",
        description: `Only ${Math.round(availableHours)} hours left for urgent work.`,
        severity: 'high' as const,
        actionLabel: "Create Buffer",
        onAction: () => navigate('/resources'),
        metric: `${Math.round(availableHours)}h left`,
        icon: <Clock className="h-4 w-4 text-red-400" />
      });
    }

    // 8. EVERYTHING IS GOOD
    if (utilizationRate >= 70 && utilizationRate <= 85 && projectsPerPerson <= 3) {
      insights.push({
        title: "Team Performing Well",
        description: `Good balance at ${utilizationRate}% utilization with manageable project load.`,
        severity: 'low' as const,
        metric: `${utilizationRate}%`,
        icon: <UserCheck className="h-4 w-4 text-green-500" />
      });
    }

    return insights;
  };

  const insights = generateSimpleInsights();

  // Show most important insights first
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
      case 'critical': return <Badge variant="destructive" className="text-xs">Action Needed</Badge>;
      case 'high': return <Badge className="bg-orange-500 text-white text-xs">Important</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 text-white text-xs">Monitor</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs">Good</Badge>;
      default: return null;
    }
  };

  if (prioritizedInsights.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-end mb-4">
          <Badge variant="outline" className="text-xs">No issues</Badge>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-green-900 mb-2">All Good!</h3>
            <p className="text-xs text-green-700">Your team is running smoothly.</p>
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
                +{prioritizedInsights.length - 3} more insights
              </Badge>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
