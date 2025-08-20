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
      <div className="bg-gradient-to-r from-brand-violet/5 to-brand-purple/5 border border-brand-violet/10 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-violet/10 rounded-lg flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-brand-violet" />
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
          <Button onClick={onNewProject} size="lg" className="bg-brand-violet hover:bg-brand-violet/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Project Wizard
          </Button>
        </div>
      </div>
    </div>
  );
};