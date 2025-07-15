import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Briefcase } from 'lucide-react';
import { UnifiedDashboardData } from '../hooks/types/dashboardTypes';
import { TimeRange } from '../TimeRangeSelector';

interface TeamCompositionCardProps {
  data: UnifiedDashboardData;
  selectedTimeRange: TimeRange;
}

export const TeamCompositionCard: React.FC<TeamCompositionCardProps> = ({
  data,
  selectedTimeRange
}) => {
  // Calculate team composition metrics from project team composition data
  const calculateTeamComposition = () => {
    if (!data.projects || !data.teamComposition) {
      return {
        totalTeamMembers: 0,
        averageTeamSize: 0,
        roleDistribution: [],
        topRole: { title: 'N/A', count: 0 }
      };
    }

    // Aggregate team composition data
    const roleMap = new Map<string, number>();
    let totalMembers = 0;

    data.teamComposition.forEach(composition => {
      const count = composition.number_of_people;
      totalMembers += count;
      
      const currentCount = roleMap.get(composition.title) || 0;
      roleMap.set(composition.title, currentCount + count);
    });

    // Convert to array and sort by count
    const roleDistribution = Array.from(roleMap.entries())
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4); // Show top 4 roles

    const activeProjects = data.projects.filter(p => p.status === 'In Progress').length;
    const averageTeamSize = activeProjects > 0 ? Math.round(totalMembers / activeProjects) : 0;
    
    const topRole = roleDistribution[0] || { title: 'N/A', count: 0 };

    return {
      totalTeamMembers: totalMembers,
      averageTeamSize,
      roleDistribution,
      topRole
    };
  };

  const getTimeRangeLabel = (): string => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return '3 Months';
      case '4months': return '4 Months';
      case '6months': return '6 Months';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  const getRoleColor = (index: number): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500'
    ];
    return colors[index] || 'bg-gray-500';
  };

  if (data.isTeamCompositionLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Composition
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const composition = calculateTeamComposition();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Composition
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {composition.totalTeamMembers} Members
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {composition.averageTeamSize}
            </div>
            <div className="text-xs text-muted-foreground">
              Avg Team Size
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {composition.roleDistribution.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Role Types
            </div>
          </div>
        </div>

        {/* Top Role */}
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
          <Briefcase className="h-4 w-4 text-primary" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {composition.topRole.title}
            </div>
            <div className="text-xs text-muted-foreground">
              Most Common Role ({composition.topRole.count} members)
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            Role Distribution
          </div>
          <div className="space-y-1">
            {composition.roleDistribution.length > 0 ? (
              composition.roleDistribution.map((role, index) => (
                <div key={role.title} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getRoleColor(index)}`}></div>
                  <div className="flex-1 text-xs truncate">{role.title}</div>
                  <div className="text-xs font-medium">{role.count}</div>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground text-center py-2">
                No team composition data available
              </div>
            )}
          </div>
        </div>

        {/* Time Range Indicator */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{getTimeRangeLabel()}</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>Active Projects</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};