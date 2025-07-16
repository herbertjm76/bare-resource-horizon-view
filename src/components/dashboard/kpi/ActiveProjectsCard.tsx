import React from 'react';
import { Calendar } from 'lucide-react';

interface ActiveProjectsCardProps {
  activeProjects: number;
  totalTeamSize: number;
}

export const ActiveProjectsCard: React.FC<ActiveProjectsCardProps> = ({
  activeProjects,
  totalTeamSize
}) => {
  const projectsPerPerson = totalTeamSize > 0 ? (activeProjects / totalTeamSize).toFixed(1) : '0.0';

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-white/5">
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Active Projects
        </span>
      </div>

      <div className="space-y-3">
        <div className="text-3xl font-bold text-foreground">
          {activeProjects}
        </div>
        
        <div className="inline-flex px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400">
          Active
        </div>
        
        <div className="text-sm text-muted-foreground">
          {projectsPerPerson} per person
        </div>
      </div>
    </div>
  );
};