import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Users, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Briefcase,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  weekly_capacity?: number;
  job_title?: string;
}

interface UtilizationData {
  days7: number;
  days30: number;
  days90: number;
}

interface StaffMember {
  name: string;
  role: string;
  availability: number;
}

interface EnhancedInsightsProps {
  teamMembers: TeamMember[];
  activeProjects: number;
  utilizationRate: number;
  utilizationTrends: UtilizationData;
  staffMembers: StaffMember[];
}

interface Insight {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionLabel?: string;
  onAction?: () => void;
  metric?: string;
  icon: React.ReactNode;
  category: 'utilization' | 'capacity' | 'staffing' | 'projects';
}

export const EnhancedInsights: React.FC<EnhancedInsightsProps> = ({
  teamMembers,
  activeProjects,
  utilizationRate,
  utilizationTrends,
  staffMembers
}) => {
  const navigate = useNavigate();
  
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];
    const teamSize = teamMembers.length;
    
    // Utilization trend analysis
    const utilizationTrend = utilizationTrends.days7 - utilizationTrends.days30;
    if (utilizationTrend > 10) {
      insights.push({
        id: 'util-trend-up',
        title: "Utilization Rising",
        description: `Utilization increased ${utilizationTrend.toFixed(1)}% from last month. Monitor for overwork.`,
        severity: 'medium',
        actionLabel: "View Trends",
        onAction: () => navigate('/workload'),
        metric: `+${utilizationTrend.toFixed(1)}%`,
        icon: <TrendingUp className="h-4 w-4 text-orange-500" />,
        category: 'utilization'
      });
    } else if (utilizationTrend < -10) {
      insights.push({
        id: 'util-trend-down',
        title: "Utilization Declining",
        description: `Utilization dropped ${Math.abs(utilizationTrend).toFixed(1)}% from last month. Capacity available.`,
        severity: 'low',
        actionLabel: "Find Projects",
        onAction: () => navigate('/projects'),
        metric: `${utilizationTrend.toFixed(1)}%`,
        icon: <TrendingDown className="h-4 w-4 text-blue-500" />,
        category: 'utilization'
      });
    }

    // Current utilization insights
    if (utilizationRate > 90) {
      insights.push({
        id: 'overutil',
        title: "Team Overutilized",
        description: `${utilizationRate}% utilization may lead to burnout. Consider hiring or deferring projects.`,
        severity: 'critical',
        actionLabel: "Plan Hiring",
        onAction: () => navigate('/team-members'),
        metric: `${utilizationRate}%`,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        category: 'utilization'
      });
    } else if (utilizationRate < 60) {
      insights.push({
        id: 'underutil',
        title: "Low Utilization",
        description: `Team is ${utilizationRate}% utilized. ${Math.round((75 - utilizationRate) * teamSize * 40 / 100)}h weekly capacity available.`,
        severity: 'medium',
        actionLabel: "View Capacity",
        onAction: () => navigate('/resources'),
        metric: `${utilizationRate}%`,
        icon: <Clock className="h-4 w-4 text-orange-500" />,
        category: 'capacity'
      });
    }

    // Staff availability insights
    const lowAvailabilityStaff = staffMembers.filter(member => member.availability < 70);
    const highAvailabilityStaff = staffMembers.filter(member => member.availability > 85);
    
    if (lowAvailabilityStaff.length > 0) {
      insights.push({
        id: 'low-availability',
        title: "Limited Staff Availability",
        description: `${lowAvailabilityStaff.length} team members have <70% availability. Check workload distribution.`,
        severity: 'high',
        actionLabel: "Review Workload",
        onAction: () => navigate('/workload'),
        metric: `${lowAvailabilityStaff.length} members`,
        icon: <Users className="h-4 w-4 text-red-400" />,
        category: 'staffing'
      });
    }

    if (highAvailabilityStaff.length >= 3) {
      insights.push({
        id: 'high-availability',
        title: "Available Team Members",
        description: `${highAvailabilityStaff.length} team members have 85%+ availability for new projects.`,
        severity: 'low',
        actionLabel: "Assign Projects",
        onAction: () => navigate('/resources'),
        metric: `${highAvailabilityStaff.length} available`,
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        category: 'staffing'
      });
    }

    // Project load analysis
    const projectsPerPerson = activeProjects / teamSize;
    if (projectsPerPerson > 3) {
      insights.push({
        id: 'high-project-load',
        title: "High Project Load",
        description: `${projectsPerPerson.toFixed(1)} projects per person may impact focus and quality.`,
        severity: 'high',
        actionLabel: "Review Projects",
        onAction: () => navigate('/projects'),
        metric: `${projectsPerPerson.toFixed(1)} proj/person`,
        icon: <Briefcase className="h-4 w-4 text-orange-600" />,
        category: 'projects'
      });
    }

    // Optimal state
    if (utilizationRate >= 70 && utilizationRate <= 85 && projectsPerPerson <= 3) {
      insights.push({
        id: 'optimal',
        title: "Optimal Balance",
        description: "Team utilization and project load are well-balanced.",
        severity: 'low',
        metric: "Excellent",
        icon: <Target className="h-4 w-4 text-green-500" />,
        category: 'utilization'
      });
    }

    return insights;
  };

  const insights = generateInsights();
  const criticalInsights = insights.filter(i => i.severity === 'critical');
  const otherInsights = insights.filter(i => i.severity !== 'critical');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
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

  if (insights.length === 0) {
    return (
      <Card className="bg-green-50 border border-green-200">
        <CardContent className="p-4 text-center">
          <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-green-900 mb-1">All Systems Running Smoothly</h3>
          <p className="text-xs text-green-700">Team utilization and project load are well-balanced.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          🧠 Smart Insights
          <Badge variant="outline" className="text-xs">
            {insights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          {/* Critical insights first */}
          {criticalInsights.map((insight) => (
            <div key={insight.id} className={`${getSeverityColor(insight.severity)} border-l-4 p-3 rounded-r transition-all hover:shadow-sm`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="mt-0.5 flex-shrink-0">
                    {insight.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium text-sm text-gray-900">{insight.title}</h3>
                      {getSeverityBadge(insight.severity)}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                    {insight.metric && (
                      <div className="text-sm font-semibold text-gray-900 mb-2">{insight.metric}</div>
                    )}
                    {insight.actionLabel && insight.onAction && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={insight.onAction}
                        className="text-xs h-6 px-2 flex items-center gap-1"
                      >
                        {insight.actionLabel}
                        <ArrowRight className="h-2 w-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Other insights */}
          {otherInsights.slice(0, 3).map((insight) => (
            <div key={insight.id} className={`${getSeverityColor(insight.severity)} border-l-4 p-3 rounded-r transition-all hover:shadow-sm`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="mt-0.5 flex-shrink-0">
                    {insight.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium text-sm text-gray-900">{insight.title}</h3>
                      {getSeverityBadge(insight.severity)}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                    {insight.metric && (
                      <div className="text-sm font-semibold text-gray-900 mb-2">{insight.metric}</div>
                    )}
                    {insight.actionLabel && insight.onAction && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={insight.onAction}
                        className="text-xs h-6 px-2 flex items-center gap-1"
                      >
                        {insight.actionLabel}
                        <ArrowRight className="h-2 w-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
