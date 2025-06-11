
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, Clock, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, addWeeks } from 'date-fns';

interface ProjectAllocation {
  id: string;
  name: string;
  code: string;
  status: string;
  totalHours: number;
  weeklyAverage: number;
}

interface TeamMemberProjectAllocationsProps {
  memberId: string;
  weeklyCapacity: number;
}

export const TeamMemberProjectAllocations: React.FC<TeamMemberProjectAllocationsProps> = ({ 
  memberId, 
  weeklyCapacity 
}) => {
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  useEffect(() => {
    const fetchProjectAllocations = async () => {
      if (!company?.id || !memberId) return;

      setIsLoading(true);
      try {
        const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        const endWeek = addWeeks(currentWeek, 8); // Next 8 weeks

        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            hours,
            project:projects(id, name, code, status)
          `)
          .eq('company_id', company.id)
          .eq('resource_id', memberId)
          .eq('resource_type', 'active')
          .gte('week_start_date', format(currentWeek, 'yyyy-MM-dd'))
          .lte('week_start_date', format(endWeek, 'yyyy-MM-dd'));

        if (error) throw error;

        // Group by project
        const projectMap = new Map<string, ProjectAllocation>();
        
        allocations?.forEach(allocation => {
          if (!allocation.project) return;
          
          const projectId = allocation.project.id;
          if (!projectMap.has(projectId)) {
            projectMap.set(projectId, {
              id: allocation.project.id,
              name: allocation.project.name,
              code: allocation.project.code,
              status: allocation.project.status,
              totalHours: 0,
              weeklyAverage: 0
            });
          }
          
          const project = projectMap.get(projectId)!;
          project.totalHours += allocation.hours;
        });

        // Calculate weekly averages
        const projectList = Array.from(projectMap.values()).map(project => ({
          ...project,
          weeklyAverage: project.totalHours / 8 // 8 weeks
        }));

        setProjectAllocations(projectList.sort((a, b) => b.totalHours - a.totalHours));
      } catch (error) {
        console.error('Error fetching project allocations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAllocations();
  }, [company?.id, memberId]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalWeeklyHours = projectAllocations.reduce((sum, p) => sum + p.weeklyAverage, 0);
  const utilizationPercentage = (totalWeeklyHours / weeklyCapacity) * 100;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Project Allocations</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Project Allocations</h2>
        <div className="text-sm text-gray-600">
          Next 8 weeks • {totalWeeklyHours.toFixed(1)}h/week average
        </div>
      </div>

      {/* Overall Allocation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-violet" />
              Weekly Allocation Summary
            </span>
            <Badge className={`${utilizationPercentage > 100 ? 'bg-red-100 text-red-800' : utilizationPercentage > 80 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} border`}>
              {utilizationPercentage.toFixed(0)}% Utilized
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={Math.min(utilizationPercentage, 100)} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{totalWeeklyHours.toFixed(1)}h allocated</span>
            <span>{weeklyCapacity}h capacity</span>
          </div>
        </CardContent>
      </Card>

      {/* Project List */}
      <div className="space-y-3">
        {projectAllocations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Allocations</h3>
              <p className="text-gray-500">No upcoming project allocations found.</p>
            </CardContent>
          </Card>
        ) : (
          projectAllocations.map((project) => (
            <Card key={project.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <Badge className={`${getStatusColor(project.status)} border text-xs`}>
                        {project.status?.replace('_', ' ') || 'Unknown'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{project.code}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{project.weeklyAverage.toFixed(1)}h/week avg</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{project.totalHours}h total</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-brand-primary">
                      {((project.weeklyAverage / weeklyCapacity) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">of capacity</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
