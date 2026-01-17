
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { NewProjectDialogContent } from '@/components/projects/dialog/NewProjectDialogContent';
import { SimpleBreadcrumbs } from '@/components/navigation/SimpleBreadcrumbs';
import { ProjectsHeader } from '@/components/projects/ProjectsHeader';

const Projects = () => {
  const { refetch } = useProjects();
  const [showWizard, setShowWizard] = useState(false);

  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <SimpleBreadcrumbs />
        
        <ProjectsHeader />
        
        <OfficeSettingsProvider>
          <ProjectsList onNewProject={() => setShowWizard(true)} />

          <Dialog open={showWizard} onOpenChange={setShowWizard}>
            <DialogContent className="max-w-xl p-6">
              <NewProjectDialogContent 
                onSuccess={() => {
                  setShowWizard(false);
                  refetch();
                }} 
              />
            </DialogContent>
          </Dialog>
        </OfficeSettingsProvider>
      </div>
    </StandardLayout>
  );
};

export default Projects;
