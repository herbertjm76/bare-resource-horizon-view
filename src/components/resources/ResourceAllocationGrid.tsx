import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { addDays, format, startOfWeek, addWeeks } from 'date-fns';
import { ProjectRow } from '@/components/resources/ProjectRow';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ResourceAllocationGridProps {
  startDate: Date;
  weeksToShow: number;
  filters: {
    office: string;
    country: string;
    manager: string;
  };
}

export const ResourceAllocationGrid: React.FC<ResourceAllocationGridProps> = ({ 
  startDate, 
  weeksToShow,
  filters
}) => {
  const { projects, isLoading } = useProjects();
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  
  const mondayOfStartDate = startOfWeek(startDate, { weekStartsOn: 1 });
  const weeks = Array.from({ length: weeksToShow }, (_, i) => {
    const weekStart = addWeeks(mondayOfStartDate, i);
    return {
      startDate: weekStart,
      label: format(weekStart, 'MMM dd'),
      days: Array.from({ length: 7 }, (_, j) => addDays(weekStart, j))
    };
  });
  
  const filteredProjects = projects.filter(project => {
    if (filters.office !== "all" && project.office?.name !== filters.office) return false;
    if (filters.country !== "all" && project.country !== filters.country) return false;
    if (filters.manager !== "all" && project.project_manager?.id !== filters.manager) return false;
    return true;
  });
  
  const toggleProjectExpanded = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId) 
        : [...prev, projectId]
    );
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }
  
  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground mb-2">No projects found matching your filters.</p>
        <Button variant="outline" onClick={() => window.location.href = '/projects'}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create a New Project
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-muted/50">
          <tr>
            <th className="sticky left-0 bg-muted/50 z-10 p-2 border-b text-left font-medium" style={{ minWidth: '250px' }}>
              Project / Resource
            </th>
            <th className="p-2 border-b text-center font-medium relative" style={{ minWidth: '80px', height: '100px' }}>
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <div className="transform -rotate-90 origin-bottom-left translate-y-full whitespace-nowrap pb-2 text-sm font-semibold">
                  WEEK OF
                </div>
              </div>
            </th>
            {weeks.map((week, i) => (
              <th key={i} className="p-2 border-b text-center font-medium relative" style={{ minWidth: '80px', height: '100px' }}>
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <div className="transform -rotate-90 origin-bottom-left translate-y-full whitespace-nowrap pb-2 text-sm">
                    {week.label}
                  </div>
                </div>
              </th>
            ))}
            <th className="p-2 border-b text-center font-medium">
              Total Hours
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map(project => (
            <ProjectRow 
              key={project.id}
              project={project}
              weeks={weeks}
              isExpanded={expandedProjects.includes(project.id)}
              onToggleExpand={() => toggleProjectExpanded(project.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
