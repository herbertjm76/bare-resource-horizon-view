
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { Dialog } from '@/components/ui/dialog';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { ProjectSetupWizard } from '@/components/projects/enhanced-wizard/ProjectSetupWizard';
import { SimpleBreadcrumbs } from '@/components/navigation/SimpleBreadcrumbs';
import { ProjectsHeader } from '@/components/projects/ProjectsHeader';
import { logger } from '@/utils/logger';

const Projects = () => {
  const { refetch } = useProjects();
  const [showWizard, setShowWizard] = useState(false);

  const handleWizardSubmit = async (data: any) => {
    logger.debug('Project wizard data:', data);
    // TODO: Implement project creation logic
    setShowWizard(false);
    refetch();
  };

  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <SimpleBreadcrumbs />
        
        <ProjectsHeader />
        
        <OfficeSettingsProvider>
          <ProjectsList onNewProject={() => setShowWizard(true)} />

          <Dialog open={showWizard} onOpenChange={setShowWizard}>
            <ProjectSetupWizard
              onSubmit={handleWizardSubmit}
              onCancel={() => setShowWizard(false)}
            />
          </Dialog>
        </OfficeSettingsProvider>
      </div>
    </StandardLayout>
  );
};

export default Projects;
