import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserProjects } from './hooks/useUserProjects';
import { format } from 'date-fns';

interface CurrentProjectsCardProps {
  userId?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress':
      return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
    case 'Planning':
      return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' };
    case 'On Hold':
      return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' };
    default:
      return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
  }
};

export const CurrentProjectsCard: React.FC<CurrentProjectsCardProps> = ({ userId }) => {
  const { data, isLoading } = useUserProjects(userId);

  if (isLoading) {
    return (
      <Card className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Current Projects</h3>
          <p className="text-xs text-gray-500">Loading...</p>
        </div>
      </Card>
    );
  }

  const currentProjects = data?.current || [];

  return (
    <Card className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Current Projects</h3>
        
        {currentProjects.length === 0 ? (
          <p className="text-xs text-gray-500">No active projects</p>
        ) : (
          <div className="space-y-2">
            {currentProjects.slice(0, 3).map((project) => {
              const colors = getStatusColor(project.status);
              
              return (
                <div key={project.id} className={`p-2 ${colors.bg} rounded-lg border ${colors.border}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-medium text-gray-900 truncate">{project.name}</h4>
                    <Badge variant="outline" className={`text-xs py-0 px-1 ${colors.text}`}>
                      {project.status}
                    </Badge>
                  </div>
                  {project.contract_end_date && (
                    <p className="text-xs text-gray-600">
                      Due: {format(new Date(project.contract_end_date), 'MMM d, yyyy')}
                    </p>
                  )}
                  <div className="mt-1">
                    <p className="text-xs text-gray-600">
                      Stage: {project.current_stage || 'Not set'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};
