
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './hooks/useWorkloadData';
import { addWeeks, format } from 'date-fns';

interface WorkloadSummaryProps {
  members: TeamMember[];
  workloadData: Record<string, Record<string, WorkloadBreakdown>>;
  selectedWeek: Date;
  periodToShow?: number;
}

export const WorkloadSummary: React.FC<WorkloadSummaryProps> = ({
  members,
  workloadData,
  selectedWeek,
  periodToShow = 12
}) => {
  // Calculate overall team utilization for the specified period
  const calculateOverallUtilization = () => {
    if (members.length === 0) return 0;
    
    let totalCapacity = 0;
    let totalAllocated = 0;
    
    members.forEach(member => {
      const weeklyCapacity = member.weekly_capacity || 40;
      totalCapacity += weeklyCapacity * periodToShow;
      
      const memberData = workloadData[member.id] || {};
      const memberTotal = Object.values(memberData).reduce((sum, breakdown) => sum + breakdown.total, 0);
      totalAllocated += memberTotal;
    });
    
    return totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;
  };

  // Calculate available capacity for the specified period
  const calculateAvailableCapacity = () => {
    let totalAvailable = 0;
    
    members.forEach(member => {
      const weeklyCapacity = member.weekly_capacity || 40;
      const totalCapacity = weeklyCapacity * periodToShow;
      
      const memberData = workloadData[member.id] || {};
      const memberAllocated = Object.values(memberData).reduce((sum, breakdown) => sum + breakdown.total, 0);
      totalAvailable += Math.max(0, totalCapacity - memberAllocated);
    });
    
    return Math.round(totalAvailable);
  };

  // Get hiring recommendation
  const getHiringRecommendation = (utilization: number, availableHours: number) => {
    if (utilization >= 90) {
      return { status: 'urgent', message: 'Urgent hiring needed', color: 'destructive' };
    } else if (utilization >= 80) {
      return { status: 'consider', message: 'Consider hiring soon', color: 'secondary' };
    } else if (availableHours > (periodToShow * 120)) { // 3 people equivalent capacity
      return { status: 'capacity', message: 'Good capacity available', color: 'default' };
    } else {
      return { status: 'monitor', message: 'Monitor capacity', color: 'default' };
    }
  };

  // Calculate metrics
  const overallUtilization = calculateOverallUtilization();
  const availableCapacity = calculateAvailableCapacity();
  const hiringRec = getHiringRecommendation(overallUtilization, availableCapacity);
  
  // Count underutilized and overallocated members for the period
  const memberStats = members.reduce((stats, member) => {
    const memberData = workloadData[member.id] || {};
    const memberTotal = Object.values(memberData).reduce((sum, breakdown) => sum + breakdown.total, 0);
    const memberCapacity = (member.weekly_capacity || 40) * periodToShow;
    const utilization = memberCapacity > 0 ? (memberTotal / memberCapacity) * 100 : 0;
    
    if (utilization < 50) stats.underutilized++;
    else if (utilization > 100) stats.overallocated++;
    else stats.optimal++;
    
    return stats;
  }, { underutilized: 0, overallocated: 0, optimal: 0 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team Utilization</p>
              <p className="text-2xl font-bold">{overallUtilization}%</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </div>
          <Progress value={overallUtilization} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {overallUtilization < 70 ? 'More projects needed' : 
             overallUtilization > 90 ? 'At capacity' : 'Good utilization'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Available Hours</p>
              <p className="text-2xl font-bold">{availableCapacity}h</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Next {periodToShow} weeks capacity
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team Status</p>
              <div className="flex gap-1 mt-1">
                <Badge variant="outline" className="text-xs px-2 py-0">
                  {memberStats.optimal} Optimal
                </Badge>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            {memberStats.underutilized > 0 && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {memberStats.underutilized} Under
              </Badge>
            )}
            {memberStats.overallocated > 0 && (
              <Badge variant="destructive" className="text-xs px-2 py-0">
                {memberStats.overallocated} Over
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hiring Status</p>
              <Badge variant={hiringRec.color as any} className="mt-1">
                {hiringRec.message}
              </Badge>
            </div>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              {hiringRec.status === 'urgent' ? (
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-orange-600" />
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on {periodToShow}-week projection
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
