
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
        description: `Up ${utilizationTrend.toFixed(1)}% from last month. Monitor for overwork.`,
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
        description: `Down ${Math.abs(utilizationTrend).toFixed(1)}% from last month. Capacity available.`,
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
        description: `${utilizationRate}% utilization may lead to burnout.`,
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
        description: `${Math.round((75 - utilizationRate) * teamSize * 40 / 100)}h weekly capacity available.`,
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
        title: "Limited Availability",
        description: `${lowAvailabilityStaff.length} members have <70% availability.`,
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
        title: "Available Team",
        description: `${highAvailabilityStaff.length} members have 85%+ availability.`,
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
        description: `${projectsPerPerson.toFixed(1)} projects per person may impact focus.`,
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

    return insights.slice(0, 4); // Limit to 4 insights for better layout
  };

  const insights = generateInsights();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive" className="text-xs px-2 py-0.5">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 text-white text-xs px-2 py-0.5">Medium</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs px-2 py-0.5">Good</Badge>;
      default: return null;
    }
  };

  if (insights.length === 0) {
    return (
      <Card className="bg-green-50 border border-green-200 rounded-xl">
        <CardContent className="p-6 text-center">
          <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-900 mb-2">All Systems Running Smoothly</h3>
          <p className="text-sm text-green-700">Team utilization and project load are well-balanced.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm border border-gray-100 rounded-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
          🧠 Smart Insights
          <Badge variant="outline" className="text-xs">
            {insights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div key={insight.id} className={`${getSeverityColor(insight.severity)} border-l-4 p-4 rounded-r-lg`}>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  {insight.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm text-gray-900">{insight.title}</h3>
                    {getSeverityBadge(insight.severity)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  {insight.metric && (
                    <div className="text-lg font-bold text-gray-900 mb-3">{insight.metric}</div>
                  )}
                  {insight.actionLabel && insight.onAction && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={insight.onAction}
                      className="text-xs h-7 px-3 flex items-center gap-2"
                    >
                      {insight.actionLabel}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
