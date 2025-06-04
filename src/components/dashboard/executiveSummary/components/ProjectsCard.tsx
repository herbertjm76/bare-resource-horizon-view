
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from 'lucide-react';

interface ProjectsCardProps {
  activeProjects: number;
  activeResources: number;
}

export const ProjectsCard: React.FC<ProjectsCardProps> = ({
  activeProjects,
  activeResources
}) => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 mb-1">Projects</p>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{activeProjects}</p>
            <p className="text-xs font-medium text-gray-500">
              {activeResources > 0 
                ? `${(activeProjects / activeResources).toFixed(1)} per person` 
                : 'No team'}
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 ml-2">
            <Briefcase className="h-4 w-4 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
