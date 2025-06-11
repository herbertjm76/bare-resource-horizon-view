
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, Target, Users, AlertTriangle, CheckCircle, Clock, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';

interface TeamMemberResourcePlanningProps {
  memberId: string;
}

export const TeamMemberResourcePlanning: React.FC<TeamMemberResourcePlanningProps> = ({ memberId }) => {
  const { company } = useCompany();

  // Fetch member's profile data
  const { data: memberProfile } = useQuery({
    queryKey: ['memberProfile', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('weekly_capacity, first_name, last_name')
        .eq('id', memberId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!memberId,
  });

  // Fetch next 12 weeks of allocations for planning
  const { data: futureAllocations } = useQuery({
    queryKey: ['futureAllocations', memberId],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const twelveWeeksOut = addWeeks(currentWeekStart, 12);
      const startDate = format(currentWeekStart, 'yyyy-MM-dd');
      const endDate = format(twelveWeeksOut, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          hours,
          week_start_date,
          project:projects(id, name, status, contract_end_date)
        `)
        .eq('resource_id', memberId)
        .eq('resource_type', 'active')
        .eq('company_id', company.id)
        .gte('week_start_date', startDate)
        .lte('week_start_date', endDate);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!memberId && !!company?.id,
  });

  // Fetch historical utilization for trends
  const { data: historicalData } = useQuery({
    queryKey: ['historicalUtilization', memberId],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const eightWeeksAgo = subWeeks(currentWeekStart, 8);
      const startDate = format(eightWeeksAgo, 'yyyy-MM-dd');
      const endDate = format(currentWeekStart, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('hours, week_start_date')
        .eq('resource_id', memberId)
        .eq('resource_type', 'active')
        .eq('company_id', company.id)
        .gte('week_start_date', startDate)
        .lt('week_start_date', endDate);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!memberId && !!company?.id,
  });

  // Fetch active projects
  const { data: activeProjects } = useQuery({
    queryKey: ['memberActiveProjects', memberId],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          project:projects(
            id,
            name,
            status,
            contract_end_date,
            current_stage
          )
        `)
        .eq('resource_id', memberId)
        .eq('resource_type', 'active')
        .eq('company_id', company.id);
      
      if (error) throw error;
      
      // Get unique projects
      const uniqueProjects = data?.reduce((acc, allocation) => {
        const project = allocation.project;
        if (project && !acc.find(p => p.id === project.id)) {
          acc.push(project);
        }
        return acc;
      }, [] as any[]) || [];
      
      return uniqueProjects;
    },
    enabled: !!memberId && !!company?.id,
  });

  const weeklyCapacity = memberProfile?.weekly_capacity || 40;

  // Calculate planning metrics
  const futureWeeksData = futureAllocations?.reduce((acc, allocation) => {
    const weekKey = allocation.week_start_date;
    if (!acc[weekKey]) {
      acc[weekKey] = { total: 0, projects: [] };
    }
    acc[weekKey].total += allocation.hours || 0;
    if (allocation.project) {
      acc[weekKey].projects.push(allocation.project);
    }
    return acc;
  }, {} as Record<string, { total: number; projects: any[] }>) || {};

  const averageFutureUtilization = Object.values(futureWeeksData).reduce((sum, week) => {
    return sum + ((week.total / weeklyCapacity) * 100);
  }, 0) / Math.max(Object.keys(futureWeeksData).length, 1);

  const overallocatedWeeks = Object.values(futureWeeksData).filter(week => week.total > weeklyCapacity).length;
  const underutilizedWeeks = Object.values(futureWeeksData).filter(week => week.total < weeklyCapacity * 0.8).length;

  // Calculate historical average
  const historicalAverage = historicalData?.reduce((sum, allocation) => sum + (allocation.hours || 0), 0) / 
    Math.max(historicalData?.length || 1, 1);
  const historicalUtilization = (historicalAverage / weeklyCapacity) * 100;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 100) return 'text-red-600';
    if (utilization > 90) return 'text-orange-600';
    if (utilization > 70) return 'text-green-600';
    return 'text-yellow-600';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Resource Planning & Allocation</h2>

      {/* Planning Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Weekly Capacity</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {weeklyCapacity}h
            </div>
            <p className="text-xs text-gray-500 mt-1">Standard weekly hours</p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Future Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUtilizationColor(averageFutureUtilization)}`}>
              {Math.round(averageFutureUtilization)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Next 12 weeks</p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-orange-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overallocated Weeks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {overallocatedWeeks}
            </div>
            <p className="text-xs text-gray-500 mt-1">Above 100% capacity</p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {activeProjects?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Current assignments</p>
          </CardContent>
        </Card>
      </div>

      {/* Utilization Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-violet" />
            Utilization Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">Historical Performance (8 weeks)</h4>
              <div className="flex items-center gap-3">
                <div className="text-xl font-bold text-gray-700">{Math.round(historicalUtilization)}%</div>
                <Progress value={historicalUtilization} className="flex-1 h-2" />
              </div>
              <p className="text-sm text-gray-600">Average: {Math.round(historicalAverage)}h/week</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">Future Planning (12 weeks)</h4>
              <div className="flex items-center gap-3">
                <div className={`text-xl font-bold ${getUtilizationColor(averageFutureUtilization)}`}>
                  {Math.round(averageFutureUtilization)}%
                </div>
                <Progress value={averageFutureUtilization} className="flex-1 h-2" />
              </div>
              <p className="text-sm text-gray-600">
                {underutilizedWeeks} weeks under 80%, {overallocatedWeeks} weeks over 100%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Project Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-violet" />
            Current Project Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeProjects && activeProjects.length > 0 ? (
            activeProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    {project.current_stage && (
                      <p className="text-sm text-gray-600">Stage: {project.current_stage}</p>
                    )}
                    {project.contract_end_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        Due: {format(new Date(project.contract_end_date), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {project.status || 'Active'}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>No current project assignments</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resource Planning Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-brand-violet" />
            Planning Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {averageFutureUtilization > 100 && (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <h4 className="font-medium text-red-800">Overallocation Risk</h4>
                <p className="text-sm text-red-600">
                  Resource is overallocated for {overallocatedWeeks} weeks. Consider redistributing workload.
                </p>
              </div>
            </div>
          )}
          
          {averageFutureUtilization < 70 && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              <div>
                <h4 className="font-medium text-yellow-800">Capacity Available</h4>
                <p className="text-sm text-yellow-600">
                  Resource has {underutilizedWeeks} weeks below 80% utilization. Consider additional assignments.
                </p>
              </div>
            </div>
          )}
          
          {averageFutureUtilization >= 70 && averageFutureUtilization <= 100 && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <h4 className="font-medium text-green-800">Optimal Allocation</h4>
                <p className="text-sm text-green-600">
                  Resource allocation is well balanced for the planning period.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
