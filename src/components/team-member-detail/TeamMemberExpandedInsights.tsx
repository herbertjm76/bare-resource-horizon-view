
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, TrendingUp, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, subWeeks } from 'date-fns';

interface TeamMemberExpandedInsightsProps {
  memberId: string;
}

export const TeamMemberExpandedInsights: React.FC<TeamMemberExpandedInsightsProps> = ({
  memberId
}) => {
  const { company } = useCompany();

  // Fetch member's profile data
  const { data: memberProfile } = useQuery({
    queryKey: ['memberProfile', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('weekly_capacity')
        .eq('id', memberId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!memberId,
  });

  // Fetch current project allocations for capacity calculation
  const { data: currentAllocations } = useQuery({
    queryKey: ['currentAllocations', memberId],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const currentWeekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          hours,
          project:projects(id, name, status)
        `)
        .eq('resource_id', memberId)
        .eq('resource_type', 'active')
        .eq('company_id', company.id)
        .eq('week_start_date', currentWeekStart);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!memberId && !!company?.id,
  });

  // Fetch recent project allocations for utilization trends
  const { data: recentAllocations } = useQuery({
    queryKey: ['recentAllocations', memberId],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const fourWeeksAgo = subWeeks(currentWeekStart, 4);
      const startDate = format(fourWeeksAgo, 'yyyy-MM-dd');
      const endDate = format(currentWeekStart, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('hours, week_start_date')
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

  // Fetch member's projects
  const { data: memberProjects } = useQuery({
    queryKey: ['memberProjects', memberId],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          project:projects(
            id,
            name,
            status,
            current_stage,
            contract_end_date
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
  const currentWeekHours = currentAllocations?.reduce((sum, allocation) => sum + (allocation.hours || 0), 0) || 0;
  const currentWeekUtilization = weeklyCapacity > 0 ? Math.round((currentWeekHours / weeklyCapacity) * 100) : 0;

  // Calculate monthly utilization (4 weeks)
  const monthlyHours = recentAllocations?.reduce((sum, allocation) => sum + (allocation.hours || 0), 0) || 0;
  const monthlyCapacity = weeklyCapacity * 4;
  const monthlyUtilization = monthlyCapacity > 0 ? Math.round((monthlyHours / monthlyCapacity) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'planning': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Current Capacity - Real Data */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Capacity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{weeklyCapacity}h</div>
            <div className="text-sm text-blue-600">Weekly Capacity</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-sm font-medium">{currentWeekHours}h</span>
            </div>
            <Progress value={currentWeekUtilization} className="h-2 bg-blue-100" />
            <div className="text-xs text-gray-500 text-center">{currentWeekUtilization}% utilized</div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Past 4 Weeks</span>
              <span className="text-sm font-medium">{monthlyHours}h</span>
            </div>
            <Progress value={monthlyUtilization} className="h-2 bg-green-100" />
            <div className="text-xs text-gray-500 text-center">{monthlyUtilization}% utilized</div>
          </div>
        </CardContent>
      </Card>

      {/* Current Projects - Real Data */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-green-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Current Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {memberProjects && memberProjects.length > 0 ? (
            memberProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="bg-white rounded-lg p-3 border border-green-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    {getStatusIcon(project.status)}
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status || 'Active'}
                  </Badge>
                </div>
                
                {project.contract_end_date && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Calendar className="h-3 w-3" />
                    Due: {format(new Date(project.contract_end_date), 'MMM dd, yyyy')}
                  </div>
                )}
                
                {project.current_stage && (
                  <div className="text-xs text-gray-600">
                    Current Stage: {project.current_stage}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No current project allocations
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resource Utilization Trends - Real Data */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Utilization Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <div className="text-center mb-3">
              <div className="text-xl font-bold text-purple-700">{currentWeekUtilization}%</div>
              <div className="text-xs text-gray-500">Current Week</div>
            </div>
            <Progress value={currentWeekUtilization} className="h-2" />
          </div>
          
          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <div className="text-center mb-3">
              <div className="text-xl font-bold text-purple-700">{monthlyUtilization}%</div>
              <div className="text-xs text-gray-500">4-Week Average</div>
            </div>
            <Progress value={monthlyUtilization} className="h-2" />
          </div>
          
          <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
            <div className="text-sm font-medium text-purple-900 mb-1">Total Allocated</div>
            <div className="text-xl font-bold text-purple-700">{monthlyHours}h</div>
            <div className="text-xs text-gray-500">Past 4 weeks</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
