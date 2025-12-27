
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
  isLoading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-muted text-muted-foreground border-border';
  }
};

export const CurrentProjectAssignments: React.FC<CurrentProjectAssignmentsProps> = ({
  activeProjects,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-theme-primary" />
            Current Project Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-2 w-3/4">
                <div className="h-5 bg-muted-foreground/20 rounded w-1/2"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-1/3"></div>
              </div>
              <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-2 w-3/4">
                <div className="h-5 bg-muted-foreground/20 rounded w-1/2"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-1/3"></div>
              </div>
              <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-theme-primary" />
          Current Project Assignments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeProjects && activeProjects.length > 0 ? (
          activeProjects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-medium text-foreground">{project.name}</h4>
                  {project.current_stage && (
                    <p className="text-sm text-muted-foreground">Stage: {project.current_stage}</p>
                  )}
                  {project.contract_end_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
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
          <div className="text-center text-muted-foreground py-8">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p>No current project assignments</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
