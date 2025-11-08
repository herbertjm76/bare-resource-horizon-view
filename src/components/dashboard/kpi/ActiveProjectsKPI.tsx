import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { Briefcase } from 'lucide-react';

interface ActiveProjectsKPIProps {
  activeProjects?: number;
  activeResources?: number;
}

export const ActiveProjectsKPI: React.FC<ActiveProjectsKPIProps> = ({
  activeProjects = 54,
  activeResources = 1
}) => {
  const projectsPerPerson = activeResources > 0 ? (activeProjects / activeResources).toFixed(1) : '0';

  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs font-semibold text-white/90 mb-2 tracking-wide">ACTIVE PROJECTS</p>
            <p className="text-3xl font-bold text-white mb-2 tracking-tight">{activeProjects}</p>
            <StandardizedBadge variant="success" size="sm" className="glass-card border-white/20">
              Active
            </StandardizedBadge>
            <p className="text-sm font-medium text-white/80">{projectsPerPerson} per person</p>
          </div>
          <div className="h-10 w-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0 ml-3">
            <Briefcase className="h-5 w-5 text-white/90" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};