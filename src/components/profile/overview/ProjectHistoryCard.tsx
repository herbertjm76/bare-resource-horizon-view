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
      <Card className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Project History</h3>
          <p className="text-xs text-gray-500">Loading...</p>
        </div>
      </Card>
    );
  }

  const historyProjects = data?.history || [];
  const totalHours = historyProjects.reduce((sum, p) => sum + p.total_hours, 0);

  return (
    <Card className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Project History</h3>
        
        {historyProjects.length === 0 ? (
          <p className="text-xs text-gray-500">No completed projects</p>
        ) : (
          <div className="space-y-2">
            {historyProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-gray-900 truncate">{project.name}</h4>
                  <p className="text-xs text-gray-600">
                    {project.latest_week ? format(new Date(project.latest_week), 'MMM yyyy') : 'N/A'}
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
