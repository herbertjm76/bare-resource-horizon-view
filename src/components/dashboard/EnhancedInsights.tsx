
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, AlertTriangle, CheckCircle, Clock, Target, Briefcase, Calendar } from 'lucide-react';
import { TimeRange } from './TimeRangeSelector';

interface EnhancedInsightsProps {
  utilizationRate: number;
  teamSize: number;
  activeProjects: number;
  selectedTimeRange: TimeRange;
}

export const EnhancedInsights: React.FC<EnhancedInsightsProps> = ({
  utilizationRate,
  teamSize,
  activeProjects,
  selectedTimeRange
}) => {
  const getInsights = () => {
    const insights = [];
    
    // Resource utilization insights with nuanced thresholds
    if (utilizationRate > 95) {
      insights.push({
        title: "Critical Over-Utilization",
        description: `At ${utilizationRate}% utilization, your team is severely over-allocated. Immediate action required to prevent burnout and quality issues.`,
        type: "critical" as const,
        icon: AlertTriangle,
        priority: 1,
        category: "Resource Management"
      });
    } else if (utilizationRate > 85) {
      insights.push({
        title: "Team Near Capacity",
        description: `${utilizationRate}% utilization indicates your team is approaching maximum capacity. Consider redistributing workload or planning for additional resources.`,
        type: "warning" as const,
        icon: AlertTriangle,
        priority: 2,
        category: "Resource Management"
      });
    } else if (utilizationRate >= 70 && utilizationRate <= 85) {
      insights.push({
        title: "Optimal Team Efficiency",
        description: `Your team is operating at an ideal ${utilizationRate}% utilization rate, balancing productivity with sustainable workload.`,
        type: "success" as const,
        icon: CheckCircle,
        priority: 3,
        category: "Performance"
      });
    } else if (utilizationRate < 50) {
      insights.push({
        title: "Significant Available Capacity",
        description: `At ${utilizationRate}% utilization, you have substantial capacity for new projects, strategic initiatives, or professional development.`,
        type: "info" as const,
        icon: TrendingUp,
        priority: 2,
        category: "Growth Opportunity"
      });
    } else if (utilizationRate < 65) {
      insights.push({
        title: "Moderate Underutilization",
        description: `${utilizationRate}% utilization suggests room for taking on additional work or investing in skill development and innovation.`,
        type: "info" as const,
        icon: Target,
        priority: 3,
        category: "Optimization"
      });
    }
    
    // Project load analysis with team size consideration
    const projectsPerPerson = teamSize > 0 ? activeProjects / teamSize : 0;
    if (projectsPerPerson > 3.5) {
      insights.push({
        title: "Excessive Project Load",
        description: `With ${projectsPerPerson.toFixed(1)} projects per team member, context switching may severely impact productivity and quality.`,
        type: "critical" as const,
        icon: Briefcase,
        priority: 1,
        category: "Project Management"
      });
    } else if (projectsPerPerson > 2.5) {
      insights.push({
        title: "High Project Complexity",
        description: `${projectsPerPerson.toFixed(1)} projects per person requires excellent project management to maintain focus and delivery quality.`,
        type: "warning" as const,
        icon: Briefcase,
        priority: 2,
        category: "Project Management"
      });
    } else if (projectsPerPerson < 1.5 && teamSize > 2) {
      insights.push({
        title: "Project Consolidation Opportunity",
        description: `With ${projectsPerPerson.toFixed(1)} projects per person, consider consolidating efforts or taking on additional strategic projects.`,
        type: "info" as const,
        icon: Target,
        priority: 3,
        category: "Strategic Planning"
      });
    }
    
    // Team scaling insights based on multiple factors
    if (teamSize <= 3 && activeProjects > 5 && utilizationRate > 80) {
      insights.push({
        title: "Small Team, High Demand",
        description: `Your lean team of ${teamSize} is managing ${activeProjects} projects at ${utilizationRate}% utilization. Consider hiring to reduce risk and improve delivery capacity.`,
        type: "warning" as const,
        icon: Users,
        priority: 1,
        category: "Team Scaling"
      });
    } else if (teamSize > 15 && activeProjects < 8 && utilizationRate < 60) {
      insights.push({
        title: "Large Team Underutilized",
        description: `Your team of ${teamSize} members with only ${activeProjects} projects suggests potential for significant growth or optimization opportunities.`,
        type: "info" as const,
        icon: Users,
        priority: 2,
        category: "Resource Optimization"
      });
    }
    
    // Time-sensitive insights based on selected period
    if (selectedTimeRange === 'week' && utilizationRate > 90) {
      insights.push({
        title: "Weekly Sprint Risk",
        description: `This week's ${utilizationRate}% utilization may indicate unsustainable pace. Monitor team wellbeing and consider workload adjustments.`,
        type: "warning" as const,
        icon: Clock,
        priority: 2,
        category: "Short-term Planning"
      });
    } else if (selectedTimeRange === 'year' && utilizationRate < 65) {
      insights.push({
        title: "Annual Growth Potential",
        description: `Year-to-date utilization of ${utilizationRate}% indicates significant opportunity for business expansion and revenue growth.`,
        type: "info" as const,
        icon: Calendar,
        priority: 2,
        category: "Strategic Growth"
      });
    }
    
    // Capacity buffer analysis
    const recommendedBuffer = teamSize > 10 ? 15 : 20; // Larger teams can operate closer to capacity
    const currentBuffer = 100 - utilizationRate;
    if (currentBuffer < recommendedBuffer && utilizationRate > 75) {
      insights.push({
        title: "Insufficient Capacity Buffer",
        description: `Only ${currentBuffer}% capacity buffer remaining. Recommend maintaining ${recommendedBuffer}% buffer for unexpected work and sick leave.`,
        type: "warning" as const,
        icon: Clock,
        priority: 2,
        category: "Risk Management"
      });
    }
    
    // Seasonal or planning insights
    if (utilizationRate > 80 && teamSize < 8) {
      insights.push({
        title: "Scaling Readiness",
        description: `High utilization with a compact team suggests readiness for strategic hiring to capture more opportunities.`,
        type: "info" as const,
        icon: TrendingUp,
        priority: 3,
        category: "Business Growth"
      });
    }
    
    return insights.sort((a, b) => a.priority - b.priority).slice(0, 3);
  };

  const getTimeRangeText = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return 'This Quarter';
      case '4months': return '4 Months';
      case '6months': return '6 Months';
      case 'year': return 'This Year';
      default: return 'Selected Period';
    }
  };

  const insights = getInsights();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-violet" />
          Smart Insights
          <Badge variant="outline" className="text-xs">
            {getTimeRangeText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length > 0 ? (
          insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/50">
                <div className={`p-1.5 rounded-full flex-shrink-0 ${
                  insight.type === 'critical' ? 'bg-red-100' :
                  insight.type === 'warning' ? 'bg-orange-100' :
                  insight.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <Icon className={`h-4 w-4 ${
                    insight.type === 'critical' ? 'text-red-600' :
                    insight.type === 'warning' ? 'text-orange-600' :
                    insight.type === 'success' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-gray-900">
                      {insight.title}
                    </h4>
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {insight.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-300" />
            <p className="text-sm font-medium mb-1">All Systems Optimal</p>
            <p className="text-xs">Your team metrics are well-balanced with no immediate concerns.</p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Current Metrics ({getTimeRangeText()}):</strong></p>
            <div className="flex justify-between">
              <span>Utilization: {utilizationRate}%</span>
              <span>Team: {teamSize} members</span>
            </div>
            <div className="flex justify-between">
              <span>Projects: {activeProjects}</span>
              <span>Load: {teamSize > 0 ? (activeProjects / teamSize).toFixed(1) : '0'} proj/person</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
