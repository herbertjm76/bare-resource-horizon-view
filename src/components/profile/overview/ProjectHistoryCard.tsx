import React from 'react';
import { Card } from '@/components/ui/card';
import { useUserProjects } from './hooks/useUserProjects';
import { format } from 'date-fns';

interface ProjectHistoryCardProps {
  userId?: string;
}

export const ProjectHistoryCard: React.FC<ProjectHistoryCardProps> = ({ userId }) => {
  const { data, isLoading } = useUserProjects(userId);

  if (isLoading) {
    return (
      <Card className="bg-card border-2 border-border rounded-xl p-4 shadow-sm">
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project History</h3>
          <p className="text-xs text-muted-foreground">Loading...</p>
        </div>
      </Card>
    );
  }

  const historyProjects = data?.history || [];
  const totalHours = historyProjects.reduce((sum, p) => sum + p.total_hours, 0);

  return (
    <Card className="bg-card border-2 border-border rounded-xl p-4 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project History</h3>
        
        {historyProjects.length === 0 ? (
          <p className="text-xs text-muted-foreground">No completed projects</p>
        ) : (
          <div className="space-y-2">
            {historyProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-gray-900 truncate">{project.name}</h4>
                  <p className="text-xs text-gray-600">
                    {project.contract_end_date 
                      ? format(new Date(project.contract_end_date), 'MMM yyyy')
                      : 'Completed'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{Math.round(project.total_hours)}h</p>
                </div>
              </div>
            ))}

            {totalHours > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-900">Total Hours</p>
                  <p className="text-sm font-bold text-gray-900">{Math.round(totalHours)}h</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
