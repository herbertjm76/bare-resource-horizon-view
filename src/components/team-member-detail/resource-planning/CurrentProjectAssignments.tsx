
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

interface Project {
  id: string;
  name: string;
  status: string;
  current_stage?: string;
  contract_end_date?: string;
}

interface CurrentProjectAssignmentsProps {
  activeProjects: Project[] | null;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const CurrentProjectAssignments: React.FC<CurrentProjectAssignmentsProps> = ({
  activeProjects
}) => {
  return (
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
  );
};
