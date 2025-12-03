import React from 'react';
import { FolderOpen } from 'lucide-react';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';

export const ProjectsHeader: React.FC = () => {
  return (
    <StandardizedPageHeader
      title="All Projects"
      description="View and manage all your ongoing projects across different locations and teams"
      icon={FolderOpen}
    />
  );
};