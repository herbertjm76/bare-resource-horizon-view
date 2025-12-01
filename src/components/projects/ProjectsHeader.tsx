import React from 'react';
import { FolderOpen, Plus, Play } from 'lucide-react';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const ProjectsHeader: React.FC = () => {
  return (
    <StandardizedPageHeader
      title="All Projects"
      description="View and manage all your ongoing projects across different locations and teams"
      icon={FolderOpen}
    >
      <Link to="/projects/onboarding">
        <Button variant="outline" size="lg">
          <Play className="h-4 w-4 mr-2" />
          View Workflow
        </Button>
      </Link>
    </StandardizedPageHeader>
  );
};