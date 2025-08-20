import React from 'react';
import { FolderOpen, Plus, Play } from 'lucide-react';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProjectsHeaderProps {
  onNewProject?: () => void;
}

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  onNewProject
}) => {
  return (
    <StandardizedPageHeader
      title="All Projects"
      description="View and manage all your ongoing projects across different locations and teams"
      icon={FolderOpen}
    >
      <div className="flex gap-3">
        <Link to="/projects/onboarding">
          <Button variant="outline" size="lg">
            <Play className="h-4 w-4 mr-2" />
            View Workflow
          </Button>
        </Link>
        {onNewProject && (
          <Button onClick={onNewProject} size="lg" className="bg-brand-violet hover:bg-brand-violet/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Project Wizard
          </Button>
        )}
      </div>
    </StandardizedPageHeader>
  );
};