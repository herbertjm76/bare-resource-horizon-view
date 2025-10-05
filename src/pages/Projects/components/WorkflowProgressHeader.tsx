import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WorkflowProgressHeaderProps {
  onNewProject: () => void;
}

export const WorkflowProgressHeader: React.FC<WorkflowProgressHeaderProps> = ({
  onNewProject
}) => {
  return (
    <div className="space-y-4">
      {/* Clean header with integrated CTA */}
      <div className="bg-card/50 border border-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-modern/10">
              <FolderOpen className="h-5 w-5" style={{ color: 'hsl(var(--theme-primary))' }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Project Setup & Planning
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Create and manage projects with integrated financial planning and team composition
              </p>
            </div>
          </div>
          
          {/* Primary CTA integrated into workflow */}
          <Button onClick={onNewProject} size="lg" className="bg-gradient-modern hover:opacity-90 text-white border-transparent">
            <Plus className="h-4 w-4 mr-2" />
            New Project Wizard
          </Button>
        </div>
      </div>
    </div>
  );
};